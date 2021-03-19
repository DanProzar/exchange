import fetch from 'node-fetch';
import crypto from 'crypto';
import qs from 'qs';

const apiKey = '48GphC_MTWN_0ntW4V1osU4S';
const apiSecret = '-hoVHM9kC1JRwlQBPjYdzosCCpKl7CNtomzyCTGVoLcQ5PSV';

export default {
  install(Vue) {
    Vue.prototype.$makeRequest = (verb, endpoint, data = {}) => {
      let path = '/api/v1/' + endpoint;
      const expires = Math.round(new Date().getTime() / 1000) + 60; 
      
      if (verb === 'GET'){
        const qdata = qs.stringify(data)
        path += qdata !== '' ? '?' + qdata : '';
      }

      const postBody = verb !== "GET" ? JSON.stringify(data) : "{}";
      const signature = crypto.createHmac('sha256', apiSecret)
        .update(verb + path + expires + postBody)
        .digest('hex');

      const headers = {
        'content-type' : 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        // This example uses the 'expires' scheme. You can also use the 'nonce' scheme. See
        // https://www.bitmex.com/app/apiKeysUsage for more details.
        'api-expires': expires,
        'api-key': apiKey,
        'api-signature': signature,
        'api-secret': apiSecret,
        'Target-URL': 'https://testnet.bitmex.com' + path,
      };

      const requestOptions = {
        headers,
        // Notice we are using testnet here. Switch to www to query the production site.
        method: verb,
      };

      if (verb == 'POST') requestOptions.body = postBody
      const url = process.env.VUE_APP_BACKEND_URL

      return fetch(url, requestOptions).then(res => res.json()).then(
        response => {
          if ('error' in response) throw new Error(response.error.message);
          return response;
        },
        error => console.error('Network error', error),
      );
      // const apiRoot = '/api/v1/';
      // const expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
    
      // let query = '', postBody = '';
      // if (verb === 'GET'){
      //   const qdata = qs.stringify(data)
      //   query = qdata !== '' ? '?' + qdata : '';
      // }
      // else {
      //   // Pre-compute the reqBody so we can be sure that we're using *exactly* the same body in the request
      //   // and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
      //   postBody = JSON.stringify(data);
      // }
      // const signature = crypto.createHmac('sha256', apiSecret)
      //   .update(verb + apiRoot + endpoint + query + expires + postBody).digest('hex');
    
      // const headers = {
      //   'content-type': 'application/json',
      //   'accept': 'application/json',
      //   'X-Requested-With': 'XMLHttpRequest',
      //   'api-expires': expires,
      //   'api-key': apiKey,
      //   'api-secret': apiSecret,
      //   'Target-URL': 'https://testnet.bitmex.com' + apiRoot + endpoint + query,
      //   'api-signature': signature,
      // };
      // const requestOptions = {
      //   method: verb,
      //   headers,
      // };
      // if (verb !== 'GET') requestOptions.body = postBody;  // GET/HEAD requests can't have body
    
      // const url = process.env.VUE_APP_BACKEND_URL
      // console.log(url)
    
      // return fetch(url, requestOptions).then(response => response.json()).then(
      //   response => {
      //     if ('error' in response) throw new Error(response.error.message);
      //     return response;
      //   },
      //   error => console.error('Network error', error),
      // );
    }
  }
}