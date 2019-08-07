// import request from '../../utils/request';
import jQuery from 'jquery';

export default function getItemInfo(dataObj) {
  // https://feng.arcgisonline.cn/portal/sharing/rest/content/items/ec3fcdb9194544b4adc934ed880c8c69?f=json
  const requestUrl =
    'https://' +
    dataObj.domainName +
    '/' +
    dataObj.webAdaptorName +
    '/sharing/rest/content/items/' +
    dataObj.itemId + '?f=json&token=' +
    dataObj.token;
  return jQuery.ajax({
    type: 'GET',
    url: requestUrl,
    dataType: 'json' //dataType不能少
  });
}
