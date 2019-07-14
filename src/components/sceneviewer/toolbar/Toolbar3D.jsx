import React, { useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import searchIcon from './images/手指.png';
import surroundRoamIcon from './images/旋转.png';
import yuYanIcon from './images/鱼眼.png';
import measurement3DIcon from './images/量高.png';
import measurement2DIcon from './images/量面.png';
import exportImageIcon from './images/导图.png';
import sunImageIcon from './images/光照.jpg';
import weatherEffectIcon from './images/天气特效.png';

import {
  ACTION_MAP_OVERVIEW,
} from '../../../constants/action-types';

import styles from './Toolbar3D.less';

const ButtonGroup = Button.Group;

const Toolbar3D = ({ viewmode,agsmap, Lightshadow,dispatch }) => {

  const [state, setState] = useState(true);

   /**
   * 3D【环绕漫游】回调
   * author:
   * @param {*} e
   */
  const mapRoam = (e) => {
    e.stopPropagation();
    window.GeomapUtils.view.map3d.surroundRoam(window.agsGlobal.view);
  }


   /**
   * 3D【鹰眼】回调
   * author:
   * @param {*} e
   */
  const overviewmap = (e) => {
    e.stopPropagation();
    setState({
      visibleovermap: !state.visibleovermap,
    });
    dispatch({
      type: ACTION_MAP_OVERVIEW,
      payload: state.visibleovermap,
    });
  }

  
  /**
   * 3D【三维测量】回调
   * author:
   * @param {*} e
   */
  const measure3DLine = (e) => {
    e.stopPropagation();
    dispatch({
      type: 'toolbar/updateCurrentView',
      payload: 'measure-line-3d',
    });
  }

  /**
   * 3D【面积测量】回调
   * author:pensiveant
   * @param {*} e
   */
  const measure3DArea = (e) => {
    e.stopPropagation();
    dispatch({
      type: 'toolbar/updateCurrentView',
      payload: 'measure-area-3d',
    });
  }

  /**
   * 天气场景模拟
   * author:lee
   */
    const changeWeatherEffect = () => {
      dispatch({
        type: 'agsmap/weatherEffectsPanelChangeState',
        payload: !agsmap.weatherEffectsPanelState,
  
      });
    }



  /**
   * 【导出底图】回调
   * author:pensiveant
   */
  const windowPrint = () => {
    dispatch({
      type: 'toolbar/updateCurrentView',
      payload: 'view-clip-map',
    });   
  }


  /**
   * 【光照阴影】回调
   * author:pensiveant
   */
  const sunShine = () => {
    dispatch({
      type: 'toolbar/updateCurrentView',
      payload: 'light-shadow-3d',
    });

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
    <div
      className={styles.toolbar}
    >
      <ButtonGroup className={styles.buttonGroup}>
        <Button onClick={mapRoam} className={styles.btnStyle}>
          <a className={styles.btnA} title="环绕漫游">
            <img src={surroundRoamIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
        <Button onClick={overviewmap} className={styles.btnStyle}>
          <a className={styles.btnA} title="鹰眼">
            <img src={yuYanIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
        <Button onClick={windowPrint} className={styles.btnStyle}>
          <a className={styles.btnA} title="导出地图">
            <img src={exportImageIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
        <Button onClick={changeWeatherEffect} className={styles.btnStyle}>
            <a className={styles.btnA} title="天气特效">
              <img src={weatherEffectIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
      </ButtonGroup>
    </div>
  );

}

export default connect(({ agsmap, Lightshadow, toolbar }) => {
  return {
    agsmap,
    //日照分析
    Lightshadow,
    toolbar,
  };
})(Toolbar3D);
