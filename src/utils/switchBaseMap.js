import { jsapi } from '../constants/geomap-utils';

export default async function switchBaseMapByWebmapId(webmapId) {
  const view = agsGlobal.view;
  const [WebMap] = await jsapi.load(['esri/WebMap']);
  const map = new WebMap({
    portalItem: {
      id: webmapId,
    },
  });
  map.load().then(function() {
    map.basemap.load().then(function() {
      view.map.basemap = map.basemap;
    });
  });
}
