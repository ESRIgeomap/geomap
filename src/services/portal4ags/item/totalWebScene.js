// import request from '../../utils/request';
import jQuery from 'jquery';

export default function getTotalWebScene(dataObj) {

  const requestUrl = "http://esrichina3d.arcgisonline.cn/portal/sharing/search?f=json&" +
    "num=100&start=1&sortField=modified&sortOrder=desc&" +
    "q=type:'Web Scene' ";
  return jQuery.ajax({
    type: 'GET',
    url: requestUrl,
    dataType: 'json' //dataType不能少
  });
}