import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import classnames from 'classnames';
import arcgis from '../../../utils/arcgis';
import Zoom from '../zoom/';
import Compass from '../compass/index';
import Home from '../home';

import styles from './Toolbarleft.css';

const ToolbarLeft = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (arcgis.isViewReady()) {
      setLoading(false);
    } else {
      const timer = setInterval(() => {
        if (arcgis.isViewReady()) {
          clearInterval(timer);
          setLoading(false);
        }
      }, 300);
    }
  });

  /**
   * 3D【平移功能】回调
   * author:
   * @param {*} e
   */
  const mapPan = e => {
    e.stopPropagation();
    window.GeomapUtils.view.map3d.changeToggle(window.agsGlobal.view, 'pan');
  };

  /**
   * 3D【环绕旋转】回调
   * author:
   * @param {*} e
   */
  const mapRotate = e => {
    e.stopPropagation();
    window.GeomapUtils.view.map3d.changeToggle(window.agsGlobal.view, 'rotate');
  };

  return (
    <div className={styles.toolbar}>
      <Home />
      <Zoom />
      <div className={styles.wrap}>
        <span
          className={classnames({
            [styles.btn]: true,
            disabled: loading,
          })}
          onMouseDown={mapPan}
        >
          {loading ? <Icon type="loading" /> : <Icon type="drag" />}
        </span>
        <span
          className={classnames({
            [styles.btn]: true,
            disabled: loading,
          })}
          onMouseDown={mapRotate}
        >
          {loading ? <Icon type="loading" /> : <Icon type="redo" />}
        </span>
      </div>
      <Compass />
    </div>
  );
};

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(ToolbarLeft);
