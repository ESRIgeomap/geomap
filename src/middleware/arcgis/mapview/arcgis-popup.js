function createPopup(opts = {}) {
  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (opts.getState && opts.dispatch) {
    return () => (next) => (action) => next(action);
  }
  return () => (next) => (action) => {
    switch (action.type) {
      default: {
        next(action);
        break;
      }
    }
    return Promise.resolve();
  };
}

export { createPopup };
