// import request from '../../utils/request';
import jQuery from 'jquery';

export default function getTotalItem(dataObj) {
  // https://feng.arcgisonline.cn/portal/sharing/rest/search?f=json&num=100&start=1&sortField=type&sortOrder=asc&q=modified%3A%5B0000001527724800000%20TO%200000001557220958000%5D%20AND%20accountid%3A0123456789ABCDEF&t=content&f=json&token=mMmBBBLGUPLXy8AZ3kjJySN8tuRBpbKCqo3l-kzYmJWq7Eej3DUWhhFkhLiGxfmhE8ZnskzHCiQFXd3BANmscV5-zF2agKOp19ljxti7jVYCHrTW_opkwmAvbflisbZe-G-AAbz2-uSjGTAwdoYC9Ig6VS-IzBl8BbmGxMtomSTmFlW0HvYRNU65bYyUc85iCVNbgyfzxstHGGTypff0-Q..

  // https://feng.arcgisonline.cn/portal/sharing/rest/search?
  // f=json&num=100&start=1&sortField=type&sortOrder=asc
  // &q=modified%3A%5B0000001527724800000%20TO%200000001557220958000%5D%20AND%20accountid%3A0123456789ABCDEF
  // &t=content&token=mMmBBBLGUPLXy8AZ3kjJySN8tuRBpbKCqo3l-kzYmJWq7Eej3DUWhhFkhLiGxfmhE8ZnskzHCiQFXd3BANmscV5-zF2agKOp19ljxti7jVYCHrTW_opkwmAvbflisbZe-G-AAbz2-uSjGTAwdoYC9Ig6VS-IzBl8BbmGxMtomSTmFlW0HvYRNU65bYyUc85iCVNbgyfzxstHGGTypff0-Q..
  const startDateTimestamp = '1527724800000'; //2018-05-31 08:00:00
  // const endDateTimestamp = '1557220958000';//2019-05-07 17:22:38
  const endDateTimestamp = Math.round(new Date() / 1000) * 1000; //当前时间的时间戳
  console.log('当前时间的时间戳:' + endDateTimestamp);
  const requestUrl =
    'https://' +
    dataObj.domainName +
    '/' +
    dataObj.webAdaptorName +
    '/sharing/rest/search?' +
    'f=json&num=100&start=1&sortField=type&sortOrder=asc' +
    '&q=modified%3A%5B000000' +
    startDateTimestamp +
    '%20TO%20000000' +
    endDateTimestamp +
    '%5D%20AND%20accountid%3A0123456789ABCDEF' +
    '&t=content&token=' +
    dataObj.token;
  return jQuery.ajax({
    type: 'GET',
    url: requestUrl,
    dataType: 'json' //dataType不能少
  });
}
