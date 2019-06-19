import {
  INIT_MAP,
  INIT_SPLITMAP,
  VIEW_MODE_2D,
  SWITCH_MAP,
  ACTION_ADDBOOKMARK_2D,
  ACTION_GOTOBOOKMARK_2D,
  ACTION_DELETBOOKMARK_2D,
  ACTION_DELETTHISBOOKMARK_2D,
  ACTION_EDITBOOKMARK_2D,
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
    sceneviewCreated:false,
    mode: VIEW_MODE_2D,
    callflags: false,
    // bookflags: false,
    splitflags: false,
    correctflags: false,
    rollerflags: false,
    // bookmarks: [],
    // bookname: null,
    
    // 日照分析参数 wangp 20180823
    // showShadow: false,
    // sliderPlay: false,
    // datepickerPlayState: false,
    // valuetime: null,
    // sliderValue: 0,
    // timerOfSlider: setInterval(null, null),
    // timerOfDatepicker: setInterval(null, null),
    // iconOfDatePicker: 'caret-right',
    // iconOfSlider: 'caret-right',
    // lightshadowlistflags: false,

    activeHeadCode: '1',
    menusflags: false,
    timerLayersSelectvisible:false,
    identifyflags: true, // pensiveant：标绘，是否进行属性查询
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
    // *addBookmark({ payload }, { put }) {
    //   yield put({ type: ACTION_ADDBOOKMARK_2D, payload });
    // },
    // *gotoBookmark({ payload }, { put }) {
    //   yield put({ type: ACTION_GOTOBOOKMARK_2D, payload });
    // },
    // *deletBookmark({ payload }, { put }) {
    //   yield put({ type: ACTION_DELETBOOKMARK_2D, payload });
    // },
    // *deletthisBookmark({ payload }, { put }) {
    //   yield put({ type: ACTION_DELETTHISBOOKMARK_2D, payload });
    // },
    // *editBookmark({ payload }, { put }) {
    //   yield put({ type: ACTION_EDITBOOKMARK_2D, payload });
    // },
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
    // 光照分析
    // listChangeState(state, action) {
    //   return {
    //     ...state,
    //     prolistflags: action.payload.prolistflags,
    //     progralistflags: action.payload.progralistflags,
    //     controllistflags: action.payload.controllistflags,
    //     lightshadowlistflags: action.payload.lightshadowlistflags,
    //     layerlistcontrol: action.payload.layerlistcontrol,
    //     viewpointflags: action.payload.viewpointflags,
    //   };
    // },
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
    // shadowInitDataState(state, action) {
    //   return {
    //     ...state,
    //     showShadow: action.payload,
    //   };
    // },
    // sliderPlayState(state, action) {
    //   return {
    //     ...state,
    //     sliderPlay: action.payload,
    //   };
    // },
    // datepickerPlayState(state, action) {
    //   return {
    //     ...state,
    //     datepickerPlay: action.payload,
    //   };
    // },
    // valuetimeState(state, action) {
    //   return {
    //     ...state,
    //     valuetime: action.payload,
    //   };
    // },
    // sliderValueState(state, action) {
    //   return {
    //     ...state,
    //     sliderValue: action.payload,
    //   };
    // },
    // timerOfDatepickerState(state, action) {
    //   return {
    //     ...state,
    //     timerOfDatepicker: action.payload,
    //   };
    // },
    // timerOfSliderState(state, action) {
    //   return {
    //     ...state,
    //     timerOfSlider: action.payload,
    //   };
    // },
    // iconOfDatePickerState(state, action) {
    //   return {
    //     ...state,
    //     iconOfDatePicker: action.payload,
    //   };
    // },
    // iconOfSliderState(state, action) {
    //   return {
    //     ...state,
    //     iconOfSlider: action.payload,
    //   };
    // },
    // rebackInitlightState(state, action) {
    //   return {
    //     ...state,
    //     showShadow: action.payload.showShadow,
    //     sliderPlay: action.payload.sliderPlay,
    //     datepickerPlay: action.payload.datepickerPlay,
    //     valuetime: action.payload.valuetime,
    //     sliderValue: action.payload.sliderValue,
    //     timerOfDatepicker: action.payload.timerOfDatepicker,
    //     timerOfSlider: action.payload.timerOfSlider,
    //     iconOfDatePicker: action.payload.iconOfDatePicker,
    //     iconOfSlider: action.payload.iconOfSlider,
    //   };
    // },
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
  },
};
