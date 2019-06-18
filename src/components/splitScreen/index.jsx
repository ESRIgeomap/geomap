import React, { Component, useState, useRef } from 'react';
import { connect } from 'dva';
import ToolbarSplit from '../toolbar/ToolbarSplit';

import styles from './index.css';
/**
 * 分屏对比组件
 * @author  wangxd
 */

const SplitScreen = ({ agsmap }) => {
  return (
      <div
        id="splitscreenDom"
        className={styles.viewsplitDiv}
        style={{
          display: agsmap.splitflags ? 'block' : 'none',
        }}
      >
        <ToolbarSplit />
      </div>
  );
};

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(SplitScreen);
