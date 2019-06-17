
/*
 * 日照分析model
 * author:pensiveant
 */

export default {
  namespace: 'Lightshadow',
  state: {
    lightshadowlistflags: false, //是否显示日照分析控件
    valuetime: null,//日期控件的值
    showShadow: false, //是否勾选显示阴影
    sliderPlay: false, //时间轴播放状态
    sliderValue: 0, //时间轴的值
    timerOfSlider: setInterval(null, null),//
    timerOfDatepicker: setInterval(null, null),//
    iconOfDatePicker: 'caret-right', // 日期控件图标
    iconOfSlider: 'caret-right',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    },
  },

  effects: {
  
  },

  reducers: {
    /**
     * 
     * author:pesiveant
     * @param {*} state 
     * @param {*} action 
     */
    rebackInitlightState(state, action) {
      return {
        ...state,
        showShadow: action.payload.showShadow,
        sliderPlay: action.payload.sliderPlay,
        datepickerPlay: action.payload.datepickerPlay,
        valuetime: action.payload.valuetime,
        sliderValue: action.payload.sliderValue,
        timerOfDatepicker: action.payload.timerOfDatepicker,
        timerOfSlider: action.payload.timerOfSlider,
        iconOfDatePicker: action.payload.iconOfDatePicker,
        iconOfSlider: action.payload.iconOfSlider,
      };
    },

    /**
     * 更改时间轴的播放状态
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    sliderPlayState(state, action) {
      return {
        ...state,
        sliderPlay: action.payload,
      };
    },

    
    /**
     * 
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    timerOfSliderState(state, action) {
      return {
        ...state,
        timerOfSlider: action.payload,
      };
    },

      /**
     * 
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    iconOfSliderState(state, action) {
      return {
        ...state,
        iconOfSlider: action.payload,
      };
    },
    
    /**
     * 
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    listChangeState(state, action) {
      return {
        ...state,
        prolistflags: action.payload.prolistflags,
        progralistflags: action.payload.progralistflags,
        controllistflags: action.payload.controllistflags,
        lightshadowlistflags: action.payload.lightshadowlistflags,
        layerlistcontrol: action.payload.layerlistcontrol,
        viewpointflags: action.payload.viewpointflags,
      };
    },

    /**
     * 
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    shadowInitDataState(state, action) {
      return {
        ...state,
        showShadow: action.payload,
      };
    },

    /**
     * 
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    datepickerPlayState(state, action) {
      return {
        ...state,
        datepickerPlay: action.payload,
      };
    },

    /**
     * 
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    valuetimeState(state, action) {
      return {
        ...state,
        valuetime: action.payload,
      };
    },

    /**
     * 更改时间轴的值
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    sliderValueState(state, action) {
      return {
        ...state,
        sliderValue: action.payload,
      };
    },

    /**
     * 
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    timerOfDatepickerState(state, action) {
      return {
        ...state,
        timerOfDatepicker: action.payload,
      };
    },

    /**
     * 
     * author:pensiveant
     * @param {*} state 
     * @param {*} action 
     */
    iconOfDatePickerState(state, action) {
      return {
        ...state,
        iconOfDatePicker: action.payload,
      };
    },

  },
};
