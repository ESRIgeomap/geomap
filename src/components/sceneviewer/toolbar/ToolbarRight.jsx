import React from 'react';
import ModifyDataSource from '../ModifyDataSource/index';
import SearchBtn from '../SearchBtn/index';
import styles from './ToolbarRight.css';

const ToolbarRight = () => {
  return (
    <div className={styles['toolbar-right']}>
      {/* 修改数据源 */}
      <ModifyDataSource />
      {/* 搜索 */}
      <SearchBtn />
    </div>
  );
};

export default ToolbarRight;
