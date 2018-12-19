import _ from 'lodash';

import * as jsapi from '../jsapi';

const ZOOM_LABEL_VISIBLE = 11;
const SCALE_LABEL_VISIBLE = 5000;

const NORMAL_TEXT = {
  type: 'text',
  color: 'black',
  haloColor: 'white',
  haloSize: '2px',
};

const HIGHLIGHT_TEXT = {
  type: 'text',
  color: '#3285ff',
  haloColor: 'white',
  haloSize: '2px',
};

class SurfaceLabel {
  constructor(view, layer, store) {
    this.view = view;
    this.layer = layer;
    this.store = store;
    this.refresh = _.bind(_.debounce(this.refresh, 300), this);
  }

  async loadLabels() {
    const [Query, QueryTask] = await jsapi.load([
      'esri/tasks/support/Query',
      'esri/tasks/QueryTask',
    ]);

    const q = new Query({
      returnGeometry: true,
      outFields: ['*'],
      spatialRelationship: 'contains',
      geometry: this.view.extent,
    });

    const qt = new QueryTask({
      url: window.poiCfg[0].url,
    });

    return await qt.execute(q);
  }

  async drawGraphics(features) {
    this.clearLabels();
    const [Graphic] = await jsapi.load(['esri/Graphic']);
    for (const ft of features) {
      this.layer.add(
        new Graphic({
          geometry: ft.geometry,
          attributes: ft.attributes,
          symbol: {
            ...NORMAL_TEXT,
            text: ft.attributes[window.poiCfg[0].displayField],
          },
        })
      );
    }
  }

  async refresh() {
    if (this.view.zoom > -1) {
      if (this.view.zoom >= ZOOM_LABEL_VISIBLE) {
        const fs = await this.loadLabels();
        const { features } = fs;
        this.drawGraphics(features);
      } else {
        this.clearLabels();
      }
    } else if (this.view.scale <= SCALE_LABEL_VISIBLE) {
      const fs = await this.loadLabels();
      const { features } = fs;
      this.drawGraphics(features);
    } else {
      this.clearLabels();
    }
  }

  async clearHighlight() {
    if (this.highlightGra) {
      this.layer.remove(this.highlightGra);
      const [Graphic] = await jsapi.load(['esri/Graphic']);
      this.layer.add(
        new Graphic({
          geometry: this.highlightGra.geometry,
          attributes: this.highlightGra.attributes,
          symbol: {
            ...NORMAL_TEXT,
            text: this.highlightGra.attributes[window.poiCfg[0].displayField],
          },
        })
      );
      this.highlightGra = null;
    }
  }

  async highlight(graphic) {
    await this.clearHighlight();

    this.layer.remove(graphic);
    const [Graphic] = await jsapi.load(['esri/Graphic']);
    this.highlightGra = new Graphic({
      attributes: graphic.attributes,
      geometry: graphic.geometry,
      symbol: {
        ...HIGHLIGHT_TEXT,
        text: graphic.attributes[window.poiCfg[0].displayField],
      },
    });
    this.layer.add(this.highlightGra);
  }

  selectPoi(graphic) {
    this.store.dispatch({
      type: 'search/selectPoiByLabel',
      payload: {
        item: graphic,
      },
    });
  }

  async loadConnections() {
    const [watchUtils] = await jsapi.load(['esri/core/watchUtils']);
    this.watchHandle = watchUtils.when(this.view, 'extent', this.refresh);
    this.view.on('pointer-move', async evt => {
      const response = await this.view.hitTest(evt);
      if (response.results.length) {
        const graphics = response.results.filter(result => {
          // check if the graphic belongs to the layer of interest
          return result.graphic.layer === this.layer;
        });
        if (graphics.length > 0) {
          const graphic = graphics[0].graphic;
          this.highlight(graphic);
        }
      } else {
        this.clearHighlight();
      }
    });
    this.view.on('click', () => {
      if (this.highlightGra) {
        this.selectPoi(this.highlightGra);
      }
    });
  }

  activate() {
    this.loadConnections();
  }

  clearLabels() {
    this.layer.graphics.removeAll();
  }
}

export default SurfaceLabel;
