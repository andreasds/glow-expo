import { createStackNavigator } from 'react-navigation'

import CustomerScreen from '../screens/customer/CustomerScreen'
import HistoryCustomerScreen from '../screens/customer/HistoryCustomerScreen'
import InfoCustomerScreen from '../screens/customer/InfoCustomerScreen'
import ModifyCustomerScreen from '../screens/customer/ModifyCustomerScreen'

const CustomerNavigator = createStackNavigator(
    {
        HomeCustomer: CustomerScreen,
        AddCustomer: ModifyCustomerScreen,
        EditCustomer: ModifyCustomerScreen,
        InfoCustomer: InfoCustomerScreen,
        HistoryCustomer: HistoryCustomerScreen
    }
)

CustomerNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'HomeCustomer'
    navigationOptions.header = null
    return navigationOptions
}

export default CustomerNavigator
