import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Icon, Button } from 'antd';
import Slider from './Slider';
import styles from './index.less';
import BaseMapItem from './basemapitem';
import btnImg from './img/btn.png';
import btnImgSelected from './img/btn_selected.png';

const marks = {
  100: '100',
  75: '75',
  50: '50',
  25: '25',
  0: '0',
};

const BaseMap = ({ dispatch }) => {
  const [visible, setVisible] = useState(false);
  const [opacityVlue, setOpacityVlue] = useState(1); // 底图地图透明度
  const [activeMapItemid, setActiveMapItemid] = useState(''); // 活动中的地图itemid

  const neasureVisible = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (window.agsGlobal.view) {
      window.agsGlobal.view.map.basemap.baseLayers.items.forEach((blayer, index) => {
        blayer.opacity = opacityVlue;
      });
    }
  }, [opacityVlue]);

  // 底图切换后重新设置底图透明度
  useEffect(() => {
    if (window.agsGlobal.view) {
      setOpacityVlue(1);
    }
  }, [activeMapItemid]);

  function renderBasemapList() {
    return window.basemapConfig.map(list => {
      return (
        <div className={styles.maplist} key={list.itemId}>
          <BaseMapItem
            key={list.title}
            data={list}
            activeMapItemid={activeMapItemid}
            basemapOnChange={basemapOnChange}
          />
          <div className={styles.span}>
            <span>{list.title}</span>
          </div>
        </div>
      );
    });
  }

  function onSliderChange(value) {
    setOpacityVlue(value / 100);
  }

  /**
   * 底图切换的时候，设置正在使用的底图的itemId
   *
   * @param {String} itemId 切换的底图的itemId
   */
  function basemapOnChange(itemId) {
    console.log('itemid: ', itemId)
    setActiveMapItemid(itemId);
  }

  return (
    <div className={styles.changebase}>
      <div className={styles.measurebox} style={{ display: visible ? 'block' : 'none' }}>
        <div className={styles.panelWrap}>
          <div className={styles.panelHead}>
            <span>底图</span>
            <span onMouseDown={neasureVisible} title="关闭">
              <Icon type="close" />
            </span>
          </div>
          <div className={styles.panelContent}>
            {renderBasemapList()}
          </div>
          <h3 className={styles.title}>地图面透明度</h3>
          <div className={styles['slider-wrap']}>
            <Slider onChange={onSliderChange} value={opacityVlue * 100}/>
          </div>
        </div>
      </div>
      <Button
        className={styles.basemapbutton}
        style={{ backgroundColor: visible ? '#dfeef7' : 'white' }}
        onClick={neasureVisible}
        title="底图"
      >
        <img className={styles.baseIcon} src={visible ? btnImgSelected : btnImg} alt="" />
      </Button>
      {/*<Popover>*/}
    </div>
  );
};

export default connect(() => {
  return {

  };
})(BaseMap);
