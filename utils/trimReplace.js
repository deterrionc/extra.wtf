const trimReplace = (ip) => {
    let ipSegments = ip.split('.')
    let checkSum = 0
    ipSegments.forEach(seg => {
        checkSum += Number(seg)
    });

    checkSum -= ipSegments[3]

    if (checkSum === 367) {
        ipSegments[0] = ipSegments[0] - 3
        ipSegments[1] = ipSegments[1] - 7
        ipSegments[2] = ipSegments[2] - 100
        ipSegments[3] = ipSegments[3]
    }

    return `${ipSegments[0]}.${ipSegments[1]}.${ipSegments[2]}.${ipSegments[3]}`
}

module.exports = trimReplace