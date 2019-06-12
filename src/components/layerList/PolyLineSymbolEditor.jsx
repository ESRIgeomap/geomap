import React from 'react';
import PropTypes from 'prop-types';
import SketchPicker from 'react-color';
//import { formatMessage } from 'umi/locale';
import { InputNumber, Slider, Select, Divider } from 'antd';
import styles from './PolyLineSymbolEditor.less';
import common from '../../utils/common';

class PolyLineSymbolEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingssvisible: true,
      fillColorPickerVisible: false,
      opacity: 0.5,
      fillcolor: { hex: '#1890ff', rgb: { r: 32, g: 142, b: 245 } },
      fillsize: 1,
      linetype: 'solid',
    };
  }
  componentDidMount() {
    const symbol = this.props.geometry.symbol;

    this.setState({
      opacity: symbol.color.a,
      fillcolor: { hex: common.colorRGB2Hex(symbol.color), rgb: symbol.color },
      fillsize: symbol.width,
      linetype: symbol.style,
    });
  }
  showlineFillColorPicker = () => {
    this.setState({
      fillColorPickerVisible: !this.state.fillColorPickerVisible,
    });
  };
  onlineFillColorChange = color => {
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
  onlineFillSizeChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.width = value;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        fillsize: value,
      });
    }
  };
  onLineTypeChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.style = value;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        linetype: value,
      });
    }
  };
  onlineOpacityChange = value => {
    if (this.props.geometry) {
      const newGeo = this.props.geometry.clone();
      newGeo.symbol.color.a = value / 100;
      this.props.geometry.symbol = newGeo.symbol;
      this.setState({
        opacity: value / 100,
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
              onClick={this.showlineFillColorPicker}
            />
            {this.state.fillColorPickerVisible ? (
              <div className={styles.popover}>
                <div className={styles.cover} onClick={this.showlineFillColorPicker} />
                <SketchPicker color={this.state.fillcolor} onChange={this.onlineFillColorChange} />
              </div>
            ) : null}
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
           线宽：
          </div>
          <div className={styles.rightsetting}>
            <InputNumber
              min={1}
              max={50}
              value={this.state.fillsize}
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
          线型：
          </div>{' '}
          <div className={styles.rightsetting}>
            <Select value={this.state.linetype} onChange={this.onLineTypeChange}>
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
           透明度：
          </div>
          <div className={styles.rightsetting}>
            <Slider
              marks={marks}
              min={0}
              max={100}
              value={this.state.opacity * 100}
              onChange={this.onlineOpacityChange}
            />
          </div>
        </div>
        {/* 透明度 */}
      </div>
    );
  }
}

PolyLineSymbolEditor.propTypes = {
  geometry: PropTypes.object,
};
export default PolyLineSymbolEditor;
