import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';

import arcgis from '../../../utils/arcgis';
import * as jsapi from '../../../utils/jsapi';

import styles from './index.css';

export default () => {
  const [loading, setLoading] = useState(true);
  const [vm, setVm] = useState(null);

  useEffect(() => {
    jsapi.load(['esri/widgets/Zoom/ZoomViewModel']).then(([ZoomViewModel]) => {
      const timer = setInterval(() => {
        if (arcgis.isViewReady()) {
          clearInterval(timer);
          const vm = new ZoomViewModel({
            view: window.agsGlobal.view,
          });
          setLoading(false);
          setVm(vm);
        }
      }, 300);
    });
  }, []);

  function onZoomIn() {
    if (!vm || vm.state !== 'ready') {
      return;
    }

    if (vm.canZoomIn) {
      vm.zoomIn();
    }
  }

  function onZoomOut() {
    if (!vm || vm.state !== 'ready') {
      return;
    }

    if (vm.canZoomOut) {
      vm.zoomOut();
    }
  }

  return (
    <div className={styles.wrap}>
      <span
        className={classnames({
          [styles.btn]: true,
          disabled: loading,
        })}
        onMouseDown={onZoomIn}
      >
        {loading ? <Icon type="loading" /> : <Icon type="plus" />}
      </span>
      <span
        className={classnames({
          [styles.btn]: true,
          disabled: loading,
        })}
        onMouseDown={onZoomOut}
      >
        {loading ? <Icon type="loading" /> : <Icon type="minus" />}
      </span>
    </div>
  );
};
