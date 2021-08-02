import Leo, { Component } from '@leojs/leo'
import { View, Text } from '@leojs/components'
import './index.css'

class Index extends Component {
  constructor() {
    super()
    this.state = {
      status: 10
    }
  }
  config = {
    navigationBarTitleText: '首页'
  }
  componentDidMount () {
    console.log('加载')
  }
  handleClick() {
    this.setState({
      status: this.state.status + 1
    })
    console.log('click')
  }
  render () {
    return (
      <View className='container'>
        <View onClick={this.handleClick} className="btn">
          <Text>加1</Text>
        </View>
        <View className="num">
          <Text>num：{ this.state.status }</Text>
        </View>
      </View>
    )
  }
}

