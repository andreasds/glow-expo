import React, { Component } from 'react'
import { Platform, StatusBar, Text, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { AppLoading, Font, ScreenOrientation } from 'expo'

import { Provider } from 'react-redux'
import store from './android/redux/store'

import RootNavigator from './android/components/navigations/RootNavigator'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isReady: false
    }

    ScreenOrientation.allowAsync("PORTRAIT")
  }

  async _loadAssetsAsync() {
    const fontAssets = [FontAwesome.font].map(font => Font.loadAsync(font))

    await Promise.all([...fontAssets])
  }

  render() {
    if (Platform.OS === 'android') {
      if (!this.state.isReady) {
        return (
          <AppLoading
            startAsync={this._loadAssetsAsync}
            onFinish={() => this.setState({ isReady: true })}
            onError={console.warn} />
        )
      } else {
        return (
          <Provider store={store}>
            <StatusBar barStyle='light-content' hidden={true} />
            <RootNavigator />
          </Provider>
        )
      }
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
