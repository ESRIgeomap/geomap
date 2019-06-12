//pensiveant：数据选择迁移添加


import * as LayerListConst from '../constants/layerList';

import { showLayerList } from '../services/layerList';
import {
  searchItems,
  deleteItems,
  shareItem,
  updateItemByItemId,
  addPoltFileItem,
  publishItem,
  exportFileByType,
  checkJobStatus,
  publishParametersAnalyze,
  getItemInfoByItemId,
} from '../services/portal';
import request from '../utils/request';
import { message } from 'antd';

export default {
  namespace: 'layerList',

  state: {
    /**layerlist */
    layerListVisible: false,
    subjectTitle: '预置专题',
    webMapsList: [],
    currentLayers: [],
    layerPanelFlag: 'layerlist',
    isSplit:false, //pensiveant:是否为分屏，用于分屏后图层列表位置调整

    /**subjectlayerlist */
    subjectLayerListShow: false,
    activeSubjectLayer: null,
    webMapsListWidth: 99999,

    poltPanelVisible: false,
    allSystemLayers: [],
    trees: [],
    collectionWebMaps: [],
    initCheckTreeNodes: [],
    checkedTreeNodes: [],
    poltlayerlist: { results: [], total: 0 },
    poltedittoolbarvisible:true,
    webmapTopload:false,
    poltlayeroptionsload:false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    },
  },

  effects: {
    *init({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: 'save', payload });
    },
    *searchPoi({ payload }, { put, call }) {
      const { keyword, bound } = payload;
      const result = yield call(showLayerList, keyword, bound);
    },
    *getAllSystemLayers({ payload }, { put, call }) {
      const q = `owner:${
        sessionStorage.username
      } orgid:0123456789ABCDEF AND type: 'Feature Service' AND tags: pgis NOT owner:{esri TO esri_zzzzz}`;
      const items = yield call(searchItems, q, 0, 100, 'created', 'desc');
      yield put({ type: 'setAllSystemLayers', payload: items.data.results });
    },
    *getCollectionWebMap({ payload }, { put, call }) {
      const q = `owner:${
        sessionStorage.username
      } orgid:0123456789ABCDEF AND type: 'Web Map' AND tags: pgis NOT owner:{esri TO esri_zzzzz}`;
      console.log(q);
      const items = yield call(searchItems, q, 0, 100, 'created', 'desc');      
      yield put({ type: 'setCollectionWebMap', payload: items.data.results });
    },
    *deleteItem({ payload }, { put, call }) {
      const res = yield call(deleteItems, payload);
      if (res.data.results[0] && res.data.results[0].success) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
        console.log(res);
      }      
      yield put({ type: 'changePoltlayerOptionsLoad',payload:false});
      yield put({ type: 'getCollectionWebMap' });
      yield put({ type: 'getPoltlayerList', payload: { start: 1, size: 10 } });
    },
    *deleteItemPolt({ payload }, { put, call ,take,select}){
      const res = yield deleteItems([payload.itemid]);
      if (res.data.results[0] && res.data.results[0].success) {
        message.success('删除成功');
        yield put({type:'getPoltlayerList',payload:payload.pageInfo});  
        yield put({ type: 'changePoltlayerOptionsLoad',payload:false});
      } else {
        message.error('删除失败');
        console.log(res);
      }               
    },
    *setCollectionWebMapTopOne({ payload }, { put, call }) {
      const q = `owner:${
        sessionStorage.username
      } orgid:0123456789ABCDEF AND type: 'Web Map' AND tags: topone NOT owner:{esri TO esri_zzzzz}`;
      const items = yield call(searchItems, q, 0, 100, 'created', 'desc');
      const itemid = items.data.results[0]&&items.data.results[0].id;
      // debugger
      if(items.data.results[0])
        yield call(updateItemByItemId,itemid, ['']);
      const upres = yield call(updateItemByItemId,payload, ['topone']);
      if(upres.data.success){
        const qp = `owner:${
          sessionStorage.username
        } orgid:0123456789ABCDEF AND type: 'Web Map' AND tags: pgis NOT owner:{esri TO esri_zzzzz}`;
        const itemsqp = yield call(searchItems, qp, 0, 100, 'created', 'desc');
        yield put({ type: 'setCollectionWebMap', payload: itemsqp.data.results });
        yield put({type:'changeWebmapTopload',payload:false});
        message.success('置顶成功');
      }
    },
    *getPoltlayerList({ payload }, { put, call }) {
      const { start, size } = payload;
      const q = `owner:${
        sessionStorage.username
      } orgid:0123456789ABCDEF  AND tags: poltfile NOT owner:{esri TO esri_zzzzz}`;
      const items = yield call(searchItems, q, start, size, 'created', 'desc');
      yield put({ type: 'setPoltlayerList', payload: items.data });
    },
    *addPoltFilelayerItem({ payload }, { put, call }) {
      const { filename, file, layertype, type, layerdescription } = payload;
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
        const addpartRes = yield call(
          addPoltFileItem,
          filename,
          file,
          layertype,
          type,
          layerdescription
        );
        if (addpartRes.data && addpartRes.data.success) {
         
          if (type === 'csv') {
            const analyzeRes = yield publishParametersAnalyze(addpartRes.data.id, publishFileType);
            publishParameters = analyzeRes.data.publishParameters;
          }
        }
        //发布要素服务
        debugger;
        const pubres = yield call(
          publishItem,
          addpartRes.data.id,
          publishFileType,
          publishParameters
        );
        if (pubres.data.error) {
          message.error('服务器异常');
          return;
        }
        const serUrl = pubres.data.services && pubres.data.services[0].serviceurl;
        const serviceItemId = pubres.data.services && pubres.data.services[0].serviceItemId;
        const jobId = pubres.data.services && pubres.data.services[0].jobId;
        const timer = window.setInterval(async () => {
          const status = await checkJobStatus(serviceItemId, jobId, 'publish');
          if (status.data.status === 'completed') {
            await shareItem(serviceItemId);
            await updateItemByItemId(serviceItemId, 'poltfile');
            await deleteItems([addpartRes.data.id]);
            const re = await getItemInfoByItemId(serviceItemId); 
            if(re.data.tags.indexOf('poltfile')>0) {
              debugger    
              window.clearInterval(timer);
              await put({type:'changePoltlayerOptionsLoad',payload:false});
              await put({ type: 'getPoltlayerList', payload: { start: 1, size: 10 } });
              message.success('上传成功');
              debugger
            }else{
              window.clearInterval(timer);
              await put({type:'changePoltlayerOptionsLoad',payload:false});
              message.error('上传失败');
              
            }               
            // window.clearInterval(timer);
          }
          if (status.data.status === 'failed' || status.data.status === 'failed') {
            deleteItems([serviceItemId]);
            message.error('发布失败,请修改文件名称后尝试');
            window.clearInterval(timer);
          }
        }, 2000);
      } else {
        const upload = yield call(
          addPoltFileItem,
          filename,
          file,
          ['poltfile'].concat(layertype),
          type,
          layerdescription
        );
        if (upload.data && upload.data.success) {
          message.success('上传成功');
        } else {
          message.error('上传失败');
          console.log(upload);
        }
        yield put({ type: 'getPoltlayerList', payload: { start: 1, size: 10 } });
      }     
    }, 
  },

  reducers: {
    changeLayerListVisible(state, action) {
      return { ...state, layerListVisible: action.payload };
    },
    setWebMapsList(state, action) {
      return { ...state, webMapsList: action.payload };
    },
    setCurrentLayers(state, action) {
      return { ...state, currentLayers: action.payload };
    },
    clearCurrentLayers(state, action) {
      return { ...state, currentLayers: [] };
    },
    settCurrentSubjectTitle(state, action) {
      return { ...state, subjectTitle: action.payload };
    },
    showSubjectLayerList(state, action) {
      return { ...state, subjectLayerListShow: action.payload };
    },
    setWebMapsListWidth(state, action) {
      return { ...state, webMapsListWidth: action.payload };
    },
    setLayerPanelFlag(state, action) {
      return { ...state, layerPanelFlag: action.payload };
    },
    changePoltPanelVisible(state, action) {
      return { ...state, poltPanelVisible: action.payload };
    },
    setAllSystemLayers(state, action) {
      return { ...state, allSystemLayers: action.payload };
    },
    setTree(state, action) {
      return { ...state, trees: action.payload };
    },
    setCollectionWebMap(state, action) {
      const  nowWebMaps = action.payload;      
      // const topOne = nowWebMaps.find(item => {
      //   if (item !== undefined) return item.tags.indexOf('topone') !== -1;
      // });  
      // // debugger   
      // if (topOne === undefined || topOne === null) {
      // } else {
      //   nowWebMaps.splice(nowWebMaps.indexOf(topOne), 1);
      //   nowWebMaps.unshift(topOne);
      // }
      return { ...state, collectionWebMaps: nowWebMaps};
    },
    setInitCheckedTreeNode(state, action) {
      return { ...state, initCheckTreeNodes: action.payload };
    },
    setCheckedTreeNode(state, action) {
      return { ...state, checkedTreeNodes: action.payload };
    },
    setPoltlayerList(state, action) {
      return { ...state, poltlayerlist: action.payload };
    },
    changePoltEditToolbarVisible(state,action){
      return {...state, poltedittoolbarvisible:action.payload}
    },
    changeWebmapTopload(state,action){
      return {...state, webmapTopload:action.payload};
    },
    changePoltlayerOptionsLoad(state,action){
      return {...state,poltlayeroptionsload:action.payload};
    },
    //pensiveant:修改分屏状态
    changeSplitState(state,action){
      return {...state,isSplit:action.payload};
    }
  },
};
