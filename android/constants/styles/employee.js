import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const highlightButtonColor = 'darkgrey'

export const buttonContainerStyle = {
    flex: 1,
    flexDirection: 'column',
    justifyContent:'flex-end',
    backgroundColor: 'white'
}

export const buttonStyle = {
    backgroundColor: 'lightslategrey',
    borderRadius: height * 0.015,
    height: height * 0.1,
    margin: height * 0.003
}

export const buttonTextStyle = {
    color: 'white',
    fontSize: height * 0.06,
    fontWeight: 'bold',
    height: height * 0.1,
    textAlign: 'center',
    textAlignVertical: 'center'
}

export const containerStyle = {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: height * 0.03
}

export const titleTextStyle = {
    backgroundColor: 'darkslategrey',
    borderRadius: height * 0.03,
    color: 'white',
    fontSize: height * 0.06,
    fontWeight: 'bold',
    height: height * 0.1,
    textAlign: 'center',
    textAlignVertical: 'center'
}
