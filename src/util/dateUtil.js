export const formatDate = (dateStr, defaultVal) => {
  if (dateStr) {
    if (typeof dateStr === "string") {
      if (dateStr.indexOf("T00:00:00.000Z") > -1) {
        dateStr = dateStr.replace("T00:00:00.000Z", "T00:00:00.000");
      } else if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.exec(dateStr)) {
        dateStr = dateStr.concat("T00:00:00.000");
      }
    }
    const date = new Date(dateStr);
    var mnthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var day = date.getDate();
    var month = mnthArray[date.getMonth()];
    var year = date.getFullYear();
    // return "" + (day <= 9 ? "0" + day : day) + " " + month + ", " + year;
    return month + " " + (day <= 9 ? "0" + day : day) + ", " + year;
  } else {
    return defaultVal;
  }
};

export const formatDateDDMMMYY = (dateStr) => {
  let mnthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const date = new Date(dateStr.slice(0, 9))

  return (
    date.getDate().toString().padStart(2, 0) + 
    " " +
    mnthArray[date.getMonth()] +
    " " +
    date.getFullYear()
  );
};

export const formatISODateDDMMMYY = (dateStr) => {
  let mnthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const date = new Date(dateStr)

  return (
    date.getDate().toString().padStart(2, 0) + 
    " " +
    mnthArray[date.getMonth()] +
    " " +
    date.getFullYear()
  );
};
export const formatISODDMMMYY = (dateStr) => {
  let mnthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const date = new Date(dateStr)

  return (
    date.getDate().toString().padStart(2, 0) + 
    "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getFullYear()
  );
};
export const formatISODateTime = (dateStr) => {
  let mnthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const date = new Date(dateStr)

  return (
    date.getDate().toString().padStart(2, 0) + 
    " " +
    mnthArray[date.getMonth()] +
    " " +
    date.getFullYear() +
    " " +
    ((date.getHours() === 0)? 12 : ((date.getHours() > 12) ? ((date.getHours() - 12) < 10 ? "0" + date.getHours() - 12 : (date.getHours() - 12)) : ((date.getHours()) < 10 ?"0" + date.getHours() : date.getHours())  )) +
    ":" +
    (date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()) +
    ":" +
    (date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds()) +
    " " +
    ((date.getHours() >= 12)? 'PM' : 'AM')
  );
};

export const formatDateMMDDYYYY = (date) => {
  return (
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getDate().toString().padStart(2, 0)
  );
};

export const formatDateDDMMYYYY = (date) => {
  console.log('date:::::::',date)
  return (
    date.getFullYear()
    + "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getDate().toString().padStart(2, 0)    
  );
};


export const formatDateForBirthDate = (dateStr) => {
  if (typeof dateStr === "string") {
    if (dateStr.indexOf("T00:00:00.000Z") > -1) {
      dateStr = dateStr.replace("T00:00:00.000Z", "T00:00:00.000");
    } else if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.exec(dateStr)) {
      dateStr = dateStr.concat("T00:00:00.000");
    }
  }
  const date = new Date(dateStr);
  return (
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getDate().toString().padStart(2, 0)
  );
};
