import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './WeatherEffects.css';
import rainImg from './images/暴雨.png';
import snowImg from './images/暴雪.png';
import rainAndSnowImg from './images/雨夹雪.png';
import sunnyDayImg from './images/晴天.png';

class WeatherEffectsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.visible4modelRoofEdit = false; // 用于屋顶纹理调整的面是否可见
    this.weatherEffectsPanelVisble = this.weatherEffectsPanelVisble.bind(this);
    this.layer4editModelVisible = this.layer4editModelVisible.bind(this);
    this.handleWeatherEffects = this.handleWeatherEffects.bind(this);
  }
  // scenelayer显隐或者threejs layer显隐
  layer4editModelVisible(e) {
    // scenelayer threejslayer
    const controlType = e.currentTarget.attributes.controlType.nodeValue;
    this.props.dispatch({
      type: 'agsmap/layer4editModelVisible',
      payload: controlType,
    });
  }
  // 天气特效 wangfh
  handleWeatherEffects(e) {
    const mySelf = this;
    // 天气特效的类型
    const weatherTypeParam = e.currentTarget.attributes.weatherType.nodeValue;
    // 执行天气特效操作
    mySelf.props.dispatch({
      type: 'agsmap/startHandleWeatherEffects',
      payload: {
        weatherType: weatherTypeParam,
        weatherValue: [1],
      },
    });
  }

  weatherEffectsPanelVisble() {
    this.props.dispatch({
      type: 'agsmap/weatherEffectsPanelChangeState',
      payload: false,
    });
  }

  render() {
    return (
      <div
        className={styles.modlediv}
        style={{
          display: this.props.agsmap.weatherEffectsPanelState
            ? 'block'
            : 'none',
        }}
      >
        <div className={styles.listdiv}>
          <p className={styles.ptitle}>
            <span className={styles.spanLeft}> 天气特效</span>
            <span
              className={styles.spantitle}
              onClick={this.weatherEffectsPanelVisble}
            >
              ×
            </span>
          </p>
          <div>
            <div className={styles.choosebuilddivdiv}>
              <p className={styles.choosebuildP}>
                <div
                  className={styles.spanLeft}
                  weatherType="rain"
                  onClick={this.handleWeatherEffects}
                >
                  <img
                    src={rainImg}
                    alt="img"
                    className={styles.btnImg4panel}
                  />
                  <span className={styles.span4panel}>雨</span>
                </div>

                <div
                  className={styles.spanLeft}
                  weatherType="snow"
                  onClick={this.handleWeatherEffects}
                >
                  <img
                    src={snowImg}
                    alt="img"
                    className={styles.btnImg4panel}
                  />
                  <span className={styles.span4panel}>雪</span>
                </div>
                <div
                  className={styles.spanLeft}
                  weatherType="rainAndSnow"
                  onClick={this.handleWeatherEffects}
                >
                  <img
                    src={rainAndSnowImg}
                    alt="img"
                    className={styles.btnImg4panel}
                  />
                  <span className={styles.span4panel}>雨+雪</span>
                </div>
                <div
                  className={styles.spanLeft}
                  weatherType="sunnyDay"
                  onClick={this.handleWeatherEffects}
                >
                  <img
                    src={sunnyDayImg}
                    alt="img"
                    className={styles.btnImg4panel}
                  />
                  <span className={styles.span4panel}>晴</span>
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(WeatherEffectsPanel);
