import request from '../../utils/request';

const URL_BUS_LINE = 'http://api.tianditu.gov.cn/transit';

/**
 * 关于linetype： 第0位为1，较快捷；第1位为1，少换乘；第2位为1，少步行；第3位为1，不坐地铁；
 * @param {*} startposition
 * @param {*} endposition
 */
export function planBusLine(startposition, endposition) {
  const p = new URLSearchParams();
  p.append('type', 'busline');
  p.append('tk', window.geosearchcfg.tianditu.key);
  p.append(
    'postStr',
    JSON.stringify({
      startposition,
      endposition,
      linetype: '1',
    }),
  );

  return request(`${URL_BUS_LINE}?${p.toString()}`, {
    method: 'GET',
  });
}
