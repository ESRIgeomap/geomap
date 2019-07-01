import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';

import Toolbar3D from '../../components/toolbar/Toolbar3D';
import ToolbarLeft from '../../components/sceneviewer/toolbar/ToolbarLeft';
//加载日照分析组件
import LightshadowList from '../../components/Lightshadow';

import { INIT_WEBSCENE } from '../../constants/action-types';
import styles from './index.css';

import RightContent from '../../components/content/RightContent';

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
          <ToolbarLeft />
          <LightshadowList />
        </div>
      </div>
    );
  }
}

export default connect(({ agsmap }) => ({ agsmap }))(IndexPage);
