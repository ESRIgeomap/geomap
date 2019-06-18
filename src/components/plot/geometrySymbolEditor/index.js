import React, { useEffect } from 'react';
import { message } from 'antd';
import PolyLineSymbolEditor from './PolyLineSymbolEditor';
import PolyGonSymbolEditor from './PolyGonSymbolEditor';
import PointSymbolEditor from './PointSymbolEditor';
import TextSymbolEditor from './TextSymbolEditor';

const GeometrySymbolEditor = props => {
  useEffect(() => {
    if (!props.geometry) {
      message.warn('请选择图形');
    }
  },[]);
  //根据不同geometry类型加载不同的symbol编辑器
  const renderDom = () => {
    const type = getType();
    let com = null;
    switch (type) {
      case 'Point': {
        com = <PointSymbolEditor geometry={props.geometry} />;
        break;
      }
      case 'Polyline': {
        com = <PolyLineSymbolEditor geometry={props.geometry} />;
        break;
      }
      case 'Polygon': {
        com = <PolyGonSymbolEditor geometry={props.geometry} />;
        break;
      }
      case 'Text': {
        com = <TextSymbolEditor geometry={props.geometry} />;
        break;
      }
      default: {
        break;
      }
    }
    return com;
  };
  //获取 geometry类型
  const getType = () => {
    const geo = props.geometry;
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
  };

  return <div>{renderDom()}</div>;
};

export default GeometrySymbolEditor;
