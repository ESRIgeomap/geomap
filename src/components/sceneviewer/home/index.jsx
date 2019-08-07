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
    jsapi.load(['esri/widgets/Home/HomeViewModel']).then(([HomeViewModel]) => {
      if (arcgis.isViewReady()) {
        const vm = new HomeViewModel({
          view: window.agsGlobal.view,
        });
        setVm(vm);
        setLoading(false);
      } else {
        const timer = setInterval(() => {
          if (arcgis.isViewReady()) {
            clearInterval(timer);
            const vm = new HomeViewModel({
              view: window.agsGlobal.view,
            });
            setVm(vm);
            setLoading(false);
          }
        }, 300);
      }
    });
  }, []);

  function reset() {
    if (!vm || vm.state !== 'ready') {
      return;
    }

    vm.go(vm.view.map.initialViewProperties.viewpoint);
  }

  return (
    <div className={styles.wrap}>
      <span
        className={classnames({
          [styles.btn]: true,
          disabled: loading,
        })}
        onMouseDown={reset}
      >
        {loading ? <Icon type="loading" /> : <span className="esri-icon-home" />}
      </span>
    </div>
  );
};
