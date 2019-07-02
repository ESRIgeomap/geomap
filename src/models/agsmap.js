import {
  INIT_MAP,
  INIT_SPLITMAP,
  VIEW_MODE_2D,
  SWITCH_MAP,
} from '../constants/action-types';

const delay = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default {
  namespace: 'agsmap',

  state: {
    viewCreated: false,
    sceneviewCreated: false,
    mode: VIEW_MODE_2D,
    callflags: false,
    // bookflags: false,
    splitflags: false,
    correctflags: false,
    rollerflags: false,
    activeHeadCode: '1',
    menusflags: false,
    activeMapItemid: null,
    deactivate: true,
    deactivate2: true,
    deactivate3: true,
    timerLayersSelectvisible: false,
    identifyflags: true, // pensiveant：标绘，是否进行属性查询
    // 天气特效 面板 状态
    weatherEffectsPanelState: false,
    // 切换数据源 面板 状态 wfh 20190618
    changeDataSourcePanelState: false,
    // bim工具条 面板 状态 wfh 20190620
    toolbar4bimPanelState: false,
    opacityVlue: 1,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: 'save' });
    },

    *init({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: INIT_MAP, payload });
    },
    *initsplitMap({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: INIT_SPLITMAP, payload });
    },
    *transMode2d({ payload }, { put, call }) {
      yield put({ type: SWITCH_MAP, payload });
      while (true) {
        yield call(delay, 300);

        if (window.agsGlobal.view.type === '2d') {
          yield put({ type: 'transMode2dState', payload });
          break;
        }
      }
    },
    *transMode3d({ payload }, { put, call }) {
      yield put({ type: SWITCH_MAP, payload });
      while (true) {
        yield call(delay, 300);

        if (window.agsGlobal.view.type === '3d') {
          yield put({ type: 'transMode3dState', payload });
          break;
        }
      }
    },
  },

  reducers: {
    afterViewCreated(state, action) {
      return { ...state, viewCreated: true };
    },
    afterSceneviewCreated(state, action) {
      return { ...state, sceneviewCreated: true };
    },
    rollscreenChangeState(state, action) {
      return { ...state, rollerflags: action.payload };
    },
    transMode3dState(state, action) {
      return { ...state, mode: action.payload };
    },
    transMode2dState(state, action) {
      return { ...state, mode: action.payload };
    },
    // bookmarkChangeState(state, action) {
    //   return { ...state, bookflags: action.payload };
    // },
    splitscreenChangeState(state, action) {
      return { ...state, splitflags: action.payload };
    },
    mapcorrectChangeState(state, action) {
      return { ...state, correctflags: action.payload };
    },
    // updateBookmarks(state, action) {
    //   return { ...state, bookmarks: action.payload };
    // },
    //菜单栏打开关闭
    menusChangeState(state, action) {
      return { ...state, menusflags: action.payload };
    },
    switchBaseMap(state, action) {
      return {
        ...state,
        activeMapItemid: action.payload,
      };
    },
    // 电表展示 end
    // 天气特效 面板状态修改
    weatherEffectsPanelChangeState(state, action) {
      return { ...state, weatherEffectsPanelState: action.payload };
    },
    changeCurrentData(state, action) {
      return {
        ...state,
        current: action.payload.current,
      };
    },
    changeProjectIdHighlightedData(state, action) {
      return {
        ...state,
        projectIdHighlighted: action.payload,
      };
    },
    setProgramChoose(state, action) {
      return {
        ...state,
        programchoose: action.payload.programchoose,
      };
    },
    setSlidesArray(state, action) {
      return {
        ...state,
        slidesarrayindex: action.payload.slidesarrayindex,
        slidesarrays: action.payload.slidesarrays,
      };
    },
    sklineAnlysisData(state, action) {
      return {
        ...state,
        sklineDatas: action.payload.temp.data.data,
      };
    },
    sklineAnlysisSchemesData(state, action) {
      return {
        ...state,
        sklineSchemes: action.payload.sklineSchemes,
        lookPointDatas: action.payload.lookPointDatas,
      };
    },
    setSkylineanalysisModalvisible(state, action) {
      return {
        ...state,
        skylineanalysisModalvisible: action.payload.skylineanalysisModalvisible,
      };
    },
    activeHeadChangeState(state, action) {
      return {
        ...state,
        activeHeadCode: action.payload,
      };
    },
    showTimerSliderCompare(state, action) {
      return { ...state, timerLayersSelectvisible: action.payload };
    },

    identifyChangeState(state, action) {
      return {
        ...state,
        identifyflags: action.payload,
      };
    },
    // 修改数据源
    changeDataSourcePanelChangeState(state, action) {
      return { ...state, changeDataSourcePanelState: action.payload };
    },
    // bim工具条
    changeToolbar4bimPanelState(state, action) {
      return { ...state, toolbar4bimPanelState: action.payload };
    },
    shanchuweijian(state, action) {
      return { ...state, deactivate: action.payload };
    },
    shanchuweijian2(state, action) {
      return { ...state, deactivate2: action.payload };
    },
    shanchuweijian3(state, action) {
      return { ...state, deactivate3: action.payload };
    },
    setOpacity(state, action){
      return { ...state, opacityVlue: action.payload };
    },
  },
};
