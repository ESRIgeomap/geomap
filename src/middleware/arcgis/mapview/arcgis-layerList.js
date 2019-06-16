import { message } from 'antd';
import ReactDOM from 'react-dom';
import * as layerlistTypes from '../../../constants/action-types';
import layerUtils from '../../../utils/layerUtils';
import { jsapi } from '../../../constants/geomap-utils';
import env from '../../../utils/env';
import wmap from '../../../utils/arcgis/webMap';
import { addWebMap, shareItem, searchItems } from '../../../services/portal';
import request from './../../../utils/request';
import poltUtils from '../../../utils/poltUtils';
import GeometryAttribute from '../../../components/layerList/GeometryAttribute';
import treeUtil from '../../../utils/layertreeutils';
import * as mapUtils from '../../../utils/arcgis/map/mapviewUtil';
import {
  deleteItems,
  updateItemByItemId,
  addPoltFileItem,
  publishItem,
  exportFileByType,
  checkJobStatus,
  publishParametersAnalyze,
  getItemInfoByItemId,
} from '../../../services/portal';

function layerList(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }
  return store => next => async action => {
    switch (action.type) {
      case layerlistTypes.LAYERLIST_WEBMAP_CHANGE: {
        try {
          const [WebMap] = await jsapi.load(['esri/WebMap']);
          const view = env.getParamAgs().view;
          let handle = null;

          const map = new WebMap({
            portalItem: {
              id: action.payload,
            },
          });
        } catch (err) {
          message.error('专题切换错误...');
        }
        break;
      }
      case layerlistTypes.LAYERLIST_WEBMAP_LIST: {
        try {
          const [WebMap] = await jsapi.load(['esri/WebMap']);
          const map = new WebMap({
            portalItem: {
              id: action.payload,
            },
          });
          map.load().then(() => {
            store.dispatch({ type: 'layerList/setCurrentLayers', payload: map.layers.items });
          });
        } catch (err) {
          message.error('专题切换错误...');
        }
        break;
      }
      case layerlistTypes.SUBJECTLAYERLIST_ADD_OR_REMOVE: {
        try {
          const { isAdd, webmapids } = action.payload;
          const agsmap = env.getParamAgs().view.map;
          const [WebMap] = await jsapi.load(['esri/WebMap']);
          if (isAdd) {
            webmapids.map(webmapid => {
              const map = new WebMap({
                portalItem: {
                  id: webmapid,
                },
              });
              //这里加载图层要过滤加载重复图层
              map.load().then(() => {
                let ls = [];
                map.layers.map(tlayer => {
                  if (agsmap.allLayers.items.indexOf(tlayer) === -1) {
                    ls.push(tlayer);
                  } else {
                  }
                });
                agsmap.layers.addMany(ls);
              });
            });
          } else {
            webmapids.map(webmapid => {
              const map = new WebMap({
                portalItem: {
                  id: webmapid,
                },
              });
              map.load().then(() => {
                const rmlayers = map.layers.items.map(orl => {
                  return agsmap.allLayers.find(function (layer) {
                    return layer.title === orl.title;
                  });
                });
                rmlayers.map(layer => {
                  console.log('移除' + layer.title);
                });
                agsmap.removeMany(rmlayers);
              });
            });
          }
        } catch (err) {
          message.error('专题图层加载错误...');
        }

        break;
      }
      case layerlistTypes.SUBJECTLAYERLIST_SAVE: {
        const q = `owner:${
          sessionStorage.username
          } orgid:0123456789ABCDEF AND type: 'Web Map' AND tags: pgis NOT owner:{esri TO esri_zzzzz}`;
        const collections = await searchItems(q, 0, 100, 'numviews', 'desc');
        if (collections.data.results.length > 5) {
          message.warn('您已收藏至上限6个，将不予收藏');
          store.dispatch({
            type: 'layerList/changeWebmapTopload',
            payload: false,
          });
          return;
        }
        const [webMercatorUtils] = await jsapi.load(['esri/geometry/support/webMercatorUtils']);
        const view = env.getParamAgs().view;
        const webmap = new wmap(view);
        const text = webmap.getWebMapJSON();
        const geoextent = webMercatorUtils.webMercatorToGeographic(view.extent);
        const { title, snippet } = action.payload;
        await addWebMap(title, 'pgis', snippet, geoextent, text).then(res => {
          shareItem(res.data.id).then(r => {
            if (r.data.results[0].success) {
              const timer = setInterval(async () => {
                const rs = await getItemInfoByItemId(res.data.id);
                if (rs.data && rs.data.id) {
                  window.clearInterval(timer);
                  store.dispatch({
                    type: 'layerList/getCollectionWebMap',
                  });
                  store.dispatch({
                    type: 'layerList/changeWebmapTopload',
                    payload: false,
                  });
                  message.success('保存成功');
                }
                if (rs.data && rs.data.error) {
                  window.clearInterval(timer);
                  store.dispatch({
                    type: 'layerList/changeWebmapTopload',
                    payload: false,
                  });
                }
              }, 1000);
            } else {
              message.error('保存失败');
            }
          });
        });
        break;
      }
      case layerlistTypes.LAYERLIST_ADD_LAYERS: {
        const {  addedlayers,view } = action.payload;
        store.dispatch({
          type: 'agsmap/changegloballoadingstate',
          payload: true,
        });
        const [FeatureLayer] = await jsapi.load([
          'esri/layers/FeatureLayer',
        ]);
        addedlayers.map(({ type, url, goto, year, title, opcity, expression, render }) => {
          if (!url) {
            message.warn(`服务缺失：${title}`);
            return;
          }
          if (
            !view.map.layers.find(l => {
              return l.title === title;
            })
          ) {
            if (type === 'ImagerLayerYear') {
              mapUtils.addImageryLayerByCondition(view, url, 'year', year, title);
            } else if (type === 'ImagerLayer') {
              mapUtils.addImageryLayer(view, url, title, goto);
            } else {
              const layer = new FeatureLayer({
                url: url,
                title,
                definitionExpression: expression,
                opacity: Number(opcity),
              });
              if (render) {
                layer.renderer = render;
              }

              layer.outFields = ['*'];
              const popupTemplate = {
                title,
                content: '{*}',
                outFields: ['*'],
              };
            }
          }
        });
        store.dispatch({
          type: 'agsmap/changegloballoadingstate',
          payload: false,
        });
        break;
      }
      case layerlistTypes.LAYERLIST_REMOVE_LAYERS: {
        const { view, removedLayers } = action.payload;
        const rls = [];

        removedLayers.map(({ url, title }) => {
          rls.push(
            view.map.layers.find(l => {
              return l.title === title;
            })
          );
        });
        view.map.removeMany(rls);
        break;
      }
      case layerlistTypes.LAYERLIST_SUBJECT_SWITCH: {
        const view = env.getParamAgs().view;
        const webmapid = action.payload;
        const [WebMap] = await jsapi.load(['esri/WebMap']);
        // view.map.layers.removeAll();
        const newwebmap = new WebMap({
          portalItem: {
            id: webmapid,
          },
        });
        view.map = newwebmap;
        const cktree = [];
        newwebmap.load().then(() => {
          newwebmap.layers.items.map(l => {
            if (l.visible) {
              cktree.push(l.title);
            }
          });
          const treesKey = treeUtil.getKeyByTitle(cktree);
          store.dispatch({
            type: 'layerList/setInitCheckedTreeNode',
            payload: treesKey,
          });
          store.dispatch({
            type: 'layerList/setCheckedTreeNode',
            payload: treesKey,
          });
        });
        break;
      }
      case layerlistTypes.LAYERLIST_GET_TREE: {
        const q = `owner:${
          sessionStorage.username
          } orgid:0123456789ABCDEF AND type: 'Feature Service' AND tags: pgis NOT owner:{esri TO esri_zzzzz}`;
        const items = await searchItems(q, 0, 100, 'modified', 'desc');

        let treesNode = [];
        // const [Layer]  = await jsapi.load(['esri/layers/Layer']);
        items.data.results &&
          items.data.results.map(async item => {
            const title = item.title;
            const serverUrl = item.url + '?f=json';

            const child = await request(serverUrl);
            const childTree = child.data.layers.map(son => {
              return {
                title: son.name,
                key: item.url + '/' + son.id,
              };
            });
            treesNode.push({
              title,
              itemid: item.id,
              children: childTree,
              //JSON.parse(JSON.stringify(child.data.layers).replace(/name/g, 'title')),
            });
          });
        store.dispatch({ type: 'layerList/setTree', payload: treesNode });
        break;
      }
      case layerlistTypes.LAYERLIST_CHANGE_INDEX: {
        const map = env.getParamAgs().view.map;
        const { dropKey, dragKey } = action.payload;
        const dropNode = treeUtil.getTreeObjByKey(dropKey);
        const dragNode = treeUtil.getTreeObjByKey(dragKey);
        const layer = map.layers.items.find(l => {
          return l.title === dragNode.title;
        });
        if (layer) {
          const index = layerUtils.getLayerIndexByTitle(dropNode.title);
          map.reorder(layer, index || 0);
        }
        break;
      }
      case layerlistTypes.LAYERLIST_POLT_BYTYPE: {
        poltUtils.poltByType(
          action.payload,
          graphic => {
            ReactDOM.unmountComponentAtNode(document.getElementById('geoattr'));
            ReactDOM.render(
              <GeometryAttribute geo={graphic} />,
              document.getElementById('geoattr')
            );
          },
          () => {
            store.dispatch({
              type: 'layerList/changePoltEditToolbarVisible',
              payload: true,
            });
          },
          () => {
            store.dispatch({
              type: 'layerList/changePoltEditToolbarVisible',
              payload: false,
            });
          }
        );
        break;
      }
      case layerlistTypes.LAYERLIST_POLT_LAYER_SAVE: {
        await poltUtils.savePoltLayer(action.payload, () => {
          setTimeout(() => {
            store.dispatch({
              type: 'layerList/getPoltlayerList',
              payload: { start: 1, size: 10 },
            });
          }, 2000);
        });

        break;
      }
      case layerlistTypes.POLT_CLEAR_LAYER: {
        poltUtils.clearPoltLayer();
        break;
      }
      case layerlistTypes.POLT_CANCLE_LASTONE: {
        poltUtils.cancelPoltLastOne();
        break;
      }
      case layerlistTypes.POLT_EDIT_UPDATE: {
        poltUtils.editUpdate();
        break;
      }
      case layerlistTypes.POLT_EDIT_CLEAR: {
        poltUtils.editClear();
        break;
      }
      case layerlistTypes.POLT_EDIT_DELETE: {
        poltUtils.editDelete();
        break;
      }
      case layerlistTypes.POLT_EDIT_UNDO: {
        poltUtils.editUndo();
        break;
      }
      case layerlistTypes.POLT_EDIT_REDO: {
        poltUtils.editRedo();
        break;
      }
      case layerlistTypes.POLT_EDIT_COMPLETE: {
        poltUtils.editComplete();
        break;
      }
      case layerlistTypes.POLT_SHOWLAYER_BYITEMID: {
        poltUtils.showPoltlayerByItemid(action.payload);
        break;
      }
      case layerlistTypes.POLT_EDIT_ACTIVE: {
        poltUtils.poltEditActive(action.payload);
        break;
      }
      case layerlistTypes.POLT_EDIT_SAVE: {
        poltUtils.poltEditSave(action.payload, () => {
          store.dispatch({
            type: 'layerList/getPoltlayerList',
            payload: {
              start: 0,
              size: 10,
              page: 1,
            },
          });
        });
        break;
      }
      case layerlistTypes.POLT_EDIT_CANCEL: {
        poltUtils.poltEditCancel(action.payload);
        break;
      }
      case layerlistTypes.POLT_EDIT_DEACTIVE: {
        poltUtils.poltEditDeActive(action.payload);
        break;
      }
      case layerlistTypes.POLT_EDITOR_REMOVE: {
        poltUtils.removeEditor(action.payload);
        break;
      }
      case layerlistTypes.POLT_EDITOR_CREATE: {
        poltUtils.createEditor(action.payload);
        break;
      }
      case layerlistTypes.POLT_EDIT_ACTIVE_COLLECTION: {
        poltUtils.poltEditActiveCollection(action.payload);
        break;
      }
      case layerlistTypes.POLT_EDIT_SAVE_COLLECTIN: {
        poltUtils.poltEditSaveCollection(action.payload);
        break;
      }
      case layerlistTypes.POLT_DOWNLOAD_FILE_BYTYPE: {
        const { type, itemid } = action.payload;
        const exportres = await exportFileByType(type, itemid);
        const timer = window.setInterval(async () => {
          const status = await checkJobStatus(
            exportres.data.exportItemId,
            exportres.data.jobId,
            'export'
          );
          if (status.data.status === 'completed') {
            await updateItemByItemId(exportres.data.exportItemId, ' ');
            await shareItem(exportres.data.exportItemId);
            const a = document.createElement('a');
            a.href = `${window.appcfg.portal}sharing/rest/content/items/${
              exportres.data.exportItemId
              }/data?token=${sessionStorage.token}`;
            a.click();
            deleteItems([exportres.data.exportItemId]);
            store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
            window.clearInterval(timer);
          }
          if (status.data.status === 'failed' || status.data.status === '') {
            message.error('下载异常');
            store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
            window.clearInterval(timer);
          }
        }, 2000);
        break;
      }
      case layerlistTypes.POLT_DOWNLOAD_COLLECTION_BYTYPE: {
        const { type, itemid } = action.payload;
        const publishParameters = { name: 'temp' };
        const pubres = await publishItem(itemid, 'featureCollection', publishParameters);
        const pubtimer = window.setInterval(async () => {
          const pubstatus = await checkJobStatus(
            pubres.data.services && pubres.data.services[0].serviceItemId,
            pubres.data.services && pubres.data.services[0].jobId,
            'publish'
          );
          if (pubstatus.data.status === 'completed') {
            window.clearInterval(pubtimer);
            const exportres = await exportFileByType(type, pubres.data.services[0].serviceItemId);
            const exptimer = window.setInterval(async () => {
              const expstatus = await checkJobStatus(
                exportres.data.exportItemId,
                exportres.data.jobId,
                'export'
              );
              if (expstatus.data.status === 'completed') {
                window.clearInterval(exptimer);
                await updateItemByItemId(exportres.data.exportItemId, ' ');
                await shareItem(exportres.data.exportItemId);
                store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
                const a = document.createElement('a');
                a.href = `${window.appcfg.portal}sharing/rest/content/items/${
                  exportres.data.exportItemId
                  }/data?token=${sessionStorage.token}`;
                a.click();
                deleteItems([exportres.data.exportItemId, pubres.data.services[0].serviceItemId]);
              }
              if (expstatus.data.status === 'failed') {
                message.error('下载异常');
                store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
                window.clearInterval(exptimer);
              }
            }, 3000);
          }
          if (pubstatus.data.status === 'failed') {
            message.error('下载异常');
            store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
            window.clearInterval(pubtimer);
          }
        }, 3000);
        break;
      }
      case layerlistTypes.LAYERLIST_RELOAD_WEATHER_LAYERS: {
        const view = env.getParamAgs().view;
        const [FeatureLayer] = await jsapi.load(['esri/layers/FeatureLayer']);
        const date = action.payload;
        const weatherLayerTitles = [
          '24小时降水量预报',
          '24小时降雪预报',
          '24小时降水监测点实况',
          '24小时降水实况',
        ];
        weatherLayerTitles.map(title => {
          const node = treeUtil.getTreeNodeByTitle(title);
          const oldLayer = layerUtils.getLayerByTitle(title);
          if (oldLayer && oldLayer.visible) {
            view.map.remove(oldLayer);

            let newexpression = null;
            if (title === '24小时降水量预报') newexpression = `EFFECTIVETODATE='${date} 20:00:00'`;
            if (title === '24小时降雪预报') newexpression = `EFFECTIVETODATE='${date} 20:00:00'`;
            if (title === '24小时降水监测点实况')
              newexpression = `effectivefromdate='${date} 08:00:00'`;
            if (title === '24小时降水实况') newexpression = `effectivefromdate='${date} 08:00:00'`;
            node.expression = newexpression;

            const newLayer = new FeatureLayer({
              url: node.url,
              title,
              definitionExpression: node.expression,
              opacity: Number(node.opcity),
            });

            if (node.render) {
              newLayer.renderer = node.render;
            }
            newLayer.outFields = ['*'];
            view.map.add(newLayer);
          }
        });
        break;
      }
      case layerlistTypes.POLT_REMOVElAYER_BY_ITEMID: {
        const map = env.getParamAgs().view.map;
        const layer = map.findLayerById(action.payload.itemid);
        if (layer) map.remove(layer);
        const { itemid, pageInfo } = action.payload;
        const res = await deleteItems([itemid]);
        if (res.data.results[0] && res.data.results[0].success) {
          const timer = setInterval(async () => {
            const rs = await getItemInfoByItemId(itemid);
            if (rs.data && rs.data.error.code === 400) {
              window.clearInterval(timer);
              message.success('删除成功');
              store.dispatch({ type: 'layerList/getPoltlayerList', payload: pageInfo });
              store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
            }
          }, 1000);
        } else {
          message.error('删除失败');
          console.log(res);
        }
        break;
      }
      case layerlistTypes.LAYERLIST_TOP_COLLECTION: {
        const q = `owner:${
          sessionStorage.username
          } orgid:0123456789ABCDEF AND type: 'Web Map' AND tags: topone NOT owner:{esri TO esri_zzzzz}`;
        const items = await searchItems(q, 0, 100, 'modified', 'desc');
        const itemid = items.data.results[0] && items.data.results[0].id;
        await updateItemByItemId(itemid, ['']);

        await updateItemByItemId(action.payload, ['topone']);
        const timer = setInterval(async () => {
          const rs = await getItemInfoByItemId(action.payload);
          if (rs.data.tags.indexOf('topone') > 0) {
            window.clearInterval(timer);
            store.dispatch({ type: 'layerList/getCollectionWebMap' });
            store.dispatch({ type: 'layerList/changeWebmapTopload', payload: false });
            message.success('置顶成功');
          }
        }, 1000);
        break;
      }
      case layerlistTypes.POLT_ADDPOLTFILE_LAYERITEM: {
        const { filename, file, layertype, type, layerdescription } = action.payload;
        let publishFileType = '',
          publishParameters = {};

        if (type === 'zip') {
          publishFileType = 'shapefile';
          publishParameters = { name: filename };
        }
        if (type === 'geojson') {
          publishFileType = 'geojson';
          publishParameters = {
            hasStaticData: true,
            name: filename,
            maxRecordCount: 2000,
            layerInfo: {
              capabilities: 'Query',
            },
          };
        }
        if (type === 'csv') {
          publishFileType = 'csv';
        }

        if (type !== 'kml') {
          const addpartRes = await addPoltFileItem(
            filename,
            file,
            layertype,
            type,
            layerdescription
          );
          if (addpartRes.data && addpartRes.data.success) {
            if (type === 'csv') {
              const analyzeRes = await publishParametersAnalyze(
                addpartRes.data.id,
                publishFileType
              );
              publishParameters = analyzeRes.data.publishParameters;
            }
          }
          //发布要素服务
          debugger;
          const pubres = await publishItem(addpartRes.data.id, publishFileType, publishParameters);
          if (pubres.data.error) {
            message.error('文件已存在或非标准文件');
            store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
            return;
          }
          const serviceItemId = pubres.data.services && pubres.data.services[0].serviceItemId;
          const jobId = pubres.data.services && pubres.data.services[0].jobId;
          const timer = window.setInterval(async () => {
            const status = await checkJobStatus(serviceItemId, jobId, 'publish');
            if (status.data.status === 'completed') {
              await shareItem(serviceItemId);
              await updateItemByItemId(serviceItemId, 'poltfile');
              await deleteItems([addpartRes.data.id]);
              const re = await getItemInfoByItemId(serviceItemId);
              if (re.data.tags.indexOf('poltfile') > 0) {
                window.clearInterval(timer);
                store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
                store.dispatch({
                  type: 'layerList/getPoltlayerList',
                  payload: { start: 1, size: 10 },
                });
                message.success('上传成功');
              } else {
                window.clearInterval(timer);
                store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
                message.error('上传失败');
              }
            }
            if (status.data.status === 'failed' || status.data.status === 'failed') {
              window.clearInterval(timer);
              // deleteItems([serviceItemId]);
              store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
              message.error('文件已存在或非标准文件');
            }
          }, 3000);
        } else {
          const upload = await addPoltFileItem(
            filename,
            file,
            ['poltfile'].concat(layertype),
            type,
            layerdescription
          );
          if (upload.data && upload.data.success) {
            const timer = window.setInterval(async () => {
              const newitem = await getItemInfoByItemId(upload.data.id);
              if (newitem.data && newitem.data.id) {
                window.clearInterval(timer);
                store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
                store.dispatch({
                  type: 'layerList/getPoltlayerList',
                  payload: { start: 1, size: 10 },
                });
                message.success('上传成功');
              } else {
                window.clearInterval(timer);
                store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
              }
            }, 1000);
          } else {
            store.dispatch({ type: 'layerList/changePoltlayerOptionsLoad', payload: false });
            message.error('上传失败');
            console.log(upload);
          }
        }
        break;
      }
      case layerlistTypes.LAYERLIST_SUBJECT_REMOVE: {
        const itemid = action.payload;
        const delres = await deleteItems([itemid]);
        const timer = setInterval(async () => {
          const info = await getItemInfoByItemId(itemid);
          if (info.data && info.data.error.code === 400) {
            window.clearInterval(timer);
            message.success('删除成功');
            store.dispatch({ type: 'layerList/getCollectionWebMap' });
            store.dispatch({ type: 'layerList/changeWebmapTopload', payload: false });
          }
        }, 2000);
      }
      case layerlistTypes.ACTION_GET_PIPELIST: {
        const url = window.pipeRoamConfig.pipeService;
        const [Query, QueryTask] = await jsapi.load([
          'esri/tasks/support/Query',
          'esri/tasks/QueryTask',
        ]);
        const query = new Query();
        query.where = '1=1';
        query.returnGeometry = true;
        query.outFields = ['*'];
        const qtask = new QueryTask({ url });
        qtask.execute(query).then(res => {
          store.dispatch({
            type: 'agsmap/setPipeList',
            payload: res.features,
          });
        });

        break;
      }
      case layerlistTypes.ACTION_PIPE_ROAM: {
        const view = env.getParamAgs().view;
        const geometry = action.payload;
        const { paths } = geometry;
        const newPath = [];
        paths[0].map((point, index) => {
          if (index % 5 === 0) {
            newPath.push(point);
          }
        });
        let i = 0;
        const roamtimer = setInterval(() => {
          if (i <= newPath.length) {
            i++;
            view.goTo({ target: newPath[i], zoom: 13 }, { duration: 5 });
          } else {
            clearInterval(roamtimer);
          }
        }, 20);
        break;
      }
      default: {
        next(action);
        break;
      }
    }
    return Promise.resolve();
  };
}

export { layerList };
