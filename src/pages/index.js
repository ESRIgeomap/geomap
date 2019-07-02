import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
// 二维查询组件
import GeoSearch from '../components/search/GeoSearch';
// 二三维切换组件
import Trans3D from '../components/trans3d/';
// 二维工具条组件
import Toolbar2D from '../components/toolbar/Toolbar2D';
// 初始化二维地图功能 
import { INIT_MAP } from '../constants/action-types';
// 二维放大缩小微件
import Zoom from '../components/mapviewer/zoom';
// 二维罗盘微件
import Compass from '../components/mapviewer/compass';
// 二维场景组件（经纬度、比例如等）
import ViewInfo from '../components/mapviewer/viewInfo';
// 二维底图组件
import Basemap from '../components/mapviewer/basemap';
// 二维时间滑块组件
import TimerSlider from '../components/timesliderlayer/TimeSilderLayer';
// 二维书签组件
import Bookmark from '../components/mapviewer/bookmark';
// 二维图层列表组件
import LayerList from '../components/layerTree';
// 二维疑点标绘组件
import PoltPanel from '../components/plot';
// 二维分屏对比图层列表组件
import SplitLayerList from '../components/layerList/SplitLayerList';
// 二维内容组件（打印、截屏等组件的包容器）
import RightContent from '../components/content/RightContent';
// 二维卷帘对比组件
import RollerBlind from '../components/RollerBlind/';
// 二维分屏对比组件
import SplitScreen from '../components/SplitScreen/';

import styles from './index.css';

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
      type: INIT_MAP,
      payload: {
        container: this.viewDiv,
      },
    });
  }

  renderMapUIWidgets() {
    // 这里可以考虑通过config.js来配置
    // 类似MapViewer初始化ui.components数组
    return [
      <Zoom
        key="ui-component-zoom"
        className={styles.componentZoom}
      />,
      <Compass
        key="ui-component-compass"
        className={styles.componentCompass}
      />,
      <ViewInfo
        key="ui-component-viewinfo"
      />,
      <Basemap
        key="ui-component-basemap"
        className={styles.componentBasemap}
      />
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
          <Trans3D />
          <Bookmark />
          <TimerSlider />
          {this.renderMapUIWidgets()}
        </div>
        <GeoSearch />
        <SplitScreen />
        <Button className={styles.exitroll} style={{ display: this.props.agsmap.rollerflags ? 'block' : 'none', }}
          onClick={this.exitRoller}
        >
          退出卷帘
        </Button>
        <RollerBlind />
        <LayerList />
        <PoltPanel />
        <SplitLayerList />
      </div>
    );
  }
}

export default connect(({ agsmap }) => ({ agsmap }))(IndexPage);
