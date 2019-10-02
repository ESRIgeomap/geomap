import React, { useState, useEffect, useRef } from 'react';
import { Icon, Button, Row, Col, Select } from 'antd';
import * as jsapi from '../../utils/jsapi';
import styles from './index.less';

const unit = {
  meters: '米',
  kilometers: '公里',
  miles: '英里',
  'nautical-miles': '海里',
  yards: '码',

  acres: '英亩',
  hectares: '公顷',
  'square-meters': '平方米',
  'square-kilometers': '平方公里',
  'square-miles': '平方英里',
};

let sketchModal = null;
let sketchModalHandle = null;
const polylineSymbol = {
    type: 'simple-line',
    color: '#0081c2',
    width: 2,
  },
  polygonSymbol = {
    type: 'simple-fill',
    color: [150, 150, 255, 0.2],
    outline: {
      color: '#0081c2',
      width: 2,
    },
  };
const Measure2DBox = ({ view, visible = true, onClose }) => {
  const measure2DBoxDiv = useRef(null);
  const [measureType, setMeasureType] = useState('line');
  const [measureTime, setMeasureTime] = useState(0);
  const [measureLineUnit, setMeasureLineUnit] = useState('meters');
  const [measureAreaUnit, setMeasureAreaUnit] = useState('square-meters');
  const [measureRes, setMeasureRes] = useState(0);
  //onMouseDown
  const drag = e => {
    const Drag = measure2DBoxDiv.current;
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
  //onMouseUp
  const removeDrag = e => {
    document.onmousemove = null;
    const Drag = measure2DBoxDiv.current;
    Drag.style.cursor = 'default';
  };

  useEffect(() => {
    if (measureTime === 0) {
      return;
    }
    actionMeasure();
  }, [measureTime]);

  const actionMeasure = async () => {
    const [
      GraphicsLayer,
      geometryEngine,
      SketchViewModel,
      webMercatorUtils,
      Graphic,
    ] = await jsapi.load([
      'esri/layers/GraphicsLayer',
      'esri/geometry/geometryEngine',
      'esri/widgets/Sketch/SketchViewModel',
      'esri/geometry/support/webMercatorUtils',
      'esri/Graphic',
    ]);
    let layer = view.map.layers.find(l => {
      return l.title === 'measure2dbox';
    });
    if (!layer) {
      layer = new GraphicsLayer({
        title: 'measure2dbox',
      });
      view.map.add(layer);
    }
    if (!sketchModal)
      sketchModal = new SketchViewModel({
        view: view,
        layer,
        polylineSymbol,
        polygonSymbol,
        updateOnGraphicClick: false,
      });
    sketchModalHandle = sketchModal.on('create', function(event) {
      if (event.state === 'complete') {
        sketchModalHandle.remove();
        if (!event.graphic) return;
        let webGeometry = null;
        if (
          event.graphic.geometry.spatialReference.isWGS84 ||
          event.graphic.geometry.spatialReference.isWebMercator
        ) {
          webGeometry = event.graphic.geometry;
        } else {
          webGeometry = webMercatorUtils.geographicToWebMercator(event.graphic.geometry);
        }
        let res = 0;
        if (webGeometry.type === 'polyline') {
          res = geometryEngine.geodesicLength(webGeometry, measureLineUnit);
        } else if (webGeometry.type === 'polygon') {
          res = geometryEngine.geodesicArea(webGeometry, measureAreaUnit);
        }
        let textGeo = null;
        if (measureType === 'line') {
          textGeo = event.graphic.geometry.getPoint(event.graphic.geometry.paths.length - 1, 0);
        } else {
          textGeo = event.graphic.geometry.centroid;
        }
        const textPoint = new Graphic({
          geometry: textGeo,
          symbol: {
            type: 'text',
            color: 'black',
            haloColor: 'white',
            haloSize: '1px',
            text: `${res.toFixed(2)}${
              measureType === 'line' ? unit[measureLineUnit] : unit[measureAreaUnit]
            }`,
            xoffset: 3,
            yoffset: 3,
            font: {
              size: 12,
            },
          },
        });
        layer.add(textPoint);
        setMeasureRes(res);
        sketchModal.reset();
      }
    });
    sketchModal.create(measureType === 'line' ? 'polyline' : 'polygon');
  };

  const clearMeasureRes = () => {
    let layer = view.map.layers.find(l => {
      return l.title === 'measure2dbox';
    });
    if (layer) {
      layer.removeAll();
    }
    setMeasureRes(0);
  };

  return (
    <div
      style={{ display: visible ? 'block' : 'none' }}
      className={styles.modal}
      ref={measure2DBoxDiv}
    >
      <div className={styles.title} onMouseDown={drag} onMouseUp={removeDrag}>
        测量
        <div
          className={styles.close}
          onClick={() => {
            clearMeasureRes();
            sketchModalHandle&&sketchModalHandle.remove();
            if (onClose) onClose();
          }}
        >
          <Icon type="close" />
        </div>
      </div>
      <div className={styles.modalbody}>
        <Button.Group>
          <Button
            type="primary"
            onClick={() => {
              setMeasureType('line');
              setMeasureRes(0);
              setMeasureTime(measureTime + 1);
            }}
          >
            <Icon type="line-chart" />
            长度
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setMeasureType('area');
              setMeasureRes(0);
              setMeasureTime(measureTime + 1);
            }}
          >
            <Icon type="area-chart" />
            面积
          </Button>
          <Button type="danger" onClick={clearMeasureRes}>
            <Icon type="delete" />
            删除
          </Button>
        </Button.Group>
        <Row gutter={24} className={styles.row}>
          
          <Col span={10} style={{marginLeft:'10px'}}>计量单位:</Col>
          <Col span={13}>
            {' '}
            <Select
              value={measureLineUnit}
              style={{ width: 120, display: measureType === 'line' ? 'block' : 'none' }}
              onChange={e => {
                setMeasureLineUnit(e);
                setMeasureRes(0);
              }}
            >
              <Option value="meters">{unit['meters']}</Option>
              <Option value="kilometers">{unit['kilometers']}</Option>
              <Option value="miles">{unit['miles']}</Option>
              <Option value="nautical-miles">{unit['nautical-miles']}</Option>
              <Option value="yards">{unit['yards']}</Option>
            </Select>
            <Select
              value={measureAreaUnit}
              style={{ width: 120, display: measureType === 'area' ? 'block' : 'none' }}
              onChange={e => {
                setMeasureAreaUnit(e);
                setMeasureRes(0);
              }}
            >
              <Option value="acres">{unit['acres']}</Option>
              <Option value="hectares">{unit['hectares']}</Option>
              <Option value="square-meters">{unit['square-meters']}</Option>
              <Option value="square-kilometers">{unit['square-kilometers']}</Option>
              <Option value="square-miles">{unit['square-miles']}</Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={24} className={styles.row}>
          <Col span={22} style={{ textAlign: 'right' }}>
            <span className={styles.res}>{`${measureRes.toFixed(2)} `}</span>
            {measureType === 'line' ? unit[measureLineUnit] : unit[measureAreaUnit]}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Measure2DBox;
