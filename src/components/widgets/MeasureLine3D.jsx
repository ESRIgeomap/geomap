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
      });
    }

    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, []);

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
