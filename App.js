import React, { Component } from 'react'
import { Platform, StatusBar, Text, View } from 'react-native'
import { FileSystem, Permissions, ScreenOrientation } from 'expo'

import { Provider } from 'react-redux'
import store from './android/redux/store'

import RootNavigator from './android/components/navigations/RootNavigator'

class App extends Component {
  async componentDidMount() {
    ScreenOrientation.allowAsync("LANDSCAPE_LEFT")

    if (Platform.OS === 'android') {
      const result = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      console.log(Expo.FileSystem.documentDirectory)
      const files = await FileSystem.readDirectoryAsync('file:///storage/emulated/0/')
      console.log(files)
    }
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
