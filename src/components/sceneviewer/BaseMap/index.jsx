import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Layout, Icon, Button, Popover, Slider } from 'antd';
import styles from './index.less';
import CustomScroll from 'react-custom-scrollbars';
import BaseMapItem from './basemapitem';
import changebasemap from './img/dtqh.png';
import changebasemap1 from './img/dtqh1.png';

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
      {/*<Popover
        placement="leftTop"
        content={content}
        title="底图切换"
        overlayClassName={styles.popover}
        trigger="click"
        visible={visible}
        onVisibleChange={visible => {
          setVisible(visible);
        }}
      >*/}
      <div className={styles.measurebox} style={{ display: visible ? 'block' : 'none' }}>
        <div className={styles.panelWrap}>
          <div className={styles.panelHead}>
            <span>底图</span>
            <span onMouseDown={neasureVisible}>
              <Icon type="close" />
            </span>
          </div>
          <div className={styles.panelContent}>
            <CustomScroll autoHeight autoHeightMin={0} autoHeightMax={290}>
              {renderBasemapList()}
            </CustomScroll>
          </div>
          <h3 style={{padding: '0 10px', marginBottom: '0'}}>地图面透明度</h3>
          <div style={{padding: '0 10px', marginBottom: '10px'}}>
            <Slider marks={marks} defaultValue={100} value={opacityVlue * 100} onChange={onSliderChange} />
          </div>
        </div>
      </div>
      <Button
        className={styles.basemapbutton}
        style={{ backgroundColor: visible ? '#47b479' : 'white' }}
        onClick={neasureVisible}
        title="底图"
      >
        <img className={styles.baseIcon} src={visible ? changebasemap1 : changebasemap} alt="" />
      </Button>
      {/*<Popover>*/}
    </div>
  );
};

export default connect(() => {
  return {

  };
})(BaseMap);
