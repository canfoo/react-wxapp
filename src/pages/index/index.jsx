import React, { Component } from 'react'
import { View, Text, Button } from '@leo/components'
import './index.css'

export default class Index extends Component {
  constructor() {
    super()
    this.state = {
      count: 0
    }
    this.onAddClick = this.onAddClick.bind(this)
    this.onReduceClick = this.onReduceClick.bind(this)
  }
  componentDidMount () {
    console.log('执行componentDidMount')
    this.setState({
      count: 1
    })
  }
  onAddClick() {
    this.setState({
      count: this.state.count + 1
    })
  }
  onReduceClick() {
    this.setState({
      count: this.state.count - 1
    })
  }
  render () {
    const text = this.state.count % 2 === 0 ? '偶数' : '奇数'

    return (
      <View className="container">
        <View className="conut">
          <Text>count: {this.state.count}</Text>
        </View>
        <View>
          <Text className="text">{text}</Text>
        </View>
        <Button onClick={this.onAddClick} className="btn">
          +1
        </Button>
        <Button onClick={this.onReduceClick} className="btn">
          -1
        </Button>
      </View>
    )
  }
}

