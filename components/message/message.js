const wxApi = require('../../utils/util.js')
const MESSAGE_IMG = '/images/message.png'
const MESSAGE_SEARCH_IMG = '/images/message_search.png'
const MESSAGE_NOEXIT_IMG = '/images/message_noexit.png'
const MESSAGE_LOADING_IMG = '/images/message_loading.png'

const MESSAGE_IMG_CLASS = 'message-img'
const MESSAGE_SEARCH_IMG_CLASS = 'search-img'
const MESSAGE_OUT_IMG_CLASS = 'message-out-img'

Component({
  properties: {
    type: {
      type: String,
      value: 'net'
    },
    modal: {
      type: Boolean,
      value: true
    },
    background: String,
    message: String,
    hasRefresh: {
      type: Boolean,
      value: false
    }
  },
  data: {
    url: null,
    height: 'auto',
    buttons: ['net', 'server'],
    msg: {
      net: '主人，您目前的网络好像不太好呢~～',
      server: '主人，服务器开小差了～',
      search: '未搜索到任何相关内容',
      out: '主人，此作品已经下架了～去看看其他作品吧',
      noExist: '很遗憾，此内容不存在哦～',
      nothing:'还什么都没有呢QAQ',
      loading: '页面加载中…',
      lose: '主人，本章节暂时丢失了～直接观看下一章节吧～',
      follow: '空空如也，还没有关注作品～',
    },
    icon: {
      net: MESSAGE_IMG,
      server: MESSAGE_IMG,
      search: MESSAGE_SEARCH_IMG,
      out: MESSAGE_IMG,
      noExist: MESSAGE_NOEXIT_IMG,
      nothing: MESSAGE_NOEXIT_IMG,
      loading: MESSAGE_LOADING_IMG,
      lose: MESSAGE_NOEXIT_IMG,
      follow:MESSAGE_NOEXIT_IMG
    },
    clazz: {
      net: MESSAGE_IMG_CLASS,
      server: MESSAGE_IMG_CLASS,
      search: MESSAGE_SEARCH_IMG_CLASS,
      out: MESSAGE_OUT_IMG_CLASS,
      noExist: MESSAGE_IMG_CLASS,
      nothing: MESSAGE_IMG_CLASS,
      loading: MESSAGE_IMG_CLASS,
      lose: MESSAGE_OUT_IMG_CLASS,
      follow:MESSAGE_IMG_CLASS
    }
  },
  attached () {
    let height = 'auto';
    const { type, modal } = this.properties
    if (modal) {
      const { windowHeight } = wxApi.getSystemInfoSync()
      if (windowHeight>0) height = windowHeight + 'px'
    }
    const hasButton = this.data.buttons.indexOf(type) != -1
    this.setData({ height, hasButton })
  },
  ready () {
    const url = wxApi.getCurrentPageUrl()
    this.setData({ url })
  },
  methods: {

  }
})
