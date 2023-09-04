const getCurrentTimeFilePath = () => {
  let currentTime = new Date();
  let year = currentTime.getFullYear();
  let month = String(currentTime.getMonth() + 1).padStart(2, '0');  // Months are 0-based
  let day = String(currentTime.getDate()).padStart(2, '0');
  let hour = String(currentTime.getHours()).padStart(2, '0');
  let minute = String(currentTime.getMinutes()).padStart(2, '0');
  let second = String(currentTime.getSeconds()).padStart(2, '0');

  let timeString = `${year}.${month}.${day}.${hour}.${minute}.${second}`;
  return timeString
};

module.exports = getCurrentTimeFilePath;
