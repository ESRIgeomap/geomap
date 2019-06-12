import React from 'react';
import { connect } from 'dva';
import { Slider, Icon, Select, Row, Col, message, Radio, Tooltip } from 'antd';
import styles from './TimeSliderLayer.less';

import layerUtils from '../../utils/layerUtils';

const { Option } = Select;
class TimeSliderLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2014,
      rangYear: [2014, 2015, 2016, 2017, 2018, 2019],
      isPlay: false,
      compareLayerTitle: null,
      layerType: 'vector',
    };
  }
  startPlay = () => {
    this.setState({
      year: this.state.rangYear[0],
    });
    const obj = window.timerCompareConfig.vectorLayers.find(
      l => l.title === this.state.compareLayerTitle
    );
    const layerType = obj && obj.type;
    this.setState({
      isPlay: true,
    });
    let i = 0;
    let yearLength = this.state.rangYear.length;
    this.timer = window.setInterval(() => {
      if (i < yearLength) {
        i++;
        this.displayFeatruesByYear(this.state.year + 1, null);
      } else {
        clearInterval(this.timer);
        const layer = agsGlobal.view.map.layers.find(l => {
          return l.title === this.state.compareLayerTitle;
        });
        if (layer) layer.definitionExpression = ``;
        if (layerType.toUpperCase() === 'IMAGERLAYER') {
          layerUtils.removeLayerByTitle(this.state.compareLayerTitle);
          layerUtils.addTimeCompareLayerByTitle(this.state.compareLayerTitle);
        }
        this.setState({
          isPlay: false,
        });
      }
    }, 5000);
  };
  // flag 留作标识 图层类型
  displayFeatruesByYear = (year, flag) => {
    const obj = window.timerCompareConfig.vectorLayers.find(
      l => l.title === this.state.compareLayerTitle
    );
    if (!obj) {
      return;
    }
    const layerType = obj && obj.type;
    const layer = agsGlobal.view.map.layers.find(l => {
      return l.title === this.state.compareLayerTitle;
    });
    this.setState({
      year,
    });
    if (layer) {
      if (layerType.toUpperCase() === 'FEATURELAYER') {
        layer.definitionExpression = `${window.timerCompareConfig.timeField}='${this.state.year}'`;
      }
      if (layerType.toUpperCase() === 'IMAGERLAYER') {
        layerUtils.refreshImageLayer(this.state.compareLayerTitle, this.state.year);
      }
    }
  };
  pausePlay = () => {
    clearInterval(this.timer);
    this.setState({
      isPlay: false,
    });
  };
  //移除图层并隐藏滑块条
  hideTimerSliderBar = () => {
    this.props.dispatch({
      type: 'agsmap/showTimerSliderCompare',
      payload: false,
    });
    layerUtils.removeLayerByTitle(this.state.compareLayerTitle);
  };
  //加载图层并显示滑块条
  showTimerSliderBar = value => {
    const layerType = window.timerCompareConfig.vectorLayers.find(l => l.title === value).type;

    if (this.state.compareLayerTitle) {
      if (layerType.toUpperCase() === 'FEATURELAYER') {
        const years = layerUtils.getRangYearByLayer(
          this.state.compareLayerTitle,
          this.state.layerType
        );
        years.then(ys => {
          this.setState({
            rangYear: ys,
          });
        });
      }
      if (layerType.toUpperCase() === 'IMAGERLAYER') {
        this.setState({
          rangYear: [2014, 2015, 2016, 2017, 2018, 2019],
        });
      }

      layerUtils.addTimeCompareLayerByTitle(this.state.compareLayerTitle, this.state.layerType);
    } else {
      message.info('请选择图层');
    }
  };
  handleChange = async value => {
    await layerUtils.removeLayerByTitle(this.state.compareLayerTitle);
    this.setState(
      {
        compareLayerTitle: value,
      },
      () => {
        this.showTimerSliderBar(value);
      }
    );
  };

  getMarks = () => {
    const marks = {};
    this.state.rangYear.map(year => {
      marks[year] = {
        style: {
          color: '#fff',
        },
        label: <span>{year}</span>,
      };
    });
    return marks;
  };
  render() {
    return (
      <div
        className={styles.wrap}
        style={{ display: this.props.agsmap.timerLayersSelectvisible ? 'block' : 'none' }}
      >
        <div className={styles.controlBar}>
          <div>
            {this.state.isPlay ? (
              <Tooltip title="暂停">
                {' '}
                <Icon type="pause" onClick={this.pausePlay} />
              </Tooltip>
            ) : (
              <Tooltip title="播放">
                {' '}
                <Icon type="caret-right" onClick={this.startPlay} />
              </Tooltip>
            )}
          </div>
        </div>

        <div className={styles.sliderbardiv}>
          <Slider
            min={this.state.rangYear[0]}
            max={this.state.rangYear[this.state.rangYear.length - 1]}
            value={this.state.year}
            step={1}
            marks={this.getMarks()}
            onChange={this.displayFeatruesByYear}
          />
        </div>
        <Select
          defaultValue={window.timerCompareConfig.vectorLayers[0].title}
          className={styles.layerSelect}
          onSelect={this.handleChange}
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
              <Icon type="poweroff" onClick={this.hideTimerSliderBar} />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ agsmap }) => {
  return { agsmap };
})(TimeSliderLayer);
