import React, { Component } from 'react'
import { View, Text } from '@leo/components'
import './index.css'

export default class Index extends Component {
  constructor() {
    super()
    this.state = {
      status: 10
    }
    this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount () {
    console.log('加载')
  }
  handleClick() {
    this.setState({
      status: this.state.status + 1
    })
  }
  render () {
    const text = this.state.status % 2 === 0 ? '偶数' : '奇数'
    return (
      <View className='container'>
        <View onClick={this.handleClick} className="btn">
          <Text>加1</Text>
        </View>
        <View className="num">
          <Text>num：{ this.state.status }</Text>
          <Text>{text}</Text>
        </View>
      </View>
    )
  }
}

