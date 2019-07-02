// import request from '../../utils/request';
import jQuery from 'jquery';

export default function getTotalGroup(dataObj) {
  // https://feng.arcgisonline.cn/portal/sharing/rest/community/groups?num=100&start=0&sortField=title&sortOrder=asc&q=orgid%3A0123456789ABCDEF&f=json&token=vHjRtx-NwGVyHtDM3Q5Q4I2L-XS_tdSntkx_9mr_23PleKkMio9a2JkCcsrQ5q4kvDLN_4dcMZzkF_l4RWeL08fsC7eVZYIGW0OsErr5k0RxJ0uHGwKQA9RWR0DJq-t9_bHf_BZnIm9G5dTks1lU4-E2jO4ca_RBkzLNIFkciTbLSpWB7aSocpQKnt63rAYN-3QDUO80yHpyFArilCIXKA..

  // https://feng.arcgisonline.cn/portal/sharing/rest/community/groups?
  // f=json&num=100&start=0&sortField=title&sortOrder=asc
  // &q=orgid%3A0123456789ABCDEF&token=vHjRtx-NwGVyHtDM3Q5Q4I2L-XS_tdSntkx_9mr_23PleKkMio9a2JkCcsrQ5q4kvDLN_4dcMZzkF_l4RWeL08fsC7eVZYIGW0OsErr5k0RxJ0uHGwKQA9RWR0DJq-t9_bHf_BZnIm9G5dTks1lU4-E2jO4ca_RBkzLNIFkciTbLSpWB7aSocpQKnt63rAYN-3QDUO80yHpyFArilCIXKA..

  const requestUrl =
    'https://' +
    dataObj.domainName +
    '/' +
    dataObj.webAdaptorName +
    '/sharing/rest/community/groups?' +
    'f=json&num=100&start=0&sortField=title&sortOrder=asc' +
    '&q=orgid%3A0123456789ABCDEF' +
    '&token=' +
    dataObj.token;
  return jQuery.ajax({
    type: 'GET',
    url: requestUrl,
    dataType: 'json' //dataType不能少
  });
}
