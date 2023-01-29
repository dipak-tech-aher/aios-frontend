import React, { useContext } from 'react';
import { properties } from "../properties";
import { history } from "./history";
import { toast } from "react-toastify";
const { API_ENDPOINT } = properties;
export const isLoading = false;


let accessToken
const initToken = () => {
  accessToken =
    JSON.parse(sessionStorage.getItem("auth")) && JSON.parse(sessionStorage.getItem("auth")) !== null
      ? JSON.parse(sessionStorage.getItem("auth")).accessToken
      : "";
};
export const setAccessToken = (token) => {
  accessToken = token;
};

function clean(obj) {
  for (var propName in obj) {
    const value = obj[propName];
    if (value === null || value === undefined || value === "") {
      delete obj[propName];
    }
  }
}

export const get = (api, params) => {
  if (!accessToken) initToken();
  clean(params);
  return new Promise((resolve, reject) => {
    let url = `${API_ENDPOINT}${api}`;
    if (params) {
      const keys = Object.keys(params);
      let query = keys.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
      if (keys.length) {
        url = `${url}?${query}`;
      }
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
    }).then((resp) => {
      if (resp.status && resp.status === 200) {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        return resolve(resp.json());
      } else {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const slowGet = async (api, params) => {
  if (!accessToken) initToken();
  clean(params);

  let url = `${API_ENDPOINT}${api}`;
  if (params) {
    const keys = Object.keys(params);
    let query = keys.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
    if (keys.length) {
      url = `${url}?${query}`;
    }
  }

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: accessToken,
    },
  });
  const data = await resp.json()
  return data
};

export const getBinary = (api, params) => {
  if (!accessToken) initToken();
  clean(params);
  return new Promise((resolve, reject) => {
    let url = `${API_ENDPOINT}${api}`;
    if (params) {
      const keys = Object.keys(params);
      let query = keys.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
      if (keys.length) {
        url = `${url}?${query}`;
      }
    }

    fetch(url, {
      method: "GET",
      headers: {
        authorization: accessToken,
      },
    }).then((resp) => {
      if (resp.status && resp.status === 200) {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        return resolve(resp.blob());
      } else {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const post = (api, body) => {

  if (!accessToken) initToken();
  return new Promise((resolve, reject) => {
    fetch(API_ENDPOINT + api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      if (resp.status && resp.status >= 200 && resp.status < 300) {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        return resolve(resp.json());
      } else {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const put = (api, body) => {
  if (!accessToken) initToken();
  return new Promise((resolve, reject) => {
    fetch(API_ENDPOINT + api, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      if (resp.status && resp.status === 200) {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        return resolve(resp.json());
      } else {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        console.error('Fetch Error', resp.status)
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const remove = (api) => {
  if (!accessToken) initToken();
  return new Promise((resolve, reject) => {
    fetch(API_ENDPOINT + api, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      }
    }).then((resp) => {
      if (resp.status && resp.status === 200) {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        return resolve(resp.json());
      } else {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const patch = (api, body) => {
  if (!accessToken) initToken();
  return new Promise((resolve, reject) => {
    fetch(API_ENDPOINT + api, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      if (resp.status && resp.status === 200) {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        return resolve(resp.json());
      } else {
        if (resp.refreshToken && resp.refreshToken !== null && resp.refreshToken !== undefined) {
          let object = JSON.parse(sessionStorage.getItem("auth"))
          object["accessToken"] = resp.refreshToken;
          sessionStorage.setItem("auth", JSON.stringify(object));
          initToken();
        }
        handleError(resp);
        return reject(resp);
      }
    });
  });
};

export const ameyoGet = (api, params, accessToken) => {  
  clean(params);
  return new Promise((resolve, reject) => {
    let url = `${API_ENDPOINT}${api}`;
    if (params) {
      const keys = Object.keys(params);
      let query = keys.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])).join("&");
      if (keys.length) {
        url = `${url}?${query}`;
      }
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
    }).then((resp) => {
      if (resp.status && resp.status === 200) {     
        return resolve(resp.json());
      } else {       
        handleAmeyoError(resp);
        return reject(resp);
      }
    });
  });
};

export const ameyoPost = (api, body, accessToken) => {  
  return new Promise((resolve, reject) => {
    fetch(API_ENDPOINT + api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: accessToken,
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      if (resp.status && resp.status >= 200 && resp.status < 300) {        
        return resolve(resp.json());
      } else {        
        handleAmeyoError(resp);
        return reject(resp);
      }
    });
  });
};

const handleError = async (resp) => {
  const status = resp.status;
  const error = await resp.json().then((resp) => {
    console.error(resp);
    switch (status) {
      case 401:
        sessionStorage.removeItem("auth");
        setAccessToken('')
        history.push(`${process.env.REACT_APP_BASE}/clearAuth`);
        toast.error(resp.message ? resp.message : "Some error has occured...", { toastId: "error" });
        break;
      case 400:
      case 409:
      default:
        toast.error(resp.message ? JSON.stringify(resp.message) : "Some error has occured...", { toastId: "error" });
        // toast.error(
        //   resp.message ? (
        //     <div>
        //       Sorry, Some error has occured!
        //       <br />
        //       <br />
        //       Technical details :
        //       <br />
        //       <br />
        //       {resp.message}
        //     </div>
        //   ) : (
        //     "Some error has occured..."
        //   ),
        //   {
        //     toastId: "error",
        //   }
        // );
        break;
    }
    return resp;
  });
  return error;
};

const handleAmeyoError = async (resp) => {  
  const error = await resp.json().then((resp) => {
    console.error(resp);
     
        toast.error(resp.message ? JSON.stringify(resp.message) : "Some error has occured...", { toastId: "error" });
       
    return resp;
  });
  return error;
};