/**
 * 统计面板组件
 * @author  pensiveant
 */
import React, { useState } from 'react';
import { connect } from 'dva';
import styles from './index.css';
import { InputNumber, Row, Col, Button } from 'antd';
import SearchResultPanle from '../SearchResultPanle/index';

const SearchBar = ({ visible }) => {
  const [searchResultVisible, setSearchResultVisible] = useState(false);

  // 显示查询结果
  function showQueryResult() {
    setSearchResultVisible(true);
  }

  // 关闭查询结果面板
  function closeSearchResultPanle() {
    setSearchResultVisible(false);
  }

  return (
    <React.Fragment>
      <div className={styles.query3D} style={{ display: visible ? 'block' : 'none' }}>
        <Button className={styles.setTime}>设为当前时间</Button>

        <div className={styles.timeContainer}>
          <InputNumber min={2018} max={1000000} defaultValue={3} className={styles.time} />
          <span className={styles.timeWords}>年</span>
        </div>

        <div className={styles.timeContainer}>
          <InputNumber min={1} max={12} defaultValue={3} className={styles.time} />
          <span className={styles.timeWords}>月</span>
        </div>

        <div className={styles.timeContainer}>
          <InputNumber min={1} max={31} defaultValue={3} className={styles.time} />
          <span className={styles.timeWords}>日</span>
        </div>

        <div className={styles.timeContainer}>
          <InputNumber min={1} max={24} defaultValue={3} className={styles.time} />
          <span className={styles.timeWords}>时</span>
        </div>

        <div className={styles.timeContainer}>
          {' '}
          <InputNumber min={1} max={60} defaultValue={3} className={styles.time} />
          <span className={styles.timeWords}>分</span>
        </div>

        <Button className={`${styles.query} ${styles.blackBtn}`} onClick={showQueryResult}>
          查询
        </Button>
        <Button className={`${styles.reset} ${styles.blackBtn}`}>还原</Button>
      </div>
      {/* 查询结果面板 */}
      <SearchResultPanle visible={searchResultVisible} closeSearchResultPanle={closeSearchResultPanle}/>
    </React.Fragment>
  );
};

export default SearchBar;
