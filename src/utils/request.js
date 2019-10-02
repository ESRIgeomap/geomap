import fetch from 'dva/fetch';
// import fetchJsonp from 'fetch-jsonp'
import NProgress from 'nprogress';

function parseJSON(response) {
  return response.json();
}

function parseText(response) {
  return response.text();
}
function parseArrayBuffer(response){
  return response.arrayBuffer();
}
function checkStatus(response) {
  if ((response.status >= 200 && response.status < 300)|| response.ok === true) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  NProgress.start();

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      NProgress.done();
      return { data };
    })
    .catch((err) => {
      NProgress.done();
      return { err };
    });
}

export function requestJsonp(url, options) {
  NProgress.start();

  return fetchJsonp(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      NProgress.done();
      return { data };
    })
    .catch((err) => {
      NProgress.done();
      return { err };
    });
}



export function requestText(url, options) {
  NProgress.start();

  return fetch(url, options)
    .then(checkStatus)
    .then(parseText)
    .then((data) => {
      NProgress.done();
      return { data };
    })
    .catch((err) => {
      NProgress.done();
      return { err };
    });
}

export function requestArrayBuffer(url,options){
  NProgress.start();

  return fetch(url, options)
    .then(checkStatus)
    .then(parseArrayBuffer)
    .then((data) => {
      NProgress.done();
      return { data };
    })
    .catch((err) => {
      NProgress.done();
      return { err };
    });
}
