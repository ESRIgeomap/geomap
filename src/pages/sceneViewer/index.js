import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';

import Toolbar3D from '../../components/toolbar/Toolbar3D';
//加载日照分析组件
import LightshadowList from '../../components/Lightshadow';

import Zoom from '../../components/zoom';
import Compass from '../../components/compass';

import { INIT_WEBSCENE } from '../../constants/action-types';
import styles from './index.css';


import RightContent from '../../components/content/RightContent';
// 天气特效
import WeatherEffectsPanel from '../../components/WeatherEffects/WeatherEffectsPanel';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rightMaxHeight: undefined,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: INIT_WEBSCENE,
      payload: {
        container: this.viewDiv,
      },
    });
  }

  renderMapUIWidgets() {
    // 3D
    return [
      <Zoom
        key="ui-component-zoom"
        view={_.get(window.agsGlobal, 'view') && _.get(window.agsGlobal, 'view').type}
        className={styles.componentZoom}
      />,
      <Compass
        key="ui-component-compass"
        view={_.get(window.agsGlobal, 'view') && _.get(window.agsGlobal, 'view').type}
        className={styles.componentCompass}
      />,
      <WeatherEffectsPanel />
    ];
  }


  render() {
    return (
      <div className={styles.wrapper}>
        <div ref={node => (this.viewDiv = node)} className={styles.viewDiv}>
          <div className={styles.mapRightWrap} ref={node => (this.rightRef = node)}>
            <RightContent maxHeight={this.state.rightMaxHeight} />
            <ReactResizeDetector
              handleHeight
              handleWidth
              onResize={(width, height) => this.setState({ rightMaxHeight: height })}
              targetDomEl={this.rightRef}
            />
          </div>
          <Toolbar3D />
          <LightshadowList />
          {this.renderMapUIWidgets()}
        </div>
      </div>
    );
  }
}

export default connect(({ agsmap }) => ({ agsmap }))(IndexPage);
