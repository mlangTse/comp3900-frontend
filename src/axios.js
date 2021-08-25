import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';

import { DEFAULT_ERROR_TEXT } from './utils/text';
import {notification } from 'antd';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use((request) => {
    if (request.method === 'put' || request.method === 'post' || request.method === 'delete') {
        request.data = qs.stringify(request.data);
    }
    return request;
});

const openNotificationWithIcon = (type,description) => {
    notification[type]({
      message: 'Oops!',
      description:description,
      style: {
        'background-color': '#fff2f0',
        border: '1px solid #ffccc7'
      }
    });
  };

const errorHandler = (error) => {
    // great gist https://gist.github.com/saqueib/a495af17d7c0e2fd5c2316b0822ebac3

    // if has response show the error
    console.error('error', error);

    let errormessage = DEFAULT_ERROR_TEXT;

    if (error.response) {
        console.log(error.response.data)
        errormessage = _.get(error, 'response.data.message') || DEFAULT_ERROR_TEXT;
    }
    openNotificationWithIcon('error',errormessage)
    return Promise.reject({ ...error })
}

const responseHandler = (response) => {
    console.log('response: ', response)
    return response;
}

axios.interceptors.response.use(responseHandler, errorHandler);