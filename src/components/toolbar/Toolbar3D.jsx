import React, { useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import panMapIcon from './images/移动.png';
import searchIcon from './images/手指.png';
import surroundRoamIcon from './images/旋转.png';
import yuYanIcon from './images/鱼眼.png';
import measurement3DIcon from './images/量高.png';
import measurement2DIcon from './images/量面.png';
import exportImageIcon from './images/导图.png';
import sunImageIcon from './images/光照.jpg';
import weatherEffectIcon from './images/天气特效.png';
import * as sceneviewUtils from '../../utils/arcgis/map/sceneviewUtil';

import {
  ACTION_MAP_OVERVIEW,
  VIEW_MODE_2D,
  ACTION_MAP_PRINT_3D,
} from '../../constants/action-types';

import styles from './Toolbar3D.less';

const ButtonGroup = Button.Group;

const Toolbar3D = ({ agsmap, Lightshadow, toolbar, dispatch }) => {

  const [state, setState] = useState(true);


  /**
   * 3D【平移功能】回调
   * author:
   * @param {*} e
   */
  const mapPan = (e) => {
    e.stopPropagation();
    sceneviewUtils.changeToggle(window.agsGlobal.view, 'pan');
  }

   /**
   * 3D【环绕旋转】回调
   * author:
   * @param {*} e
   */
  const mapRotate = (e) => {
    e.stopPropagation();
    sceneviewUtils.changeToggle(window.agsGlobal.view, 'rotate');
  }

   /**
   * 3D【环绕漫游】回调
   * author:
   * @param {*} e
   */
  const mapRoam = (e) => {
    e.stopPropagation();
    sceneviewUtils.surroundRoam(window.agsGlobal.view);
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
      style={{
        display: agsmap.mode === VIEW_MODE_2D ? 'none' : 'block',
      }}
    >
      <ButtonGroup className={styles.buttonGroup}>
        <Button onClick={mapPan} className={styles.btnStyle}>
          <a className={styles.btnA} title="地图移动">
            <img src={panMapIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
        <Button onClick={mapRotate} className={styles.btnStyle}>
          <a className={styles.btnA} title="环绕旋转">
            <img src={surroundRoamIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
        <Button className={styles.btnStyle}>
          <a className={styles.btnA} title="搜索">
            <img src={searchIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
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
        <Button onClick={measure3DLine} className={styles.btnStyle}>
          <a className={styles.btnA} title="三维测量">
            <img src={measurement3DIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
        <Button onClick={measure3DArea} className={styles.btnStyle}>
          <a className={styles.btnA} title="面积测量">
            <img src={measurement2DIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
        <Button onClick={windowPrint} className={styles.btnStyle}>
          <a className={styles.btnA} title="导出地图">
            <img src={exportImageIcon} alt="" className={styles.btnImg} />
          </a>
        </Button>
        <Button onClick={sunShine} className={styles.btnStyle}>
          <a className={styles.btnA} title="光照阴影">
            <img src={sunImageIcon} alt="" className={styles.btnImg} />
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
