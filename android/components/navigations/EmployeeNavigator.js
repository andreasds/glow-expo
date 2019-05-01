import { createStackNavigator } from 'react-navigation'

import EmployeeScreen from '../screens/employee/EmployeeScreen'
import ModifyEmployeeScreen from '../screens/employee/ModifyEmployeeScreen'

const EmployeeNavigator = createStackNavigator(
    {
        HomeEmployee: EmployeeScreen,
        AddEmployee: ModifyEmployeeScreen,
        EditEmployee: ModifyEmployeeScreen
    }
)

EmployeeNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'HomeEmployee'
    navigationOptions.header = null
    return navigationOptions
}

export default EmployeeNavigator
