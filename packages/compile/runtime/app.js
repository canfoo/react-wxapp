export class Component {
    constructor() {
      this.__isReady = false
      this.state = {}
    }
    setState(state) {
      doUpdate(this.$scope.$component, state)
    }
    _init(scope) {
      this.$scope = scope
    }
  }
  
  export function createApp(AppClass) {
    const app = new AppClass()
    const weappAppConf = {
      onLaunch() {
        if (app.componentWillMount) {
          app.componentWillMount()
        }
        if (app.componentDidMount) {
          app.componentDidMount()
        }
      },
  
      onShow() {
        if (app.componentDidShow) {
          app.componentDidShow()
        }
      },
  
      onHide() {
        if (app.componentDidHide) {
          app.componentDidHide()
        }
      }
    }
    return Object.assign(weappAppConf, app)
  }
  
  function doUpdate($component, state) {
    let data = state || {}
    data['$leoCompReady'] = true
    $component.state = data
    $component.$scope.setData(data)
  }
  
  function initComponent() {
    if (this.$component.__isReady) return
    this.$component.__isReady = true
    doUpdate(this.$component, this.$component.state)
  }
  
  function componentTrigger(component, key) {
    component[key] && typeof component[key] === 'function' && component[key].call(component)
  }
  
  function bindEvents(weappComponentConf, events) {
    weappComponentConf.methods = weappComponentConf.methods || {}
    const target = weappComponentConf.methods
    events.forEach(eventHandlerName => {
      if (target[eventHandlerName]) return
      target[eventHandlerName] = function () {
        this.$component[eventHandlerName].call(this.$component)
      }
    })
  }
  
  export function createComponent(ComponentClass) {
    let initData = {}
    const componentInstance = new ComponentClass()
    componentInstance.state = componentInstance._createData() || componentInstance.state
    initData = Object.assign({}, initData, componentInstance.state)
    const weappComponentConf = {
      data: initData,
      created() {
        this.$component = new ComponentClass()
        this.$component._init(this)
      }
    }
    weappComponentConf.methods = weappComponentConf.methods || {}
    weappComponentConf.methods['onLoad'] = function (options = {}) {
      if (this.$component.__isReady) return
      initComponent.call(this)
    }
    weappComponentConf.methods['onReady'] = function () {
      componentTrigger(this.$component, 'componentDidMount')
    }
    weappComponentConf.methods['onShow'] = function () {
      componentTrigger(this.$component, 'componentDidShow')
    }
    weappComponentConf.methods['onHide'] = function () {
      componentTrigger(this.$component, 'componentDidHide')
    }
    ComponentClass['$$events'] && bindEvents(weappComponentConf, ComponentClass['$$events'])
  
    return weappComponentConf
  }
  