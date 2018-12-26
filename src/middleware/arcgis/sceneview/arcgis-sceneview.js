import React from 'react';
import ReactDOM from 'react-dom';

import {
  ACTION_MAP_OVERVIEW,
} from '../../../constants/action-types';
import { jsapi } from '../../../constants/geomap-utils';
import env from '../../../utils/env';

// 获取全局ags对象，用于其他组件获取其中的view对象

async function prepare() {
  const [esriConfig] = await jsapi.load(['esri/config']);
  esriConfig.request.proxyUrl = env.getProxyUrl();
  esriConfig.portalUrl = env.getPortal();
}


function createSceneView(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return store => next => async action => {
    switch (action.type) {
      case ACTION_MAP_OVERVIEW: {
        const visibleOverviewmap = action.payload;
        const overmap = document.getElementById('overmapDiv');
        if (visibleOverviewmap) {
          overmap.style.display = 'block';
        } else {
          overmap.style.display = 'none';
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

export { createSceneView };
