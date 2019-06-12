//pensiveant：数据选择迁移添加

/**
 * 关于调用Portal的接口在写里写
 */
import request from '../utils/request';

const portalUrl =
  window.appcfg.portal.indexOf('https') < 0
    ? window.appcfg.portal.replace('http', 'https')
    : window.appcfg.portal;
// const portalUrl = window.appcfg.portal;
/**
 * 获取token令牌,默认一个小时有效期
 * @param {*} username 用户名
 * @param {*} password 密码
 */
export function getPortalToken(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('referer', location.hostname);
  formData.append('expiration', 60);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  return request(`${portalUrl}` + 'sharing/rest/generateToken', options);
}
/**
 * 获取当前用户信息
 */
export function getPortalSelf() {
  const formData = new URLSearchParams();
  formData.append('f', 'json');
  formData.append('token', sessionStorage.token);
  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  return request(`${portalUrl}` + 'sharing/rest/community/self', options);
}
/**
 *
 * @param {*} q 查询条件
 * @param {*} start 开始条目
 * @param {*} num 返回条数
 * @param {*} sortField 排序字段
 * @param {*} sort 排序方式
 */
export function searchItems(q, start, num, sortField, sort) {
  const formData = new URLSearchParams();
  formData.append('token', sessionStorage.token);
  formData.append('q', q);
  formData.append('start', start);
  formData.append('num', num);
  formData.append('sortField', sortField);
  formData.append('sortOrder', sort);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  return request(`${portalUrl}` + 'sharing/rest/search', options);
}
/**
 * 获取Item详情
 * @param {*} itemid itemid
 */
export function getItemInfoByItemId(itemid) {
  const formData = new URLSearchParams();
  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  return request(`${portalUrl}` + 'sharing/rest/content/items/' + itemid, options);
}
/**
 *添加新的WebMap
 * @param {*} title 标题
 * @param {*} tags 标签
 * @param {*} username 用户名
 * @param {*} snippet 摘要
 * @param {*} extent 范围
 * @param {*} text webmap json
 * @param {*} token token
 */
export function addWebMap(title, tags, snippet, extent, text) {
  const formData = new URLSearchParams();
  formData.append('title', title);
  formData.append('tags', tags);
  formData.append('snippet', snippet);
  formData.append('description', '');
  formData.append('accessInformation', '');
  formData.append('licenseInfo', '');
  formData.append(
    'extent',
    extent.xmin + ',' + extent.ymin + ',' + extent.xmax + ',' + extent.ymax
  );
  formData.append('text', JSON.stringify(text));
  formData.append('type', 'Web Map');

  formData.append('typeKeywords', 'Web Map,Explorer Web Map,Map,Online Map,ArcGIS Online');
  formData.append('overwrite', false);
  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  return request(
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/addItem`,
    options
  );
}

export function updateItemByItemId(itemid, tags, url, description,text) {
  const formData = new URLSearchParams();
  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');
  tags && formData.append('tags', ['pgis'].concat(tags));
  url && formData.append('url', url);
  description && formData.append('description', description);
  text && formData.append('text', text);
  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  return request(
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/items/${itemid}/update`,
    options
  );
}
/**
 * Item公共共享
 * @param {*} items
 */
export function shareItem(items) {
  const formData = new URLSearchParams();
  formData.append('items', items);
  formData.append('token', sessionStorage.token);
  formData.append('everyone', true);
  formData.append('groups', '');
  formData.append('account', true);
  formData.append('f', 'json');
  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  return request(
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/shareItems`,
    options
  );
}
/**
 * 删除Items
 * @param {*} itemids item数组例 ['12321q1q1','q1q1q1q1']
 */
export function deleteItems(itemids) {
  const formData = new URLSearchParams();
  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');
  formData.append('items', itemids);
  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  return request( 
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/deleteItems`,
    options
  );
}

/**
 *
 * @param {*} title 标绘标题
 * @param {*} text  标绘内容字符串
 */
export function addPoltlayerItem(title, text, extent,tags) {
  const formData = new URLSearchParams();
  formData.append('title', title);
  formData.append('tags', ['pgis'].concat(tags));
  formData.append('text', text);
  formData.append('type', 'Feature Collection');
  // formData.append('url', window.location.href);
  formData.append(
    'extent',
    extent.xmin + ',' + extent.ymin + ',' + extent.xmax + ',' + extent.ymax
  );

  formData.append('overwrite', true);
  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  return request(
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/addItem`,
    options
  );
}

/**
 *
 * @param {*} title 文件标题
 * @param {*} file 文件对象
 * @param {*} filetype tags 文件业务类型
 * @param {*} type 文件类型
 * @param {*} description  文件描述
 */
export function addPoltFileItem(title, file, filetype, type, description) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('tags', ['pgis'].concat(filetype));
  formData.append('file', file);
  if (type.toUpperCase() === 'CSV') {
    formData.append('type', 'CSV');
  }
  if (type.toUpperCase() === 'KML') {
    formData.append('type', 'KML');
  }
  if (type.toUpperCase() === 'ZIP') {
    formData.append('type', 'Shapefile');
  }
  if (type.toUpperCase() === 'GEOJSON') {
    formData.append('type', 'GeoJson');
  }
  formData.append('async', true);
  formData.append('description', description);
  formData.append('itemType', 'file');
  formData.append('access', 'public');

  formData.append('overwrite', true);
  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');

  // formData.append('multipart', true);
  // formData.append('filename',file.name);

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      // 'Content-Type': 'multipart/form-data',
    }),
  };
  return request(
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/addItem`,
    options
  );
}

/**
 * 发布Item项服务
 * @param {*} itemid
 * @param {*} fileType
 * @param {*} publishParameters
 */
export function publishItem(itemid, fileType, publishParameters) {
  const formData = new FormData();
  formData.append('itemId', itemid);
  formData.append('fileType', fileType);
  formData.append('publishParameters', JSON.stringify(publishParameters));
  formData.append('overwrite', true);

  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  return request(
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/publish`,
    options
  );
}
/**
 * 根据导出item文件类型导出类型
 * @param {*} exportFormat 导出文件类型(限于Shapefile、CSV、GeoJson、KML)
 * @param {*} itemid itemid
 */
export function exportFileByType(exportFormat, itemid) {
  const formData = new URLSearchParams();
  formData.append('itemId', itemid);
  formData.append('exportFormat', exportFormat);
  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');
  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };
  return request(
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/export`,
    options
  );
}

/**
 * 检查Job状态
 * @param {*} itemid  新任务itemid
 * @param {*} jobId   jobId
 * @param {*} jobType Values: publish, generateFeatures, export, and createService
 */
export function checkJobStatus(itemid, jobId, jobType) {
  const formData = new URLSearchParams();
  formData.append('jobId', jobId);
  formData.append('jobType', jobType);
  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  return request(
    `${portalUrl}sharing/rest/content/users/${sessionStorage.username}/items/${itemid}/status`,
    options
  );
}

export function publishParametersAnalyze(itemid, filetype) {
  const formData = new URLSearchParams();
  formData.append('itemid', itemid);
  formData.append('filetype', filetype); 

  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  return request(
    `${portalUrl}sharing/rest/content/features/analyze?token=${sessionStorage.token}`,
    options
  );
}
/**
 * 获取标绘图层text
 * @param {*} itemid 
 */
export function getPoltItemData(itemid){
  const formData = new URLSearchParams();

  formData.append('token', sessionStorage.token);
  formData.append('f', 'json');

  const options = {
    method: 'POST',
    body: formData,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  return request(
    `${window.appcfg.portal}sharing/rest/content/items/${
      itemid
    }/data`,
    options
  );
}
