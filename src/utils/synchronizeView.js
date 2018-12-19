let viewpointWatchHandle;
let viewStationaryHandle;
let otherInteractHandlers;
let scheduleId;

function synchronizeView(view, others, watchUtils) {
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

function synchronizeViews(views, watchUtils) {
  handles = views.map((view, idx) => {
    const others = views.concat();
    others.splice(idx, 1);
    // console.log(others);
    return synchronizeView(view, others, watchUtils);
  });
  // console.log(handles);
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
