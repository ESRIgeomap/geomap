
/*
 * 日照分析model
 * author:pensiveant
 */

export default {
  namespace: 'Lightshadow',
  state: {
    lightshadowlistflags: false, //是否显示日照分析控件
    valuetime: null,//日期控件的值，对应Lighting对象的date属性
    showShadow: false, //是否勾选显示阴影
    sliderPlay: false, //时间轴播放状态
    sliderValue: 0, //时间轴的值
    timerOfSlider: setInterval(null, null),//
    timerOfDatepicker: setInterval(null, null),//
    iconOfDatePicker: 'caret-right', // 日期控件图标
    iconOfSlider: 'caret-right',

    // prolistflags: ,
    // progralistflags: ,
    // controllistflags: ,
    // layerlistcontrol: ,
    // viewpointflags: ,

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
     * 回到初始状态
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
     * 设置按时间轴播放的循环函数
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
     * 设置时间轴播放按钮的图标
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
     * 设置日照分析组件的显隐
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
     * 设置是否勾选显示阴影
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
     * 设置日期播放状态
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
     * 设置当前日期值
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
     * 设置日期播放定时器
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
     * 设置日期播放按钮图标
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
