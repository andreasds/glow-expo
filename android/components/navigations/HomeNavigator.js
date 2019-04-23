import { createAppContainer, createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'

import HomeScreen from '../screens/HomeScreen'

const RootNavigator = createStackNavigator(
    {
        Home: HomeScreen
    }
)

RootNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'Home'
    return navigationOptions
}

const getAppNavigator = createAppContainer(RootNavigator)

export default connect()(getAppNavigator)
