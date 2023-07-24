function getCurrentIST() {
    const date = new Date();
    const offsetInMinutes = date.getTimezoneOffset();
    const offsetInMilliseconds = offsetInMinutes * 60 * 1000;
    const ISTTime = new Date(date.getTime() + offsetInMilliseconds + 5.5 * 60 * 60 * 1000);
    
    const year = ISTTime.getFullYear();
    const month = String(ISTTime.getMonth() + 1).padStart(2, '0');
    const day = String(ISTTime.getDate()).padStart(2, '0');
    const hours = String(ISTTime.getHours()).padStart(2, '0');
    const minutes = String(ISTTime.getMinutes()).padStart(2, '0');
    const seconds = String(ISTTime.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  
  module.exports = {getCurrentIST};