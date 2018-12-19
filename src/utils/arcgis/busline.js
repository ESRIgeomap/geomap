import { DOMParser } from 'xmldom';

import { IDX_LAYER_BUS } from '../../constants/layer-index';
import * as jsapi from '../jsapi';
import env from '../env';

let xmlDoc = null;

const ID_GROUP_LAYER = 'layer-busline';
const ID_PIN_LAYER = 'layer-busline-pin';
const ID_ROUTE_LAYER = 'layer-busline-route';
const ID_HIGHLIGHT_LAYER = 'layer-busline-highlight';

const LINE_SYMBOL = { type: 'simple-line', width: '4px' };

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

async function drawWalkRouteLine(view, segLine) {
  const lyr = await getBuslineRouteLayer(view);
  const { linePoint } = segLine;
  const points = linePoint.split(';');
  const paths = [];
  for (const point of points) {
    if (point !== '') {
      const coordArr = point.split(',');
      paths.push([+coordArr[0], +coordArr[1]]);
    }
  }
  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        env.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : env.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: 'orange',
      style: 'short-dot',
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
      paths.push([+coordArr[0], +coordArr[1]]);
    }
  }
  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        env.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : env.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: 'blue',
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
      paths.push([+coordArr[0], +coordArr[1]]);
    }
  }

  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        env.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : env.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: 'blue',
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
      paths.push([+coordArr[0], +coordArr[1]]);
    }
  }

  const [Graphic] = await jsapi.load(['esri/Graphic']);
  const gra = new Graphic({
    geometry: {
      type: 'polyline',
      paths,
      spatialReference:
        env.getParamAgs().view.spatialReference.wkid === 102100
          ? {
              wkid: 4326,
            }
          : env.getParamAgs().view.spatialReference,
    },
    symbol: {
      ...LINE_SYMBOL,
      color: 'blue',
    },
  });
  lyr.graphics.add(gra);
  return gra;
}

class BusLine {
  static async addStartLocation(view, lon, lat) {
    const gl = await getBuslinePinLayer(view);

    const [Graphic] = await jsapi.load(['esri/Graphic']);
    gl.graphics.add(
      new Graphic({
        geometry: {
          type: 'point',
          x: lon,
          y: lat,
          spatialReference:
            env.getParamAgs().view.spatialReference.wkid === 102100
              ? {
                  wkid: 4326,
                }
              : env.getParamAgs().view.spatialReference,
        },
        symbol: {
          type: 'picture-marker',
          url: './images/start.png',
          height: '24px',
          width: '24px',
        },
      })
    );
  }

  static async addEndLocation(view, lon, lat) {
    const gl = await getBuslinePinLayer(view);

    const [Graphic] = await jsapi.load(['esri/Graphic']);
    gl.graphics.add(
      new Graphic({
        geometry: {
          type: 'point',
          x: lon,
          y: lat,
          spatialReference:
            env.getParamAgs().view.spatialReference.wkid === 102100
              ? {
                  wkid: 4326,
                }
              : env.getParamAgs().view.spatialReference,
        },
        symbol: {
          type: 'picture-marker',
          url: './images/end.png',
          height: '24px',
          width: '24px',
        },
      })
    );
  }

  static async drawPlanLine(view, segments) {
    await BusLine.clearHighlightLayer(view);

    // 清除规划线路图层的Graphic
    await BusLine.clearLineLayer(view);

    const lines = [];
    for (const segment of segments) {
      // 天地图API说明是1-4，没有具体说明对应的类型
      switch (segment.segmentType) {
        case 1: {
          // 步行
          const { segmentLine } = segment;
          for (const segLine of segmentLine) {
            const line = await drawWalkRouteLine(view, segLine);
            lines.push(line);
          }
          break;
        }
        case 2: {
          // 公交
          const { segmentLine } = segment;
          for (const segLine of segmentLine) {
            const line = await drawBusRouteLine(view, segLine);
            lines.push(line);
          }
          break;
        }
        case 3: {
          // 地铁
          const { segmentLine } = segment;
          for (const segLine of segmentLine) {
            const line = await drawMetroRouteLine(view, segLine);
            lines.push(line);
          }
          break;
        }
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
  }

  static async drawDriveLine(view, xmlStr) {
    await BusLine.clearHighlightLayer(view);

    // 清除规划线路图层的Graphic
    await BusLine.clearLineLayer(view);

    const lines = [];
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlStr);
    const latlon = xmlDoc.documentElement.getElementsByTagName('routelatlon')[0].textContent;
    const line = await drawDriveRouteLine(view, latlon);
    lines.push(line);

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
              env.getParamAgs().view.spatialReference.wkid === 102100
                ? {
                    wkid: 4326,
                  }
                : env.getParamAgs().view.spatialReference,
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
