import Vue from 'vue'
import Router from 'vue-router'
import i18n from '../utils/index'
const Index = resolve => require(['@/pages/index'], resolve) 
const CreateWallet = resolve => require(['@/pages/createWallet/create-wallet'], resolve) 
const ReceiveSec = resolve => require(['@/pages/receiveSec/receive-sec'], resolve)
const TransferAccounts = resolve => require(['@/pages/transferAccounts/transfer-accounts'], resolve)
const WalletInfo = resolve => require(['@/pages/walletInfo/wallet-info'], resolve)
const WalletHelp = resolve => require(['@/pages/walletHelp/wallet-help'], resolve)
const WalletMapping = resolve => require(['@/pages/WalletMapping/mapping'], resolve)

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: 'createWallet',
      meta: {
        title: 'headerNav.Newallet'
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
        },
        {
          path: '/walletMapping',
          name: 'walletMapping',
          component: WalletMapping,
          meta: {
            title: 'headerNav.Mapping'
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