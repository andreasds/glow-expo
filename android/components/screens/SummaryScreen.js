import React, { Component } from 'react'
import { ActivityIndicator, Alert, DatePickerAndroid, FlatList, Picker, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import { PRODUCT_ID, PRODUCT_NAME } from '../../constants/database/productsDetails'
import { STYLIST_FIRST_NAME, STYLIST_ID, STYLIST_LAST_NAME } from '../../constants/database/stylists'

import { getCurrentDate, getDateString } from '../../constants/utils/date'

import { summaryStylists } from '../../redux/actions/database/SaleDetailActions'
import { summaryProducts } from '../../redux/actions/database/SaleProductActions'

import { activityIndicatorStyle } from '../../constants/styles/summary'
import { highlightButtonColor } from '../../constants/styles/summary'
import { containerStyle, containerStyle5, pickerContainer } from '../../constants/styles/summary'
import { dateButtonStyle, dateContainerStyle, dateTextInputStyle } from '../../constants/styles/summary'
import { iconStyle } from '../../constants/styles/summary'
import { lineStyle } from '../../constants/styles/summary'
import { countTextStyle, listContainer, listContainer2, listStyle, listStyle2, listTextStyle } from '../../constants/styles/summary'
import { titleTextStyle } from '../../constants/styles/summary'

class SummaryScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let summaries = navigation.getParam('summaries', [])
        let startDate = navigation.getParam('startDate', getCurrentDate())
        let endDate = navigation.getParam('endDate', getCurrentDate())
        let filter = navigation.getParam('filter', 'product')
        this.state = {
            search: 0,
            summaries,
            startDate,
            endDate,
            filter,
            summaryType: filter
        }

        this._reinitializeSummary = this._reinitializeSummary.bind(this)
    }

    _reinitializeSummary(_result) {
        for (let key in _result) {
            switch (key) {
                case 'summaryProducts': {
                    let summaries = _result[key]._array
                    this.setState({
                        summaries,
                        filter: 'product',
                        search: this.state.search - 1
                    })
                    break
                }
                case 'summaryStylists': {
                    let results = _result[key]._array
                    let stylists = {}
                    for (stylistIndex in results) {
                        let products = []
                        let index = results[stylistIndex][STYLIST_FIRST_NAME] + ' ' + results[stylistIndex][STYLIST_LAST_NAME] + ' ' + results[stylistIndex][STYLIST_ID]
                        if (index in stylists) {
                            products = stylists[index]
                        }
                        products.push(results[stylistIndex])
                        stylists[index] = products
                    }
                    let summaries = []
                    for (stylistIndex in stylists) {
                        let stylist = {}
                        stylist[STYLIST_ID] = stylists[stylistIndex][0][STYLIST_ID]
                        stylist[STYLIST_FIRST_NAME] = stylists[stylistIndex][0][STYLIST_FIRST_NAME]
                        stylist[STYLIST_LAST_NAME] = stylists[stylistIndex][0][STYLIST_LAST_NAME]
                        stylist.products = stylists[stylistIndex]
                        summaries.push(stylist)
                    }
                    this.setState({
                        summaries,
                        filter: 'stylist',
                        search: this.state.search - 1
                    })
                    break
                }
                default: {
                    console.log('Unprocessed _result[\'' + key + '\'] = ' + JSON.stringify(_result[key]))
                    break
                }
            }
        }
    }

    _onSearchSummaryPressed() {
        if (new Date(this.state.startDate) <= new Date(this.state.endDate)) {
            this.setState({ search: this.state.search + 1 })
            if (this.state.summaryType === 'product') {
                summaryProducts(this.props.database.db, this.state.startDate, this.state.endDate, this._reinitializeSummary)
            } else {
                summaryStylists(this.props.database.db, this.state.startDate, this.state.endDate, this._reinitializeSummary)
            }
        } else {
            Alert.alert(
                '',
                'Start date must be less than end date!',
                [
                    {
                        text: 'OK', onPress: () => { }
                    }
                ],
                { cancelable: true }
            )
        }
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>SUMMARY</Text>
                <View style={dateContainerStyle}>
                    <TextInput
                        maxLength={50}
                        onFocus={async () => {
                            try {
                                const { action, year, month, day } = await DatePickerAndroid.open({
                                    date: new Date(this.state.startDate),
                                    maxDate: new Date(getCurrentDate())
                                })
                                if (action !== DatePickerAndroid.dismissedAction) {
                                    this.setState({ startDate: getDateString(year, month, day) })
                                }
                            } catch ({ code, message }) {
                                console.warn('Cannot open date picker', message)
                            }
                        }}
                        placeholder='Start Date'
                        selectTextOnFocus={true}
                        style={dateTextInputStyle}
                        value={this.state.startDate} />
                    <TextInput
                        maxLength={50}
                        onFocus={async () => {
                            try {
                                const { action, year, month, day } = await DatePickerAndroid.open({
                                    date: new Date(this.state.endDate),
                                    maxDate: new Date(getCurrentDate())
                                })
                                if (action !== DatePickerAndroid.dismissedAction) {
                                    this.setState({ endDate: getDateString(year, month, day) })
                                }
                            } catch ({ code, message }) {
                                console.warn('Cannot open date picker', message)
                            }
                        }}
                        placeholder='End Date'
                        selectTextOnFocus={true}
                        style={dateTextInputStyle}
                        value={this.state.endDate} />
                    <TouchableHighlight
                        onPress={() => this._onSearchSummaryPressed()}
                        style={dateButtonStyle}
                        underlayColor={highlightButtonColor}>
                        <FontAwesome color='white' name='search' size={30} style={iconStyle} />
                    </TouchableHighlight>
                </View>
                <View style={pickerContainer}>
                    <Picker
                        mode='dropdown'
                        onValueChange={(type, typeIndex) => {
                            this.setState({ summaryType: type })
                        }}
                        selectedValue={this.state.summaryType}>
                        <Picker.Item label={'Treatment'} value={'product'} />
                        <Picker.Item label={'Employee'} value={'stylist'} />
                    </Picker>
                </View>
                <View style={lineStyle} />
                {
                    this.state.search ?
                        <ActivityIndicator style={activityIndicatorStyle} animating={true} size='large' color='white' /> :
                        null
                }
                {
                    this.state.filter === 'product' ?
                        <FlatList
                            data={this.state.summaries}
                            keyExtractor={(summaryItem, summaryIndex) => summaryIndex.toString()}
                            style={listStyle}
                            renderItem={({ item, index }) => (
                                <View style={listContainer}>
                                    <Text style={countTextStyle}>{item.count}</Text>
                                    <Text style={listTextStyle}>{item[PRODUCT_NAME]}</Text>
                                </View>
                            )}
                        /> :
                        null
                }
                {
                    this.state.filter === 'stylist' ?
                        <FlatList
                            data={this.state.summaries}
                            keyExtractor={(summaryItem, summaryIndex) => summaryIndex.toString()}
                            style={listStyle}
                            renderItem={({ item, index }) => (
                                <View style={listContainer2}>
                                    <Text style={listTextStyle}>{item[STYLIST_FIRST_NAME] + ' ' + item[STYLIST_LAST_NAME]}</Text>
                                    <FlatList
                                        data={item.products}
                                        keyExtractor={(productItem, productIndex) => productIndex.toString()}
                                        style={listStyle2}
                                        renderItem={({ item, index }) => (
                                            <View style={containerStyle5}>
                                                <Text style={countTextStyle}>{item.count}</Text>
                                                <Text style={listTextStyle}>
                                                    {
                                                        item['product_name'] +
                                                        (item['package_id'] !== item[PRODUCT_ID] ?
                                                            (' [ ' + item['package_name'] + ' ]') :
                                                            ''
                                                        )
                                                    }
                                                </Text>
                                            </View>
                                        )}
                                    />
                                </View>
                            )}
                        /> :
                        null
                }
            </View>
        )
    }
}

const mapStateToProps = state => {
    const { db } = state.databaseReducers
    return {
        database: { db }
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SummaryScreen)
