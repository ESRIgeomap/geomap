import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import * as jsapi from '../../../utils/jsapi';

import styles from './index.css';
/**
 * 放大缩小组件
 * @author  lee
 */

const Zoom = props => {
  const [vm, setVm] = useState(null);
  // 监听是否是最大zoom
  const [maxZoomed, setMaxZoomed] = useState(false);
  // 监听是否是最小zoom
  const [minZoomed, setMinZoomed] = useState(false);
  const [zoomVal, setZoomVal] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.agsGlobal.view) {
        clearInterval(timer);
        createWidget(window.agsGlobal.view);
      }
    }, 300);
  }, []);

  // 创建微件
  function createWidget(view) {
    jsapi
      .load(['esri/widgets/Zoom/ZoomViewModel', 'esri/core/watchUtils'])
      .then(([ZoomViewModel, watchUtils]) => {
        const vmstate = new ZoomViewModel();
        vmstate.view = view;
        setVm(vmstate);
        watchUtils.init(view, 'zoom', val => {
          setMaxZoomed(val === view.constraints.maxZoom);
          setMinZoomed(val === view.constraints.minZoom);
        });
      });
    watchZoom(view);
  }
  // 缩小功能
  function zoomIn() {
    if (!maxZoomed && vm && vm.zoomIn()) {
      vm.zoomIn();
    }
  }
  // 放大功能
  function zoomOut() {
    if (!minZoomed && vm && vm.zoomOut()) {
      vm.zoomOut();
    }
  }
  // 监听zoom变化
  function watchZoom(view) {
    setZoomVal(view.zoom);
    view.watch('zoom', newValue => {
      setZoomVal(Math.round(newValue));
    });
  }

  return (
    <div {...props}>
      <a className={styles.zoomBtn} onClick={zoomIn} disabled={maxZoomed}>
        <Icon type="plus" className={styles.iconstyle} />
      </a>
      <br />
      <a className={styles.zoomBtnbottom} onClick={zoomOut} disabled={minZoomed}>
        <Icon type="minus" className={styles.iconstyle} />
      </a>
    </div>
  );
};

export default Zoom;
