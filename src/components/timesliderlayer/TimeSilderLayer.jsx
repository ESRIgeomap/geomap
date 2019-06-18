import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Slider, Icon, Select, message, Tooltip } from 'antd';
import styles from './TimeSliderLayer.less';

import layerUtils from '../../utils/layerUtils';

const { Option } = Select;

const TimeSliderLayer = props => {
  const [rangYear, setRangYear] = useState([2014, 2015, 2016, 2017, 2018, 2019]);
  const [year, setYear] = useState(rangYear[0]);
  const [isPlay, setIsPlay] = useState(false);
  const [compareLayerTitle, setCompareLayerTitle] = useState(null);
  const [layerType, setLayerType] = useState('');
  useEffect(() => {
    showTimerSliderBar(compareLayerTitle);
  }, [compareLayerTitle]);
  useEffect(() => {
    displayFeatruesByYear();
  }, [year]);
  let i = 0;
  // 开始播放
  function startPlay() {
    setIsPlay(true);
    setYear(rangYear[0]);
    let yearLength = rangYear.length;
    window.timer = window.setInterval(() => {
      if (i < yearLength) {
        i++;
        setYear(parseInt(year) + i);
      } else {
        pausePlay();
        setYear(rangYear[0]);
        const layer = agsGlobal.view.map.layers.find(l => {
          return l.title === compareLayerTitle;
        });
        if (layer) layer.definitionExpression = ``;
        if (layerType.toUpperCase() === 'IMAGERLAYER') {
          layerUtils.removeLayerByTitle(compareLayerTitle);
          layerUtils.addTimeCompareLayerByTitle(compareLayerTitle);
        }
      }
    }, 1000);
  }
  // 展示某一年的图层要素
  const displayFeatruesByYear = () => {
    if (!agsGlobal.view) return;
    const layer = agsGlobal.view.map.layers.find(l => {
      return l.title === compareLayerTitle;
    });

    if (layer) {
      if (layerType.toUpperCase() === 'FEATURELAYER') {
        layer.definitionExpression = `${window.timerCompareConfig.timeField}='${year}'`;
      }
      if (layerType.toUpperCase() === 'IMAGERLAYER') {
        layerUtils.refreshImageLayer(compareLayerTitle, year);
      }
    }
  };
  // 暂停播放
  const pausePlay = () => {
    clearInterval(window.timer);

    setIsPlay(false);
  };
  //移除图层并隐藏滑块条
  const hideTimerSliderBar = () => {
    props.dispatch({
      type: 'agsmap/showTimerSliderCompare',
      payload: false,
    });
    pausePlay();
    layerUtils.removeLayerByTitle(compareLayerTitle);
  };
  //加载图层并显示滑块条
  const showTimerSliderBar = value => {
    const obj = window.timerCompareConfig.vectorLayers.find(l => l.title === value);
    if (!obj) return;
    const layerType = obj && obj.type;

    if (compareLayerTitle) {
      if (layerType.toUpperCase() === 'FEATURELAYER') {
        const years = layerUtils.getRangYearByLayer(compareLayerTitle, layerType);
        years.then(ys => {
          setRangYear(ys);
        });
      }
      if (layerType.toUpperCase() === 'IMAGERLAYER') {
        setRangYear([2014, 2015, 2016, 2017, 2018, 2019]);
      }

      layerUtils.addTimeCompareLayerByTitle(compareLayerTitle, layerType);
    } else {
      message.info('请选择图层');
    }
  };
  const handleChange = async value => {
    await layerUtils.removeLayerByTitle(compareLayerTitle);
    const t = window.timerCompareConfig.vectorLayers.find(l => l.title === value).type;
    setLayerType(t);
    setCompareLayerTitle(value);
  };
  // 获取时间刻度条
  const getMarks = () => {
    const marks = {};
    rangYear.map(year => {
      marks[year] = {
        style: {
          color: '#fff',
        },
        label: <span>{year}</span>,
      };
    });
    return marks;
  };
  const changeYear = year => {
    setYear(year);
  };
  return (
    <div
      className={styles.wrap}
      style={{ display: props.agsmap.timerLayersSelectvisible ? 'block' : 'none' }}
    >
      <div className={styles.controlBar}>
        <div>
          {isPlay ? (
            <Tooltip title="暂停">
              {' '}
              <Icon type="pause" onClick={pausePlay} />
            </Tooltip>
          ) : (
            <Tooltip title="播放">
              {' '}
              <Icon type="caret-right" onClick={startPlay} />
            </Tooltip>
          )}
        </div>
      </div>

      <div className={styles.sliderbardiv}>
        <Slider
          min={rangYear[0]}
          max={rangYear[rangYear.length - 1]}
          value={year}
          step={1}
          marks={getMarks()}
          onChange={changeYear}
        />
      </div>
      <Select
        defaultValue={window.timerCompareConfig.vectorLayers[0].title}
        className={styles.layerSelect}
        onSelect={handleChange}
      >
        {window.timerCompareConfig.vectorLayers.map(layer => {
          return (
            <Option value={layer.title} key={layer.title}>
              {layer.title}
            </Option>
          );
        })}
      </Select>
      <div className={styles.closeBar}>
        <div>
          <Tooltip title="退出">
            {' '}
            <Icon type="poweroff" onClick={hideTimerSliderBar} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default connect(({ agsmap }) => {
  return { agsmap };
})(TimeSliderLayer);
