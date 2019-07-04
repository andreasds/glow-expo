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

export const getCurrentDateTime = () => {
    let date = new Date()
    let current_date_time = date.getFullYear() + '-' + intToStringLeadingZero((date.getMonth() + 1), 2) + '-' + intToStringLeadingZero(date.getDate(), 2)
    current_date_time = current_date_time + ' ' + intToStringLeadingZero(date.getHours(), 2) + ':' + intToStringLeadingZero(date.getMinutes(), 2) + ':' + intToStringLeadingZero(date.getSeconds(), 2)
    return current_date_time
}

export const getDateString = (year, month, day) => {
    return year + '-' + intToStringLeadingZero(month + 1, 2) + '-' + intToStringLeadingZero(day, 2)
}
