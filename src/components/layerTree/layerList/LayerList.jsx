//pensiveant:图层列表组件

import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Icon, Tooltip } from 'antd';
import styles from './LayerList.less';

//引入子组件
import SystemLayer from '../systemLayer/SystemLayer';

import { VIEW_MODE_2D } from '../../../constants/action-types';

const LayerList = props => {
  const [comheight, setComheight] = useState(840);
  const [contentheight, setContentheight] = useState(804);
  const domRef = useRef(null);

  useEffect(() => {
    const height = document.body.clientHeight - 150;
    setComheight(height);
    setContentheight(height - 36);
  },[]);

  //图层列表关闭“X”回调
  const changeLayerListVisible = e => {
    e.stopPropagation();

    props.dispatch({
      type: 'layerList/changeLayerListVisible',
      payload: !props.layerList.layerListVisible,
    });
  };

  //面板onMouseDown
  const drag = e => {
    const Drag = domRef.current;
    const ev = event || window.event;
    event.stopPropagation();
    const disX = ev.clientX - Drag.offsetLeft;
    const disY = ev.clientY - Drag.offsetTop;
    document.onmousemove = function(event) {
      const ev = event || window.event;
      Drag.style.left = ev.clientX - disX + 'px';
      Drag.style.top = ev.clientY - disY + 'px';
      Drag.style.cursor = 'move';
    };
  };

  //面板onMouseUp
  const removeDrag = e => {
    document.onmousemove = null;
    const Drag = domRef.current;
    Drag.style.cursor = 'default';
  };

  return (
    <div
      className={styles.leftPanel}
      style={{
        display: props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
      }}
    >
      <div
        className={styles.layerListPanel}
        style={{
          display: props.layerList.layerListVisible ? 'block' : 'none',
          height: comheight,
          left: props.layerList.isSplit ? '30px' : '',
        }}
        ref={domRef}
      >
        <div className={styles.title} onMouseDown={drag} onMouseUp={removeDrag}>
          图层列表
          <Tooltip title="关闭">
            <div onClick={changeLayerListVisible} className={styles.close}>
              <Icon type="close" />
            </div>
          </Tooltip>
        </div>

        <div className={styles.content} style={{ height: contentheight }}>
          <h4 className={styles.header}> 图层列表</h4>
          <SystemLayer />
        </div>
      </div>
    </div>
  );
};
LayerList.propTypes = {};
export default connect(({ agsmap, layerList }) => {
  return {
    agsmap,
    layerList,
  };
})(LayerList);
