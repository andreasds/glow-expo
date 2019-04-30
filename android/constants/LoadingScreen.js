import React from 'react'
import { Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native'

import { containerStyle, textStyle } from '../constants/styles/loading'

export const loadingScreen = (message, error) => {
    return (
        <View style={containerStyle}>
            <ActivityIndicator animating={true} size='large' color='white' />
            <Text style={textStyle}>{'Please wait'}</Text>
            <Text style={textStyle}>{'Do not close the app'}</Text>
            <Text style={textStyle}>{message}</Text>
            <Text style={textStyle}>{error}</Text>
        </View>
    )
}
