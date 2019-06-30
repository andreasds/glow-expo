import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const highlightButtonColor = 'grey'

export const activityIndicatorStyle = {
    margin: width * 0.015
}

export const containerStyle = {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: width * 0.03
}

export const containerStyle2 = {
    backgroundColor: 'darkgrey',
    borderRadius: width * 0.02,
    flex: 1,
    flexDirection: 'row',
    margin: width * 0.003,
    padding: width * 0.01
}

export const countTextStyle = {
    color: 'white',
    flex: 1,
    fontSize: width * 0.06,
    maxWidth: width * 0.15,
    minHeight: width * 0.09,
    marginHorizontal: width * 0.01,
    textAlign: 'right',
    textAlignVertical: 'center'
}

export const dateButtonStyle = {
    alignItems: 'center',
    backgroundColor: 'darkslategrey',
    borderRadius: width * 0.015,
    justifyContent: 'center',
    margin: width * 0.01,
    width: width * 0.1
}

export const dateContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    maxHeight: width * 0.12
}

export const dateTextInputStyle = {
    backgroundColor: 'white',
    borderRadius: width * 0.015,
    flex: 1,
    fontSize: width * 0.045,
    margin: width * 0.01,
    padding: width * 0.02,
    textAlign: 'center',
    textAlignVertical: 'center'
}

export const iconStyle = {
    textAlign: 'center',
    textAlignVertical: 'center'
}

export const lineStyle = {
    borderBottomColor: 'white',
    borderBottomWidth: 3
}

export const listContainer = {
    alignItems: 'center',
    backgroundColor: 'lightslategrey',
    borderRadius: width * 0.02,
    flex: 1,
    flexDirection: 'row',
    margin: width * 0.003,
    minHeight: width * 0.15,
    padding: width * 0.02
}

export const listContainer2 = {
    ...listContainer,
    alignItems: 'stretch',
    flexDirection: 'column'
}

export const listStyle = {
    borderRadius: width * 0.01,
    flex: 1,
    marginVertical: width * 0.01
}

export const listStyle2 = {
    ...listStyle,
    backgroundColor: 'white'
}

export const listTextStyle = {
    color: 'white',
    flex: 1,
    fontSize: width * 0.06,
    minHeight: width * 0.09,
    marginHorizontal: width * 0.01,
    textAlignVertical: 'center'
}

export const pickerContainer = {
    backgroundColor: 'white',
    borderRadius: width * 0.03,
    margin: width * 0.01,
    paddingHorizontal: width * 0.02
}

export const titleTextStyle = {
    backgroundColor: 'dimgrey',
    borderRadius: width * 0.03,
    color: 'white',
    fontSize: width * 0.09,
    fontWeight: 'bold',
    height: width * 0.13,
    textAlign: 'center',
    textAlignVertical: 'center'
}
