//pensiveant:标绘组件

import React from 'react';
import { connect } from 'dva';
import {
  Button,
  Tooltip,
  Icon,
  InputNumber,
  Slider,
  Input,
  Select,
  message,
  Divider,
  Modal,
} from 'antd';
import SketchPicker from 'react-color';

import styles from './PoltToolBar.less';
import {
  LAYERLIST_POLT_BYTYPE,
  LAYERLIST_POLT_LAYER_SAVE,
  POLT_EDITOR_REMOVE,
  POLT_EDIT_CLEAR,
} from '../../constants/action-types';
import pointsvg from './img/polticon/icon-point.svg';
//import { FormattedMessage, setLocale, getLocale, formatMessage } from 'umi/locale';
import poltUtils from '../../utils/poltUtils';

const { Option } = Select;
class PoltToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comheight: 400,
      settingssvisible: false,
      activePoltType: '',
      modalvisible: false,
      layertitle: '',
      pointparam: {
        fillColorPickerVisible: false,
        borderColorPickerVisible: false,
        fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
        fillsize: 5,
        opacity: 0.5,
        bordercolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
        bordersize: 1,
        pointimg: '',
      },
      lineparam: {
        fillColorPickerVisible: false,
        opacity: 0.5,
        fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
        fillsize: 1,
        linetype: 'solid',
      },
      polygonparam: {
        fillColorPickerVisible: false,
        borderColorPickerVisible: false,
        fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
        opacity: 0.5,
        bordercolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
        bordersize: 1,
      },
      textparam: {
        fillColorPickerVisible: false,
        text: '文本',
        fillsize: 18,
        fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
      },
    };
  }
  componentDidMount = () => {
    this.props.onRef(this);
    const height = document.body.clientHeight - 240;
    this.setState({
      comheight: height,
    });
  };
  

  clearAll = () => {
    this.deActivePolt();
    this.props.dispatch({
      type: POLT_EDITOR_REMOVE,
    });
    this.props.dispatch({
      type: POLT_EDIT_CLEAR,
    });
    this.props.dispatch({
      type: 'agsmap/identifyChangeState',
      payload: !this.props.agsmap.identifyflags,
    });
  };

  deActivePolt = () => {
    this.setState({
      activePoltType: '',
    });
    poltUtils.deactivePolt();
  };

  //标绘，点击各种绘制图形图标回调
  poltByType = e => {
    const { pointparam, lineparam, polygonparam, textparam } = this.state;
    const type = e && e.target.dataset.polttype;
    if (this.state.activePoltType === type) {
      poltUtils.deactivePolt();
      this.setState({
        activePoltType: '',
      });
    } else {
      
      this.setState({
        activePoltType: type,
      });

      this.props.dispatch({
        type: LAYERLIST_POLT_BYTYPE,
        payload: {
          type,
          symbolparam: {
            pointparam,
            lineparam,
            polygonparam,
            textparam,
          },
        },
      });
    }
  };
  actionPolt = () => {
    const { pointparam, lineparam, polygonparam, textparam } = this.state;
    this.props.dispatch({
      type: LAYERLIST_POLT_BYTYPE,
      payload: {
        type: this.state.activePoltType,
        symbolparam: {
          pointparam,
          lineparam,
          polygonparam,
          textparam,
        },
      },
    });
  };

  getPointStyleDemo = () => {
    return (
      window.poltConfig &&
      window.poltConfig.map(item => {
        return (
          <div className={styles.pointbar}>
            <Tooltip title={item.name}>
              <img data-polttype="pointimg" src={item.url} onClick={this.pointStyleCLick} />
            </Tooltip>
          </div>
        );
      })
    );
  };
  pointStyleCLick = e => {
    const img = e.target.src;
    const type = e.target.dataset.polttype;
    this.setState(
      {
        pointimg: img,
        activePoltType: type,
      },
      () => {
        this.actionPolt();
      }
    );
  };
  showAdvanceSetting = e => {
    if (this.state.activePoltType === '') {
      message.warn('请先选择标绘模式');
      return;
    }
    this.setState({
      settingssvisible: !this.state.settingssvisible,
    });
  };
  renderAdvance = () => {
    if (!this.state.settingssvisible) {
      return (
        <span className={styles.advance} onClick={this.showAdvanceSetting}>
          {/*{formatMessage({ id: 'plottoolbar.style' })}*/}
          样式
          <Icon type="caret-down" />
        </span>
      );
    } else {
      return (
        <span className={styles.advance} onClick={this.showAdvanceSetting}>
          {/*{formatMessage({ id: 'plottoolbar.style' })}*/}
          样式
          <Icon type="caret-up" />
        </span>
      );
    }
  };
  renderPreviewDiv = () => {
    const { fillsize, fillcolor, bordersize, bordercolor, opacity } = this.state.pointparam;
    return (
      <div>
        <center>
          <div
            style={{
              width: fillsize + bordersize,
              height: fillsize + bordersize,
              borderRadius: fillsize + bordersize,
              backgroundColor: fillcolor.hex,
              borderStyle: 'solid',
              borderWidth: bordersize,
              borderColor: bordercolor.hex,
              opacity: opacity,
            }}
          />
        </center>
      </div>
    );
  };
  // 设置事件
  // 点
  onpointFillSizeChange = value => {
    const {} = this.state.pointparam;
    const s = {
      ...this.state.pointparam,
      fillsize: value,
    };
    this.setState({
      pointparam: s,
    });
    this.actionPolt();
  };
  showpointFillColorPicker = () => {
    const s = {
      ...this.state.pointparam,
      fillColorPickerVisible: !this.state.pointparam.fillColorPickerVisible,
    };
    this.setState({
      pointparam: s,
    });
    this.actionPolt();
  };
  onpointFillColorChange = hex => {
    const s = {
      ...this.state.pointparam,
      fillcolor: hex,
    };
    this.setState({
      pointparam: s,
    });
    this.actionPolt();
  };
  onpointOpacityChange = value => {
    const s = {
      ...this.state.pointparam,
      opacity: value / 100,
    };
    this.setState({
      pointparam: s,
    });
    this.actionPolt();
  };
  showpointBorderColorPickerBorder = () => {
    const s = {
      ...this.state.pointparam,
      borderColorPickerVisible: !this.state.pointparam.borderColorPickerVisible,
    };
    this.setState({
      pointparam: s,
    });
    this.actionPolt();
  };
  onpointBorderColorChange = hex => {
    const s = {
      ...this.state.pointparam,
      bordercolor: hex,
    };
    this.setState({
      pointparam: s,
    });
    this.actionPolt();
  };
  onpointBorderSizeChange = value => {
    this.setState({
      pointparam: {
        ...this.state.pointparam,
        bordersize: value,
      },
    });
    this.actionPolt();
  };
  // 线

  onlineFillSizeChange = value => {
    this.setState({
      lineparam: {
        ...this.state.lineparam,
        fillsize: value,
      },
    });
    this.actionPolt();
  };
  showlineFillColorPicker = () => {
    this.setState({
      lineparam: {
        ...this.state.lineparam,
        fillColorPickerVisible: !this.state.lineparam.fillColorPickerVisible,
      },
    });
    this.actionPolt();
  };
  onlineFillColorChange = hex => {
    this.setState({
      lineparam: {
        ...this.state.lineparam,
        fillcolor: hex,
      },
    });
    this.actionPolt();
  };
  onLineTypeChange = value => {
    this.setState(
      {
        lineparam: {
          ...this.state.lineparam,
          linetype: value,
        },
      },
      () => {
        this.actionPolt();
      }
    );
  };
  onlineOpacityChange = value => {
    this.setState({
      lineparam: {
        ...this.state.lineparam,
        opacity: value / 100,
      },
    });
    this.actionPolt();
  };

  // 面
  showpolygonFillColorPicker = () => {
    this.setState({
      polygonparam: {
        ...this.state.polygonparam,
        fillColorPickerVisible: !this.state.polygonparam.fillColorPickerVisible,
      },
    });
    this.actionPolt();
  };
  onpolygonFillColorChange = hex => {
    this.setState({
      polygonparam: {
        ...this.state.polygonparam,
        fillcolor: hex,
      },
    });
    this.actionPolt();
  };
  onpolygonOpacityChange = value => {
    this.setState({
      polygonparam: {
        ...this.state.polygonparam,
        opacity: value / 100,
      },
    });
    this.actionPolt();
  };
  showpolygonBorderColorPickerBorder = () => {
    this.setState({
      polygonparam: {
        ...this.state.polygonparam,
        borderColorPickerVisible: !this.state.polygonparam.borderColorPickerVisible,
      },
    });
    this.actionPolt();
  };
  onpolygonBorderColorChange = hex => {
    this.setState({
      polygonparam: {
        ...this.state.polygonparam,
        bordercolor: hex,
      },
    });
    this.actionPolt();
  };
  onpolygonBorderSizeChange = value => {
    this.setState({
      polygonparam: {
        ...this.state.polygonparam,
        bordersize: value,
      },
    });
    this.actionPolt();
  };
  //字体
  onTextChange = e => {
    const value = e.target.value;
    debugger;
    this.setState(
      {
        textparam: {
          ...this.state.textparam,
          text: value,
        },
      },
      () => {
        this.actionPolt();
      }
    );
  };

  showtextFillColorPicker = () => {
    this.setState({
      textparam: {
        ...this.state.textparam,
        fillColorPickerVisible: !this.state.textparam.fillColorPickerVisible,
      },
    });
    this.actionPolt();
  };
  ontextFillColorChange = hex => {
    this.setState({
      textparam: {
        ...this.state.textparam,
        fillcolor: hex,
      },
    });
    this.actionPolt();
  };
  ontextFillSizeChange = value => {
    this.setState({
      textparam: {
        ...this.state.textparam,
        fillsize: value,
      },
    });
    this.actionPolt();
  };

  finishPlot = () => {
    // message.info('完成标绘保存图层，关闭面板不保存');
    this.setState({
      modalvisible: true,
    });
  };

  layertitleChange = e => {
    const value = e.target.value;
    this.setState({
      layertitle: value,
    });
  };

  handleSaveOk = e => {
    if (this.state.layertitle === '') {
      message.warn('标绘图层标题不能为空');
      return;
    }
    this.deActivePolt();
    const layerinfo = {
      layertitle: this.state.layertitle,
    };
    this.props.dispatch({
      type: LAYERLIST_POLT_LAYER_SAVE,
      payload: layerinfo,
    });
    this.setState({
      modalvisible: false,
      layertitle: '',
    });
  };
  handleSaveCancel = e => {
    this.setState({
      modalvisible: false,
      layertitle: '',
    });
  };

  render() {
    const marks = {
      0: '0%',
      50: '50%',
      100: '100%',
    };
    return (
      <div className={styles.wrap} style={{ height: this.state.comheight }}>
        {/*<span>标绘模式:</span>*/}

        <div className={styles.barsdiv}>
          <div className={styles.bars}>
            <Tooltip title='绘点'>
              <div
                className={
                  this.state.activePoltType === 'point'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="point"
                  data-mode="simple"
                  onClick={this.poltByType}
                  className={styles.point}
                />
              </div>
            </Tooltip>
            <Tooltip title='绘线'>
              <div
                className={
                  this.state.activePoltType === 'polyline'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="polyline"
                  data-mode="simple"
                  onClick={this.poltByType}
                  className={styles.polyline}
                />
              </div>
            </Tooltip>
            <Tooltip title='绘面'>
              <div
                className={
                  this.state.activePoltType === 'polygon'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="polygon"
                  data-mode="simple"
                  onClick={this.poltByType}
                  className={styles.polygon}
                />
              </div>
            </Tooltip>
            <Tooltip title= '矩形'>
              <div
                className={
                  this.state.activePoltType === 'rectangle'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="rectangle"
                  data-mode="simple"
                  onClick={this.poltByType}
                  className={styles.rectangle}
                />
              </div>
            </Tooltip>
            <Tooltip title='圆形'>
              <div
                className={
                  this.state.activePoltType === 'circle'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="circle"
                  data-mode="simple"
                  onClick={this.poltByType}
                  className={styles.circle}
                />
              </div>
            </Tooltip>
            <Tooltip title='普通箭头'>
              <div
                className={
                  this.state.activePoltType === 'general_arrow'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="general_arrow"
                  data-mode="simple"
                  onClick={this.poltByType}
                  className={styles.general_arrow}
                />
              </div>
            </Tooltip>
            <Tooltip title='双箭头'>
              <div
                className={
                  this.state.activePoltType === 'double_arrow'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="double_arrow"
                  data-mode="simple"
                  onClick={this.poltByType}
                  className={styles.double_arrow}
                />
              </div>
            </Tooltip>
            <Tooltip title= '燕尾箭头'>
              <div
                className={
                  this.state.activePoltType === 'swallowtail_arrow'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="swallowtail_arrow"
                  data-mode="simple"
                  onClick={this.poltByType}
                  className={styles.swallowtail_arrow}
                />
              </div>
            </Tooltip>
            <Tooltip title='文字'>
              <div
                className={
                  this.state.activePoltType === 'font'
                    ? [styles.bar, styles.selected].join(' ')
                    : styles.bar
                }
              >
                <div
                  data-polttype="font"
                  data-mode="font"
                  onClick={this.poltByType}
                  className={styles.font}
                />
              </div>
            </Tooltip>
            <Tooltip title='清除'>
              <div className={styles.bar}>
                <div
                  data-polttype="clear"
                  data-mode=""
                  onClick={this.clearAll}
                  className={styles.clear}
                />
              </div>
            </Tooltip>
          </div>
          {/* <div>预览：{this.renderPreviewDiv()}<Divider/></div> */}
          {/* {this.renderAdvance()} */}
        </div>

        {/*<div style={{ display: this.state.settingssvisible ? 'block' : 'none' }}>*/}
        <div>
          {/*<div
            className={styles.barsdiv}
            style={{
              display: ['point', 'pointimg'].includes(this.state.activePoltType) ? 'block' : 'none',
            }}
          >
             <div className={styles.pointbars}>{this.getPointStyleDemo()}</div>
          </div> */}
          {/* 高级设置 */}
          {/* 点 */}
          <div
            style={{
              display: ['point'].includes(this.state.activePoltType) ? 'block' : 'none',
            }}
          >
            {/* 颜色 */}
            <div className={styles.settingdiv}>
              <div className={styles.leftsetting}>
                符号颜色：
              </div>
              <div className={styles.rightsetting}>
                <div
                  className={styles.fillcolor}
                  style={{ background: this.state.pointparam.fillcolor.hex }}
                  onClick={this.showpointFillColorPicker}
                />
                {this.state.pointparam.fillColorPickerVisible ? (
                  <div className={styles.popover}>
                    <div className={styles.cover} onClick={this.showpointFillColorPicker} />
                    <SketchPicker
                      color={this.state.pointparam.fillcolor}
                      onChange={this.onpointFillColorChange}
                    />
                  </div>
                ) : null}
              </div>
              <div className={styles.morediv}>
                <a onClick={this.showAdvanceSetting}>
                  高级设置
                </a>
              </div>
            </div>
            {/* 颜色 */}

            <Divider style={{ display: this.state.settingssvisible ? 'block' : 'none' }} />
            {/* 大小 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              符号大小：
              </div>
              <div className={styles.rightsetting}>
                <InputNumber
                  min={1}
                  max={50}
                  defaultValue={this.state.pointparam.fillsize}
                  onChange={this.onpointFillSizeChange}
                />
              </div>
            </div>
            {/* 大小 */}
            {/* 透明度 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              透 明 度：
              </div>
              <div className={styles.rightsetting}>
                <Slider
                  marks={marks}
                  min={0}
                  max={100}
                  defaultValue={this.state.pointparam.opacity * 100}
                  onChange={this.onpointOpacityChange}
                />
              </div>
            </div>

            {/* 透明度 */}
            {/* 轮廓颜色 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              轮廓颜色：
              </div>
              <div className={styles.rightsetting}>
                <div
                  className={styles.fillcolor}
                  style={{ background: this.state.pointparam.bordercolor.hex }}
                  onClick={this.showpointBorderColorPickerBorder}
                />
                {this.state.pointparam.borderColorPickerVisible ? (
                  <div className={styles.popover}>
                    <div className={styles.cover} onClick={this.showpointBorderColorPickerBorder} />
                    <SketchPicker
                      color={this.state.pointparam.bordercolor}
                      onChange={this.onpointBorderColorChange}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            {/* 轮廓颜色 */}
            {/* 轮廓宽度 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              轮廓宽度：
              </div>
              <div className={styles.rightsetting}>
                <InputNumber
                  min={0}
                  max={20}
                  defaultValue={2}
                  onChange={this.onpointBorderSizeChange}
                />
              </div>
            </div>
            {/* 轮廓宽度 */}
          </div>
          {/* 线 */}
          <div
            style={{
              display: ['polyline'].includes(this.state.activePoltType) ? 'block' : 'none',
            }}
          >
            {/* 颜色 */}
            <div className={styles.settingdiv}>
              <div className={styles.leftsetting}>
              符号颜色：
              </div>
              <div className={styles.rightsetting}>
                <div
                  className={styles.fillcolor}
                  style={{ background: this.state.lineparam.fillcolor.hex }}
                  onClick={this.showlineFillColorPicker}
                />
                {this.state.lineparam.fillColorPickerVisible ? (
                  <div className={styles.popover}>
                    <div className={styles.cover} onClick={this.showlineFillColorPicker} />
                    <SketchPicker
                      color={this.state.lineparam.fillcolor}
                      onChange={this.onlineFillColorChange}
                    />
                  </div>
                ) : null}
              </div>
              <div className={styles.morediv}>
                <a onClick={this.showAdvanceSetting}>
                高级设置
                </a>
              </div>
            </div>
            {/* 颜色 */}
            <Divider style={{ display: this.state.settingssvisible ? 'block' : 'none' }} />
            {/* 宽度 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              线 宽：
              </div>
              <div className={styles.rightsetting}>
                <InputNumber
                  min={1}
                  max={50}
                  defaultValue={this.state.lineparam.fillsize}
                  onChange={this.onlineFillSizeChange}
                />
              </div>
            </div>
            {/* 宽度 */}

            {/* 样式 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              线 型：
              </div>{' '}
              <div className={styles.rightsetting}>
                <Select defaultValue="solid" onChange={this.onLineTypeChange}>
                  <Option value="solid">实线</Option>
                  <Option value="short-dot">虚线</Option>
                </Select>
              </div>
            </div>
            {/* 样式 */}

            {/* 透明度 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              透 明 度 ：
              </div>
              <div className={styles.rightsetting}>
                <Slider
                  marks={marks}
                  min={0}
                  max={100}
                  defaultValue={this.state.lineparam.opacity * 100}
                  onChange={this.onlineOpacityChange}
                />
              </div>
            </div>
            {/* 透明度 */}
          </div>
          {/* 线 */}
          {/* 面 */}
          <div
            style={{
              display: [
                'polygon',
                'polygon',
                'rectangle',
                'circle',
                'general_arrow',
                'double_arrow',
                'swallowtail_arrow',
              ].includes(this.state.activePoltType)
                ? 'block'
                : 'none',
            }}
          >
            {/* 颜色 */}
            <div className={styles.settingdiv}>
              <div className={styles.leftsetting}>
              填充颜色：
              </div>
              <div className={styles.rightsetting}>
                <div
                  className={styles.fillcolor}
                  style={{ background: this.state.polygonparam.fillcolor.hex }}
                  onClick={this.showpolygonFillColorPicker}
                />
                {this.state.polygonparam.fillColorPickerVisible ? (
                  <div className={styles.popover}>
                    <div className={styles.cover} onClick={this.showpolygonFillColorPicker} />
                    <SketchPicker
                      color={this.state.polygonparam.fillcolor}
                      onChange={this.onpolygonFillColorChange}
                    />
                  </div>
                ) : null}
              </div>
              <div className={styles.morediv}>
                <a onClick={this.showAdvanceSetting}>
                高级设置
                </a>
              </div>
            </div>
            {/* 颜色 */}
            <Divider style={{ display: this.state.settingssvisible ? 'block' : 'none' }} />
            {/* 透明度 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
                透明度：
              </div>
              <div className={styles.rightsetting}>
                <Slider
                  marks={marks}
                  min={0}
                  max={100}
                  defaultValue={this.state.polygonparam.opacity * 100}
                  onChange={this.onpolygonOpacityChange}
                />
              </div>
            </div>
            {/* 透明度 */}

            {/* 轮廓颜色 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              轮廓颜色：
              </div>
              <div className={styles.rightsetting}>
                <div
                  className={styles.fillcolor}
                  defaultValue={this.state.polygonparam.opacity * 100}
                  style={{ background: this.state.polygonparam.bordercolor.hex }}
                  onClick={this.showpolygonBorderColorPickerBorder}
                />
                {this.state.polygonparam.borderColorPickerVisible ? (
                  <div className={styles.popover}>
                    <div
                      className={styles.cover}
                      onClick={this.showpolygonBorderColorPickerBorder}
                    />
                    <SketchPicker
                      color={this.state.polygonparam.bordercolor}
                      onChange={this.onpolygonBorderColorChange}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            {/* 轮廓颜色 */}

            {/* 轮廓宽度 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              轮廓宽度：
              </div>
              <div className={styles.rightsetting}>
                <InputNumber
                  min={0}
                  max={20}
                  defaultValue={2}
                  onChange={this.onpolygonBorderSizeChange}
                />
              </div>
            </div>
            {/* 轮廓宽度 */}
          </div>
          {/* 面 */}
          {/* 文本 */}
          <div
            style={{
              display: ['font'].includes(this.state.activePoltType) ? 'block' : 'none',
            }}
          >
            {/* 文本 */}
            <div className={styles.settingdiv}>
              <div className={styles.leftsetting}>
              文本内容：
              </div>{' '}
              <div className={styles.rightsetting}>
                <Input value={this.state.textparam.text} onChange={this.onTextChange} />
              </div>
              <div className={styles.morediv}>
                <a onClick={this.showAdvanceSetting}>
                  高级设置
                </a>
              </div>
            </div>
            {/* 文本 */}
            <Divider style={{ display: this.state.settingssvisible ? 'block' : 'none' }} />
            {/* 字体颜色 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
                颜 色：
              </div>
              <div className={styles.rightsetting}>
                <div
                  className={styles.fillcolor}
                  style={{ background: this.state.textparam.fillcolor.hex }}
                  onClick={this.showtextFillColorPicker}
                />
                {this.state.textparam.fillColorPickerVisible ? (
                  <div className={styles.popover}>
                    <div className={styles.cover} onClick={this.showtextFillColorPicker} />
                    <SketchPicker
                      color={this.state.textparam.fillcolor}
                      onChange={this.ontextFillColorChange}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            {/* 字体颜色 */}

            {/* 字体大小 */}
            <div
              className={styles.settingdiv}
              style={{ display: this.state.settingssvisible ? 'block' : 'none' }}
            >
              <div className={styles.leftsetting}>
              大小：
              </div>
              <div className={styles.rightsetting}>
                <InputNumber
                  min={1}
                  max={50}
                  defaultValue={this.state.textparam.fillsize}
                  onChange={this.ontextFillSizeChange}
                />
              </div>
            </div>
            {/* 字体大小 */}
          </div>
          {/* 文本 */}

          {/*    高级设置 */}
        </div>
        <div id="geosymbol" />
        <div id="geoattr" />
        <div className={styles.btnWrap}>
          <Button type="primary" className={styles.btnStyle} onClick={this.finishPlot}>
            {' '}
            完成标绘
          </Button>
        </div>
        <Modal
          title='保存至标绘'
          visible={this.state.modalvisible}
          onOk={this.handleSaveOk}
          onCancel={this.handleSaveCancel}
          mask={false}
          cancelText='取消'
          okText='确定'
        >
          <span> 标题： </span>
          <Input
            className={styles.inputmargin}
            // addonBefore="标题"
            value={this.state.layertitle}
            onChange={this.layertitleChange}
          />
        </Modal>
      </div>
    );
  }
}
PoltToolBar.propTypes = {};
export default connect(({ agsmap }) => {
  return { agsmap };
})(PoltToolBar);
