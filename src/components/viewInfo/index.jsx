import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import styles from './index.css';

const ViewInfo = props => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [scale, setScale] = useState('');
  const [lod, setLod] = useState('');

  useEffect(() => {
    if (props.view) {
      loadViewInfo(props.view);
    }
  });

  function loadViewInfo(view) {
    view.when(view => {
      setLod(parseInt(view.zoom));
      setScale(parseInt(view.scale));
      view.watch('zoom', () => {
        setLod(parseInt(view.zoom));
        setScale(parseInt(view.scale));
      });

      view.on(
        'pointer-move',
        _.throttle(event => {
          // 将屏幕点坐标转化为map点坐标
          const point = view.toMap({ x: event.x, y: event.y });
          const lng = (point.x / 20037508.34) * 180;
          const mmy = (point.y / 20037508.34) * 180;
          const lat =
            (180 / Math.PI) * (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2);
          setLatitude(Math.round(lat * 100) / 100);
          setLongitude(Math.round(lng * 100) / 100);
        }, 100)
      );
    });
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <span>
          <span>
            经度：
            <span id="showspan2">{longitude}</span>
          </span>
          <span>
            纬度：
            <span id="showspan1">{latitude}</span>
          </span>
        </span>
        <span className={styles.leftarrow} />
      </div>
      <div className={styles.right}>
        <span className={styles.rightarrow} />
        <span>
          <span>
            比例尺：
            <span id="showspan2">{scale}</span>
          </span>
          <span>
            LOD：
            <span id="showspan1">{lod}</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default ViewInfo;
