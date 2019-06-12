import {request,requestJsonp} from '../../utils/request';


export function queryBusStation(key, start) {
  let queryUrl = window.searchConfig.addressTipApiUrl;
  queryUrl = queryUrl.replace('{keyword}', key);

  return requestJsonp(`${queryUrl}`, {
    method: 'GET',
    // mode: 'no-cors',
    // mode: 'cors',
    headers:{ 
      Accept: 'application/json'
    },
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
    })
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
    })
  );

  return request(`${URL_QUERY}?${p.toString()}`, {
    method: 'GET',
  });
}