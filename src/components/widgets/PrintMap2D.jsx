import { useRef, useState, useEffect } from 'react';
import { Spin, Icon } from 'antd';
import * as jsapi from '../../utils/jsapi';

let widget;
/**
 * 二维打印微件
 * @author  liugh  
 */
const PrintMap2D = ({ view }) => {
  const domRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (domRef.current) {
      jsapi.load(['esri/widgets/Print']).then(([Print]) => {
        setLoading(false);

        const div = document.createElement('div');
        // 调用jsapi的二维打印微件
        widget = new Print({
          view,
          container: div,
          printServiceUrl: window.appcfg.printService,
        });
        domRef.current.appendChild(div);
      });
    }

    return () => {
      if (widget) {
          // 如果widget存在，则删除该widget
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

export default PrintMap2D;
