import React from 'react';
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

import {
  ACTION_MEASURE_LINE_3D,
  ACTION_MEASURE_AREA_3D,
  ACTION_MAP_PAN,
  ACTION_MAP_ROTATE,
  ACTION_MAP_OVERVIEW,
  ACTION_MAP_ROAM,
  VIEW_MODE_2D,
  ACTION_MAP_PRINT_3D,
} from '../../constants/action-types';

import styles from './Toolbar3D.css';

const ButtonGroup = Button.Group;

class Toolbar3D extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleovermap: true,
    };
    this.measure3DLine = this.measure3DLine.bind(this);
    this.measure3DArea = this.measure3DArea.bind(this);
    this.mapPan = this.mapPan.bind(this);
    this.mapRotate = this.mapRotate.bind(this);
    this.overviewmap = this.overviewmap.bind(this);
    this.mapRoam = this.mapRoam.bind(this);
    this.sunShine = this.sunShine.bind(this);
    this.windowPrint = this.windowPrint.bind(this);
  }
  componentDidMount() {}

  measure3DLine(e) {
    e.stopPropagation();
    this.props.dispatch({
      type: ACTION_MEASURE_LINE_3D,
    });
  }

  /**
   * 面积测量回调
   * author:pensiveant
   * @param {*} e 
   */
  measure3DArea(e) {
    e.stopPropagation();
    this.props.dispatch({
      type: ACTION_MEASURE_AREA_3D,
    });
  }

  mapPan(e) {
    e.stopPropagation();
    this.props.dispatch({
      type: ACTION_MAP_PAN,
    });
  }

  mapRotate(e) {
    e.stopPropagation();
    this.props.dispatch({
      type: ACTION_MAP_ROTATE,
    });
  }
  mapRoam(e) {
    e.stopPropagation();
    this.props.dispatch({
      type: ACTION_MAP_ROAM,
    });
  }
  // 控制是否显示鹰眼
  overviewmap(e) {
    e.stopPropagation();
    console.log(this.state.visibleovermap);
    this.setState({
      visibleovermap: !this.state.visibleovermap,
    });
    this.props.dispatch({
      type: ACTION_MAP_OVERVIEW,
      payload: this.state.visibleovermap,
    });
  }

  /**
   * 日照分析回调
   * author:pensiveant
   */
  sunShine() {
    if (!this.props.Lightshadow.lightshadowlistflags) {
      this.props.dispatch({
        type: 'Lightshadow/listChangeState',
        payload: {
          prolistflags: false,
          progralistflags: false,
          controllistflags: false,
          lightshadowlistflags: true,
        },
      });
    } else {
      this.props.dispatch({
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

  /**
   * 导出底图
   * author:pensiveant
   */
  windowPrint() {
    this.props.dispatch({
      type: ACTION_MAP_PRINT_3D,
    });
  }
  
  render() {
    return (
      <div
        className={styles.toolbar}
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? 'none' : 'block',
        }}
      >
        <ButtonGroup className={styles.buttonGroup}>
          <Button onClick={this.mapPan} className={styles.btnStyle}>
            <a className={styles.btnA} title="地图移动">
              <img src={panMapIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
          <Button onClick={this.mapRotate} className={styles.btnStyle}>
            <a className={styles.btnA} title="环绕旋转">
              <img src={surroundRoamIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
          <Button className={styles.btnStyle}>
            <a className={styles.btnA} title="搜索">
              <img src={searchIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
          <Button onClick={this.mapRoam} className={styles.btnStyle}>
            <a className={styles.btnA} title="环绕漫游">
              <img src={surroundRoamIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
          <Button onClick={this.overviewmap} className={styles.btnStyle}>
            <a className={styles.btnA} title="鹰眼">
              <img src={yuYanIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
          <Button onClick={this.measure3DLine} className={styles.btnStyle}>
            <a className={styles.btnA} title="三维测量">
              <img src={measurement3DIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
          <Button onClick={this.measure3DArea} className={styles.btnStyle}>
            <a className={styles.btnA} title="面积测量">
              <img src={measurement2DIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
          <Button onClick={this.windowPrint} className={styles.btnStyle}>
            <a className={styles.btnA} title="导出地图">
              <img src={exportImageIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
          <Button onClick={this.sunShine} className={styles.btnStyle}>
            <a className={styles.btnA} title="光照阴影">
              <img src={sunImageIcon} alt="" className={styles.btnImg} />
            </a>
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default connect(({ agsmap,Lightshadow }) => {
  return {
    agsmap,
    //日照分析
    Lightshadow,
  };
})(Toolbar3D);