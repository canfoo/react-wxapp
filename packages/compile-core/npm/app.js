export class Component {
  constructor() {
    this.state = {}
  }
  setState(state) {
    update(this.$scope.$component, state)
  }
  _init(scope) {
    this.$scope = scope
  }
}


function update($component, state = {}) {
  let data = $component.createData(state)
  data['$leoCompReady'] = true
  $component.state = data
  $component.$scope.setData(data)
}

function bindEvents(option, events) {
  option.methods = option.methods || {}
  const target = option.methods
  events.forEach(eventHandlerName => {
    if (target[eventHandlerName]) return
    target[eventHandlerName] = function () {
      this.$component[eventHandlerName].call(this.$component)
    }
  })
}

export function createComponent(ComponentClass) {
  const componentInstance = new ComponentClass()
  const initData = componentInstance.state
  const option = {
    data: initData,
    created() {
      this.$component = new ComponentClass()
      this.$component._init(this)
    }
  }
  option.methods = option.methods || {}
  option.methods['onLoad'] = function () {
    update(this.$component, this.$component.state)
  }
  option.methods['onReady'] = function () {
    if (typeof this.$component.componentDidMount === 'function') {
      this.$component.componentDidMount()
    }
  }
  ComponentClass['$$events'] && bindEvents(option, ComponentClass['$$events'])

  return option
}
