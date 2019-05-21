import React, { Component } from 'react'
import { FlatList, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { loadingScreen } from '../../../constants/LoadingScreen'

import { salesGot } from '../../../redux/actions/database/SaleActions'
import { selectAllStylistService } from '../../../redux/actions/database/StylistServiceActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle } from '../../../constants/styles/customer'
import { listContainer, listStyle } from '../../../constants/styles/customer'
import { titleTextStyle } from '../../../constants/styles/customer'

class CustomerScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: 0,
            sale: {},
            process: '',
            result: '',
            error: ''
        }

        this._reinitializeCustomer = this._reinitializeCustomer.bind(this)
    }

    _reinitializeCustomer(_result) {
        for (let key in _result) {
            switch (key) {
                case 'stylistsServices':
                    let stylistsServices = _result[key]._array
                    this.setState({ loading: this.state.loading - 1 })

                    const { navigate } = this.props.navigation
                    switch (this.state.process) {
                        case 'add':
                            // let process = this.state.process
                            this.setState({ process: '' })
                            navigate('AddCustomer', {
                                mode: 'add',
                                stylistsServices
                            })
                            break
                        // case 'info':
                        // case 'edit':
                        //     let process = this.state.process
                        //     this.setState({ process: '' })
                        //     if (process === 'edit') {
                        //         navigate('EditEmployee', {
                        //             mode: 'edit',
                        //             stylist: this.state.stylist
                        //         })
                        //     } else {
                        //         navigate('InfoEmployee', {
                        //             stylist: this.state.stylist
                        //         })
                        //     }
                        //     break
                        default:
                            this.setState({
                                loading: this.state.loading + 1,
                                error: 'Failed to ' + this.state.process + ' process at get stylist services'
                            })
                            break
                    }
                    break
                default: {
                    console.log('Unprocessed _result[\'' + key + '\'] = ' + JSON.stringify(_result[key]))
                    break
                }
            }
        }
    }

    _onAddCustomerPressed() {
        this.setState({
            loading: this.state.loading + 1,
            process: 'add'
        })
        selectAllStylistService(this.props.database.db, this._reinitializeCustomer)
        // const { navigate } = this.props.navigation
        // navigate('AddCustomer', {
        //     mode: 'add'
        // })
    }

    render() {
        console.log('props = ' + JSON.stringify(this.props))
        console.log('state = ' + JSON.stringify(this.state))

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>CUSTOMERS LIST</Text>
                <FlatList
                    data={this.props.sale.sales}
                    keyExtractor={(saleItem, saleIndex) => saleIndex.toString()}
                    style={listStyle}
                    renderItem={({ item, index }) => (
                        <View style={listContainer}>
                            {/* <Text style={listTextStyle}>{item.first_name + ' ' + item.last_name}</Text>
                            <View style={modifyButtonContainerStyle}>
                                <TouchableHighlight
                                    onPress={() => this._onInfoEmployeePressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <FontAwesome color='white' name='info' size={30} style={iconStyle} />
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onEditEmployeePressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <FontAwesome color='white' name='pencil' size={30} style={iconStyle} />
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onRemoveEmployeePressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <FontAwesome color='white' name='remove' size={32} style={iconStyle} />
                                </TouchableHighlight>
                            </View> */}
                        </View>
                    )}
                />
                <View style={buttonContainerStyle}>
                    <TouchableHighlight
                        onPress={() => this._onAddCustomerPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <Text style={buttonTextStyle}>ADD CUSTOMER</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    const { db } = state.databaseReducers
    const { sales, salesLen } = state.saleReducers
    return {
        database: { db },
        sale: { sales, salesLen }
    }
}

const mapDispatchToProps = dispatch => ({
    salesGot: (sales, salesLen) => dispatch(salesGot(sales, salesLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomerScreen)
