import React from 'react';
import PropTypes from 'prop-types';
import SketchPicker from 'react-color';
//import { formatMessage } from 'umi/locale';
import { InputNumber, Slider, message, Divider } from 'antd';
import styles from './PointSymbolEditor.less';
import common  from '../../utils/common';

class PointSymbolEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingssvisible: true,
      fillColorPickerVisible: false,
      borderColorPickerVisible: false,
      fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
      fillsize: 5,
      opacity: 0.5,
      bordercolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
      bordersize: 1,
      pointimg: '',
    };
  }
  componentDidMount() {
    const symbol = this.props.geometry.symbol;
    this.setState({
      opacity: symbol.color.a,
      fillcolor: { hex: common.colorRGB2Hex(symbol.color), rgb: symbol.color },
      fillsize: symbol.size,
      bordercolor: { hex: common.colorRGB2Hex(symbol.outline.color), rgb: symbol.outline.color },
      bordersize: symbol.outline.width,
    });
  }
  showpointFillColorPicker = () => {
    this.setState({
      fillColorPickerVisible: !this.state.fillColorPickerVisible,
    });
  };
  showpointBorderColorPickerBorder = () => {
    this.setState({
      borderColorPickerVisible: !this.state.borderColorPickerVisible,
    });
  };
  onpointFillColorChange = color => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.color.r = color.rgb.r;
      newGeo.symbol.color.g = color.rgb.g;
      newGeo.symbol.color.b = color.rgb.b;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        fillcolor: color,
      });
    }
  };
  onpointFillSizeChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.size = value;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        fillsize: value,
      });
    }
  };

  onpointOpacityChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.color.a = value / 100;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        opacity: value / 100,
      });
    }
  };

  onpointBorderColorChange = color => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.outline.color.r = color.rgb.r;
      newGeo.symbol.outline.color.g = color.rgb.g;
      newGeo.symbol.outline.color.b = color.rgb.b;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        bordercolor: color,
      });
    }
  };
  onpointBorderSizeChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.outline.width = value;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        bordersize: value,
      });
    }
  };
  render() {
    const marks = {
      0: '0%',
      50: '50%',
      100: '100%',
    };
    return (
      <div>
        {/* 颜色 */}
        <div className={styles.settingdiv}>
          <div className={styles.leftsetting}>
          符号颜色：
          </div>
          <div className={styles.rightsetting}>
            <div
              className={styles.fillcolor}
              style={{ background: this.state.fillcolor.hex }}
              onClick={this.showpointFillColorPicker}
            />
            {this.state.fillColorPickerVisible ? (
              <div className={styles.popover}>
                <div className={styles.cover} onClick={this.showpointFillColorPicker} />
                <SketchPicker color={this.state.fillcolor} onChange={this.onpointFillColorChange} />
              </div>
            ) : null}
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
              value={this.state.fillsize}
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
            透明度：
          </div>
          <div className={styles.rightsetting}>
            <Slider
              marks={marks}
              min={0}
              max={100}
              value={this.state.opacity * 100}
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
              style={{ background: this.state.bordercolor.hex }}
              onClick={this.showpointBorderColorPickerBorder}
            />
            {this.state.borderColorPickerVisible ? (
              <div className={styles.popover}>
                <div className={styles.cover} onClick={this.showpointBorderColorPickerBorder} />
                <SketchPicker
                  color={this.state.bordercolor}
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
            {/* {formatMessage({ id: 'plottoolbar.outlinewidth' })}： */}
            轮廓宽度:
          </div>
          <div className={styles.rightsetting}>
            <InputNumber
              min={0}
              max={20}
              value={this.state.bordersize}
              onChange={this.onpointBorderSizeChange}
            />
          </div>
        </div>
        {/* 轮廓宽度 */}
      </div>
    );
  }
}

PointSymbolEditor.propTypes = {
  geometry: PropTypes.object,
};
export default PointSymbolEditor;
