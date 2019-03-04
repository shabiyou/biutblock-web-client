import Vue from 'vue'
import Router from 'vue-router'
import i18n from '../utils/index'
const Index = resolve => require(['@/pages/index'], resolve) 
const CreateWallet = resolve => require(['@/pages/create_wallet/create'], resolve) 
const ReceiveSec = resolve => require(['@/pages/receive_sec/receive_sec'], resolve)
const TransferAccounts = resolve => require(['@/pages/transfer_accounts/transfer_accounts'], resolve)
const WalletInfo = resolve => require(['@/pages/wallet_info/wallet_info'], resolve)
const WalletHelp = resolve => require(['@/pages/wallet_help/wallet_help'], resolve)

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: 'createWallet',
      meta: {
        title: 'hello world'
      },
      children: [
        {
          path: '/createWallet',
          name: 'createWallet',
          component: CreateWallet,
          meta: {
            title: 'headerNav.Newallet'
          }
        },
        {
          path: '/receiveSec',
          name: 'receiveSec',
          component: ReceiveSec,
          meta: {
            title: 'headerNav.GetTestCoin'
          }
        },
        {
          path: '/transferAccounts',
          name: 'transferAccounts',
          component: TransferAccounts,
          meta: {
            title: 'headerNav.TransferSEC'
          }
        },
        {
          path: '/walletInfo',
          name: 'walletInfo',
          component: WalletInfo,
          meta: {
            title: 'headerNav.ViewWalletInfo'
          }
        },
        {
          path: '/walletHelp',
          name: 'walletHelp',
          component: WalletHelp,
          meta: {
            title: 'headerNav.Guide'
          }
        }
      ]
    }
  ],
  scrollBehavior: function (to, from, savedPosition) {
    if (savedPosition || typeof savedPosition == 'undefined') {
      if (savedPosition) {
        return savedPosition;
      }
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.beforeEach((to, from, next) => { 
  if (to.meta.title) {
    document.title = i18n.t(to.meta.title.replace(/\s+/g, ""))
  }
  next()
})

export default router