import React from 'react';
import { message } from 'antd';
import PolyLineSymbolEditor from './PolyLineSymbolEditor';
import PolyGonSymbolEditor from './PolyGonSymbolEditor';
import PointSymbolEditor from './PointSymbolEditor';
import TextSymbolEditor from './TextSymbolEditor';

export default class GeometrySymbolEditor extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (!this.props.geometry) {
      message.warn('请选择图形');
    }
  }
  renderDom() {
    const type = this.getType();
    let com = null;
    switch (type) {
      case 'Point': {
        com = <PointSymbolEditor geometry={this.props.geometry} />;
        break;
      }
      case 'Polyline': {
        com = <PolyLineSymbolEditor geometry={this.props.geometry} />;
        break;
      }
      case 'Polygon': {
        com = <PolyGonSymbolEditor geometry={this.props.geometry} />;
        break;
      }
      case 'Text': {
        com = <TextSymbolEditor geometry={this.props.geometry} />;
        break;
      }
      default: {
        break;
      }
    }
    return com;
  }
  getType() {
    const geo = this.props.geometry;
    let geoType = null;

    switch (geo.geometry.type) {
      case 'point': {
        const symbol = geo.symbol;
        if (symbol.type === 'simple-marker') {
          geoType = 'Point';
        }
        if (symbol.type === 'text') {
          geoType = 'Text';
        }
        break;
      }
      case 'polyline': {
        geoType = 'Polyline';
        break;
      }
      case 'polygon': {
        geoType = 'Polygon';
        break;
      }
    }
    return geoType;
  }
  render() {
    return <div>{this.renderDom()}</div>;
  }
}
