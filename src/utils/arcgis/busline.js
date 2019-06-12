import { DOMParser } from 'xmldom';

import { IDX_LAYER_BUS } from '../../constants/layer-index';
import { jsapi } from '../../constants/geomap-utils';
import envs from '../envs';

let xmlDoc = null;

const ID_GROUP_LAYER = 'layer-busline';
const ID_PIN_LAYER = 'layer-busline-pin';
const ID_ROUTE_LAYER = 'layer-busline-route';
const ID_HIGHLIGHT_LAYER = 'layer-busline-highlight';

const LINE_SYMBOL = { type: 'simple-line', width: '4px' };

//定义一些常量
const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;

/**
 * Private Function
 * Find Busline group layer in the view
 * @param {MapView | SceneView} view
 */
async function getBuslineGroupLayer(view) {
  const gLayer = view.map.layers.find(lyr => {
    return lyr.id === ID_GROUP_LAYER;
  });

  if (gLayer) return gLayer;

  const [GraphicsLayer, GroupLayer] = await jsapi.load([
    'esri/layers/GraphicsLayer',
    'esri/layers/GroupLayer',
  ]);
  const pinLayer = new GraphicsLayer({
    id: ID_PIN_LAYER,
  });
  const routeLayer = new GraphicsLayer({
    id: ID_ROUTE_LAYER,
  });
  const highlightLyr = new GraphicsLayer({
    id: ID_HIGHLIGHT_LAYER,
  });
  const lyr = new GroupLayer({
    id: ID_GROUP_LAYER,
    listMode: 'hide', // do not list the bus line layer in LayerList | Legend widget
    layers: [routeLayer, highlightLyr, pinLayer],
  });

  // Add the group layer to the view
  view.map.layers.add(lyr, IDX_LAYER_BUS);

  return lyr;
}

async function getBuslinePinLayer(view) {
  const lyr = await getBuslineGroupLayer(view);
  return lyr.layers.getItemAt(2);
}

async function getBuslineRouteLayer(view) {
  const lyr = await getBuslineGroupLayer(view);
  return lyr.layers.getItemAt(0);
}

async function getBuslineHighlightLayer(view) {
  const lyr = await getBuslineGroupLayer(view);
  return lyr.layers.getItemAt(1);
}

async function transformlat(lng, lat) {
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

async function transformlng(lng, lat) {
  let ret =
    300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

async function bd09togcj02(bd_lon, bd_lat) {
  const x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  const x = bd_lon - 0.0065;
  const y = bd_lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  const gg_lng = z * Math.cos(theta);
  const gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
}

async function gcj02towgs84(lng, lat) {
  // if (out_of_china(lng, lat)) {
  //     return [lng, lat]
  // }
  // else {
  let dlat = await transformlat(lng - 105.0, lat - 35.0);
  let dlng = await transformlng(lng - 105.0, lat - 35.0);
  const radlat = (lat / 180.0) * PI;
  let magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
  dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
  const mglat = lat + dlat;
  const mglng = lng + dlng;
  return [lng * 2 - mglng, lat * 2 - mglat];
  // }
}

async function drawWalkRouteLine(view, segLine) {
  const lyr = await getBuslineRouteLayer(view);
  const { linePoint } = segLine;
  const points = linePoint.split(';');
  const paths = [];
  for (const point of points) {
    if (point !== '') {
      const coordArr = point.split(',');
      const hxpoint = await bd09togcj02(coordArr[0], coordArr[1]);
      const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);

      paths.push([+bspoint[0], +bspoint[1]]);
    }
  }
  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        envs.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : envs.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: '#4DDC26',
      // style: 'short-dot',
    },
  });
  lyr.graphics.add(gra);
  return gra;
}

async function drawWalkWalkRouteLine(view, segLine) {
  const lyr = await getBuslineRouteLayer(view);
  const { path } = segLine;
  const points = path.split(';');
  const paths = [];
  for (const point of points) {
    if (point !== '') {
      const coordArr = point.split(',');
      const hxpoint = await bd09togcj02(coordArr[0], coordArr[1]);
      const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);

      paths.push([+bspoint[0], +bspoint[1]]);
    }
  }
  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        envs.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : envs.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: 'orange',
      // style: 'short-dot',
    },
  });
  lyr.graphics.add(gra);
  return gra;
}

async function drawDriveDriveRouteLine(view, segLine) {
  const lyr = await getBuslineRouteLayer(view);
  const { path } = segLine;
  const points = path.split(';');
  const paths = [];
  for (const point of points) {
    if (point !== '') {
      const coordArr = point.split(',');
      const hxpoint = await bd09togcj02(coordArr[0], coordArr[1]);
      const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);

      paths.push([+bspoint[0], +bspoint[1]]);
    }
  }
  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        envs.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : envs.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: '#0099FF',
      // style: 'short-dot',
    },
  });
  lyr.graphics.add(gra);
  return gra;
}

async function drawRideRouteLine(view, segLine) {
  const lyr = await getBuslineRouteLayer(view);
  const { path } = segLine;
  const points = path.split(';');
  const paths = [];
  for (const point of points) {
    if (point !== '') {
      const coordArr = point.split(',');
      const hxpoint = await bd09togcj02(coordArr[0], coordArr[1]);
      const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);

      paths.push([+bspoint[0], +bspoint[1]]);
    }
  }
  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        envs.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : envs.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: 'red',
      // style: 'short-dot',
    },
  });
  lyr.graphics.add(gra);
  return gra;
}

async function drawBusRouteLine(view, segLine) {
  const lyr = await getBuslineRouteLayer(view);
  const { linePoint } = segLine;
  const points = linePoint.split(';');
  const paths = [];
  for (const point of points) {
    if (point !== '') {
      const coordArr = point.split(',');
      const hxpoint = await bd09togcj02(coordArr[0], coordArr[1]);
      const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);

      paths.push([+bspoint[0], +bspoint[1]]);
    }
  }
  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        envs.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : envs.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: '#0099FF',
    },
  });
  lyr.graphics.add(gra);
  return gra;
}

async function drawMetroRouteLine(view, segLine) {
  const lyr = await getBuslineRouteLayer(view);
  const { linePoint } = segLine;
  const points = linePoint.split(';');
  const paths = [];
  for (const point of points) {
    if (point !== '') {
      const coordArr = point.split(',');
      const hxpoint = await bd09togcj02(coordArr[0], coordArr[1]);
      const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);

      paths.push([+bspoint[0], +bspoint[1]]);
    }
  }

  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        envs.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : envs.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: '#0099FF',
    },
  });
  lyr.graphics.add(gra);
  return gra;
}

async function drawDriveRouteLine(view, linePoint) {
  const lyr = await getBuslineRouteLayer(view);
  const points = linePoint.split(';');
  const paths = [];
  for (const point of points) {
    if (point !== '') {
      const coordArr = point.split(',');
      const hxpoint = await bd09togcj02(coordArr[0], coordArr[1]);
      const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);

      paths.push([+bspoint[0], +bspoint[1]]);
    }
  }

  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        envs.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : envs.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: '#0099FF',
    },
  });
  lyr.graphics.add(gra);
  return gra;
}

class BusLine {
  static async addStartLocation(view, lon, lat) {
    const gl = await getBuslinePinLayer(view);
    const hxpoint = await bd09togcj02(lon, lat);
    const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);
    const [Graphic] = await jsapi.load(['esri/Graphic']);
    gl.graphics.add(
      new Graphic({
        geometry: {
          type: 'point',
          x: bspoint[0],
          y: bspoint[1],
          spatialReference:
            envs.getParamAgs().view.spatialReference.wkid === 102100
              ? {
                  wkid: 4326,
                }
              : envs.getParamAgs().view.spatialReference,
        },
        symbol: {
          type: 'picture-marker',
          url: './images/start.png',
          height: '41px',
          width: '25px',
        },
      })
    );
    const [Point] = await jsapi.load(['esri/geometry/Point']);
    view.goTo({
      target: new Point({
        x: +bspoint[0],
        y: +bspoint[1],
        spatialReference:
          view.spatialReference.wkid === 102100
            ? {
                wkid: 4326,
              }
            : view.spatialReference,
      }),
      zoom: 17,
    });
  }

  static async addEndLocation(view, lon, lat) {
    const gl = await getBuslinePinLayer(view);
    const hxpoint = await bd09togcj02(lon, lat);
    const bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);
    const [Graphic] = await jsapi.load(['esri/Graphic']);
    gl.graphics.add(
      new Graphic({
        geometry: {
          type: 'point',
          x: bspoint[0],
          y: bspoint[1],
          spatialReference:
            envs.getParamAgs().view.spatialReference.wkid === 102100
              ? {
                  wkid: 4326,
                }
              : envs.getParamAgs().view.spatialReference,
        },
        symbol: {
          type: 'picture-marker',
          url: './images/end.png',
          height: '41px',
          width: '25px',
        },
      })
    );
    const [Point] = await jsapi.load(['esri/geometry/Point']);
    view.goTo({
      target: new Point({
        x: +bspoint[0],
        y: +bspoint[1],
        spatialReference:
          view.spatialReference.wkid === 102100
            ? {
                wkid: 4326,
              }
            : view.spatialReference,
      }),
      zoom: 17,
    });
  }
  static async zoomToPoints(view, start, end) {
    const [Point] = await jsapi.load(['esri/geometry/Point']);
    let hxpoint = await bd09togcj02(start.location.lng, start.location.lat);
    let bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);
    let startPoint = new Point({
      x: bspoint[0],
      y: bspoint[1],
      spatialReference:
        view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : view.spatialReference,
    });
     hxpoint = await bd09togcj02(end.location.lng, end.location.lat);
     bspoint = await gcj02towgs84(hxpoint[0], hxpoint[1]);
    let endPoint = new Point({
      x: bspoint[0],
      y: bspoint[1],
      spatialReference:
        view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : view.spatialReference,
    });
    
    const [geometryEngine] = await jsapi.load(['esri/geometry/geometryEngine']);
    view.goTo(geometryEngine.union([startPoint, endPoint]).extent.expand(2));
  }

  static async drawPlanLine(view, segments) {
    await BusLine.clearHighlightLayer(view);

    // 清除规划线路图层的Graphic
    await BusLine.clearLineLayer(view);

    const lines = [];
    for (const segment of segments) {
      // 天地图API说明是1-4，没有具体说明对应的类型,1:步行,2:公交,3:地铁,4:
      // 百度：1：火车；2：飞机；3：公交；4：驾车；5：步行；6：大巴
      switch (segment.segmentType) {
        case 5: {
          // 步行
          const { segmentLine } = segment;
          for (const segLine of segmentLine) {
            const line = await drawWalkRouteLine(view, segLine);
            lines.push(line);
          }
          break;
        }
        case 3:
        case 6: {
          // 公交
          const { segmentLine } = segment;
          for (const segLine of segmentLine) {
            const line = await drawBusRouteLine(view, segLine);
            lines.push(line);
          }
          break;
        }
        // case 3: {
        //   // 地铁
        //   const { segmentLine } = segment;
        //   for (const segLine of segmentLine) {
        //     const line = await drawMetroRouteLine(view, segLine);
        //     lines.push(line);
        //   }
        //   break;
        // }
        case 4:
          break;
        default:
          break;
      }
    }

    const [geometryEngine] = await jsapi.load(['esri/geometry/geometryEngine']);
    view.goTo(geometryEngine.union(lines.map(gra => gra.geometry)).extent.expand(2));
  }

  static async highlightSegment(view, index) {
    const lyr = await BusLine.clearHighlightLayer(view);
    const rLyr = await getBuslineRouteLayer(view);

    const [Graphic] = await jsapi.load(['esri/Graphic']);
    const gra = rLyr.graphics.getItemAt(index);
    lyr.graphics.add(
      new Graphic({
        geometry: gra.geometry,
        symbol: {
          ...LINE_SYMBOL,
          color: '#00ffff',
        },
      })
    );

    view.goTo(gra.geometry.extent.expand(2));
  }

  static async drawDriveLine(view, segments) {
    await BusLine.clearHighlightLayer(view);

    // 清除规划线路图层的Graphic
    await BusLine.clearLineLayer(view);

    const lines = [];
    // const parser = new DOMParser();
    // xmlDoc = parser.parseFromString(xmlStr);
    // const latlon = xmlDoc.documentElement.getElementsByTagName('routelatlon')[0].textContent;
    // const line = await drawDriveRouteLine(view, latlon);
    // lines.push(line);

    for (const segment of segments) {
      const line = await drawDriveDriveRouteLine(view, segment);
      lines.push(line);
    }

    const [geometryEngine] = await jsapi.load(['esri/geometry/geometryEngine']);
    view.goTo(geometryEngine.union(lines.map(gra => gra.geometry)).extent.expand(2));
  }

  static async drawWalkLine(view, segments) {
    await BusLine.clearHighlightLayer(view);

    // 清除规划线路图层的Graphic
    await BusLine.clearLineLayer(view);
    const lines = [];
    for (const segment of segments) {
      const line = await drawWalkWalkRouteLine(view, segment);
      lines.push(line);
    }

    const [geometryEngine] = await jsapi.load(['esri/geometry/geometryEngine']);
    view.goTo(geometryEngine.union(lines.map(gra => gra.geometry)).extent.expand(2));
  }

  static async drawRideLine(view, segments) {
    await BusLine.clearHighlightLayer(view);

    // 清除规划线路图层的Graphic
    await BusLine.clearLineLayer(view);
    const lines = [];
    for (const segment of segments) {
      const line = await drawRideRouteLine(view, segment);
      lines.push(line);
    }

    const [geometryEngine] = await jsapi.load(['esri/geometry/geometryEngine']);
    view.goTo(geometryEngine.union(lines.map(gra => gra.geometry)).extent.expand(2));
  }

  static async highlightDriveSegment(view, index) {
    const lyr = await BusLine.clearHighlightLayer(view);
    if (xmlDoc) {
      const simple = xmlDoc.documentElement.getElementsByTagName('simple')[0];
      const items = simple.getElementsByTagName('item');
      const graNode = items[index];
      const latlon = graNode.getElementsByTagName('streetLatLon')[0].textContent;
      const points = latlon.split(';');
      const paths = [];
      for (const point of points) {
        if (point !== '') {
          const coordArr = point.split(',');
          paths.push([+coordArr[0], +coordArr[1]]);
        }
      }

      const [Graphic] = await jsapi.load(['esri/Graphic']);
      lyr.graphics.add(
        new Graphic({
          geometry: {
            type: 'polyline',
            paths,
            spatialReference:
              envs.getParamAgs().view.spatialReference.wkid === 102100
                ? {
                    wkid: 4326,
                  }
                : envs.getParamAgs().view.spatialReference,
          },
          symbol: {
            ...LINE_SYMBOL,
            color: '#00ffff',
          },
        })
      );
    }
  }

  static async clearHighlightLayer(view) {
    const lyr = await getBuslineHighlightLayer(view);
    lyr.graphics.removeAll();

    return lyr;
  }

  static async clearLineLayer(view) {
    const rgl = await getBuslineRouteLayer(view);
    rgl.graphics.removeAll();

    return rgl;
  }

  static async clear(view) {
    const gl = await getBuslinePinLayer(view);
    gl.graphics.removeAll();

    const rgl = await getBuslineRouteLayer(view);
    rgl.graphics.removeAll();

    const hgl = await getBuslineHighlightLayer(view);
    hgl.graphics.removeAll();
  }
}

export default BusLine;
