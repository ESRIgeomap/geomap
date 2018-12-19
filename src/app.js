import { arcgisAuth } from './middleware/arcgis/arcgis-authentication';
import { createMap } from './middleware/arcgis/sceneview/arcgis-sceneview';
import { createPopup } from './middleware/arcgis/mapview/arcgis-popup';
import { toolbar } from './middleware/arcgis/sceneview/arcgis-toolbar';

export const dva = {
  config: {
    onAction: [arcgisAuth(), createMap(), createPopup(), toolbar()],
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};