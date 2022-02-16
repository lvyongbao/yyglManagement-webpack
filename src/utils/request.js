import qs from 'qs';
import { isEmpty, inRange } from 'lodash';
import axios from './axiosInstance';
// 请求成功区间(开区间) 约定
const REQUEST_SUCCESS_REGION = [199, 300];

const fetch = (options) => {
  const {
    method = 'get', data = {}, url, isUrl, headers = {},
  } = options;
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(`${url}${!isEmpty(data) ? `?${qs.stringify(data)}` : ''}`, headers);
    case 'delete':
      return axios.delete(`${url}${!isEmpty(data) ? `?${qs.stringify(data)}` : ''}`, headers);
    case 'head':
      return axios.head(url, {
        headers,
      });
    case 'post':
      return isUrl
        ? axios.post(`${url}${!isEmpty(data) ? `?${qs.stringify(data)}` : ''}`, data, headers)
        : axios.post(url, data, headers);
    case 'put':
      return axios.put(url, data, headers);
    case 'patch':
      return axios.patch(url, data, headers);
    default:
      return axios(options);
  }
};

export default function request(options) {
  const tempOptions = {
    ...options,
  };

  return fetch(tempOptions).then((response) => {
    const { data } = response;
    const { code } = data;
    if (inRange(code, ...REQUEST_SUCCESS_REGION) && code !== 203) {
      return data;
    }
    throw response;
  });
}
