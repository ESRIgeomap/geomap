// import request from '../../utils/request';
import jQuery from 'jquery';

// const generateTokenUrl = 'https://localhost:9991/portal4ags/generateToken';

export default function generateToken(dataObj) {
  // https://feng.arcgisonline.cn/portal/sharing/rest/generateToken
  const requestUrl =
    'https://' +
    dataObj.domainName +
    '/' +
    dataObj.webAdaptorName +
    '/sharing/rest/generateToken';
  const dataObjFinal = {
    username: dataObj.username,
    password: dataObj.password,
    //                    referer: "localhost", // URL of the sending app.
    referer: location.hostname, // URL of the sending app.
    expiration: 60, // Lifetime of the token in minutes.
    f: 'json'
  };
  return jQuery.ajax({
    type: 'POST',
    url: requestUrl,
    data: dataObjFinal,
    dataType: 'json' //dataType不能少
  });
}
