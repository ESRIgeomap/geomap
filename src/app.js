// import { arcgisAuth } from './middleware/arcgis/arcgis-authentication';
import { createMapView } from './middleware/arcgis/mapview/arcgis-mapview';
import { bookmarks } from './middleware/arcgis/mapview/arcgis-bookmark';
import { search } from './middleware/arcgis/mapview/arcgis-search';
import { createSceneView } from './middleware/arcgis/sceneview/arcgis-sceneview';
import { createPopup } from './middleware/arcgis/mapview/arcgis-popup';
import { toolbar } from './middleware/arcgis/sceneview/arcgis-toolbar';
import { weatherEffects } from './middleware/arcgis/sceneview/arcgis-weatherEffects'; // 天气特效 中间件


//pensiveant:加载中间件 arcgis-layerList
import { layerList } from './middleware/arcgis/mapview/arcgis-layerList';


export const dva = {
  config: {
    onAction: [
      // arcgisAuth(),
      createSceneView(),
      createMapView(),
      createPopup(),
      toolbar(),
      bookmarks(),
      search(),
      layerList(),
      weatherEffects(),
    ],
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
