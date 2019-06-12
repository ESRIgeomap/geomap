import {request,requestJsonp} from '../../utils/request';

const URL_BUS_LINE = 'http://api.tianditu.gov.cn/transit';

/**
 * 关于linetype： 第0位为1，较快捷；第1位为1，少换乘；第2位为1，少步行；第3位为1，不坐地铁；
 * @param {*} startposition
 * @param {*} endposition
 */
export function planWalkLine(startposition, endposition) {
  let queryUrl = window.searchConfig.walkApiUrl;
  queryUrl = queryUrl.replace('{origin}', startposition.split(',')[1]+','+startposition.split(',')[0]);
  queryUrl = queryUrl.replace('{destination}', endposition.split(',')[1]+','+endposition.split(',')[0]);

  return requestJsonp(`${queryUrl}`, {
    method: 'GET',
    headers:{ 
      Accept: 'application/json'
    },
  });
}
