import { Store } from './index'
import { action, flow, makeObservable, observable, ObservableMap } from 'mobx'
import dayjs from 'dayjs'
// @ts-ignore
import multiavatar from '@multiavatar/multiavatar/esm'
import { request } from '../utils/request'
import api from '../utils/api'

const DONT_REMIND_LINK_TO_JUMP_MODAL_KEY = 'dontRemindLinkToJumpModal'
export const NO_NEED_REMIND_USER_OPEN_BROWSER_NOTIFICATION_TIMESTAMP = 'NO_NEED_REMIND_USER_OPEN_BROWSER_NOTIFICATION_TIMESTAMP'
const NO_NEED_REMIND_USER_OPEN_BROWSER_NOTIFICATION_MAX_TIME = 24 * 60 * 60 * 1000

const MAX_USER_INFO_MAP_SIZE = 500
export const DEFAULT_AVATAR_URL = '/nft/defaultImg.svg'


export default class AppStore {
  rootStore: Store
  isLoading: boolean = false
  dontRemindLinkToJumpModal: boolean = false
  needRemindUserOpenBrowserNotification: boolean = false
  userLoginTime: number = 0
  observableCount: number = 0

  constructor(rootStore: Store) {
    this.rootStore = rootStore
    makeObservable(this, {
      rootStore: observable,
      resetStore: action,
      isLoading: observable,
      showLoading: action,
      hideLoading: action,
      hydrate: action,
      dontRemindLinkToJumpModal: observable,
      changeDontRemindLinkToJumpModal: action,
      needRemindUserOpenBrowserNotification: observable,
      changeNeedRemindUserOpenBrowserNotification: action,
      initNeedRemindUserOpenBrowserNotification: action,
      userLoginTime: observable,
      updateUserLoginTime: action,
      observableCount: observable,
    })
  }

  updateUserLoginTime = () => {
    this.userLoginTime = dayjs().valueOf()
  }

  resetStore = () => {
    this.isLoading = false
    this.dontRemindLinkToJumpModal = Boolean(window?.localStorage?.getItem(DONT_REMIND_LINK_TO_JUMP_MODAL_KEY))
    this.observableCount = 0
  }


  showLoading = () => {
    this.isLoading = true
  }

  hideLoading = () => {
    this.isLoading = false
  }

  hydrate = (data: any) => {
    console.log('hydrate old data', data)
  }

  changeDontRemindLinkToJumpModal = (newValue: boolean) => {
    this.dontRemindLinkToJumpModal = newValue
    window?.localStorage?.setItem(DONT_REMIND_LINK_TO_JUMP_MODAL_KEY, `${newValue}`)
  }

  changeNeedRemindUserOpenBrowserNotification = (newValue: boolean) => {
    this.needRemindUserOpenBrowserNotification = newValue
  }

  initNeedRemindUserOpenBrowserNotification = () => {
    if (window?.Notification) {
      const notificationPermission = window.Notification.permission
      if (notificationPermission === 'default') {
        const latestTimestamp = window?.localStorage?.getItem(NO_NEED_REMIND_USER_OPEN_BROWSER_NOTIFICATION_TIMESTAMP)
        if (latestTimestamp) {
          const lastDate = dayjs(latestTimestamp)
          if (lastDate.isValid()) {
            const nowDate = dayjs()
            const diff = nowDate.diff(lastDate)
            if (diff >= NO_NEED_REMIND_USER_OPEN_BROWSER_NOTIFICATION_MAX_TIME) {
              this.changeNeedRemindUserOpenBrowserNotification(true)
            }
          }
        } else {
          this.changeNeedRemindUserOpenBrowserNotification(true)
        }
      }
    } else {
      console.error("Current browser doesn't support notification")
    }
  }
  
}
