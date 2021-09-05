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
  $component.state = Object.assign($component.state, state)
  let data = $component.createData(state)
  data['$leoCompReady'] = true
  $component.state = data
  $component.$scope.setData(data)
}

export function createPage(ComponentClass) {
  const componentInstance = new ComponentClass()
  const initData = componentInstance.state
  const option = {
    data: initData,
    onLoad() {
      this.$component = new ComponentClass()
      this.$component._init(this)
      update(this.$component, this.$component.state)
    },
    onReady() {
      if (typeof this.$component.componentDidMount === 'function') {
        this.$component.componentDidMount()
      }
    }
  }

  const events = ComponentClass['$$events']
  if (events) {
    events.forEach(eventHandlerName => {
      if (option[eventHandlerName]) return
      option[eventHandlerName] = function () {
        this.$component[eventHandlerName].call(this.$component)
      }
    })
  }

  return option
}
