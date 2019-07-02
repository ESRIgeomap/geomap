import React, { useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import sunImageIcon from './rzfx.png';
import sunImageIcon1 from './rzfx1.png';
import LightShadowPanle from './components/lightShadowPanle/index';
import styles from './index.less';

const LightShadow = ({ Lightshadow, dispatch }) => {
  const [visible, setVisible] = useState(false);

  // 按钮被点击
  function btnOnClick() {
    if (!Lightshadow.lightshadowlistflags) {
      dispatch({
        type: 'Lightshadow/listChangeState',
        payload: {
          prolistflags: false,
          progralistflags: false,
          controllistflags: false,
          lightshadowlistflags: true,
        },
      });
    } else {
      dispatch({
        type: 'Lightshadow/listChangeState',
        payload: {
          prolistflags: false,
          progralistflags: false,
          controllistflags: false,
          lightshadowlistflags: false,
        },
      });
    }
  }

  return (
    <React.Fragment>
      <Button onClick={btnOnClick} className={styles.btnStyle} style={{ backgroundColor: Lightshadow.lightshadowlistflags ? "#47b479" : "white" }}>
        <a className={styles.btnA} title="光照阴影">
          <img src={Lightshadow.lightshadowlistflags ? sunImageIcon1 : sunImageIcon} alt="" className={styles.btnImg} />
        </a>
      </Button>
      <LightShadowPanle />
    </React.Fragment>
  );
}

export default connect(({ Lightshadow }) => {
  return {
    // 日照分析
    Lightshadow,
  };
})(LightShadow);
