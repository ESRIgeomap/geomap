import React, { useState } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import modifyDataSourceIcon from './modifyDataSource.png';
import modifyDataSourceIcon1 from './modifyDataSource1.png';
import ChangeDataSource from './ChangeDataSource/ChangeDataSource';
import styles from './index.css';

const ModifyDataSource = ({dispatch, agsmap}) => {
  // const [visible, setVisible] = useState(false);

  function btnOnClick() {
    // setVisible(!visible);
    if (agsmap.changeDataSourcePanelState) {
      dispatch({
        type: 'agsmap/changeDataSourcePanelChangeState',
        payload: false,
      });
    } else {
      dispatch({
        type: 'agsmap/changeDataSourcePanelChangeState',
        payload: true,
      });
    }
  }

  return (
    <React.Fragment>
      <Button onClick={btnOnClick} className={styles.btnStyle} style={{ backgroundColor: agsmap.changeDataSourcePanelState ? "#47b479" : "white" }}>
        <a className={styles.btnA} title="修改数据源">
          <img src={agsmap.changeDataSourcePanelState ? modifyDataSourceIcon : modifyDataSourceIcon1} alt="" className={styles.btnImg} />
        </a>
      </Button>
      <ChangeDataSource/>
    </React.Fragment>
  );
};

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(ModifyDataSource);