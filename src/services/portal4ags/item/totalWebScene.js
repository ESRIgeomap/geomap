// import request from '../../utils/request';
import jQuery from 'jquery';

export default function getTotalWebScene(dataObj) {
  //   type:'Web Scene' AND owner:Product   对
  // type:'Web Scene' and owner:Product    不对
  // type:'Web Scene' AND owner:'Product'   不对
  // asc 正序
  // desc 倒序
  // https://feng.arcgisonline.cn/portal/sharing/rest/search?f=json&num=100&start=1&sortField=type&sortOrder=asc&q=modified%3A%5B0000001527724800000%20TO%200000001557220958000%5D%20AND%20accountid%3A0123456789ABCDEF&t=content&f=json&token=mMmBBBLGUPLXy8AZ3kjJySN8tuRBpbKCqo3l-kzYmJWq7Eej3DUWhhFkhLiGxfmhE8ZnskzHCiQFXd3BANmscV5-zF2agKOp19ljxti7jVYCHrTW_opkwmAvbflisbZe-G-AAbz2-uSjGTAwdoYC9Ig6VS-IzBl8BbmGxMtomSTmFlW0HvYRNU65bYyUc85iCVNbgyfzxstHGGTypff0-Q..
  // http://esrichina3d.arcgisonline.cn/portal/sharing/search?f=json&q=type%3A%27Web+Scene%27+AND+owner%3AProduct&bbox=&sortField=&sortOrder=

  const requestUrl = "http://esrichina3d.arcgisonline.cn/portal/sharing/search?f=json&" +
    "num=100&start=1&sortField=modified&sortOrder=desc&" +
    "q=type:'Web Scene' AND owner:" + dataObj.owner;
  return jQuery.ajax({
    type: 'GET',
    url: requestUrl,
    dataType: 'json' //dataType不能少
  });
}