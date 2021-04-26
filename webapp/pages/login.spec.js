import Vuex from 'vuex'
import { config, mount } from '@vue/test-utils'
import login from './login.vue'

const localVue = global.localVue

config.stubs['client-only'] = '<span class="client-only"><slot /></span>'
config.stubs['nuxt-link'] = '<span class="nuxt-link"><slot /></span>'

describe('Login.vue', () => {
  let mutations
  let store
  let mocks
  let wrapper
  let asyncData
  let tosVersion
  let redirect


  beforeEach(() => {
    mutations = {
      // 'posts/SELECT_ORDER': jest.fn(),
    }
    mocks = {
      $t: jest.fn(),
      $i18n: {
        locale: () => 'en',
      },
    }
    asyncData = false
    tosVersion = '0.0.0'
    redirect = jest.fn()
  })

  describe('mount', () => {
    const Wrapper = async () => {
      store = new Vuex.Store({
        getters: {
          'auth/user': () => {
            return { termsAndConditionsAgreedVersion: tosVersion }
          },
        },
        mutations,
      })
      if (asyncData) {
        const data = login.data ? login.data() : {}
        const aData = await login.asyncData({
          store,
          redirect
        })
        login.data = function() {
          return { ...data, ...aData};
        };
      }
      return mount(login, {
        store,
        mocks,
        localVue,
      })
    }

    it('renders', async () => {
      wrapper = await Wrapper()
      expect(wrapper.findAll('.login-form')).toHaveLength(1)
    })

    it('renders with asyncData and wrong TOS Version', async () => {
      asyncData = true
      wrapper = await Wrapper()
      expect(redirect).not.toHaveBeenCalled()
    })

    it('renders with asyncData and correct TOS Version', async () => {
      asyncData = true
      tosVersion = '0.0.4'
      wrapper = await Wrapper()
      expect(redirect).toBeCalledWith('/')
    })

    
  })
})
