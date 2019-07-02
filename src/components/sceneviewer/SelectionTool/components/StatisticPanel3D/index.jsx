/**
 * 属性面板
 * @author  pensiveant
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Row, Col, Icon } from 'antd';

//引入子组件
import TypeClassifyChart from './components/typeClassifyChart';
import RemoveNumberChart from './components/removeNumberChart';
import TimeClassifyChart from './components/timeClassifyChart';
import FinishClassifyChart from './components/finishClassifyChart';
import Map from './components/map';

const StatisticPanel3D = ({ visible, closePanle }) => {
  /**
   * 关闭属性面板
   * @author pensiveant
   */
  function closeBtnOnClick() {
    closePanle();
  }

  return (
    <div
      className={styles.statisticPanel3D}
      style={{ display: visible ? 'flex' : 'none' }}
    >
      <div className={styles.close} onClick={closeBtnOnClick}>
        <Icon type="close" />
      </div>
      <div className={styles.removeNumberChart}>
        <RemoveNumberChart />
      </div>
      <div className={styles.timeClassifyChart}>
        <TimeClassifyChart />
      </div>
      <div className={styles.typeClassifyChart}>
        <TypeClassifyChart />
      </div>
      <div className={styles.mapContainer}>
        {/* 地图控件 */}
        <Map />
      </div>
      <div className={styles.finishClassifyChart}>
        <FinishClassifyChart />
      </div>
    </div>
  );
};

export default StatisticPanel3D;
