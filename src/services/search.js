import request from '../utils/request';

import BatchSearch from '../utils/batch-search';
// import { IDENTIFY_TOLERENCE } from '../constants/search';

const URL_SEARCH_SOLR =
  'http://www.mapjs.com.cn/map/search/solr?q=%E5%8D%97%E4%BA%AC%E5%B8%82%E6%94%BF%E5%BA%9C&start=0&rows=5&wt=json';

export function searchsolr(key, start) {
  const param = new URLSearchParams();
  param.append('q', encodeURIComponent(key));
  param.append('start', start);
  param.append('rows', 5);
  param.append('wt', 'json');

  return request(URL_SEARCH_SOLR, {
    method: 'GET',
    params: param,
  });
}

/**
 * 根据关键字查询POI兴趣点
 * @param {string} key 关键字
 */
export async function searchPoi(key) {
  return BatchSearch.instance().search(key);
}

export async function searchCategory(keyword, bound) {
  return BatchSearch.instance().searchCategory(keyword, bound);
}

/**
 * 查询指定的位置周边的POI要素
 * @param {__esri.Point} point 指定的位置
 * @param {number} buffer 缓冲区范围
 */
export async function searchSurround(point, keyword, tolerance, bound) {
  return BatchSearch.instance().identify(point, keyword, tolerance, bound);
}

export async function searchSurroundCat(point, keyword, tolerance, bound) {
  return BatchSearch.instance().identify(point, keyword, tolerance, bound);
}
