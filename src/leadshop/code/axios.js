import axios from 'axios';
import utils from 'axios/lib/utils';
import normalizeHeaderName from 'axios/lib/helpers/normalizeHeaderName';
import createError from 'axios/lib/core/createError';
import buildUrl from 'axios/lib/helpers/buildURL';
import settle from 'axios/lib/core/settle';
import Timeout from './await-timeout';

const timer = new Timeout();

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

axios.defaults.transformRequest = [
  function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (
      utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }
];

axios.defaults.adapter = config => {
  return new Promise((resolve, reject) => {
    const requestMethod = (utils.isString(config.method) ? config.method : 'GET').toUpperCase();
    const requestUrl = config.baseURL + buildUrl(config.url, config.params, config.paramsSerializer);
    const requestHeaders = utils.isObject(config.headers) ? config.headers : {};

    // 请求数据
    let requestData = config.data;

    let request = '';
    if (requestHeaders['Content-Type'] && requestHeaders['Content-Type'] === 'multipart/form-data') {
      let data = JSON.parse(config.data);
      let header = JSON.parse(JSON.stringify(requestHeaders));
      delete header['Content-Type'];
      request = uni.uploadFile({
        url: requestUrl,
        header: header,
        filePath: data.content,
        formData: {
          type: data.type
        },
        name: 'content',
        success: res => {
          settle(resolve, reject, {
            data: res.data,
            status: res.statusCode,
            statusText: '',
            headers: res.header,
            config: config,
            request: request
          });
        },
        fail: res => {
          const error = createError('网络错误', config, res, request);
          reject(error);
        },
        complete: () => {
          timer.clear();
        }
      });
    } else {
      request = uni.request({
        method: requestMethod,
        url: requestUrl,
        header: requestHeaders,
        data: requestMethod === 'POST' || requestMethod === 'PUT' || requestMethod === 'PATCH' ? requestData : '',
        responseType: config.responseType === 'arraybuffer' ? 'arraybuffer' : 'text',
        dataType: config.responseType === 'json' ? 'json' : config.responseType,
        success: res => {
          settle(resolve, reject, {
            data: res.data,
            status: res.statusCode,
            statusText: '',
            headers: res.header,
            config: config,
            request: request
          });
        },
        fail: res => {
          const error = createError('网络错误', config, res, request);
          reject(error);
        },
        complete: () => {
          timer.clear();
        }
      });
    }

    // 支持超时处理
    if (config.timeout) {
      timer.set(config.timeout).then(() => {
        reject(new Error('请求超时'));
        request.abort();
      });
    }
  });
};

export default axios;
