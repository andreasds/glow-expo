import { createStackNavigator } from 'react-navigation'

import EmployeeScreen from '../screens/employee/EmployeeScreen'
import AddEmployeeScreen from '../screens/employee/AddEmployeeScreen'

const EmployeeNavigator = createStackNavigator(
    {
        HomeEmployee: EmployeeScreen,
        AddEmployee: AddEmployeeScreen
    }
)

EmployeeNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'HomeEmployee'
    navigationOptions.header = null
    return navigationOptions
}

export default EmployeeNavigator
