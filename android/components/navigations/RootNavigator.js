import { createAppContainer, createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'

import HomeScreen from '../screens/HomeScreen'
import CustomerNavigator from '../navigations/CustomerNavigator'
import EmployeeNavigator from '../navigations/EmployeeNavigator'
import TreatmentNavigator from '../navigations/TreatmentNavigator'

const RootNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Customer: CustomerNavigator,
        Employee: EmployeeNavigator,
        Treatment: TreatmentNavigator
    }
)

RootNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'Home'
    return navigationOptions
}

const getAppNavigator = createAppContainer(RootNavigator)

export default connect()(getAppNavigator)
