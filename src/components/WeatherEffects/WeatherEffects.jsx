import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import styles from '../WebSceneDemo.css';
import WeatherEffectsIcon from '../../../assets/slider/天气特效01.png';
import WeatherEffectsIcons from '../../../assets/slider/天气特效02.png';
import {
  ACTION_CLEAN_SKLINE,
  ACTION_CLEAN_RENDEREDGES,
  ACTION_ON_GROUND,
} from '../../../constants/action-types';

class WeatherEffects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictureState: true,
    };
    this.weatherEffectsvisble = this.weatherEffectsvisble.bind(this);
    this.enterChange = this.enterChange.bind(this);
    this.leaveChange = this.leaveChange.bind(this);
  }

  weatherEffectsvisble() {
    if (this.props.webscenedemo.weatherEffectsPanelState) {
      // 关闭模型编辑面板，开启场景弹窗,和sightlinePanelChangeState 合并 20180801
      this.props.dispatch({
        type: 'webscenedemo/weatherEffectsPanelChangeState',
        payload: false,
      });
      this.props.dispatch({
        type: 'webscenedemo/handleWeatherEffects',
        payload: false,
      });
    } else {
      // 打开模型编辑面板 start
      this.props.dispatch({
        type: 'webscenedemo/weatherEffectsPanelChangeState',
        payload: true,
      });
      this.props.dispatch({
        type: 'webscenedemo/handleWeatherEffects',
        payload: true,
      });
      // 打开模型编辑面板 end
      // 关闭其他面板 start
      this.props.dispatch({
        type: ACTION_CLEAN_SKLINE,
      });
      this.props.dispatch({
        type: ACTION_CLEAN_RENDEREDGES,
      });
      // 关闭其他面板 end
      this.props.dispatch({
        type: ACTION_ON_GROUND,
      });
    }
  }
  enterChange() {
    this.setState({
      pictureState: false,
    });
  }

  leaveChange() {
    this.setState({
      pictureState: true,
    });
  }

  render() {
    return (
      <div style={{ position: 'absolute', left: '10px', top: '880px' }}>
        <Tooltip placement="right" title="天气特效(雨雪)">
          <a
            className={styles.btn}
            onClick={this.weatherEffectsvisble}
            onMouseEnter={this.enterChange}
            onMouseLeave={this.leaveChange}
          >
            <img
              src={this.state.pictureState ? WeatherEffectsIcon : WeatherEffectsIcons}
              alt=""
              className={styles.btnImg}
            />
          </a>
        </Tooltip>
      </div>
    );
  }
}

export default connect(({ webscenedemo }) => {
  return {
    webscenedemo,
  };
})(WeatherEffects);
