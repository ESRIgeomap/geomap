/*
 * home 页面中的 地图 组件
 * author:dengd
 */

import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import styles from './index.less';

const Map = ({ dispatch }) => {
  useEffect(() => {
    const viewDiv = document.getElementById('statisticMap');
    dispatch({
      type: 'statisticPanel3D/initStatisticMap',
      payload: {
        container: viewDiv,
      },
    });
  }, []);

  return <div className={styles.map} id="statisticMap" />;
};

export default connect(({ statisticPanel3D }) => ({ statisticPanel3D }))(Map);
