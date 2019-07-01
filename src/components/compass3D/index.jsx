// 罗盘微件
import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';

import arcgis from '../../utils/arcgis';
import * as jsapi from '../../utils/jsapi';

import styles from './index.css';

function toRotationTransform(orientation) {
  return {
    display: 'inline-block',
    fontSize: '24px',
    transform: `rotateZ(${orientation.z}deg)`,
  };
}

export default () => {
  const [loading, setLoading] = useState(true);
  const [vm, setVm] = useState(null);
  const [orientation, setorientation] = useState({ z: 0 });

  useEffect(() => {
    jsapi.load(['esri/widgets/Compass/CompassViewModel']).then(([CompassViewModel]) => {
      if (arcgis.isViewReady()) {
        const vm = new CompassViewModel({
          view: window.agsGlobal.view,
        });
        vm.watch('orientation', orientation => {
          setorientation(orientation);
        });
        setLoading(false);
        setVm(vm);
      } else {
        const timer = setInterval(() => {
          if (arcgis.isViewReady()) {
            clearInterval(timer);
            const vm = new CompassViewModel({
              view: window.agsGlobal.view,
            });
            vm.watch('orientation', orientation => {
              setorientation(orientation);
            });
            setLoading(false);
            setVm(vm);
          }
        }, 300);
      }
    });
  }, []);

  function reset() {
    if (!vm) {
      return;
    }

    vm.reset();
  }

  return (
    <div className={styles.wrap}>
      <span
        className={classnames({
          [styles.roundBtn]: true,
          disabled: loading,
        })}
        onMouseDown={reset}
      >
        {loading ? (
          <Icon type="loading" />
        ) : (
          <span className="esri-icon-compass" style={toRotationTransform(orientation)} />
        )}
      </span>
    </div>
  );
};
