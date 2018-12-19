import request from '../../utils/request';

const URL_QUERY = 'http://api.tianditu.gov.cn/search';

export function queryBusStation(key, start) {
  const p = new URLSearchParams();
  p.append('type', 'query');
  p.append('tk', window.geosearchcfg.tianditu.key);
  p.append(
    'postStr',
    JSON.stringify({
      keyWord: key,
      mapBound: '-180,90,180,90',
      queryType: '6',
      level: '11',
      count: '5',
      start: `${start}`,
    }),
  );

  return request(`${URL_QUERY}?${p.toString()}`, {
    method: 'GET',
  });
}

export function queryPoi(key, level, bound, start) {
  const p = new URLSearchParams();
  p.append('type', 'query');
  p.append('tk', window.geosearchcfg.tianditu.key);
  p.append(
    'postStr',
    JSON.stringify({
      keyWord: key,
      mapBound: bound,
      queryType: '7',
      level: `${level}`,
      count: '1000',
      start: `${start}`,
    }),
  );

  return request(`${URL_QUERY}?${p.toString()}`, {
    method: 'GET',
  });
}

export function queryNearbyPoi(key, point, level, bound, start) {
  const p = new URLSearchParams();
  p.append('type', 'query');
  p.append('tk', window.geosearchcfg.tianditu.key);
  p.append(
    'postStr',
    JSON.stringify({
      keyWord: key,
      mapBound: bound,
      queryType: '3',
      queryRadius: '3000',
      pointLonlat: point,
      level: `${level}`,
      count: '1000',
      start: `${start}`,
    }),
  );

  return request(`${URL_QUERY}?${p.toString()}`, {
    method: 'GET',
  });
}
