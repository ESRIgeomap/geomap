import React from 'react';
import ModifyDataSource from '../ModifyDataSource/index';
import styles from './ToolbarRight.css';

const ToolbarRight = () => {
  return (
    <div className={styles['toolbar-right']}>
      <ModifyDataSource />
    </div>
  );
};

export default ToolbarRight;
