/**
 * geomap-uilts备用通用库
 * @author  lee  
 */
import * as jsapi from '../../jsapi';
//---------------------------------场景初始化 start----------------------------------------
/**
 * 初始化二维场景
 * @author  lee  
 * @param {object} portal  portal地址
 * @param {string} itemid  webmapId
 * @param {string} container  地图的div
 * @returns {object}  view 场景
 */
async function initMapView(portal, itemid, container) {
  const [WebMap, MapView] = await jsapi.load(['esri/WebMap', 'esri/views/MapView']);
  const webmap = new WebMap({
    portalItem: {
      id: itemid,
      portal: portal,
    },
  });
  const view = new MapView({
    container: container,
    map: webmap,
    ui: {
      components: [],
    },
  });
  return view;
}
export { initMapView }
/**
 * 初始化三维场景
 * @author  lee  
 * @param {object} portal  portal地址
 * @param {string} itemid  webscenenId
 * @param {string} container  地图的div
 * @returns {object}  view 场景
 */

async function initSceneView(portal, itemid, container) {
  const [WebScene, Sceneview] = await jsapi.load(['esri/WebScene', 'esri/views/SceneView']);
  const scene = new WebScene({
    portalItem: {
      id: itemid,
      portal: portal,
    },
  });

  const view = new Sceneview({
    container: container,
    map: scene,
    environment: {
      atmosphere: {
        quality: 'high',
      },
      // 修改光照
      lighting: {
        date: new Date(),
        directShadowsEnabled: false,
        cameraTrackingEnabled: false,
      },
    },
    ui: {
      components: [], 
    },
  });
  return view;
}
export { initSceneView };
//---------------------------------场景初始化 end--------------------------------

//---------------------------------底图切换 start------------------------------
/**
 * 通过webmapid 切换底图
 * @author  lee  
 * @param {object} view 场景
 * @param {string} webmapId webmap的itmid
 */
async function switchBaseMapByWebmapId(view, webmapId) {
  const [WebMap] = await jsapi.load(['esri/WebMap']);
  const map = new WebMap({
    portalItem: {
      id: webmapId,
    },
  });
  map.load().then(function () {
    map.basemap.load().then(function () {
      view.map.basemap = map.basemap;
    });
  });
}
export { switchBaseMapByWebmapId }
//---------------------------------底图切换 start------------------------------

//---------------------------------图层获取----------------------------------------
/**
 * 根据图层的title获取图层
 * @author  lee  
 * @param {object} view  场景
 * @param {string} title  图层名称
 */
function getLayerByTitle(view, title) {
  var foundLayer = view.map.layers.find(function (lyr) {
    return lyr.title === title;
  });
  return foundLayer;
}
export { getLayerByTitle };
/**
 * 根据图层的title获取图层
 * @author  lee 
 * @param {object} view  场景
 * @param {string} id  图层id
 */
function getLayerById(view, id) {
  var foundLayer = view.map.findLayerById(id);
  return foundLayer;
}

export { getLayerById };

//---------------------------------图层叠加----------------------------------------

/**
 * 添加切片图层
 * @author  lee  
 * @param {object} view  场景
 * @param {string} url  服务地址
 */
async function addTileLayer(view, url) {
  const [TileLayer] = await jsapi.load(['esri/layers/TileLayer']);
  const tileLayer = new TileLayer({
    url: url,
  });
  view.map.add(tileLayer, 9);
}
export { addTileLayer };

/**
 * 添加影像图层
 * @author  lee  
 * @param {object} view  场景
 * @param {string} url  服务地址
 */
async function addImageryLayer(view, url, title, extent) {
  const [ImageryLayer] = await jsapi.load(['esri/layers/ImageryLayer']);
  const layer = new ImageryLayer({
    url: url,
  });
  if (title) {
    layer.title = title;
  }
  view.map.add(layer);
  layer.when(function () {
    if (extent) {
      view.goTo(extent);
    } else {
      view.goTo(layer.fullExent);
    }
  });

}
export { addImageryLayer };


/**
 * 根据条件添加影像图层
 * @author  lee  
 * @param {object} view  场景
 * @param {string} url  服务地址
 * @param {string} type  条件类型
 * @param {string}  value 条件值
 */
async function addImageryLayerByCondition(view, url, type, value, title) {
  const [ImageryLayer] = await jsapi.load(['esri/layers/ImageryLayer']);
  const layer = new ImageryLayer({
    url: url,
    mosaicRule: { mosaicMethod: 'esriMosaicAttribute', where: type + "='" + value + "'" }
  });
  if (title) {
    layer.title = title;
  }
  view.map.add(layer);
  layer.when(function () {
    view.goTo(layer.fullExtent);
  });
}
export { addImageryLayerByCondition };



/**
 * 根据幻灯片的名称，切换到对应的视角
 * @param {*} scenceView
 * @param {*} title
 */
function gotoBySliderName(scenceView, title) {
  const view = scenceView;
  const slides = view.map.presentation.slides.items;
  const options = {
    duration: 3000,
    maxDuration: 3000,
  };
  // 飞行到视线分析 幻灯片
  slides.forEach(slide => {
    if (slide.title.text === title) {
      view.goTo(slide.viewpoint, options);
    }
  });
}



/**
 * 根据图层名称，控制图层显隐藏
 * @author  lee  20181208
 * @param {*} view  场景
 * @param {*} title  名称
 * @param {*} visible 显示/隐藏  true or false
 */
function setLayerVisible(view, title, visible) {
  var foundLayer = getLayerByTitle(view, title);
  foundLayer.visible = visible;
}

/**
 * 批量设置指定图层的可见性
 * @param {*} scenceView
 * @param {*} titles
 * @param {*} visible
 */
function setLayerVisibleByTitleBatch(view, titles, visible) {
  titles.map(title => {
    return setLayerVisible(view, title, visible);
  });
}

/**
 * 给面图层添加outline并高亮
 * @author  lee  20181208
 * @param {*} view  场景
 * @param {*} title  名称
 * @param {*} visible 显示/隐藏  true or false
 */
async function highLightPolygonOutline(view, feature) {
  const [GraphicsLayer, Graphic] = await jsapi.load(['esri/layers/GraphicsLayer', 'esri/Graphic']);

  var fillSymbol = {
    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    // color: [227, 139, 79, 0.8],
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: [227, 139, 79, 0.8],
      width: 1,
    },
  };

  let graphicsLayer = view.map.findLayerById('graphic_id');
  if (!graphicsLayer) {
    graphicsLayer = new GraphicsLayer({
      id: 'graphic_id',
    });
    view.map.add(graphicsLayer);
  }
  const graphic = new Graphic({
    geometry: feature.geometry,
    symbol: fillSymbol,
  });
  graphicsLayer.graphics.removeAll();
  graphicsLayer.add(graphic);
}

/**
 * 给面图层添加outline并高亮
 * @author  lee  20181208
 * @param {*} view  场景
 * @param {*} title  名称
 * @param {*} visible 显示/隐藏  true or false
 */
async function addfeatureLayer(view, url) {
  const [FeatureLayer] = await jsapi.load(['esri/layers/FeatureLayer']);
  const feaLayer = new FeatureLayer({
    title: '飞行轨迹',
    url: url,
  });
  view.map.add(feaLayer);
}

/**
 * 画buffer
 * @author  lee  20181209
 * @param {object} view  场景
 * @param {string} point  中心点
 * @param {string} radius 半径 radiusUnit 单位
 * @param {string} radiusUnit 单位  三维场景里画圆形会出现变形
 */
async function drawbuffer(view, point, radius, radiusUnit) {
  const [GraphicsLayer, Graphic, Circle] = await jsapi.load([
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
    'esri/geometry/Circle',
  ]);
  // 画一个圆形的geometry
  const buffer = new Circle({
    center: point,
    radius: radius,
    radiusUnit: radiusUnit,
    spatialReference: {
      wkid: '4326',
    },
  });
  const bufferGraphic = new Graphic({
    geometry: buffer,
    symbol: {
      type: 'simple-fill', // autocasts as new SimpleFillSymbol()
      color: [51, 51, 204, 0],
      style: 'solid',
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: 'red',
        width: 1,
      },
    },
  });

  const bufferLayer = view.map.findLayerById('bufferLayer');
  if (bufferLayer) {
    bufferLayer.removeAll();
    bufferLayer.add(bufferGraphic);
  } else {
    const bufferLayer = new GraphicsLayer({
      id: 'bufferLayer',
      graphics: [bufferGraphic],
      elevationInfo: {
        mode: 'absolute-height',
        featureExpressionInfo: {
          expression: "1000"
        },
        unit: "meters"
      }
    });
    view.map.add(bufferLayer);
  }
}

/**
 * 画buffer
 * @author  lee  20181209
 * @param {object} view  场景
 * @param {string} point  中心点
 * @param {string} radius 半径 radiusUnit 单位
 * @param {string} radiusUnit 单位  三维场景里画圆形会出现变形
 */
/**
 *
 *
 * @param {*} view
 * @param {*} point
 * @param {*} radius
 * @param {*} radiusUnit
 */
async function pointBuffer(view, point, radius, radiusUnit) {
  const [GraphicsLayer, Graphic, geometryEngine] = await jsapi.load([
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
    'esri/geometry/geometryEngine',
  ]);
  const bufferGeometry = geometryEngine.geodesicBuffer(point, radius, radiusUnit);
  var polySym = {
    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    // color: [140, 140, 222, 0.5],
    outline: {
      color: 'red',
      width: 2,
    },
  };
  const bufferGraphic = new Graphic({
    geometry: bufferGeometry,
    symbol: polySym,
  });

  const bufferLayer = view.map.findLayerById('bufferlayer');
  if (bufferLayer) {
    bufferLayer.removeAll();
    bufferLayer.add(bufferGraphic);
  } else {
    const bufferLayer = new GraphicsLayer({
      id: 'bufferLayer',
      graphics: [bufferGraphic],
    });
    view.map.add(bufferLayer);
  }
}

export { pointBuffer };

/**
 * 根据图层,Graphic或Feature
 * @author  liugh  20181209
 * @param {*} view view
 * @param {*} layer 图层
 * @param {*} graphic  要高亮的要素
 * @param {*} isGoto 是否跳转
 */
var highlightSelect = null;
function highlightByLayerGraphic(view, layer, graphic, isGoto) {
  view.whenLayerView(layer).then(function (layerView) {
    if (highlightSelect) {
      highlightSelect.remove();
    }
    highlightSelect = layerView.highlight(graphic);
  });
  view.on('click', function (e) {
    if (highlightSelect) {
      highlightSelect.remove();
    }
  });
  if (isGoto) {
    view.goTo(
      {
        target: graphic.geometry,
        tilt: 70,
      },
      {
        duration: 2000,
        easing: 'in-out-expo',
      }
    );
  }
}
function clearhightlight() {
  if (highlightSelect) {
    highlightSelect.remove();
  }
}

//-----------------------------------END--------------------------------------
/**
 *
 * @param {*} scenceView
 * @param {*} itemId
 * @param {*} visible
 */
function setLayerVisibleByItem(scenceView, itemId, visible) {
  const view = scenceView;
  for (let i = 0; i < view.map.layers.items.length; i += 1) {
    if (view.map.layers.items[i].portalItem) {
      if (view.map.layers.items[i].portalItem.id === itemId) {
        view.map.layers.items[i].visible = visible;
      }
    }
  }
}

/**
 * 根据图层的Itemid获取图层
 * @param {*} itemId
 */
function getLayerByItem(scenceView, itemId) {
  const view = scenceView;
  for (let i = 0; i < view.map.layers.items.length; i += 1) {
    if (view.map.layers.items[i].portalItem) {
      if (view.map.layers.items[i].portalItem.id === itemId) {
        return view.map.layers.items[i];
      }
    }
  }
  return null;
}
/**
 * 根据图层的Itemid添加图层  lih 20181116
 * @param {*} itemId
 */
async function addLayerByItem(mapView, itemId) {
  const view = mapView;
  const [Layer] = await jsapi.load(['esri/layers/Layer']);
  const citiesRenderer = {
    type: 'simple', // autocasts as new SimpleRenderer()
    symbol: {
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      size: 10,
      color: '#FF4000',
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [255, 64, 0, 0.4], // autocasts as new Color()
        width: 7,
      },
    },
  };
  Layer.fromPortalItem({
    portalItem: {
      // autocasts as new PortalItem()
      id: itemId,
    },
  })
    .then(layer => {
      layer.renderer = citiesRenderer;
      view.map.add(layer);
    })
    .catch();
  return null;
}
/**
 * 根据图层的Itemid删除图层  lih 20181116
 * @param {*} itemId
 */
function removeLayerByItem(mapView, itemId) {
  const view = mapView;
  for (let i = 0; i < view.map.layers.items.length; i += 1) {
    if (view.map.layers.items[i].portalItem) {
      if (view.map.layers.items[i].portalItem.id === itemId) {
        view.map.remove(view.map.layers.items[i]);
        return;
      }
    }
  }
  return null;
}

/**
 * 根据图层的名称查找图层的可见性
 * @param {*} scenceView
 * @param {*} title
 */
function getLayerVisibleByLayerName(scenceView, title) {
  const view = scenceView;
  for (let i = 0; i < view.map.layers.items.length; i += 1) {
    if (view.map.layers.items[i].title) {
      if (view.map.layers.items[i].title === title) {
        return view.map.layers.items[i].visible;
      }
    }
  }
  return false;
}

/**
 * 根据渲染字段值的集合创建唯一值渲染信息对象
 * @param {*} renderFieldValues
 * @param {*} materialcolor
 * @param {*} materialcolorMixMode
 */
function createUniqueValueInfos(renderFieldValues, materialcolor, materialcolorMixMode) {
  const uniqueValueInfos = [];
  for (let i = 0; i < renderFieldValues.length; i += 1) {
    const tmp = {
      value: renderFieldValues[i],
      symbol: {
        type: 'mesh-3d', // autocasts as new MeshSymbol3D()
        symbolLayers: [
          {
            type: 'fill', // autocasts as new FillSymbol3DLayer()
            material: {
              color: materialcolor,
              colorMixMode: materialcolorMixMode,
            },
          },
        ],
      },
    };
    uniqueValueInfos.push(tmp);
  }
  return uniqueValueInfos;
}

/**
 * 创建唯一值渲染
 * @param {*} renderField
 * @param {*} materialcolor
 * @param {*} materialcolorMixMode
 * @param {*} renderFieldValues
 */
function getUniqueValueRenderer(
  renderField,
  materialcolor,
  materialcolorMixMode,
  renderFieldValues
) {
  return {
    type: 'unique-value', // autocasts as new UniqueValueRenderer()
    field: renderField,
    defaultSymbol: null,
    uniqueValueInfos: createUniqueValueInfos(
      renderFieldValues,
      materialcolor,
      materialcolorMixMode
    ),
  };
}

const textSymbol = {
  type: 'text', // autocasts as new TextSymbol()
  color: 'white',
  haloColor: 'black',
  haloSize: '1px',
  text: '10公里',
  xoffset: 3,
  yoffset: 3,
  font: {
    // autocast as new Font()
    size: 11,
    family: 'sans-serif',
    weight: 'bold',
  },
};

/**
 * 添加buffer的10公里text
 * @author  mingfang  20190317
 * @param {object} view  场景
 * @param {object} point  机场的点位
 */
async function addBufferTextLayer(view, point) {
  const [GraphicsLayer, Graphic, Point, Circle] = await jsapi.load([
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
    'esri/geometry/Point',
    'esri/geometry/Circle',
  ]);

  //获取机场10公里范围最东边的点位信息，用作10公里标注的原始点
  const buffer = new Circle({
    center: point,
    radius: 10,
    radiusUnit: 'kilometers',
  });
  // console.log(buffer);

  const textpoint = new Point({
    type: 'point',
    x: buffer.extent.xmax,
    y: buffer.center.y,
    z: 1010,
  });

  var textpointGraphic = new Graphic({
    geometry: textpoint,
    symbol: textSymbol,
  });

  const graphicsLayer = view.map.findLayerById('buffertextLayer');
  if (graphicsLayer) {
    graphicsLayer.removeAll();
    graphicsLayer.add(textpointGraphic);
  } else {
    const graphicsLayer = new GraphicsLayer({
      id: 'buffertextLayer',
      graphics: [textpointGraphic],
    });
    view.map.add(graphicsLayer);
  }
}
async function addGraphicsToMap(graphics, view) {
  const [GraphicsLayer] = await jsapi.load([
    'esri/layers/GraphicsLayer'
  ]);
  const graphicsLayer = new GraphicsLayer({
    graphics: graphics
  });
  view.map.add(graphicsLayer);
}

export {
  addGraphicsToMap,//给map添加Graphics
  setLayerVisible,
  setLayerVisibleByItem,
  getLayerByItem,
  addLayerByItem,
  removeLayerByItem,
  getLayerVisibleByLayerName,
  getUniqueValueRenderer,
  setLayerVisibleByTitleBatch,
  drawbuffer,
  highLightPolygonOutline,
  highlightByLayerGraphic,
  clearhightlight,
  addfeatureLayer,
  gotoBySliderName,
  addBufferTextLayer,
};
