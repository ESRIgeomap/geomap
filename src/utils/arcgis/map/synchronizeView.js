/**
 * 保持两个view同步
 * @author  lee  
 */
import { jsapi } from '../../../constants/geomap-utils';
let viewpointWatchHandle;
let viewStationaryHandle;
let otherInteractHandlers;
let scheduleId;

async function synchronizeView(view, others) {
  const [watchUtils] = await jsapi.load([
    'esri/core/watchUtils',
  ]);
  const others1 = Array.isArray(others) ? others : [others];
  const clear = () => {
    if (otherInteractHandlers) {
      otherInteractHandlers.forEach((handle) => {
        handle.remove();
      });
    }
    if (viewpointWatchHandle) {
      viewpointWatchHandle.remove();
    }
    if (viewStationaryHandle) {
      viewStationaryHandle.remove();
    }
    if (scheduleId) {
      clearTimeout(scheduleId);
    }
    otherInteractHandlers = viewpointWatchHandle = viewStationaryHandle = scheduleId = null;
  };

  const interactWatcher = view.watch('interacting,animation', (newValue) => {
    if (!newValue) {
      return;
    }
    if (viewpointWatchHandle || scheduleId) {
      return;
    }

    // start updating the other views at the next frame
    scheduleId = setTimeout(() => {
      scheduleId = null;
      viewpointWatchHandle = view.watch('viewpoint', (newValue1) => {
        others1.forEach((otherView) => {
          const viewOther = otherView;
          viewOther.viewpoint = newValue1;
        });
      });
    }, 0);

    // stop as soon as another view starts interacting, like if the user starts panning
    otherInteractHandlers = others1.map((otherView) => {
      return watchUtils.watch(otherView, 'interacting,animation', (value) => {
        if (value) {
          clear();
        }
      });
    });

    // or stop when the view is stationary again
    viewStationaryHandle = watchUtils.whenTrue(view, 'stationary', clear);
  });

  return {
    remove: () => {
      this.remove = () => {};
      clear();
      interactWatcher.remove();
    },
  };
}

let handles;

/**
 * 将两个场景同步
 * @author lee
 * @param {object} views 两个需要同步的场景
 * @returns
 */
function synchronizeViews(views) {
  handles = views.map((view, idx) => {
    const others = views.concat();
    others.splice(idx, 1);
    return synchronizeView(view, others);
  });
  return {
    remove: () => {
      this.remove = () => {};
      handles.forEach((h) => {
        h.remove();
      });
      handles = null;
    },
  };
}

export { synchronizeViews };
