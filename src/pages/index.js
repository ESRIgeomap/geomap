import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';

import GeoSearch from '../components/search/GeoSearch';
import Trans3D from '../components/trans3d/Trans3D';

import Toolbar2D from '../components/toolbar/Toolbar2D';
import ToolbarSplit from '../components/toolbar/ToolbarSplit';
import Toolbar3D from '../components/toolbar/Toolbar3D';
import Bookmark from '../components/bookmark/Bookmark';
import MapcorrectList from '../components/mapcorrect/MapcorrectList';
//加载日照分析组件
import LightshadowList from '../components/Lightshadow';

import Zoom from '../components/zoom/';
import Compass from '../components/compass/Compass';
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

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rightMaxHeight: undefined,
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.MouseDown = this.MouseDown.bind(this);
    this.MouseUp = this.MouseUp.bind(this);
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
        // <Zoom
        //   key="ui-component-zoom"
        //   view={_.get(window.agsGlobal, 'view')}
        //   className={styles.componentZoom}
        // />,
        <Compass
          key="ui-component-compass"
          view={_.get(window.agsGlobal, 'view')}
          className={styles.componentCompass}
        />,
        <ViewInfo key="ui-component-viewinfo" view={_.get(window.agsGlobal, 'view')} />,
      ];
    }

    // 3D
    return [
      // <Zoom
      //   key="ui-component-zoom"
      //   view={_.get(window.agsGlobal, 'view')}
      //   className={styles.componentZoom}
      // />,
      <Compass
        key="ui-component-compass"
        view={_.get(window.agsGlobal, 'view')}
        className={styles.componentCompass}
      />,
    ];
  }

  handleMouseDown(e) {
    //onMouseDown
    const TDrag = this.refs.lineTmove;
    const Drag = this.refs.linemove;
    const Spdom = this.refs.splitsDom;
    const ev = event || window.event;
    event.stopPropagation();
    const disX = ev.clientX - Drag.offsetLeft;
    TDrag.style.top = 0;
    TDrag.style.left = 0;
    // const disY = ev.clientY - Drag.offsetTop;
    document.onmousemove = function(event) {
      const ev = event || window.event;
      Drag.style.left = ev.clientX - disX + 'px';
      // Drag.style.top = ev.clientY - disY + 'px';
      Drag.style.cursor = 'move';
      Spdom.style.clip = 'rect(0px, ' + ev.clientX + 'px' + ', 1000px , 0px)';
    };
  }
  handleMouseUp(e) {
    e.preventDefault();
    document.onmousemove = null;
    const Drag = this.refs.linemove;
    Drag.style.cursor = 'default';
  }
  MouseDown(e) {
    //onMouseDown
    const TDrag = this.refs.lineTmove;
    const Drag = this.refs.linemove;
    const Spdom = this.refs.splitsDom;
    const ev = event || window.event;
    event.stopPropagation();
    //  const disX = ev.clientX - TDrag.offsetLeft;
    const disY = ev.clientY - TDrag.offsetTop;
    Drag.style.top = 0;
    Drag.style.left = 0;
    document.onmousemove = function(event) {
      const ev = event || window.event;
      //  TDrag.style.left = ev.clientX - disX + 'px';
      TDrag.style.top = ev.clientY - disY + 'px';
      TDrag.style.cursor = 'move';
      Spdom.style.clip = 'rect(0, 2000px,' + ev.clientY + 'px' + ' , 0px)';
    };
  }
  MouseUp(e) {
    e.preventDefault();
    document.onmousemove = null;
    const Drag = this.refs.lineTmove;
    Drag.style.cursor = 'default';
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
        {/*卷帘对比dom*/}
        <div
          id="rollerBlind"
          ref="splitsDom"
          className={styles.viewrollDiv}
          style={{
            display: this.props.agsmap.rollerflags ? 'block' : 'none',
          }}
        />
        {/*卷帘对比左侧红线dom*/}
        <div
          className={styles.leftslider}
          id="verticalSlider"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          ref="linemove"
          style={{
            display: this.props.agsmap.rollerflags ? 'block' : 'none',
          }}
        />
        {/*卷帘对比右侧红线dom*/}
        <div
          className={styles.topslider}
          id="verticalTSlider"
          onMouseDown={this.MouseDown}
          onMouseUp={this.MouseUp}
          ref="lineTmove"
          style={{
            display: this.props.agsmap.rollerflags ? 'block' : 'none',
          }}
        />
        <LayerList />
        {/*疑点标绘 */}
        <PoltPanel />
        <SplitLayerList />
        {/* <FullscreenButton/> */}
      </div>
    );
  }
}

export default connect(({ agsmap }) => ({ agsmap }))(IndexPage);
