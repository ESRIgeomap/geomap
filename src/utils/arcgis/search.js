import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import PoiPopup from '../../components/popups/PoiPopup';

import {
  ZOOM_HIGHLIGHT_POI,
  IDENTIFY_TOLERENCE,
  LIST_RESULT_FIND,
  LIST_RESULT_QUERY,
} from '../../constants/search';
import { IDX_LAYER_SEARCH } from '../../constants/layer-index';

import * as jsapi from '../jsapi';
import env from '../env';

let inst;
const ID_GROUP_LAYER = 'layer-search-group';
const ID_PIN_LAYER = 'layer-search-pin';
const ID_LABEL_LAYER = 'layer-search-label';

const DRAW_SYMBOL = {
  type: 'picture-marker',
  url: './images/busline/svg_location_red.png',
  width: '32px',
  height: '32px',
  yoffset: '16px',
};

const HIGHLIGHT_SYMBOL = {
  type: 'picture-marker',
  url: './images/busline/svg_location_highlight.png',
  width: '32px',
  height: '32px',
  yoffset: '16px',
};

const BUFFER_SYMBOL = {
  type: 'simple-fill',
  color: [0, 0, 0, 0.1],
  style: 'solid',
  outline: {
    color: [1, 85, 255],
    width: 2,
  },
};

const PIN_SYMBOL = {
  type: 'picture-marker',
  url: './images/busline/pin.png',
  width: '32px',
  height: '32px',
  yoffset: '16px',
};

/**
 * Private Function
 * Find Busline group layer in the this.view
 * @param {Mapthis.view | Scenethis.view} this.view
 */
async function getSearchLayer(view) {
  const gLayer = view.map.layers.find(lyr => {
    return lyr.id === ID_GROUP_LAYER;
  });

  if (gLayer) return gLayer;

  const [GraphicsLayer, GroupLayer] = await jsapi.load([
    'esri/layers/GraphicsLayer',
    'esri/layers/GroupLayer',
  ]);
  const glyr = new GroupLayer({
    id: ID_GROUP_LAYER,
    listMode: 'hide',
  });
  const lyr = new GraphicsLayer({
    id: ID_PIN_LAYER,
  });
  const lLyr = new GraphicsLayer({
    id: ID_LABEL_LAYER,
  });
  lLyr.opacity = 0.98;
  glyr.layers.addMany([lyr, lLyr]);

  // Add the group layer to the this.view
  view.map.layers.add(glyr, IDX_LAYER_SEARCH);

  return glyr;
}

async function getSublayerById(view, id) {
  const gLayer = await getSearchLayer(view);
  return gLayer.layers.find(l => l.id === id);
}

function getPoiPopup(graphic) {
  const div = document.createElement('div');

  ReactDOM.render(<PoiPopup graphic={graphic} />, div);
  return div;
}

async function disableLabelLayerClick() {
  const [domStyle, query] = await jsapi.load(['dojo/dom-style', 'dojo/query']);
  domStyle.set(query('div[style*="opacity: 0.98;"]'), 'pointer-events', 'none');
}

class SearchGraphicUtil {
  constructor() {
    this.highlightId = null;
    this.highlightNearbyId = null;
    this.view = null;
    this.store = null;
    this.type = null;
  }

  static instance() {
    if (!inst) {
      inst = new SearchGraphicUtil();
    }

    return inst;
  }

  clearPopup() {
    this.view.popup.close();
    this.view.popup.clear();
  }

  showPopup(graphic) {
    this.view.popup.open({
      features: [graphic],
    });
  }

  async onFeatureSelected() {
    if (!this.view.popup.features || !this.view.popup.features.length) {
      return;
    }

    const feature = this.view.popup.features[0];
    if (feature) {
      if (this.type === LIST_RESULT_FIND) {
        if (this.highlightId !== null) {
          await this.clearHighlight();
        }
        this.highlightId = feature.attributes.SEARCHID;
        this.store.dispatch({
          type: 'search/selectPoi',
          payload: {
            item: feature,
            index: feature.attributes.SEARCHID,
          },
        });
      } else if (this.type === LIST_RESULT_QUERY) {
        if (this.highlightNearbyId !== null) {
          await this.clearHighlightNearby();
        }
        this.highlightNearbyId = feature.attributes.SEARCHID;
        this.store.dispatch({
          type: 'search/selectNearbyPoi',
          payload: {
            item: feature,
            index: feature.attributes.SEARCHID,
          },
        });
      }
    }
  }

  async loadConnections() {
    await disableLabelLayerClick();
    const [watchUtils] = await jsapi.load(['esri/core/watchUtils']);

    if (!this.clickHandle) {
      this.clickHandle = watchUtils.when(
        this.view.popup,
        'features',
        this.onFeatureSelected.bind(this)
      );
    }
  }

  clearConnections() {
    if (this.clickHandle) {
      this.clickHandle.remove();
      this.clickHandle = null;
    }
  }

  async clear() {
    const lyr = await getSublayerById(this.view, ID_PIN_LAYER);
    lyr.removeAll();

    const llyr = await getSublayerById(this.view, ID_LABEL_LAYER);
    llyr.removeAll();

    this.clearConnections();
    this.highlightId = null;
    this.highlightNearbyId = null;
    this.type = null;
  }

  // eslint-disable-next-line
  async clearGraphics() {
    const lyr = await getSublayerById(this.view, ID_PIN_LAYER);
    lyr.removeAll();

    const llyr = await getSublayerById(this.view, ID_LABEL_LAYER);
    llyr.removeAll();
  }

  async draw(findres, page) {
    await this.clearGraphics(this.view);
    await this.loadConnections();
    this.type = LIST_RESULT_FIND;
    const lyr = await getSublayerById(this.view, ID_PIN_LAYER);
    const llyr = await getSublayerById(this.view, ID_LABEL_LAYER);

    const filterRes = findres.slice(6 * (page - 1), 6 * page);
    _.each(filterRes, async (res, idx) => {
      const pGeom = {
        type: 'point',
        x: res.geometry.x,
        y: res.geometry.y,
        spatialReference:
          env.getParamAgs().view.spatialReference === '102100'
            ? { wkid: 4326 }
            : env.getParamAgs().view.spatialReference,
      };

      const [Graphic] = await jsapi.load(['esri/Graphic']);
      lyr.add(
        new Graphic({
          attributes: {
            ...res.attributes,
            SEARCHID: idx,
          },
          symbol: this.highlightId === idx ? HIGHLIGHT_SYMBOL : DRAW_SYMBOL,
          geometry: pGeom,
          popupTemplate: {
            title: res.attributes[window.poiCfg[0].displayField],
            content: getPoiPopup(res),
          },
        })
      );

      llyr.add(
        new Graphic({
          geometry: pGeom,
          symbol: {
            type: 'text',
            color: 'white',
            text: idx + 1,
            yoffset: 10,
            font: {
              // autocast as new Font()
              size: 12,
              family: 'sans-serif',
              weight: 'bold',
            },
          },
        })
      );
    });

    this.view.goTo(lyr.graphics);
  }

  async highlight(key) {
    this.highlightId = key;

    const lyr = await getSublayerById(this.view, ID_PIN_LAYER);
    const gra = lyr.graphics.find(g => g.attributes.SEARCHID === key);
    if (gra) {
      this.view.goTo({
        target: gra,
        zoom: ZOOM_HIGHLIGHT_POI,
      });
      lyr.graphics.remove(gra);
      const [Graphic] = await jsapi.load(['esri/Graphic']);
      lyr.add(
        new Graphic({
          attributes: gra.attributes,
          geometry: gra.geometry,
          symbol: HIGHLIGHT_SYMBOL,
          popupTemplate: gra.popupTemplate,
        })
      );
    }
  }

  async highlightNearby(key) {
    this.highlightNearbyId = key;
    const lyr = await getSublayerById(this.view, ID_PIN_LAYER);
    const gra = lyr.graphics.find(g => g.attributes.SEARCHID === key);
    if (gra) {
      this.view.goTo({
        target: gra,
        zoom: ZOOM_HIGHLIGHT_POI,
      });
      lyr.graphics.remove(gra);
      const [Graphic] = await jsapi.load(['esri/Graphic']);
      lyr.add(
        new Graphic({
          attributes: gra.attributes,
          geometry: gra.geometry,
          symbol: HIGHLIGHT_SYMBOL,
          popupTemplate: gra.popupTemplate,
        })
      );
    }
  }

  async clearHighlight() {
    const lyr = await getSublayerById(this.view, ID_PIN_LAYER);
    const gra = lyr.graphics.find(g => g.attributes.SEARCHID === this.highlightId);
    const [Graphic] = await jsapi.load(['esri/Graphic']);
    if (gra) {
      lyr.graphics.remove(gra);
      lyr.add(
        new Graphic({
          attributes: gra.attributes,
          geometry: gra.geometry,
          symbol: DRAW_SYMBOL,
          popupTemplate: gra.popupTemplate,
        })
      );
    }
    this.highlightId = null;
  }

  async drawNearby(point, result, page) {
    const lyr = await getSublayerById(this.view, ID_PIN_LAYER);
    const llyr = await getSublayerById(this.view, ID_LABEL_LAYER);
    await this.clearGraphics(this.view);
    await this.loadConnections();
    this.type = LIST_RESULT_QUERY;
    const filterRes = result
      .filter(
        res =>
          res.attributes[window.poiCfg[0].displayField] !==
          point.attributes[window.poiCfg[0].displayField]
      )
      .slice(6 * (page - 1), 6 * page);

    const [Graphic, Circle] = await jsapi.load(['esri/Graphic', 'esri/geometry/Circle']);
    lyr.add(
      new Graphic({
        attributes: {
          SEARCHID: -1,
        },
        geometry: new Circle({
          radius: IDENTIFY_TOLERENCE,
          radiusUnit: 'meters',
          center: point.geometry,
          spatialReference:
            env.getParamAgs().view.spatialReference === '102100'
              ? { wkid: 4326 }
              : env.getParamAgs().view.spatialReference,
        }),
        symbol: BUFFER_SYMBOL,
      })
    );

    lyr.add(
      new Graphic({
        attributes: { SEARCHID: -1 },
        geometry: point.geometry,
        symbol: PIN_SYMBOL,
      })
    );

    _.each(filterRes, (res, idx) => {
      const pGeom = {
        type: 'point',
        x: res.geometry.x,
        y: res.geometry.y,
        spatialReference: env.getParamAgs().view.spatialReference,
      };
      lyr.add(
        new Graphic({
          attributes: {
            ...res.attributes,
            SEARCHID: idx,
          },
          symbol: DRAW_SYMBOL,
          geometry: pGeom,
          popupTemplate: {
            title: res.attributes[window.poiCfg[0].displayField],
            content: getPoiPopup(res),
          },
        })
      );

      llyr.add(
        new Graphic({
          geometry: pGeom,
          symbol: {
            type: 'text',
            color: 'white',
            text: idx + 1,
            yoffset: 10,
            font: {
              // autocast as new Font()
              size: 12,
              family: 'sans-serif',
              weight: 'bold',
            },
          },
        })
      );
    });
    this.view.goTo(point);
  }

  async clearHighlightNearby() {
    const lyr = await getSublayerById(this.view, ID_PIN_LAYER);
    const gra = lyr.graphics.find(g => g.attributes.SEARCHID === this.highlightNearbyId);
    if (gra) {
      lyr.graphics.remove(gra);
      const [Graphic] = await jsapi.load(['esri/Graphic']);
      lyr.add(
        new Graphic({
          attributes: gra.attributes,
          geometry: gra.geometry,
          symbol: DRAW_SYMBOL,
          popupTemplate: gra.popupTemplate,
        })
      );
    }
    this.highlightNearbyId = null;
  }
}

export default SearchGraphicUtil;
