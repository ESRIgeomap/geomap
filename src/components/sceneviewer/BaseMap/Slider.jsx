import React, { useRef, useEffect, useState } from 'react';
import styles from './Slider.less';

const LINE_WIDTH = 220;

const Slider = ({ onChange, value }) => {
  const [isDraging, setIsDraging] = useState(false); // 正在拖动
  const [startX, setStartX] = useState(0); // 拖动开始坐标
  const [oldX, setOldX] = useState(0); // 旧的值
  const [left, setLeft] = useState(0); // 滑块坐标
  const [endX, setEndX] = useState(0); // 拖动结束坐标

  // 实时计算滑块位置
  useEffect(() => {
    let deltaX = oldX + endX - startX;
    if (deltaX > LINE_WIDTH) {
      deltaX = LINE_WIDTH;
    } else if (deltaX < 0) {
      deltaX = 0;
    }
    setLeft(deltaX);
    onChange((1 - deltaX / LINE_WIDTH) * 100);
  }, [endX]);

  // value值变化时重新设置滑块位置
  useEffect(() => {
    if (!isDraging) {
      setLeft(LINE_WIDTH * (1- (value / 100)));
      setOldX(LINE_WIDTH * (1- (value / 100)));
    }
  }, [value]);

  // 获取刻度
  function getScales() {
    let scales = [];
    for (let i = 0; i < 21; i += 1) {
      scales.push({
        left: i * (LINE_WIDTH / 20), // 距离左边距离
        height: i % 5 === 0 ? 5 : 2, // 刻度尺高度
      });
    }
    return scales.map(item => (
      <div
        className={styles.scale}
        key={item.left}
        style={{
          left: item.left + 'px',
          height: item.height + 'px',
        }}
      >
      </div>
    ));
  }

  // 获取数字
  function getNumber() {
    let numbers = [];
    for (let i = 0; i < 5; i += 1) {
      numbers.push({
        left: i * (LINE_WIDTH / 4), // 距离左边距离
        number: i * 25,
        ratio: i / 4,
      });
    }
    return numbers.map(item => (
      <div
        className={styles.number}
        key={item.left}
        style={{
          left: item.left + 'px',
        }}
        onClick={() => {
          updateX(item.ratio);
        }}
      >
        {item.number}
      </div>
    ));
  }

  /**
   * 更新滑块位置
   *
   * @param {Number} ratio 距离左边位置的比例 0 ~ 1
   */
  function updateX(ratio) {
    setLeft(LINE_WIDTH * ratio);
    setOldX(LINE_WIDTH * ratio);
    onChange((1 - ratio) * 100);
  }

  // 拖动开始事件
  function onDragStart(e) {
    setIsDraging(true);
    setStartX(e.pageX);
  }

  // 拖动事件
  function onDrag(e) {
    if (e.pageX) {
      setEndX(e.pageX);
    }
  }

  // 拖动结束事件
  function onDragEnd(e) {
    setEndX(e.pageX);
    setOldX(left);
    setIsDraging(false);
  }

  return (
    <div className={styles.slider}>
      <div className={styles.line}></div>
      {/* 刻度 */}
      {getScales()}
      {/* 地球滑块 */}
      <div
        className={styles.block}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        style={{
          left: left,
        }}
      >
        <div className={styles['icon-img']} style={{opacity: 1 - (left / LINE_WIDTH)}}></div>
      </div>
      {/* 数值 */}
      {getNumber()}
    </div>
  );
};

export default Slider;
