import { createStackNavigator } from 'react-navigation'

import InfoTreatmentScreen from '../screens/treatment/InfoTreatmentScreen'
import TreatmentScreen from '../screens/treatment/TreatmentScreen'
import ModifyTreatmentScreen from '../screens/treatment/ModifyTreatmentScreen'

const TreatmentNavigator = createStackNavigator(
    {
        HomeTreatment: TreatmentScreen,
        AddTreatment: ModifyTreatmentScreen,
        EditTreatment: ModifyTreatmentScreen,
        InfoTreatment: InfoTreatmentScreen
    }
)

TreatmentNavigator.navigationOptions = () => {
    let navigationOptions = {}
    navigationOptions.initialRouteName = 'HomeTreatment'
    navigationOptions.header = null
    return navigationOptions
}

export default TreatmentNavigator
