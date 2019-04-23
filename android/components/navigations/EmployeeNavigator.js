import { createStackNavigator } from 'react-navigation'

import EmployeeScreen from '../screens/employee/EmployeeScreen'

const EmployeeNavigator = createStackNavigator(
    {
        HomeEmployee: EmployeeScreen
    }
)

EmployeeNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'HomeEmployee'
    navigationOptions.header = null
    return navigationOptions
}

export default EmployeeNavigator
