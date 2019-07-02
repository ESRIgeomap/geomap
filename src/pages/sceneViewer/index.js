import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';

import ToolbarLeft from '../../components/sceneviewer/toolbar/ToolbarLeft';
import ToolbarRight from '../../components/sceneviewer/toolbar/ToolbarRight';

import { INIT_WEBSCENE } from '../../constants/action-types';
import styles from './index.css';

import RightContent from '../../components/content/RightContent';

// wangxd:修改数据源模块
import ChangeDataSource from '../../components/ChangeDataSource/ChangeDataSource';

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
          <ToolbarLeft />
          <ChangeDataSource />
          <ToolbarRight />
        </div>
      </div>
    );
  }
}

export default connect(({ agsmap }) => ({ agsmap }))(IndexPage);
