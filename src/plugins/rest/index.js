import fetch from 'node-fetch';
import crypto from 'crypto';
import qs from 'qs';

const apiKey = '_UsrrJSsY6wIzwej4LG98bA9';
const apiSecret = 'JBWqoMYP4lia_B8w-cgwoQCi_HhyuymJfvELxYp33qalAq-W';

export default {
  install(Vue) {
    Vue.prototype.$makeRequest = (verb, endpoint, data = {}) => {
      let path = '/api/v1/' + endpoint;
      const expires = Math.round(new Date().getTime() / 1000) + 60; 
      
      if (verb === 'GET'){
        const qdata = qs.stringify(data)
        path += qdata !== '' ? '?' + qdata : '';
      }

      const postBody = verb !== "GET" ? JSON.stringify(data) : '';

      const signature = crypto.createHmac('sha256', apiSecret)
        .update(verb + path + expires + postBody)
        .digest('hex');

      const headers = {
        'content-type' : 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'api-expires': expires,
        'api-secret': apiSecret,
        'api-key': apiKey,
        'api-signature': signature
      };

      const requestOptions = {
        headers,
        method: verb,
      };

      if (verb == 'POST') requestOptions.body = postBody
      const url = window.location.origin + path

      return fetch(url, requestOptions).then(res => res.json()).then(
        response => {
          if ('error' in response) throw new Error(response.error.message);
          return response;
        },
        error => console.error('Network error', error),
      );
    }
  }
}