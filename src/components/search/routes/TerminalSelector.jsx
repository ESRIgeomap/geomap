import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Icon, Input } from 'antd';

import revertSrc from '../images/icon_往返.png';
import startSrc from '../images/icon_circle_green.png';
import endSrc from '../images/icon_circle_red.png';

import styles from './TerminalSelector.css';

/**
 * 起点与终点 - 选择器
 */
const TerminalSelector = props => {

  function onStartInputChange (evt) {
    props.dispatch({
      type: 'search/updateStartText',
      payload: evt.target.value,
    });
    props.onStartInput(evt.target.value);
  }

  function onEndInputChange(evt){
    props.dispatch({
      type: 'search/updateEndText',
      payload: evt.target.value,
    });
    props.onEndInput(evt.target.value);
  }

  function onStartInputPressEnter(){
    if (props.onStartInput) {
      props.onStartInput(props.search.starttext);
    }
  }

  function onEndInputPressEnter() {
    if (props.onEndInput) {
      props.onEndInput(props.search.endtext);
    }
  }

    return (
      <div className={styles.box}>
        <div className={styles.searchbox}>
          <div className={styles.revertbox} onClick={props.onReverDir}>
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
                value={props.search.starttext}
                onChange={onStartInputChange}
                onPressEnter={onStartInputPressEnter}
              />
              {props.search.startsearching ? (
                <Icon type="loading" />
              ) : null}
            </div>
            <div className={styles.routeinputbox}>
              <img alt="" src={endSrc} className={styles.routeinputicon} />
              <Input
                className={styles.routeinput}
                placeholder={"输入终点"}
                value={props.search.endtext}
                onChange={onEndInputChange}
                onPressEnter={onEndInputPressEnter}
              />
              {props.search.endsearching ? <Icon type="loading" /> : null}
            </div>
          </div>
        </div>
      </div>
    );
}

export default connect(({ search }) => {
  return { search };
})(TerminalSelector);
