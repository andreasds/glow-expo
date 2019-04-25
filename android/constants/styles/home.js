import { Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const padding = 0.05

export const highlightButtonColor = 'lightgrey'

export const buttonStyle = {
    backgroundColor: 'darkgrey',
    borderRadius: height * 0.05,
    height: height * (1 - (6 * padding)) / 2,
    marginHorizontal: width * padding,
    marginVertical: height * padding,
    width: width * (1 - (8 * padding)) / 3,
}

export const containerStyle = {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: width * padding,
    paddingVertical: height * padding
}
