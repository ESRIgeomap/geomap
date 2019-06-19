/* eslint-disable no-undef */
import { request, requestJsonp, requestText } from '../../utils/request';

import { jsapi } from '../../constants/geomap-utils';

export async function poiSearch(keyword, bound, types, param, pageInfo, bSmartTips) {
  param = param || {};
  if (param.mapExtent && param.mapExtent.xmin) {
    var mapExtent = param.mapExtent;
    param.mapExtent =
      mapExtent.xmin + ',' + mapExtent.ymin + ',' + mapExtent.xmax + ',' + mapExtent.ymax;
  }

  let queryUrl;
  // if (bSmartTips) {
  queryUrl = window.searchConfig.poiApiUrl;
  queryUrl = queryUrl.replace('{keyword}', keyword);
  if (bSmartTips) {
    queryUrl = queryUrl.replace('{pageSize}', window.searchConfig.smartTipSize);
  } else {
    queryUrl = queryUrl.replace('{pageSize}', window.searchConfig.pageSize);
  }

  if (pageInfo.pageIndex) {
    queryUrl = queryUrl.replace('{pageNum}', pageInfo.pageIndex - 1);
  } else {
    queryUrl = queryUrl.replace('{pageNum}', 0);
  }
  // } else {
  // }

  // lat,lng(左下角坐标),lat,lng(右上角坐标)

  const [webMercatorUtils] = await jsapi.load(['esri/geometry/support/webMercatorUtils']);
  let wgsExtent = webMercatorUtils.webMercatorToGeographic(bound);
  let bounds = wgsExtent.ymin + ',' + wgsExtent.xmin + ',' + wgsExtent.ymax + ',' + wgsExtent.xmax;
  queryUrl = queryUrl.replace('{bounds}', bounds);

  return requestJsonp(`${queryUrl}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
}

export async function coordConvert(coords, fromCoord, toCoord) {
  if (coords && coords.length) {
    let queryUrl;
    let coordStr = '';

    coords.map((coord, index) => {
      coordStr += coord[0] + ',' + coord[1];
      if (index < coords.length - 1) {
        coordStr += ';';
      }
    });

    queryUrl = window.searchConfig.coordCovertApiUrl;
    queryUrl = queryUrl.replace('{coords}', coordStr);
    queryUrl = queryUrl.replace('{fromCoord}', fromCoord);
    queryUrl = queryUrl.replace('{toCoord}', toCoord);

    return requestJsonp(`${queryUrl}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  } else {
    return null;
  }
}

export async function verifyPanoExist(coords) {
  if (coords) {
    let queryUrl;
    queryUrl = window.searchConfig.panoVerfiyApiUrl;
    queryUrl = queryUrl.replace('{x}', coords.x);
    queryUrl = queryUrl.replace('{y}', coords.y);

    return requestText(`${queryUrl}`, {
      method: 'GET',
      // headers: {
      //   Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      // },
    });
  } else {
    return null;
  }
}
