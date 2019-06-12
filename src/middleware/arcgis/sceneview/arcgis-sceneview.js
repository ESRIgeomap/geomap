import { ACTION_MAP_OVERVIEW } from '../../../constants/action-types';

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
