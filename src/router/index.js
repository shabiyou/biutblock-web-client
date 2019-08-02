import Vue from 'vue'
import Router from 'vue-router'
import i18n from '../utils/index'

const Index = () => import('@/pages/index')
const CreateWallet = () => import('@/pages/createWallet/create-wallet')
const TransferAccounts = () => import('@/pages/transferAccounts/transfer-accounts')
const WalletInfo = () => import('@/pages/walletInfo/wallet-info')
const WalletHelp = () => import('@/pages/walletHelp/wallet-help')
const WalletMapping = () => import('@/pages/walletMapping/mapping')
const OrePool = () => import('@/pages/orePool/ore-pool')

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
        },
        {
          path: '/orePool',
          name: 'orePool',
          component: OrePool,
          meta: {
            title: 'headerNav.orePool'
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