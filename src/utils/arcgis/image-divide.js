/**
 * 影像查看全域划分
 */
import { jsapi } from '../../constants/geomap-utils';

let initialized = false;
let clickHandle = null;
const LAYER_ID_GROUP = 'layer-group-divide';
const LAYER_ID_EDIT = 'layer-edit-divide';
const LAYER_ID_GRID = 'layer-grid-divide';
const DefaultSymbol = {
  type: 'simple-fill',
  color: [0, 0, 0, 0],
  outline: {
    type: 'simple-line',
    width: '3px',
    color: '#00cacc',
  },
};
const DefaultLineSymbol = {
  type: 'simple-line',
  width: '1px',
  color: '#00cacc',
  style: 'short-dot',
};

async function getDivideGroupLayer() {
  const { view } = window.agsGlobal;
  const lyr = view.map.findLayerById(LAYER_ID_GROUP);
  if (lyr) {
    return lyr;
  }

  const [GroupLayer] = await jsapi.load(['esri/layers/GroupLayer']);
  const gl = new GroupLayer({
    id: LAYER_ID_GROUP,
  });

  view.map.add(gl);
  return gl;
}

async function generateDefaultPolygon() {
  const { view } = window.agsGlobal;
  const { center } = view;
  const [geometryEngine, Graphic] = await jsapi.load([
    'esri/geometry/geometryEngine',
    'esri/Graphic',
  ]);

  const bufferCircle = geometryEngine.geodesicBuffer(center, 200, 'meters');
  return new Graphic({
    geometry: {
      type: 'polygon',
      rings: [
        [
          [bufferCircle.extent.xmin, bufferCircle.extent.ymax],
          [bufferCircle.extent.xmax, bufferCircle.extent.ymax],
          [bufferCircle.extent.xmax, bufferCircle.extent.ymin],
          [bufferCircle.extent.xmin, bufferCircle.extent.ymin],
          [bufferCircle.extent.xmin, bufferCircle.extent.ymax],
        ],
      ],
      spatialReference: { wkid: 102100, latestWkid: 4326 },
    },
    symbol: DefaultSymbol,
  });
}

async function generateDivideLines(polygon) {
  const vlines = [];
  const hlines = [];

  const { extent } = polygon.geometry;
  const { xmin, xmax, ymin, ymax } = extent;
  const vmid = (ymin + ymax) / 2;
  const hmid = (xmin + xmax) / 2;
  const [Graphic] = await jsapi.load(['esri/Graphic']);

  hlines.push(
    new Graphic({
      geometry: {
        type: 'polyline',
        paths: [[[xmin, vmid], [xmax, vmid]]],
        spatialReference: { wkid: 102100, latestWkid: 4326 },
      },
      symbol: DefaultLineSymbol,
    }),
    new Graphic({
      geometry: {
        type: 'polyline',
        paths: [[[xmin, (vmid + ymin) / 2], [xmax, (vmid + ymin) / 2]]],
        spatialReference: { wkid: 102100, latestWkid: 4326 },
      },
      symbol: DefaultLineSymbol,
    }),
    new Graphic({
      geometry: {
        type: 'polyline',
        paths: [[[xmin, (vmid + ymax) / 2], [xmax, (vmid + ymax) / 2]]],
        spatialReference: { wkid: 102100, latestWkid: 4326 },
      },
      symbol: DefaultLineSymbol,
    })
  );

  vlines.push(
    new Graphic({
      geometry: {
        type: 'polyline',
        paths: [[[hmid, ymin], [hmid, ymax]]],
        spatialReference: { wkid: 102100, latestWkid: 4326 },
      },
      symbol: DefaultLineSymbol,
    }),
    new Graphic({
      geometry: {
        type: 'polyline',
        paths: [[[(hmid + xmin) / 2, ymin], [(hmid + xmin) / 2, ymax]]],
        spatialReference: { wkid: 102100, latestWkid: 4326 },
      },
      symbol: DefaultLineSymbol,
    }),
    new Graphic({
      geometry: {
        type: 'polyline',
        paths: [[[(hmid + xmax) / 2, ymin], [(hmid + xmax) / 2, ymax]]],
        spatialReference: { wkid: 102100, latestWkid: 4326 },
      },
      symbol: DefaultLineSymbol,
    })
  );

  return [...vlines, ...hlines];
}

export default {
  async init() {
    if (initialized&&window.agsGlobal.view.map.findLayerById(LAYER_ID_EDIT)&&window.agsGlobal.view.map.findLayerById(LAYER_ID_GRID)) {
      this.centerAndZoom();
      return;
    }

    const { view } = window.agsGlobal;
    const group = await getDivideGroupLayer();
    const [GraphicsLayer, SketchViewModel, watchUtils] = await jsapi.load([
      'esri/layers/GraphicsLayer',
      'esri/widgets/Sketch/SketchViewModel',
      'esri/core/watchUtils',
    ]);
    const editLyr = new GraphicsLayer({ id: LAYER_ID_EDIT });
    const gridLyr = new GraphicsLayer({ id: LAYER_ID_GRID });
    const polygon = await generateDefaultPolygon();
    const lines = await generateDivideLines(polygon);
    editLyr.graphics.add(polygon);
    gridLyr.graphics.addMany(lines);

    group.add(gridLyr);
    group.add(editLyr);
    view.map.add(group);
    view.goTo(polygon);

    const sketch = new SketchViewModel({
      layer: editLyr,
      view,
      updateOnGraphicClick: false,
    });
    watchUtils.watch(sketch, 'state', val => {
      if (val === 'active') {
        gridLyr.visible = false;
      } else {
        gridLyr.visible = true;
      }
    });
    sketch.on('update', async ({ graphics, state }) => {
      // re-calculate the grid lines
      if (state === 'complete' && graphics.length) {
        const first = graphics[0];

        const lines = await generateDivideLines(first);
        gridLyr.graphics.removeAll();
        gridLyr.graphics.addMany(lines);
      }
    });

    clickHandle = view.on('click', e => {
      view.hitTest(e).then(resp => {
        if (resp.results.length) {
          const filterGra = resp.results.filter(result => {
            return result.graphic.layer && result.graphic.layer.id === LAYER_ID_EDIT;
          });

          if (filterGra.length) {
            if (sketch.state === 'active') {
              return;
            }

            sketch.update(filterGra[0].graphic, {
              tool: 'transform',
              enableRotation: false,
              toggleToolOnClick: false,
            });
          } else if (sketch.state === 'active') {
            sketch.cancel();
          }
        }
      });
    });

    initialized = true;
  },

  destroy() {
    if (clickHandle) {
      clickHandle.remove();
      clickHandle = null;
    }
  },

  async centerAndZoom() {
    const { view } = window.agsGlobal;
    const group = await getDivideGroupLayer();
    const editLyr = group.findLayerById(LAYER_ID_EDIT);
    view.goTo(editLyr.graphics.getItemAt(0));
  },
};
