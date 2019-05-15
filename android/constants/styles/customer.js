import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const highlightButtonColor = 'grey'

export const buttonContainerStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    maxHeight: width * 0.107
}

export const buttonStyle = {
    backgroundColor: 'darkslategrey',
    borderRadius: width * 0.015,
    flex: 1,
    height: width * 0.11,
    justifyContent: 'center',
    margin: width * 0.003
}

export const buttonTextStyle = {
    color: 'white',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    height: width * 0.11,
    textAlign: 'center',
    textAlignVertical: 'center'
}

export const containerStyle = {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: width * 0.03
}

export const listContainer = {
    alignItems: 'center',
    backgroundColor: 'lightslategrey',
    borderRadius: width * 0.02,
    flex: 1,
    flexDirection: 'row',
    minHeight: width * 0.15,
    margin: width * 0.003,
    padding: width * 0.02
}

export const listStyle = {
    borderRadius: width * 0.01,
    flex: 1,
    marginVertical: width * 0.01
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
