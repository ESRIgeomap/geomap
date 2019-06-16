import React, { useState } from 'react';
import styles from './index.less';
import defautBmap from './img/map.png';
import BaseMapPanel from './baseMapPanel/';

const BaseMap = () => {
  const [bmapPanelVisible, setBmapPanelVisible] = useState(false);
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
