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

export const lineStyle = {
    borderBottomColor: 'white',
    borderBottomWidth: 3
}

export const listContainer = {
    backgroundColor: 'lightslategrey',
    borderRadius: width * 0.02,
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: width * 0.003,
    minHeight: width * 0.15,
    padding: width * 0.02,
}

export const listStyle = {
    borderRadius: width * 0.01,
    flex: 1,
    marginVertical: width * 0.01
}

export const miniTextStyle = {
    color: 'white',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    height: width * 0.07,
    padding: width * 0.01,
    textAlignVertical: 'center'
}

export const textStyle = {
    color: 'white',
    flex: 1,
    fontSize: width * 0.06,
    fontWeight: 'bold',
    height: width * 0.1,
    padding: width * 0.01,
    textAlignVertical: 'center'
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

export const switchContainerStyle = {
    flexDirection: 'row',
    padding: width * 0.01
}

export const switchStyle = {
    marginRight: width * 0.025
}
