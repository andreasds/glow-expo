import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer'

import { PRODUCT_NAME } from '../../constants/database/productsDetails'
import { SALE_AMOUNT, SALE_CUSTOMER_NAME, SALE_TIME_PAID, SALE_ID } from '../../constants/database/sales'
import { SALE_PRODUCT_PRICE } from '../../constants/database/salesProducts'
import { STYLIST_FIRST_NAME } from '../../constants/database/stylists'

import { logo } from '../../../../assets/logo'

export const printReceipt = async (sale, _callback) => {
    await BluetoothEscposPrinter.printPic(logo, { width: 250, left: 60 })
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
    await BluetoothEscposPrinter.printText('TAMAN HOLIS INDAH II\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printText('RUKO 2A NO 41\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printText('BANDUNG\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printText('\r\n--------------------------------\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printText('CUSTOMER: ' + sale[SALE_CUSTOMER_NAME].toUpperCase() + '\r\n', { fonttype: 0 })

    let products = sale.products
    for (let i = 0; i < products.length; i++) {
        await BluetoothEscposPrinter.printColumn([24, 8],
            [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
            [products[i][PRODUCT_NAME].toUpperCase(), products[i][SALE_PRODUCT_PRICE]],
            { fonttype: 0 })
        let packs = products[i].packages
        if (packs) {
            for (let j = 0; j < packs.length; j++) {
                await BluetoothEscposPrinter.printColumn([2, 30],
                    [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT],
                    ['', packs[j][PRODUCT_NAME].toUpperCase() + ' [' + packs[j][STYLIST_FIRST_NAME] + ']'],
                    { fonttype: 0 })
            }
        } else {
            await BluetoothEscposPrinter.printColumn([2, 30],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT],
                ['', '[' + products[i][STYLIST_FIRST_NAME].toUpperCase() + ']'],
                { fonttype: 0 })
        }
    }

    await BluetoothEscposPrinter.printText('\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printColumn([20, 12],
        [BluetoothEscposPrinter.ALIGN.RIGHT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['', '----------'],
        { fonttype: 0 })
    await BluetoothEscposPrinter.printColumn([20, 12],
        [BluetoothEscposPrinter.ALIGN.RIGHT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['TOTAL', sale[SALE_AMOUNT]],
        { fonttype: 0 })

    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
    await BluetoothEscposPrinter.printText('\r\n--------------------------------\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printText('THANK YOU, PLEASE COME AGAIN\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printColumn([12, 20],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [sale[SALE_ID], sale[SALE_TIME_PAID]],
        { fonttype: 0 })
    await BluetoothEscposPrinter.printText('\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printText('\r\n', { fonttype: 0 })
    await BluetoothEscposPrinter.printText('\r\n', { fonttype: 0 })

    _callback({ printReceipt: { result: 'success' } })
}
