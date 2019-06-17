export default {
  namespace: 'toolbar',

  state: {
    current: null,
  },

  effects: {},

  reducers: {
    updateCurrentView(state, action) {
      return { ...state, current: action.payload };
    },
  },
};
