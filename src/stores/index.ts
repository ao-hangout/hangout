import { observable, makeObservable, action } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import AppStore from './app-store'


enableStaticRendering(typeof window === 'undefined')

export class Store {
  appStore: AppStore

  constructor() {
    this.appStore = new AppStore(this)

    makeObservable(this, {
      appStore: observable,
    })
  }
  resetStore = () => {
    this.appStore.resetStore()
  }
}
