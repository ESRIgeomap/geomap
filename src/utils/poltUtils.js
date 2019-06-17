import { message, Modal, Input, Button } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
//import { formatMessage } from 'umi/locale';
import { jsapi } from '../constants/geomap-utils';
import env from '../utils/env';
import GeometryAttribute from '../components/layerList/GeometryAttribute';
import {
  addPoltlayerItem,
  getItemInfoByItemId,
  updateItemByItemId,
  publishItem,
  checkJobStatus,
  shareItem,
  getPoltItemData,
} from '../services/portal';
import { requestArrayBuffer } from '../utils/request';
import request from '../utils/request';
import layerUtils from '../utils/layerUtils';
import GeometrySymbolEditor from '../components/layerList/GeometrySymbolEditor';

class poltUtils {

  /**
  * 
  * @param {} [] (!)
  * @return {} 
  */
  static async poltByType({ type, symbolparam }, callback, showeditbar) {
    if (!type) return
    const view = env.getParamAgs().view;
    const poltlayerid = window.poltlayerid ? window.poltlayerid : 'poltlayer';
    this.deactivePolt();
    /**获取绘图初始化属性参数 */
    poltUtils.symbolparam = symbolparam;
    const { text } = symbolparam.textparam;

    const pointfc = symbolparam.pointparam.fillcolor.rgb;
    const pointbc = symbolparam.pointparam.bordercolor.rgb;

    const linefc = symbolparam.lineparam.fillcolor.rgb;

    const gonfc = symbolparam.polygonparam.fillcolor.rgb;
    const gonbc = symbolparam.polygonparam.bordercolor.rgb;

    const textfc = symbolparam.textparam.fillcolor.rgb;

    let pointSymbol = null;
    const [GraphicsLayer, SketchViewModel, Graphic] = await jsapi.load([
      'esri/layers/GraphicsLayer',
      'esri/widgets/Sketch/SketchViewModel',
      'esri/Graphic',
    ]);

    /**初始化标绘图层poltlayer */
    if (!view.map.findLayerById(poltlayerid)) {
      this.poltlayer = new GraphicsLayer({
        id: poltlayerid,
        title: '临时标绘图层',
        elevationInfo: {
          mode: 'relative-to-ground',
          offset: 10,
          unit: 'meters',
        },
        // popupTemplate: {
        //   title: '标绘',
        //   content: '{*}',
        // },
      });
      view.map.add(this.poltlayer);
    } else {
      this.poltlayer = view.map.findLayerById(poltlayerid);
    }
    //点三种样式：图片、文字、常规符号
    if (poltUtils.symbolparam.pointimg) {
      this.pointType = 'picture';
      type = 'point';
      pointSymbol = {
        type: 'picture-marker',
        url: poltUtils.symbolparam.pointimg,
        width: poltUtils.symbolparam.pointparam.fillsize || '24px',
        height: poltUtils.symbolparam.pointparam.fillsize || '24px',
      };
    } else if (type === 'font') {
      type = 'point';
      this.pointType = 'font';
      pointSymbol = {
        type: 'text',
        color: [textfc.r, textfc.g, textfc.b, poltUtils.symbolparam.opacity] || '#1890ff',
        text: text,
        xoffset: 3,
        yoffset: 3,
        font: {
          size: poltUtils.symbolparam.textparam.fillsize || 6,
          family: 'sans-serif',
        },
      };
    } else {
      this.pointType = 'simple';
      pointSymbol = {
        type: 'simple-marker',
        style: 'circle',
        color:
          [pointfc.r, pointfc.g, pointfc.b, poltUtils.symbolparam.pointparam.opacity] || '#8A2BE2',
        size: poltUtils.symbolparam.pointparam.fillsize || '12px',
        outline: {
          color:
            [pointbc.r, pointbc.g, pointbc.b, poltUtils.symbolparam.pointparam.opacity] ||
            '#8A2BE2',
          width: poltUtils.symbolparam.pointparam.bordersize || 1,
        },
      };
    }
    const polylineSymbol = {
      type: 'simple-line',
      color: [linefc.r, linefc.g, linefc.b, poltUtils.symbolparam.lineparam.opacity] || '#1890ff',
      width: poltUtils.symbolparam.lineparam.fillsize || '2px',
      style: poltUtils.symbolparam.lineparam.linetype || 'solid',
    };
    const polygonSymbol = {
      type: 'simple-fill',
      color: [gonfc.r, gonfc.g, gonfc.b, poltUtils.symbolparam.polygonparam.opacity] || '#1890ff',
      style: 'solid',
      outline: {
        color: [gonbc.r, gonbc.g, gonbc.b, poltUtils.symbolparam.polygonparam.opacity] || '#1890ff',
        width: poltUtils.symbolparam.polygonparam.bordersize || 1,
      },
    };

    /**创建sketch绘图对象 */
    if (!this.sketchViewModel) {
      this.sketchViewModel = new SketchViewModel({
        view: view,
        layer: this.poltlayer,
        pointSymbol,
        polylineSymbol,
        polygonSymbol,
      });
    }
    this.sketchViewModel.pointSymbol = pointSymbol;
    this.sketchViewModel.polylineSymbol = polylineSymbol;
    this.sketchViewModel.polygonSymbol = polygonSymbol;

    if (this.editlayer) {
      this.sketchViewModel.layer = this.editlayer;
    } else {
      this.sketchViewModel.layer = this.poltlayer;
    }

    /**sketch标绘状态事件 */
    this.sketchCreatehandle = this.sketchViewModel.on('create', event => {
      if (event.state === 'start') {
        // action at the start time
      }
      if (event.state === 'complete') {
        this.sketchCreatehandle.remove();

        if (callback) {
          // const graphics = [];
          // graphics.push(event.graphic);
          // addGraphicsToMap(graphics, env.getParamAgstwo().view);
          // const drawLayer = mapUtils.getLayerByTitle(ags.view,'临时标绘图层');
          // if(drawLayer){
          //   drawLayer.on('change',function(s){
          //     console.log(s);
          //   });
          // }
          callback(event.graphic);
        }

        if (this.pointType === 'font') {
          type = 'font';
        }
        this.poltByType({ type, symbolparam }, callback);
      }
      if (event.state === 'active') {
      }
    });
    
    /**sketch更新状态 */
    this.sketchUpdatehandle = this.sketchViewModel.on('update', event => {

      const graphic = event.graphics[0];
      if (event.state === 'start') {
        // action at the start time
       
        ReactDOM.unmountComponentAtNode(document.getElementById('geosymbol'));
        ReactDOM.unmountComponentAtNode(document.getElementById('geoattr'));
        if (showeditbar) {
          // showeditbar();
        }
      }
      if (event.state === 'complete') {
        // update geometry symbol
        const symbolDom = document.getElementById('geosymbol');
        const r = ReactDOM.unmountComponentAtNode(symbolDom);
        ReactDOM.render(<GeometrySymbolEditor geometry={graphic} />, symbolDom);
        //update geometry attributes
        const attrDom = document.getElementById('geoattr');
        const res = ReactDOM.unmountComponentAtNode(attrDom);
        // ReactDOM.render(<GeometryAttribute geo={graphic} />, attrDom);
      }
      if (event.state === 'cancel') {
        // update geometry symbol
        const symbolDom = document.getElementById('geosymbol');
        const r = ReactDOM.unmountComponentAtNode(symbolDom);
        ReactDOM.render(<GeometrySymbolEditor geometry={graphic} />, symbolDom);
        //update geometry attributes
        const attrDom = document.getElementById('geoattr');
        const res = ReactDOM.unmountComponentAtNode(attrDom);
        ReactDOM.render(<GeometryAttribute geo={graphic} />, attrDom);
      }
    });

    this.sketchViewModel.create(type);
    /**箭头绘制 */
    if (type === 'double_arrow' || type === 'general_arrow' || type === 'swallowtail_arrow') {
      const symbol = {
        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
        color: [gonfc.r, gonfc.g, gonfc.b, poltUtils.symbolparam.polygonparam.opacity] || '#1890ff',
        style: 'solid',
        outline: {
          color:
            [gonbc.r, gonbc.g, gonbc.b, poltUtils.symbolparam.polygonparam.opacity] || '#1890ff',
          width: poltUtils.symbolparam.polygonparam.bordersize || 1,
        },
      };
      const [PlotDrawTool] = await jsapi.load(['modules/PlotDrawTool']);
      if (!this.poltFreeBar) {
        this.poltFreeBar = new PlotDrawTool({
          mapView: view,
          symbol,
        });
      }
      this.poltFreeBar.symbol = symbol;
      this.poltFreeBar.active(type);

      this.poltFreeBar.onDrawEnd(event => {
        this.poltlayer.add(event.graphic);
        if (callback) {
          callback(event.graphic);
        }
        this.poltFreeBar.active(type);
      });
      return;
    }
  }

  static async getSketchModal() {
    const view = env.getParamAgs().view;
    const [GraphicsLayer, SketchViewModel] = await jsapi.load([
      'esri/layers/GraphicsLayer',
      'esri/widgets/Sketch/SketchViewModel',
    ]);
    this.sketchViewModel = new SketchViewModel({
      view: view,
      layer: new GraphicsLayer(),
    });
  }
  static deactivePolt() {
    if (this.sketchViewModel) this.sketchViewModel.reset();
    if (this.poltFreeBar) this.poltFreeBar.reSet();
    ReactDOM.unmountComponentAtNode(document.getElementById('geosymbol'));
  }
  static clearPoltLayer() {
    const view = env.getParamAgs().view;
    const poltlayer = this.sketchViewModel && this.sketchViewModel.layer;
    if (poltlayer) {
      poltlayer.removeAll();
      // view.map.remove(poltlayer);
    }

  }
  static cancelPoltLastOne() {
    const view = env.getParamAgs().view;
    const poltlayer = view.map.findLayerById(poltlayerid);
    poltlayer.remove(poltlayer.graphics.items[poltlayer.graphics.items.length - 1]);
    // this.sketchViewModel.undo();
  }
  
  //清除标绘
  static editClear() {
    const poltlayerid = window.poltlayerid ? window.poltlayerid : 'poltlayer';
    const view = env.getParamAgs().view;
    const layer = view.map.findLayerById(poltlayerid);
    layer && layer.removeAll();
  }
  //激活编辑
  static editUpdate() {
    if (!this.editSketch) {
      const gs = this.sketchViewModel && this.sketchViewModel.updateGraphics;
      if (gs) this.sketchViewModel.update([gs.items[0]]);
    } else {
      const gs = this.editSketch && this.editSketch.updateGraphics;
      if (gs) this.editSketch.update([gs.items[0]]);
    }
  }

  //删除编辑
  static editDelete() {
    if (!this.editSketch) {
      const view = env.getParamAgs().view;
      const gs = this.sketchViewModel && this.sketchViewModel.updateGraphics;
      if (!gs)
        message.info('暂无要素');
      const layer = this.sketchViewModel && this.sketchViewModel.layer;
      debugger
      layer && layer.remove(gs && gs.items[0]);
    } else {
      const gs = this.editSketch && this.editSketch.updateGraphics;

      this.editlayer && this.editlayer.remove(gs && gs.items[0]);
    }
  }
  //回退编辑
  static editUndo() {
    if (!this.editSketch) {
      this.sketchViewModel && this.sketchViewModel.undo();
    } else {
      this.editSketch && this.editSketch.undo();
    }
  }
  //恢复
  static editRedo() {
    if (!this.editSketch) {
      this.sketchViewModel && this.sketchViewModel.redo();
    } else {
      this.editSketch && this.editSketch.redo();
    }
  }
  //完成
  static editComplete() {
    const gs = this.sketchViewModel && this.sketchViewModel.updateGraphics;
    if(!gs){
      message.info('请选择图形');
      return
    }
    if(gs.items&&gs.items.length===0)
      message.warn('请选择图形');
    if (!this.editSketch) {
      this.sketchViewModel && this.sketchViewModel.complete();
    } else {
      this.editSketch && this.editSketch.complete();
    }
  }
  //完成标绘
  static async savePoltLayer(layerinfo, callback) {
    window.poltlayerid = null;
    const map = env.getParamAgs().view.map;
    const poltlayer = map.findLayerById('poltlayer');
    if (poltlayer) {
      const graphics = poltlayer.graphics.items;
      if (graphics.length === 0) {
        message.warn('暂无标绘内容');
        return;
      }
      const layertitle = layerinfo.layertitle;
      const layerText = await layerUtils.getPortalLayerText(poltlayer, layertitle);
      const [webMercatorUtils] = await jsapi.load(['esri/geometry/support/webMercatorUtils']);
      const extent = webMercatorUtils.webMercatorToGeographic(agsGlobal.view.extent);
      const r = await addPoltlayerItem(layertitle, layerText, extent, 'poltfile');
      if (r.data.success) {
        await shareItem(r.data.id);
        if (callback) callback();
      }
      this.clearPoltLayer();
    }
  }
  static async showPoltlayerByItemid({ checked, item }) {
    const map = env.getParamAgs().view.map;
    const view = env.getParamAgs().view;
    const dataUrl = `${window.appcfg.portal}sharing/rest/content/items/${item.id}/data?token=${
      sessionStorage.token
      }`;
    const type = item.type;
    const [
      esriConfig,
      CSVLayer,
      KMLLayer,
      GraphicsLayer,
      Graphic,
      Point,
      Polyline,
      Polygon,
      FeatureLayer,
      GeoJSONLayer,
      Extent,
      Layer,
    ] = await jsapi.load([
      'esri/config',
      'esri/layers/CSVLayer',
      'esri/layers/KMLLayer',
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
      'esri/geometry/Point',
      'esri/geometry/Polyline',
      'esri/geometry/Polygon',
      'esri/layers/FeatureLayer',
      'esri/layers/GeoJSONLayer',
      'esri/geometry/Extent',
      'esri/layers/Layer',
    ]);
    if (checked) {
      switch (type) {
        case 'CSV': {
          try {
            const layer = new CSVLayer({
              id: item.id,
              url: dataUrl,
              title: item.title,
              popupTemplate: {
                title: item.title,
                content: '{*}',
              },
            });
            // layer.renderer = {
            //   type: 'simple',
            //   symbol: {
            //     type: 'simple-marker',
            //     style: 'circle',
            //     color: '#8A2BE2',
            //     size: '8px',
            //     outline: {
            //       color: [255, 255, 255],
            //       width: 1,
            //     },
            //   },
            // };
            map.add(layer);
            const query = layer.createQuery();
            query.geometry = layer.fullExtent;
            layer.queryFeatures(query).then(function (results) {
              view.goTo(results.features);
            });
          } catch (e) {
            message.warn('该文件不是一个标准文件');
            console.log(e);
          }
          break;
        }
        case 'KML': {
          try {
            const layer = new KMLLayer({
              id: item.id,
              url: dataUrl,
              title: item.title,
              popupTemplate: {
                title: item.title,
                content: '{*}',
              },
            });
            map.add(layer);
            console.log(layer.graphics);
            const formData = new URLSearchParams();
            formData.append('url', dataUrl);
            formData.append('mode', 'simple');
            const options = {
              method: 'POST',
              body: formData,
              headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
              }),
            };
            request(esriConfig.kmlServiceUrl, options).then(res => {
              const { xmin, xmax, ymin, ymax, spatialReference } = res.data.lookAtExtent;
              const extent = new Extent({
                xmin,
                xmax,
                ymin,
                ymax,
                spatialReference,
              });
              view.goTo(extent);
            });
          } catch (e) {
            message.warn('该文件不是一个标准文件');
            console.log(e);
          }
          break;
        }
        case 'GeoJson': {
          try {
            const layer = new GeoJSONLayer({
              id: item.id,
              url: dataUrl,
              title: item.title,
              popupTemplate: {
                title: item.title,
                content: '{*}',
              },
            });
            map.add(layer);
            const query = layer.createQuery();
            query.geometry = layer.fullExtent;
            layer.queryFeatures(query).then(function (results) {
              view.goTo(results.features);
            });
          } catch (e) {
            message.warn('该文件不是一个标准文件');
            console.log(e);
          }
          break;
        }
        case 'Shapefile': {
          //发布服务展示方式
          // const layer = new FeatureLayer({
          //   url: item.url,
          //   id: item.id,
          //   popupTemplate: {
          //     title: item.title,
          //     content: '{*}',
          //   },
          // });
          // map.add(layer);

          //js前端解析方式
          const graphicsLayer = new GraphicsLayer({
            id: item.id,
            title: item.title,
            popupTemplate: {
              title: item.title,
              content: '{*}',
            },
          });
          map.add(graphicsLayer);
          const pointSymbol = {
            type: 'simple-marker',
            style: 'circle',
            color: 'blue',
            size: '8px', // pixels
            outline: {
              color: [255, 255, 0],
              width: 1,
            },
          };
          const polylineSymbol = {
            type: 'simple-line',
            color: '#8A2BE2',
            width: '2px',
          };
          const polygonSymbol = {
            type: 'simple-fill',
            color: 'rgba(138,43,226, 0.8)',
            style: 'solid',
            outline: {
              color: 'white',
              width: 1,
            },
          };
          requestArrayBuffer(dataUrl).then(data => {
            const shparrbuffer = data.data;
            let fs = [];
            shp(shparrbuffer).then(geojson => {
              geojson.features.splice(2000);
              geojson.features.map(geo => {
                if (geo.geometry.type === 'Point') {
                  const point = new Point(geo.geometry.coordinates);
                  const graphic = new Graphic({
                    geometry: point,
                    attributes: geo.properties,
                    symbol: pointSymbol,
                  });
                  fs.push(graphic);
                }
                if (geo.geometry.type === 'LineString') {
                  const line = new Polyline({
                    paths: geo.geometry.coordinates,
                  });
                  const graphic = new Graphic({
                    geometry: line,
                    attributes: geo.properties,
                    symbol: polylineSymbol,
                  });
                  fs.push(graphic);
                }
                if (geo.geometry.type === 'Polygon') {
                  const gon = new Polygon({
                    rings: geo.geometry.coordinates,
                  });
                  const graphic = new Graphic({
                    geometry: gon,
                    attributes: geo.properties,
                    symbol: polygonSymbol,
                  });
                  fs.push(graphic);
                }
              });
              graphicsLayer.addMany(fs);
              view.goTo(fs);
            });
          });
          view.extent = graphicsLayer.fullExtent;
          break;
        }
        case 'Document Link': {
          const graphicsStr = item.description;
          if (!map.findLayerById(item.id)) {
            const layer = new GraphicsLayer({
              id: item.id,
              title: item.title,
              popupTemplate: {
                title: item.title,
                content: '{*}',
              },
            });
            const graphics = [];
            graphicsStr.split('-').map(gstr => {
              graphics.push(Graphic.fromJSON(JSON.parse(gstr)));
            });
            layer.addMany(graphics);
            map.add(layer);

            view.goTo(graphics);
          }
          break;
        }
        case 'Feature Service': {
          if (!map.findLayerById(item.id)) {
            const layer = new FeatureLayer({
              id: item.id,
              url: item.url,
              title: item.title,
              popupTemplate: {
                title: item.title,
                content: '{*}',
              },
            });
            map.add(layer);
            const query = layer.createQuery();
            query.geometry = layer.fullExtent;
            layer.queryFeatures(query).then(function (results) {
              view.goTo(results.features);
            });
          }
          break;
        }
        case 'Feature Collection': {
          const itemInfo = await getPoltItemData(item.id);
          if (map.findLayerById(item.id)) {
            map.remove(map.findLayerById(item.id));
          }
          const layer = new GraphicsLayer({ id: item.id });
          const features = [];
          itemInfo.data.layers &&
            itemInfo.data.layers.map(sublayer => {
              if (sublayer.featureSet.geometryType === 'esriGeometryPolygon') {
                sublayer.featureSet.features.map(graphic => {
                  const fc = graphic.symbol.color;
                  const bc = graphic.symbol.outline.color;
                  const symbol = {
                    type: 'simple-fill',
                    color: [fc[0], fc[1], fc[2], fc[3] / 255] || '#1890ff',
                    style: 'solid',
                    outline: {
                      color: [bc[0], bc[1], bc[2], bc[3] / 255] || '#1890ff',
                      width: graphic.symbol.outline.width || 1,
                    },
                  };
                  const geo = new Polygon({
                    rings: graphic.geometry.rings,
                    spatialReference: graphic.geometry.spatialReference,
                  });
                  const gra = new Graphic({
                    geometry: geo,
                    attributes: graphic.attributes,
                    symbol: symbol,
                  });
                  // layer.add(gra);
                  features.push(gra);
                });
              } else if (sublayer.featureSet.geometryType === 'esriGeometryPolyline') {
                sublayer.featureSet.features.map(graphic => {
                  const fc = graphic.symbol.color;
                  const symbol = {
                    type: 'simple-line',
                    color: [fc[0], fc[1], fc[2], fc[3] / 255] || '#1890ff',
                    width: graphic.symbol.width || '2px',
                    style:
                      (graphic.symbol.style.toUpperCase().indexOf('SOLID') > 0
                        ? 'solid'
                        : 'short-dot') || 'solid',
                  };
                  const geo = new Polyline({
                    paths: graphic.geometry.paths,
                    spatialReference: graphic.geometry.spatialReference,
                  });
                  const gra = new Graphic({
                    geometry: geo,
                    attributes: graphic.attributes,
                    symbol: symbol,
                  });
                  // layer.add(gra);
                  features.push(gra);
                });
              } else {
                sublayer.featureSet.features.map(graphic => {
                  let symbol = null;
                  if (graphic.symbol.type === 'esriSMS') {
                    const fc = graphic.symbol.color;
                    const bc = graphic.symbol.outline.color;
                    symbol = {
                      type: 'simple-marker',
                      style: 'circle',
                      color: [fc[0], fc[1], fc[2], fc[3] / 255] || '#8A2BE2',
                      size: graphic.symbol.size || '12px',
                      outline: {
                        color: [bc[0], bc[1], bc[2], bc[3] / 255] || '#8A2BE2',
                        width: graphic.symbol.outline.width || 1,
                      },
                    };
                  }
                  if (graphic.symbol.type === 'esriTS') {
                    const fc = graphic.symbol.color;
                    symbol = {
                      type: 'text',
                      color: [fc[0], fc[1], fc[2], fc[3] / 255] || '#1890ff',
                      text: graphic.symbol.text,
                      xoffset: graphic.symbol.xoffset || 3,
                      yoffset: graphic.symbol.yoffset || 3,
                      font: {
                        size: graphic.symbol.font.size || 6,
                        family: 'sans-serif',
                      },
                    };
                  }

                  const geo = new Point({
                    x: graphic.geometry.x,
                    y: graphic.geometry.y,
                    spatialReference: graphic.geometry.spatialReference,
                  });
                  const gra = new Graphic({
                    geometry: geo,
                    attributes: graphic.attributes,
                    symbol: symbol,
                  });
                  // layer.add(gra);
                  features.push(gra);
                });
              }
            });
          layer.addMany(features);
          view.goTo(features);
          map.add(layer);
          break;
        }
        default: {
          break;
        }
      }
    } else {
      const layer = map.findLayerById(item.id);
      if (layer) {
        map.remove(layer);
      }
    }
  }

  static async poltEditActive(itemid) {
    await this.createEditor();
    const layer = agsGlobal.view.map.findLayerById(itemid);
    const disableEditLayer = [];

    agsGlobal.view.map.layers.items.map(lay => {
      if (lay.id === layer.id) {
        disableEditLayer.push({
          layer,
          enabled: true,
        });
      } else {
        disableEditLayer.push({
          layer: lay,
          enabled: false,
        });
      }
    });

    this.editor.layerInfos = disableEditLayer;
  }
  static async poltEditDeActive(itemid) {
    if (itemid) {
      const layer = agsGlobal.view.map.findLayerById(itemid);
      const disableEditLayer = [];
      agsGlobal.view.map.layers.items.map(lay => {
        // if (lay.id === layer.id) {
        //   disableEditLayer.push({
        //     layer,
        //     enabled: false,
        //   });
        // } else {
        disableEditLayer.push({
          layer: lay,
          enabled: false,
        });
        // }
      });

      this.editor.layerInfos = disableEditLayer;
    } else {
      const disableEditLayers = [];
      agsGlobal.view.map.layers.items.map(laye => {
        disableEditLayers.push({
          layer: laye,
          enabled: false,
        });
      });

      this.editor.layerInfos = disableEditLayers;
    }
  }
  static async poltEditSave(itemid, callback) {
    const view = env.getParamAgs().view;
    const [Graphic, GraphicsLayer] = await jsapi.load([
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
    ]);
    let editLayer = view.map.findLayerById(itemid);
    const graphicsArr = [];
    if (editLayer) {
      const graphics = editLayer.graphics.items;
      graphics.map(gs => {
        graphicsArr.push(JSON.stringify(gs.toJSON()));
      });
      const graphicsStr = graphicsArr.join('-');
      const res = await updateItemByItemId(itemid, null, null, graphicsStr);
      if (res.data.success) {
        view.map.remove(editLayer);
        const itemInfo = await getItemInfoByItemId(itemid);
        editLayer = new GraphicsLayer({
          id: itemid,
        });
        const graphicsStr = itemInfo.data.description;
        graphicsStr.split('-').map(gstr => {
          editLayer.add(Graphic.fromJSON(JSON.parse(gstr)));
        });
        view.map.add(editLayer);
        this.editSketch = null;
        message.success('保存成功');
        if (callback) {
          callback();
        }
      } else {
        message.error('保存失败');
        console.log(res);
      }
    }
  }
  static async poltEditCancel(itemid) {
    const view = env.getParamAgs().view;
    const [Graphic, GraphicsLayer] = await jsapi.load([
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
    ]);
    const layer = view.map.findLayerById(itemid);
    view.map.remove(layer);
    const itemInfo = await getItemInfoByItemId(itemid);
    const editLayer = new GraphicsLayer({
      id: itemid,
    });
    const graphicsStr = itemInfo.data.description;
    graphicsStr.split('-').map(gstr => {
      editLayer.add(Graphic.fromJSON(JSON.parse(gstr)));
    });
    view.map.add(editLayer);
    this.editSketch = null;
  }
  static async createEditor() {
    const [Editor] = await jsapi.load(['esri/widgets/Editor']);
    const disableEditLayer = [];
    agsGlobal.view.map.layers.items.map(lay => {
      disableEditLayer.push({
        layer: lay,
        enabled: false,
      });
    });
    if (!this.editor) {
      const editcontainer = document.getElementById('editcontainer');
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = '-900px';
      editcontainer.appendChild(div);
      this.editor = new Editor({
        view: agsGlobal.view,
        layerInfos: disableEditLayer,
        container: div,
      });
      agsGlobal.view.ui.add(this.editor, 'top-right');
    }
  }
  static removeEditor() {
    agsGlobal.view.ui.remove(this.editor);
    this.editor = null;
  }
  static async poltEditActiveCollection(itemid) {
    window.poltlayerid = itemid;
    debugger;
    const [GraphicsLayer, Graphic, Point, Polyline, Polygon, SketchViewModel] = await jsapi.load([
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
      'esri/geometry/Point',
      'esri/geometry/Polyline',
      'esri/geometry/Polygon',
      'esri/widgets/Sketch/SketchViewModel',
    ]);
    const itemInfo = await getPoltItemData(itemid);
    const view = env.getParamAgs().view;
    const map = view.map;
    const oldlayer = map.findLayerById('poltlayer');
    oldlayer && oldlayer.removeAll();
    if (map.findLayerById(itemid)) {
      map.remove(map.findLayerById(itemid));
    }
    this.editlayer = new GraphicsLayer({ id: itemid });
    const features = [];
    itemInfo.data.layers &&
      itemInfo.data.layers.map(sublayer => {
        if (sublayer.featureSet.geometryType === 'esriGeometryPolygon') {
          sublayer.featureSet.features.map(graphic => {
            const fc = graphic.symbol.color;
            const bc = graphic.symbol.outline.color;
            const symbol = {
              type: 'simple-fill',
              color: [fc[0], fc[1], fc[2], fc[3] / 255] || '#1890ff',
              style: 'solid',
              outline: {
                color: [bc[0], bc[1], bc[2], bc[3] / 255] || '#1890ff',
                width: graphic.symbol.outline.width || 1,
              },
            };
            const geo = new Polygon({
              rings: graphic.geometry.rings,
              spatialReference: graphic.geometry.spatialReference,
            });
            const gra = new Graphic({
              geometry: geo,
              attributes: graphic.attributes,
              symbol: symbol,
            });
            // layer.add(gra);
            features.push(gra);
          });
        } else if (sublayer.featureSet.geometryType === 'esriGeometryPolyline') {
          sublayer.featureSet.features.map(graphic => {
            const fc = graphic.symbol.color;
            const symbol = {
              type: 'simple-line',
              color: [fc[0], fc[1], fc[2], fc[3] / 255] || '#1890ff',
              width: graphic.symbol.width || '2px',
              style:
                (graphic.symbol.style.toUpperCase().indexOf('SOLID') > 0 ? 'solid' : 'short-dot') ||
                'solid',
            };
            const geo = new Polyline({
              paths: graphic.geometry.paths,
              spatialReference: graphic.geometry.spatialReference,
            });
            const gra = new Graphic({
              geometry: geo,
              attributes: graphic.attributes,
              symbol: symbol,
            });
            // layer.add(gra);
            features.push(gra);
          });
        } else {
          sublayer.featureSet.features.map(graphic => {
            let symbol = null;
            if (graphic.symbol.type === 'esriSMS') {
              const fc = graphic.symbol.color;
              const bc = graphic.symbol.outline.color;
              symbol = {
                type: 'simple-marker',
                style: 'circle',
                color: [fc[0], fc[1], fc[2], fc[3] / 255] || '#8A2BE2',
                size: graphic.symbol.size || '12px',
                outline: {
                  color: [bc[0], bc[1], bc[2], bc[3] / 255] || '#8A2BE2',
                  width: graphic.symbol.outline.width || 1,
                },
              };
            }
            if (graphic.symbol.type === 'esriTS') {
              const fc = graphic.symbol.color;
              symbol = {
                type: 'text',
                color: [fc[0], fc[1], fc[2], fc[3] / 255] || '#1890ff',
                text: graphic.symbol.text,
                xoffset: graphic.symbol.xoffset || 3,
                yoffset: graphic.symbol.yoffset || 3,
                font: {
                  size: graphic.symbol.font.size || 6,
                  family: 'sans-serif',
                },
              };
            }

            const geo = new Point({
              x: graphic.geometry.x,
              y: graphic.geometry.y,
              spatialReference: graphic.geometry.spatialReference,
            });
            const gra = new Graphic({
              geometry: geo,
              attributes: graphic.attributes,
              symbol: symbol,
            });
            // layer.add(gra);
            features.push(gra);
          });
        }
      });
    this.editlayer.addMany(features);
    if (!this.sketchViewModel) {
      // await this.getSketchModal();
      const symbolparam = {
        pointparam: {
          fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
          fillsize: 5,
          opacity: 0.5,
          bordercolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
          bordersize: 1,
          pointimg: '',
        },
        lineparam: {
          opacity: 0.5,
          fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
          fillsize: 1,
          linetype: 'solid',
        },
        polygonparam: {
          fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
          opacity: 0.5,
          bordercolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
          bordersize: 1,
        },
        textparam: {
          text: '文本',
          fillsize: 18,
          fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
        },
      };
      await this.poltByType({ type: 'point', symbolparam }, graphic => {
        ReactDOM.unmountComponentAtNode(document.getElementById('geoattr'));
        ReactDOM.render(<GeometryAttribute geo={graphic} />, document.getElementById('geoattr'));
      });
      this.sketchViewModel.layer = this.editlayer;
    } else {
      this.sketchViewModel.layer = this.editlayer;
    }

    map.add(this.editlayer);
  }

  static async poltEditSaveCollection(item) {
    window.poltlayerid = null;
    const view = env.getParamAgs().view;
    if (!this.editlayer) return;
    const layerText = await layerUtils.getPortalLayerText(this.editlayer, this.editlayer.title);
    const res = await updateItemByItemId(item.id, null, null, null, layerText);
    if (res.data.success) {
      view.map.remove(this.editlayer);
      this.editlayer.removeAll();
      await this.showPoltlayerByItemid({ checked: true, item: item });
      message.success('保存成功');
    } else {
      message.error('保存失败');
      console.log(res);
    }
  }
}

export default poltUtils;
