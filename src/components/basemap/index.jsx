/**
 * 底图切换功能组件
 * @author  lee  
 */

import React, { useState } from 'react';
import styles from './index.less';
import defautBmap from './img/map.png';
import BaseMapPanel from './baseMapPanel/';

const BaseMap = () => {
  // bmapPanelVisible 控制是否显示底图选择框
  const [bmapPanelVisible, setBmapPanelVisible] = useState(false);
  // activeBmapIcon 控制底图显示的图片
  const [activeBmapIcon, setActiveBmapIcon] = useState(defautBmap);

  return (
    <div className={styles.wrap} title="切换底图">
      <img src={activeBmapIcon} onClick={() => setBmapPanelVisible(!bmapPanelVisible)} />
      <BaseMapPanel
        show={bmapPanelVisible}
        setBmapIcon={mapIcon => setActiveBmapIcon(mapIcon)}
        hide={() => setBmapPanelVisible(false)}
      />
    </div>
  );
};

export default BaseMap;
