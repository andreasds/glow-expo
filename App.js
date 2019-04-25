import React, { Component } from 'react'
import { Platform, StatusBar, Text, View } from 'react-native'
import { ScreenOrientation } from 'expo'

import { Provider } from 'react-redux'
import store from './android/redux/store'

import RootNavigator from './android/components/navigations/RootNavigator'

class App extends Component {
  constructor(props) {
    super(props)
    ScreenOrientation.allowAsync("LANDSCAPE")
  }

  render() {
    if (Platform.OS === 'android') {
      return (
        <Provider store={store}>
          <StatusBar barStyle='light-content' hidden={true} />
          <RootNavigator />
        </Provider>
      )
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Text>Open up App.js to start working on your app!</Text>
        </View>
      )
    }
  }
}

export default App
