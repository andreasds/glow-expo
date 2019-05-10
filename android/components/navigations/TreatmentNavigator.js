import { createStackNavigator } from 'react-navigation'

import TreatmentScreen from '../screens/treatment/TreatmentScreen'
import ModifyTreatmentScreen from '../screens/treatment/ModifyTreatmentScreen'

const TreatmentNavigator = createStackNavigator(
    {
        HomeTreatment: TreatmentScreen,
        AddTreatment: ModifyTreatmentScreen,
        EditTreatment: ModifyTreatmentScreen
    }
)

TreatmentNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'HomeTreatment'
    navigationOptions.header = null
    return navigationOptions
}

export default TreatmentNavigator
