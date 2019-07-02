import React, { useState } from 'react';
import { Button } from 'antd';
import modifyDataSourceIcon from './modifyDataSource.png';
import modifyDataSourceIcon1 from './modifyDataSource1.png';
import ModifyDataSourcePanle from './ModifyDataSourcePanle/index';
import styles from './index.css';

const ModifyDataSource = () => {
  const [visible, setVisible] = useState(false);

  function btnOnClick() {
    setVisible(!visible);
  }

  function closeModifyDataSourcePanle() {
    setVisible(false);
  }

  return (
    <React.Fragment>
      <Button onClick={btnOnClick} className={styles.btnStyle} style={{ backgroundColor: visible ? "#47b479" : "white" }}>
        <a className={styles.btnA} title="修改数据源">
          <img src={visible ? modifyDataSourceIcon : modifyDataSourceIcon1} alt="" className={styles.btnImg} />
        </a>
      </Button>
      <ModifyDataSourcePanle visible={visible} closeModifyDataSourcePanle={closeModifyDataSourcePanle} />
    </React.Fragment>
  );
};

export default ModifyDataSource;
