/**
 * 单个资源Item子组件
 * @author  pensiveant
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import DataImg from './img/data.png';

const DataItem = ({ item, onlayerClick }) => {
  return (
    <div className={styles.dataItem} onClick={onlayerClick}>
      <div className={styles.map}>
        <img src={item.thumbnailUrl} alt={item.id} style={{ width: '100%', height: '100%' }} />
      </div>
      <p className={styles.title}>{item.title}</p>
      <p className={styles.type}>{item.type}</p>
      <p className={styles.modifyTime}>{item.modified}</p>
    </div>
  );
};

export default DataItem;
