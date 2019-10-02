import React from 'react';
import ModifyDataSource from '../ModifyDataSource/index';
import BaseMap from '../BaseMap/index';
import Layerlist from '../Layerlist/index';
import LightShadow from '../LightShadow/index';
import Measure3Dbutton from '../Measure3Dbutton/index';
import styles from './ToolbarRight.css';

const ToolbarRight = () => {
  return (
    <div className={styles['toolbar-right']}>
      {/* 修改数据源 */}
      <ModifyDataSource />
      {/* 图层列表 */}
      <Layerlist />
      {/* 底图切换 */}
      <BaseMap />
      {/* 光照阴影 */}
      <LightShadow />
      {/* 三维分析 */}
      <Measure3Dbutton />
    </div>
  );
};

export default ToolbarRight;
