// import request from '../../utils/request';
import jQuery from 'jquery';

export default function getTotalUser(dataObj) {
  // https://feng.arcgisonline.cn/portal/sharing/rest/portals/0123456789ABCDEF/users
  const requestUrl =
    'https://' +
    dataObj.domainName +
    '/' +
    dataObj.webAdaptorName +
    '/sharing/rest/portals/0123456789ABCDEF/users';
    
  const dataObjFinal = {
    token: dataObj.token, // token.
    f: 'json'
  };
  return jQuery.ajax({
    type: 'POST',
    url: requestUrl,
    data: dataObjFinal,
    dataType: 'json' //dataType不能少
  });
}
