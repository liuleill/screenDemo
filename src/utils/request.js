/*
 * @Descripttion: 
 * @version: 
 * @Author: fengbingwei
 * @Date: 2021-06-23 17:07:01
 * @LastEditors: fengbingwei
 * @LastEditTime: 2021-06-23 17:08:25
 */
import axios from 'axios'

// const ip = '39.98.244.238'
// const ip = '58.0.191.167'

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

const xhr = (url, options) => {
  const axiosInstance = axios.create()
  axiosInstance.defaults.timeout = 120000;
  axiosInstance.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
  const { method = 'GET', data } = options;
  switch (method.toLowerCase()) {
    case 'get':
      return axiosInstance.get(url, { params: { date: new Date().getTime(), ...data } });
    case 'post':
      return axiosInstance.post(url, { date: new Date().getTime(), ...data });
    case 'put':
      return axiosInstance.put(url, data);
    case 'patch':
      return axiosInstance.patch(url, data);
    case 'delete':
      return axiosInstance.delete(url, { data });
    case 'head':
      return axiosInstance.head(url, data);
    default:
      return axiosInstance(options);
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

export default function request(url, options) {
  return xhr(`/serverApi${url}`, options).then(checkStatus);
  // return xhr(url, options).then(checkStatus);
  // return xhr(`http://${ip}:8910${url}`, options).then(checkStatus);
}
