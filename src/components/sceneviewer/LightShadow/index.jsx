import React, { useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import sunImageIcon from './rzfx.png';
import sunImageIcon1 from './rzfx1.png';
import LightShadowPanle from './components/lightShadowPanle/index';
import styles from './index.less';

const LightShadow = ({ dispatch }) => {
  const [visible, setVisible] = useState(false);

  // 按钮被点击
  function btnOnClick() {
    setVisible(!visible)
  }

  // 关掉面板
  function closePanle() {
    setVisible(false);
  }

  return (
    <React.Fragment>
      <Button onClick={btnOnClick} className={styles.btnStyle} style={{ backgroundColor: visible ? "#47b479" : "white" }}>
        <a className={styles.btnA} title="光照阴影">
          <img src={visible ? sunImageIcon1 : sunImageIcon} alt="" className={styles.btnImg} />
        </a>
      </Button>
      <LightShadowPanle visible={visible} closePanle={closePanle} />
    </React.Fragment>
  );
}

export default connect(() => {
  return {

  };
})(LightShadow);
