import { useState, useRef, useEffect } from 'react';
import { Icon } from 'antd';
import _ from 'lodash';
import CustomScroll from 'react-custom-scrollbars';

import styles from './index.css';

const ClosePanel = ({ title, onClose, children, maxHeight }) => {
  return (
    <div className={styles.panelWrap}>
      <div className={styles.panelHead}>
        <span>{title}</span>
        <span
          onMouseDown={() => {
            if (_.isFunction(onClose)) {
              onClose();
            }
          }}
        >
          <Icon type="close" />
        </span>
      </div>
      <div className={styles.panelContent}>
        <CustomScroll autoHeight autoHeightMin={0} autoHeightMax={maxHeight - 60}>
          {children}
        </CustomScroll>
      </div>
    </div>
  );
};

export default ClosePanel;
