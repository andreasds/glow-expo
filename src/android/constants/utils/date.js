const intToStringLeadingZero = (number, size) => {
    let num = number.toString()
    while (num.length < size) num = '0' + num
    return num
}

export const getCurrentDate = () => {
    let date = new Date()
    let current_date = date.getFullYear() + '-' + intToStringLeadingZero((date.getMonth() + 1), 2) + '-' + intToStringLeadingZero(date.getDate(), 2)
    return current_date
}

export const getDateString = (year, month, day) => {
    return year + '-' + intToStringLeadingZero(month + 1, 2) + '-' + intToStringLeadingZero(day, 2)
}
