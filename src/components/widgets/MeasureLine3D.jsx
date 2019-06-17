/**
 * 三维长度测量
 * @author dengd
 */
import { useRef, useState, useEffect } from 'react';
import { Spin, Icon } from 'antd';
import * as jsapi from '../../utils/jsapi';

let widget;

const MeasureLine3D = ({ view }) => {
  const domRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (domRef.current) {
      jsapi.load(['esri/widgets/DirectLineMeasurement3D']).then(([DirectLineMeasurement3D]) => {
        setLoading(false);

        const div = document.createElement('div');
        widget = new DirectLineMeasurement3D({
          view,
          container: div,
        });
        domRef.current.appendChild(div);
        changeLineUnit();
      });
    }

    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, []);

  /**
   * 修改测量微件默认单位
   */
  function changeLineUnit() {
    const interval4distanceMeasureUnit = setInterval(() => {
      if (view.activeTool) {
        view.activeTool.unit = 'meters';
        clearInterval(interval4distanceMeasureUnit);
      }
    }, 10);
    const interval4distanceMeasurePanel = setInterval(() => {
      if (
        document.getElementsByClassName('esri-direct-line-measurement-3d__units-select esri-select')
      ) {
        if (
          document.getElementsByClassName(
            'esri-direct-line-measurement-3d__units-select esri-select'
          ).length > 0
        ) {
          clearInterval(interval4distanceMeasurePanel);
          const dom = document.getElementsByClassName(
            'esri-direct-line-measurement-3d__units-select esri-select'
          );
          const ops = dom[0];
          if (ops) {
            if (ops.length > 0) {
              for (let i = 0; i < ops.length; i += 1) {
                const tempValue = ops[i].value;
                if (tempValue === 'meters') {
                  ops[i].selected = true;
                }
              }
            }
          }
        }
      }
    }, 10);
  }

  return (
    <div>
      <div ref={domRef} />
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '30px 50px',
            margin: '20px 0',
          }}
        >
          <Spin
            size="large"
            spinning={loading}
            indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
          />
        </div>
      )}
    </div>
  );
};

export default MeasureLine3D;
