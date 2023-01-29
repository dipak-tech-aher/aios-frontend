export const validate = (schema, obj) => {
  try {
    schema.validateSync(obj);
  } catch (err) {
    return err.message;
  }
};

export const isObjectEmpty = (obj) => {
  if (obj && Object.keys(obj).length > 0) {
    return false;
  } else {
    return true;
  }
};

export const isSafeText = (e) => {
  if (
    !(
      (e.charCode >= 65 && e.charCode <= 90) ||
      (e.charCode >= 97 && e.charCode <= 122) ||
      e.charCode === 45 ||
      e.charCode === 46
    )
  ) {
    e.preventDefault();
  }
};

export const isMixedText = (e) => {
  if (
    !(
      (e.charCode >= 65 && e.charCode <= 90) ||
      (e.charCode >= 97 && e.charCode <= 122) ||
      (e.charCode >= 48 && e.charCode <= 57) ||
      e.charCode === 45 ||
      e.charCode === 46 ||
      e.charCode === 32
    )
  ) {
    e.preventDefault();
  }
};

export const isNumber = (e) => {
  if (e.key === "e" || e.target.value.length > 9) {
    e.preventDefault();
  }
};

export const isNumeric = (number) => {
  if(number === '')
  {
    return true;
  }
  const pattern = /^[0-9]{1,}$/
  let temp = pattern.test(number)
  return temp;
}
export const passport = (number) => {
  if(number === '')
  {
    return true;
  }
  const pattern = /^[0-9]{1,15}$/
  let temp = pattern.test(number)
  return temp;
}
export const copies = (number) => {
  if(number === '')
  {
    return true;
  }
  const pattern = /^[0-9]{1,2}$/
  let temp = pattern.test(number)
  return temp;
}
export const isString = (text) => {
  if(text === '')
  {
    return true;
  }
  const stringPattern = /^[a-zA-Z ]{1,40}$/
  let temp = stringPattern.test(text)
  return temp;
}
export const isStringSurname = (text) => {
  if(text === '')
  {
    return true;
  }
  const stringPattern = /^[a-zA-Z!@#$_'.\- ]{1,80}$/
  let temp = stringPattern.test(text)
  return temp;
}

export const isStringForename = (text) => {
  if(text === '')
  {
    return true;
  }
  const stringPattern = /^[a-zA-Z!@#$_'.\- ]{1,50}$/
  let temp = stringPattern.test(text)
  return temp;
}

export const contactValidate = (number) => {
  if(number === '')
  {
    return true;
  }
  const regexPattern = /^[0-9]{7,7}$/
  let temp = regexPattern.test(number)
  return temp;
}

export const isAlphaNumeric = (data) => {
  if(data === '')
  {
    return true;
  }
  if(data.length > 50)
  {
    return false;
  }
  else
  {
    return true;
  }
  const pattern = /^[a-zA-Z0-9 ]{1,40}$/
  let temp = pattern.test(data)
  return temp;
}

export const isAlphaNumericSpecial = (text) => {
  if(text === '')
  {
    return true;
  }
  if(text.length > 10)
  {
    return false;
  }
  else
  {
    return true;
  }
  const pattern = /^[a-zA-Z0-9-]{1,50}$/
  let temp = pattern.test(text)
  return temp;
}

export const alphaNumericSpecial = (data) => {
  if(data === '')
  {
    return true;
  }
  if(data.length > 8)
  {
    return false;
  }
  else
  {
    return true;
  }
  const pattern = /^[a-zA-Z_0-9@\!#\$\^%&*()+=\-[]\\\';,\.\/\{\}\|\":<>\? ]+$/;
  //const pattern = /^[a-zA-Z0-9-/]{1,8}$/
  let temp = pattern.test(data)   
  return temp;
}


export const numericSpecial = (data) => {
  if(data === '')
  {
    return true;
  }
  if(data.length > 20)
  {
    return false;
  }
  else
  {
    return true;
  }
  const pattern = /[0-9-]/
  let temp = pattern.test(data)
  return temp;
}

export const cityValidate = (data) => {
  if(data === '')
  {
    return true;
  }
  if(data.length > 30)
  {
    return false;
  }
  else
  {
    return true;
  }
}

export const todayDate = (data) => {
  if(data === '')
  {
    return true;
  }
  let parts = data.split('-')
  let before = new Date(parts[2] + "/" + parts[1] + "/" + parts[0])
  //let today = new Date();
  let today1 = new Date();
  let dd = String(today1.getDate()).padStart(2, '0');
  let mm = String(today1.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today1.getFullYear();
  let today = yyyy + '-' + mm + '-' + dd
  //today = mm + '/' + dd + '/' + yyyy
  if (yyyy - Number(parts[0]) < 18) {
    return false;
  }
  if (yyyy  - Number(parts[0]) == 18) {
      //CD: 11/06/2018 and DB: 15/07/2000. Will turned 18 on 15/07/2018.
      if (mm < Number(parts[1])) {
          return false;
      }
      if (mm == Number(parts[1])) {
          //CD: 11/06/2018 and DB: 15/06/2000. Will turned 18 on 15/06/2018.
          if (dd < Number(parts[2])) {
              return false;
          }
      }
  }
  
  if(yyyy  < Number(parts[0]))
  {
    return false;
  }
  if(yyyy  == Number(parts[0]))
  {
    if(mm < Number(parts[1]))
    {
      return false;
    }
    if(mm == Number(parts[1]))
    {
      if(dd < Number(parts[2]))
      {
        return false;
      }
    }
    
  }
  if(data !== today)
  {
    return true;
  }
  else
  {
    return false;
  }
  return true;
}

export const email = (data) => {
  if(data === '')
  {
    return true;
  }
  const pattern = /^[a-zA-Z0-9@._]{1,100}$/
  let temp = pattern.test(data)
  return temp;
}

export const title = (data) => {
  if(data === '')
  {
    return true;
  }
  const pattern = /[0-9]/
  let temp = pattern.test(data)
  if(temp === true)
  {
    return false
  }
  else
  {
    if(data.length > 20)
    {
      return false;
    }
    else
    {
      return true;
    }
  }
  return temp;
}


export const validateNumber = (object) => {
  const pattern = new RegExp("^[0-9]{1,}$");
  let key = String.fromCharCode(!object.charCode ? object.which : object.charCode);
  let temp = pattern.test(key)
  if (temp === false) {
      object.preventDefault();
      return false;
  }
}

export const handlePaste = (e) => {
  e.preventDefault();
  //toast.error("Do not Paste Please Enter Value")
  return false;
}