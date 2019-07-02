import React, { useState } from 'react';
import { Button } from 'antd';
import kuangxuan from './dwxz.png';
import kuangxuan1 from './dwxz1.png';
import StatisticPanle3D from './components/StatisticPanel3D/index';
import styles from './index.less';

const SelectionTool = () => {
  const [visible, setVisible] = useState(false);

  // 按钮被点击
  function btnOnClick() {
    setVisible(!visible);
  }

  // 关掉面板
  function closePanle() {
    setVisible(false);
  }

  return (
    <React.Fragment>
      <Button onClick={btnOnClick} className={styles.btnStyle} style={{ backgroundColor: visible ? "#47b479" : "white" }}>
        <a className={styles.btnA} title="框选">
          <img src={visible ? kuangxuan1 : kuangxuan} alt="" className={styles.btnImg} />
        </a>
      </Button>
      <StatisticPanle3D visible={visible} closePanle={closePanle}/>
    </React.Fragment>
  );
};

export default SelectionTool;
