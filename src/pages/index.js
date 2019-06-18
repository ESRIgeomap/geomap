import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';

import GeoSearch from '../components/search/GeoSearch';
import Trans3D from '../components/trans3d/';

import Toolbar2D from '../components/toolbar/Toolbar2D';
import ToolbarSplit from '../components/toolbar/ToolbarSplit';
import Toolbar3D from '../components/toolbar/Toolbar3D';
import Bookmark from '../components/bookmark';
import MapcorrectList from '../components/mapcorrect/MapcorrectList';
//加载日照分析组件
import LightshadowList from '../components/Lightshadow';

import Zoom from '../components/zoom/';
import Compass from '../components/compass';
import ViewInfo from '../components/viewInfo/';
import TimerSlider from '../components/timesliderlayer/TimeSilderLayer';

import { VIEW_MODE_2D } from '../constants/action-types';
import styles from './index.css';


//pensiveant:加载LayerList组件
import LayerList from '../components/layerTree';
//pensiveant:加载疑点标绘PoltPanel组件
import PoltPanel from '../components/plot';

import SplitLayerList from '../components/layerList/SplitLayerList';

import RightContent from '../components/content/RightContent';
//卷帘对比模块加载
import RollerBlind from '../components/RollerBlind/';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rightMaxHeight: undefined,
    };
    this.exitRoller = this.exitRoller.bind(this);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'agsmap/init',
      payload: {
        container: this.viewDiv,
        viewMode: this.props.agsmap.mode,
      },
    });
  }

  renderMapUIWidgets() {
    // 这里可以考虑通过config.js来配置
    // 类似MapViewer初始化ui.components数组
    if (this.props.agsmap.mode === VIEW_MODE_2D) {
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
        <ViewInfo key="ui-component-viewinfo" view={_.get(window.agsGlobal, 'view') && _.get(window.agsGlobal, 'view').type} />,
      ];
    }

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
    ];
  }

  exitRoller() {
    this.props.dispatch({
      type: 'agsmap/rollscreenChangeState',
      payload: false,
    });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div ref={node => (this.viewDiv = node)} className={styles.viewDiv}>
          <Toolbar2D />
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
          <Trans3D />
          <Bookmark />
          <MapcorrectList />
          <LightshadowList />
          <TimerSlider />
          {this.renderMapUIWidgets()}
        </div>
        <GeoSearch />
        {/*分屏对比dom*/}
        <div
          id="splitscreenDom"
          className={styles.viewsplitDiv}
          style={{
            display: this.props.agsmap.splitflags ? 'block' : 'none',
          }}
        >
          <ToolbarSplit />
        </div>
        <Button
          className={styles.exitroll}
          style={{
            display: this.props.agsmap.rollerflags ? 'block' : 'none',
          }}
          onClick={this.exitRoller}
        >
          退出卷帘
        </Button>
        <RollerBlind/>
        <LayerList />
        <PoltPanel />
        <SplitLayerList />
      </div>
    );
  }
}

export default connect(({ agsmap }) => ({ agsmap }))(IndexPage);
