import { jsapi } from '../constants/geomap-utils';

import { queryPoi, queryNearbyPoi } from '../services/tianditu/searchpoi';

let inst;

// async function queryServ(url, params) {
//   const [QueryTask] = await jsapi.load(['esri/tasks/QueryTask']);
//   const qt = new QueryTask({
//     url,
//   });

//   return await qt.execute(params);
// }

async function identifyServ(url, params) {
  const [QueryTask] = await jsapi.load(['esri/tasks/QueryTask']);
  const it = new QueryTask({
    url,
  });
  return await it.execute(params);
}

export default class BatchSearch {
  constructor(services) {
    this.pageSize = 10;
    this.agsservs = services;
    this.keyword = null;
    this.results = [];
  }

  static instance() {
    if (!inst) {
      inst = new BatchSearch();
    }
    return inst;
  }

  reset(text) {
    this.keyword = text;
    this.results = [];
  }

  async search(text) {
    this.reset(text);

    // const [all, Query] = await jsapi.load(['dojo/promise/all', 'esri/tasks/support/Query']);
    // const arrResult = await all(
    //   window.poiCfg.map(serv =>
    //     queryServ(
    //       serv.url,
    //       new Query({
    //         outFields: ['*'],
    //         returnGeometry: true,
    //         where: serv.query.replace('$key$', text),
    //         outSpatialReference: env.getParamAgs().view.spatialReference,
    //       })
    //     )
    //   )
    // );

    // this.results = arrResult.reduce((prev, curr) => prev.concat(curr.features), []);

    return this.results;
  }

  async searchCategory(keyword, bound) {
    this.reset(keyword);

    // const [all, Query] = await jsapi.load(['dojo/promise/all', 'esri/tasks/support/Query']);
    // const arrResult = await all(
    //   window.poiCfg.map(serv =>
    //     queryServ(
    //       serv.url,
    //       new Query({
    //         outFields: ['*'],
    //         returnGeometry: true,
    //         where: serv.catquery.replace('$code$', code),
    //         outSpatialReference: env.getParamAgs().view.spatialReference,
    //       })
    //     )
    //   )
    // );

    const [Graphic, webMercatorUtils] = await jsapi.load([
      'esri/Graphic',
      'esri/geometry/support/webMercatorUtils',
    ]);
    const result = await queryPoi(keyword, '15', bound, '0');
    if (result && result.data) {
      const { pois } = result.data;
      if (pois) {
        this.results = pois.map(poi => {
          const coordArr = poi.lonlat.split(' ');
          const geom = webMercatorUtils.lngLatToXY(+coordArr[0], +coordArr[1]);
          return new Graphic({
            attributes: {
              name: poi.name,
              address: poi.address,
            },
            symbol: {
              type: 'simple-marker',
              color: 'red',
            },
            geometry: {
              type: 'point',
              x: geom[0],
              y: geom[1],
              spatialReference: {
                wkid: 102100,
              },
            },
          });
        });
      } else {
        this.results = [];
      }
    }
    // this.results = arrResult.reduce((prev, curr) => prev.concat(curr.features), []);

    return this.results;
  }

  async identify(point, keyword, tolerence, bound) {
    // const [all, Query] = await jsapi.load(['dojo/promise/all', 'esri/tasks/support/Query']);
    // const arrResult = await all(
    //   window.poiCfg.map(serv =>
    //     identifyServ(
    //       serv.url,
    //       new Query({
    //         outFields: ['*'],
    //         returnGeometry: true,
    //         geometry: point.geometry,
    //         spatialRelationship: 'contains',
    //         distance: tolerence,
    //         units: 'meters',
    //         where: serv.query.replace('$key$', keyword),
    //         outSpatialReference: env.getParamAgs().view.spatialReference,
    //       })
    //     )
    //   )
    // );

    // this.results = arrResult.reduce(
    //   (prev, curr) =>
    //     prev.concat(
    //       curr.reduce((prevQr, currQr) => {
    //         for (const ft of currQr.features) {
    //           for (const attrName of Object.getOwnPropertyNames(
    //             ft.attributes,
    //           )) {
    //             ft.attributes[
    //               currQr.fields.find((f) => f.name === attrName).alias
    //             ] = ft.attributes[attrName];
    //           }

    //           for (const field of currQr.fields) {
    //             delete ft.attributes[field.name];
    //           }
    //         }
    //         return prevQr.concat(currQr.features);
    //       }, []),
    //     ),
    //   [],
    // );

    // this.results = arrResult.reduce((prev, curr) => prev.concat(curr.features), []);

    const [Graphic, webMercatorUtils] = await jsapi.load([
      'esri/Graphic',
      'esri/geometry/support/webMercatorUtils',
    ]);
    const lonlat = webMercatorUtils.xyToLngLat(point.geometry.x, point.geometry.y);
    const result = await queryNearbyPoi(keyword, `${lonlat[0]},${lonlat[1]}`, '11', bound, '0');
    if (result && result.data) {
      const { pois } = result.data;
      if (pois) {
        this.results = pois.map(poi => {
          const coordArr = poi.lonlat.split(' ');
          const geom = webMercatorUtils.lngLatToXY(+coordArr[0], +coordArr[1]);

          return new Graphic({
            attributes: {
              name: poi.name,
              address: poi.address,
            },
            symbol: {
              type: 'simple-marker',
              color: 'red',
            },
            geometry: {
              type: 'point',
              x: geom[0],
              y: geom[1],
              spatialReference: {
                wkid: 102100,
              },
            },
          });
        });
      } else {
        this.results = [];
      }
    }
    return this.results;
  }

  async identifyCategory(point, keyword, tolerence) {
    const [all, Query] = await jsapi.load(['dojo/promise/all', 'esri/tasks/support/Query']);
    const arrResult = await all(
      window.poiCfg.map(serv =>
        identifyServ(
          serv.url,
          new Query({
            outFields: ['*'],
            returnGeometry: true,
            geometry: point.geometry,
            spatialRelationship: 'contains',
            distance: tolerence,
            units: 'meters',
            where: serv.catquery.replace('$code$', keyword),
            outSpatialReference: window.agsGlobal.view.spatialReference,
          })
        )
      )
    );

    // this.results = arrResult.reduce(
    //   (prev, curr) =>
    //     prev.concat(
    //       curr.reduce((prevQr, currQr) => {
    //         for (const ft of currQr.features) {
    //           for (const attrName of Object.getOwnPropertyNames(
    //             ft.attributes,
    //           )) {
    //             ft.attributes[
    //               currQr.fields.find((f) => f.name === attrName).alias
    //             ] = ft.attributes[attrName];
    //           }

    //           for (const field of currQr.fields) {
    //             delete ft.attributes[field.name];
    //           }
    //         }
    //         return prevQr.concat(currQr.features);
    //       }, []),
    //     ),
    //   [],
    // );

    this.results = arrResult.reduce((prev, curr) => prev.concat(curr.features), []);

    return this.results;
  }
}
