import axios from 'axios';
import NetworkUtils from './NetworkUtils';
import AsyncStorageHelper from './AsyncStorageHelper';
import Config from '../comman/Config';
import { getLanguage } from '../comman/i18n';

export const Auth_Api = (Url, SendData) => {
  return async dispatch => {
    const data = await Auth_ApiRequest(Url, SendData, Config.POST);
    return {
      data: data,
    };
  };
};

export const Get_Api = Url => {
  return async dispatch => {
    console.log('GET_API URL:', Url);

    const data = await GET_API_PUBLIC(Url);
    return {
      data: data?.data.data,
    };
  };
};

export const Get_ApiWithToken = (Url, SendData) => {
  return async dispatch => {
    const data = await ApiRequestRow(Url, SendData);
    return {
      data: data?.data?.data,
    };
  };
};

export const Post_Api = async (Url, SendData) => {
  try {
    console.log('FINAL URL:', Config.baseurl + Url);
    console.log('BODY:', SendData);

    const res = await axios.post(Config.baseurl + Url, SendData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res;
  } catch (error) {
    console.log('AXIOS ERROR:', error);
    throw error;
  }
};

export const Post_ApiWithToken = (Url, SendData) => {
  return async dispatch => {
    const data = await ApiRequestRow(Url, SendData);
    return {
      data: data,
    };
  };
};

export const Update_Api = (Url, SendData) => {
  return async dispatch => {
    const data = await ApiRequestPut(Url, SendData);
    return {
      data: data,
    };
  };
};
export const Update_Image = (Url, SendData) => {
  return async dispatch => {
    const data = await ImageRequestPut(Url, SendData);
    return {
      data: data,
    };
  };
};

export async function Auth_ApiRequest(Url, SendData) {
  const isConnected = await NetworkUtils.isNetworkAvailable();
  if (isConnected) {
    let requestOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    //  console.log('Url', Config.baseurl + Url);
    //   console.log('SendData', SendData);
    //   console.log('requestOptions', requestOptions);
    try {
      const response = await axios.post(`${Config.baseurl + Url}`, SendData, {
        ...requestOptions,
      });
      return response;
    } catch (error_msg) {
      // console.log('error_msg', error_msg);
      return error_msg?.response?.data || { error: true };
    }
  }
}

export async function Get_Send_Api(Url, SendData) {
  let token = await AsyncStorageHelper.getData(Config.TOKEN);

  const lang = getLanguage();
  let requestOptions = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authorization: 'Bearer ' + token,
      lang: lang,
    },
  };
  // console.log('Url', Config.baseurl + Url);
  // console.log('SendData', SendData);
  // console.log(' requestOptions', requestOptions);
  // console.log('token', 'Bearer ' + token);
  try {
    const fullUrl = Config.baseurl + Url;

    const response =
      SendData !== undefined && SendData !== null
        ? await axios.post(fullUrl, SendData, requestOptions)
        : await axios.post(fullUrl, {}, requestOptions);
    // const response = await axios.post(`${Config.baseurl + Url}`, SendData, requestOptions);

    return response;
  } catch (error_msg) {
    if (error_msg?.response) {
      // console.log('error_msg?.response.status', error_msg?.response.status);
      return error_msg?.response.status;
    } else if (error_msg?.request) {
      // console.log('error_msg?.request', error_msg?.request);
      return error_msg?.request;
    } else {
      // console.log('error_msg?.message', error_msg?.message);
      return error_msg?.message || null;
    }
  }
}
export const Post_Api_Public = async (url, data) => {
  try {
    const res = await axios.post(Config.baseurl + url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
};

export const GET_API_PUBLIC = async url => {
  try {
    console.log('FINAL URL:', Config.baseurl + url);

    const res = await axios.get(Config.baseurl + url);

    return res;
  } catch (error) {
    throw error;
  }
};
export async function Post_Send_Api(Url, SendData) {
  let token = await AsyncStorageHelper.getData(Config.TOKEN);

  let requestOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // ✅ Only add token if exists
  if (token) {
    requestOptions.headers.Authorization = 'Bearer ' + token;
  }

  try {
    const response = await axios.post(
      `${Config.baseurl + Url}`,
      SendData,
      requestOptions,
    );

    return response;
  } catch (error_msg) {
    console.log('API ERROR:', error_msg?.response);

    // ✅ return full error response
    return (
      error_msg?.response || {
        data: {
          success: false,
          message: 'API failed',
        },
      }
    );
  }
}
export async function Send_ApiRequestWithToken(Url, SendData) {
  let token = await AsyncStorageHelper.getData(Config.TOKEN);
  let requestOptions = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + token,
    },
  };
  // console.log(Config.baseurl + Url);
  // console.log(SendData);
  // console.log(requestOptions);
  const formBody = new URLSearchParams();
  Object.keys(SendData).forEach(key => {
    formBody.append(key, SendData[key]);
  });
  // console.log('formBody', formBody.toString());
  if (token) {
    const response = await axios.post(
      Config.baseurl + Url,
      formBody.toString(),
      requestOptions,
    );
    return response;
  }
}

export async function ApiRequestRow(Url, SendData) {
  let token = await AsyncStorageHelper.getData(Config.TOKEN);
  let requestOptions = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + token,
    },
  };
  // console.log('Url', Config.baseurl + Url);
  // console.log('SendData', SendData);
  // console.log(' requestOptions', requestOptions);
  // console.log('token', 'Bearer ' + token);
  try {
    const response = await axios.post(
      Config.baseurl + Url,
      SendData,
      requestOptions,
    );
    return response;
  } catch (error) {
    if (error?.response) {
      // console.log('error?.response?.data', error?.response?.data);
      return error?.response?.data || null;
    } else if (error?.request) {
      // console.log('error?.request', error?.request);
      return error?.request || null;
    } else {
      // console.log('error?.message', error?.message);
      return error?.message || null;
    }
  }
}

export async function ApiImageRequest(Url, SendData) {
  let token = await AsyncStorageHelper.getData(Config.TOKEN);
  // Do NOT set Content-Type for FormData – axios adds multipart boundary automatically
  let requestOptions = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
    timeout: 30000,
  };

  if (token) {
    try {
      const response = await axios.post(
        `${Config.baseurl + Url}`,
        SendData,
        requestOptions,
      );
      return response;
    } catch (error_msg) {
      if (error_msg?.response) {
        return error_msg?.response?.data || error_msg?.response?.status;
      } else if (error_msg?.request) {
        return error_msg?.request;
      } else {
        return error_msg?.message || null;
      }
    }
  }
}

export async function ApiRequestDelete(Url, SendData) {
  let token = await AsyncStorageHelper.getData(Config.TOKEN);
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: 'Bearer ' + token,
  };
  try {
    const response = await axios.delete(`${Config.baseurl + Url}`, {
      data: SendData,
      headers: headers,
    });
    return response;
  } catch (error_msg) {
    if (error_msg?.response) {
      return error_msg?.response.status;
    } else if (error_msg?.request) {
      return error_msg?.request;
    } else {
      return error_msg?.message || null;
    }
  }
}
export async function ApiRequestPut(Url, SendData) {
  let token = await AsyncStorageHelper.getData(Config.TOKEN);
  let requestOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };
  // console.log('Url', Config.baseurl + Url);
  // console.log('SendData', SendData);
  // console.log('requestOptions', requestOptions);
  try {
    const response = await axios.put(
      `${Config.baseurl + Url}`,
      SendData,
      requestOptions,
    );
    return response;
  } catch (error_msg) {
    if (error_msg?.response) {
      return error_msg?.response.status;
    } else if (error_msg?.request) {
      return error_msg?.request;
    } else {
      return error_msg?.message || null;
    }
  }
}
export async function ImageRequestPut(Url, SendData) {
  let token = await AsyncStorageHelper.getData(Config.TOKEN);

  try {
    const response = await axios.post(`${Config.baseurl + Url}`, SendData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
      timeout: 60000,
    });
    return response;
  } catch (error_msg) {
    if (error_msg?.response) {
      // console.log('error_msg?.response.status', error_msg?.response.status);
      return error_msg?.response.status;
    } else if (error_msg?.request) {
      // console.log('error_msg?.request', error_msg?.request);
      return error_msg?.request;
    } else {
      // console.log('error_msg?.message', error_msg?.message);
      return error_msg?.message || null;
    }
  }
}
