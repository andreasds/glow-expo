import { createStackNavigator } from 'react-navigation'

import EmployeeScreen from '../screens/employee/EmployeeScreen'
import InfoEmployeeScreen from '../screens/employee/InfoEmployeeScreen'
import ModifyEmployeeScreen from '../screens/employee/ModifyEmployeeScreen'

const EmployeeNavigator = createStackNavigator(
    {
        HomeEmployee: EmployeeScreen,
        AddEmployee: ModifyEmployeeScreen,
        EditEmployee: ModifyEmployeeScreen,
        InfoEmployee: InfoEmployeeScreen
    }
)

EmployeeNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'HomeEmployee'
    navigationOptions.header = null
    return navigationOptions
}

export default EmployeeNavigator
