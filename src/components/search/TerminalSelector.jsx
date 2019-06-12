import React from 'react';
import { connect } from 'dva';
import { Icon, Input } from 'antd';

import revertSrc from './images/icon_往返.png';
import startSrc from './images/icon_circle_green.png';
import endSrc from './images/icon_circle_red.png';

import styles from './TerminalSelector.css';

/**
 * 起点与终点 - 选择器
 */
class TerminalSelector extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onStartInputChange=(evt)=> {
    this.props.dispatch({
      type: 'search/updateStartText',
      payload: evt.target.value,
    });
    this.props.onStartInput(evt.target.value);
  }

  onEndInputChange=(evt) =>{
    this.props.dispatch({
      type: 'search/updateEndText',
      payload: evt.target.value,
    });
    this.props.onEndInput(evt.target.value);
  }

  onStartInputPressEnter=() =>{
    if (this.props.onStartInput) {
      this.props.onStartInput(this.props.search.starttext);
    }
  }

  onEndInputPressEnter=()=> {
    if (this.props.onEndInput) {
      this.props.onEndInput(this.props.search.endtext);
    }
  }

  render() {
    return (
      <div className={styles.box}>
        <div className={styles.searchbox}>
          <div className={styles.revertbox} onClick={this.props.onReverDir}>
            <img src={revertSrc} alt="" />
          </div>
          <div className={styles.inputbox}>
            <div
              className={styles.routeinputbox}
              style={{ borderBottom: '1px solid #ececec' }}
            >
              <img alt="" src={startSrc} className={styles.routeinputicon} />
              <Input
                className={styles.routeinput}
                placeholder={"输入起点"}
                value={this.props.search.starttext}
                onChange={this.onStartInputChange}
                onPressEnter={this.onStartInputPressEnter}
              />
              {this.props.search.startsearching ? (
                <Icon type="loading" />
              ) : null}
            </div>
            <div className={styles.routeinputbox}>
              <img alt="" src={endSrc} className={styles.routeinputicon} />
              <Input
                className={styles.routeinput}
                placeholder={"输入终点"}
                value={this.props.search.endtext}
                onChange={this.onEndInputChange}
                onPressEnter={this.onEndInputPressEnter}
              />
              {this.props.search.endsearching ? <Icon type="loading" /> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ search }) => {
  return {
    search,
  };
})(TerminalSelector);
