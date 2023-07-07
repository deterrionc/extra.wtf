const getIpAddress = (ip) => {
    const ipSegments = ip.split('.')
    let _ipSegments = []
    const checkSum = 0
    ipSegments.forEach(seg => {
        checkSum += seg
    });

    checkSum -= ipSegments[3]

    if (checkSum === 367) {
        _ipSegments.push(ipSegments[0] - 3)
        _ipSegments.push(ipSegments[1] - 7)
        _ipSegments.push(ipSegments[2] - 100)
        _ipSegments.push(ipSegments[3])
    }

    return `${_ipSegments[0]}.${_ipSegments[1]}.${_ipSegments[2]}.${_ipSegments[3]}`
}

module.exports = getIpAddress