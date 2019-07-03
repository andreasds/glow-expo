import { createAppContainer, createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'

import BluetoothScreen from '../screens/BluetoothScreen'
import HomeScreen from '../screens/HomeScreen'
import CustomerNavigator from '../navigations/CustomerNavigator'
import EmployeeNavigator from '../navigations/EmployeeNavigator'
import SummaryScreen from '../screens/SummaryScreen'
import TreatmentNavigator from '../navigations/TreatmentNavigator'

const RootNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Bluetooth: BluetoothScreen,
        Customer: CustomerNavigator,
        Employee: EmployeeNavigator,
        Summary: SummaryScreen,
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
