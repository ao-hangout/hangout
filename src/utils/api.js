const api = {}

// Twitter OAuth2.0 Login, getting the twitter user from auth code
api.post_oauth_login = '/user-api/user/twitterOAuthLogin'
//绑定PK好友，通过分享PK链接进入时调用
api.post_bind_pk_friend = '/ao-api/fission/bindPKFriend'
//start pk
api.post_start_pk = '/ao-api/fission/pk'
//pk好友列表
api.post_pk_friend_list = '/ao-api/fission/pkFriends'
//角色评估
api.post_user_gamerole_evaluation = '/ao-api/fission/roleEvaluation'
// 分配npc
api.post_hangout_dispatch_npc = '/ao-api/hangout/dispatchNPC'
//根据npc ID获取对话
api.post_npc_agent_chatStream = '/ao-api/hangout/chatNPC'
// 问题提交获取id
api.post_npc_upload_awareness = '/ao-api/hangout/uploadAwareness'
// 添加好友
api.post_add_friend = '/ao-api/hangout/addFriend'
// 好友列表
api.post_hangout_friend_list = '/ao-api/hangout/friends'
// 关注Hangout Twitter账号
api.post_follow_hangout_follow = '/ao-api/fission/followTwitter'
//分享成功回调增加pk次数
api.post_share_success_addPK = '/ao-api/fission/share'
//分享成功回调增加pk次数
api.post_get_leftpktimes = '/ao-api/fission/getLeftPkTimes'

api.post_user_createwallet = '/user-api/wallet/createWallet'
api.get_user_wallet = '/user-api/wallet/myWallet'


// 获取意识上载步骤
api.post_get_awareness = '/ao-api/hangout/getAwareness'
// 上传意识上载内容
api.post_upload_awareness_url = '/ao-api/hangout/uploadAwarenessUrl'

export default api
