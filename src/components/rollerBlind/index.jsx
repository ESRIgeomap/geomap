import React, { Component, useState, useRef } from 'react';
import { connect } from 'dva';

import styles from './index.css';
/**
 * 卷帘对比组件
 * @author  wangxd
 */

const RollerBlind = ({agsmap}) => {

const splitsDom = useRef(null);
const linemove = useRef(null);
const lineTmove = useRef(null);

// 卷帘对比功能左侧红线鼠标点击拖动事件
function handleMouseDown(e) {
    console.log(lineTmove.current)
    const TDrag = lineTmove.current;
    const Drag = linemove.current;
    const Spdom = splitsDom.current;
    const ev = event || window.event;
    event.stopPropagation();
    const disX = ev.clientX - Drag.offsetLeft;
    TDrag.style.top = 0;
    TDrag.style.left = 0;
    document.onmousemove = function(event) {
      const ev = event || window.event;
      Drag.style.left = ev.clientX - disX + 'px';
      Drag.style.cursor = 'move';
      Spdom.style.clip = 'rect(0px, ' + ev.clientX + 'px' + ', 1000px , 0px)';
    };
  }
  // 卷帘对比功能左侧红线鼠标点击松开事件
  function handleMouseUp(e) {
    e.preventDefault();
    document.onmousemove = null;
    const Drag = linemove.current;
    Drag.style.cursor = 'default';
  }
  // 卷帘对比功能上侧红线鼠标点击拖动事件
  function MouseDown(e) {
    const TDrag = lineTmove.current;
    const Drag = linemove.current;
    const Spdom = splitsDom.current;
    const ev = event || window.event;
    event.stopPropagation();
    const disY = ev.clientY - TDrag.offsetTop;
    Drag.style.top = 0;
    Drag.style.left = 0;
    document.onmousemove = function (event) {
      const ev = event || window.event;
      TDrag.style.top = ev.clientY - disY + 'px';
      TDrag.style.cursor = 'move';
      Spdom.style.clip = 'rect(0, 2000px,' + ev.clientY + 'px' + ' , 0px)';
    };
  }
  // 卷帘对比功能上侧红线鼠标点击松开事件
  function MouseUp(e) {
    e.preventDefault();
    document.onmousemove = null;
    const Drag = lineTmove.current;
    Drag.style.cursor = 'default';
  }
 

  return (
    <div>
        {/*卷帘对比dom*/}
        <div
          id="rollerBlind"
          ref={splitsDom}
          className={styles.viewrollDiv}
          style={{
            display: agsmap.rollerflags ? 'block' : 'none',
          }}
        />
        {/*卷帘对比左侧红线dom*/}
        <div
          className={styles.leftslider}
          id="verticalSlider"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          ref={linemove}
          style={{
            display: agsmap.rollerflags ? 'block' : 'none',
          }}
        />
        {/*卷帘对比右侧红线dom*/}
        <div
          className={styles.topslider}
          id="verticalTSlider"
          onMouseDown={MouseDown}
          onMouseUp={MouseUp}
          ref={lineTmove}
          style={{
            display: agsmap.rollerflags ? 'block' : 'none',
          }}
        />
    </div>
  );
};

export default connect(({ agsmap }) => {
    return {
        agsmap,
    };
  })(RollerBlind);