const parseDeviceInfo = (userAgent) => {
  const uaParser = require("ua-parser-js");
  const parsedInfo = uaParser(userAgent);
  const { browser, os } = parsedInfo;

  return { browser, os };
}

module.exports = trimReplace