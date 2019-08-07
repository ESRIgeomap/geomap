// import request from '../../utils/request';
import jQuery from 'jquery';

export default function getTotalSceneLayerItem(dataObj) {
  const requestUrl = 'http://esrichina3d.arcgisonline.cn/portal/sharing/search?f=json&' +
    'num=100&start=1&sortField=modified&sortOrder=desc&' +
    'q=owner:' + dataObj.owner + ' (type:"Scene Service") -type:("Code Attachment" OR "Featured Items")';
  return jQuery.ajax({
    type: 'GET',
    url: requestUrl,
    dataType: 'json' // dataType不能少  
  });
}