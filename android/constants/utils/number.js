export const intToNumberCurrencyString = (number, decimal) => {
    let num = number ? number : 0
    return (
        num
            .toFixed(decimal) // decimal digits
            .replace(/\./g, ',') // replace decimal point character with ,
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    )
}

export const numberCurrencyStringToInt = (number) => {
    return (
        parseInt(
            number
                .replace(/\./g, '')
                .replace(/,/g, '.')
        )
    )
}
