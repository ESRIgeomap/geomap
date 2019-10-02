import jQuery from 'jquery';

import {
  ACTION_STARTHANDLEWEATHEREFFECTS_3D,
} from '../../../constants/action-types';

function weatherEffects(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => (next) => (action) => next(action);
  }

  return (store) => (next) => (action) => {
    switch (action.type) {
      case ACTION_STARTHANDLEWEATHEREFFECTS_3D: {
        const param = action.payload;
        console.log('开始处理天气特效，传来的参数是：' + param.weatherType);
        if (param.weatherType === 'rain') {
          jQuery('.snow-container').hide();
          jQuery('#rain').show();
        } else if (param.weatherType === 'snow') {
          jQuery('#rain').hide();
          jQuery('.snow-container').show();
        } else if (param.weatherType === 'rainAndSnow') {
          jQuery('#rain').show();
          jQuery('.snow-container').show();
        } else if (param.weatherType === 'sunnyDay') {
          jQuery('.snow-container').hide();
          jQuery('#rain').hide();
        } else {
          console.log('天气特效没有操作，请检查');
        }
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

export { weatherEffects };
