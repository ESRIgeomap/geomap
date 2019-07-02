import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import * as mapUtils from '../../../utils/arcgis/map/mapviewUtil';
import styles from './index.less';

const BaseMapItem = ({ dispatch, agsmap, data, key }) => {
  const [itemid, stateitemid] = useState(null);
  const view = window.agsGlobal.view;

  useEffect(() => {
    stateitemid(data.itemId);
  }, []);

  function switchBaseMap(e) {
    const activeMap = e.target.getAttribute('activemap');
    dispatch({
      type: 'agsmap/switchBaseMap',
      payload: activeMap,
    });
    console.log(itemid)
    mapUtils.switchBaseMapByWebmapId(view, itemid);
    dispatch({
      type: 'agsmap/menusChangeState',
      payload: false,
    });
  }

  return (
    <div
      className={`${styles.mapitem} ${
        data.itemId === agsmap.activeMapItemid ? styles.active : ''
      }`}
      title={data.title}
      onClick={switchBaseMap}
    >
      <img
        activemap={data.itemId}
        className={styles.mapIcon}
        src={data.icon}
      />
    </div>
  );
};

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(BaseMapItem);
