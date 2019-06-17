/**
 * 二维长度测量
 * @author  lee  
 */
import { useRef, useState, useEffect } from 'react';
import { Spin, Icon } from 'antd';
import * as jsapi from '../../utils/jsapi';

let widget;

const Legendlist = ({ view }) => {
  const domRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (domRef.current) {
      jsapi.load(['esri/widgets/Legend']).then(([Legend]) => {
        setLoading(false);

        const div = document.createElement('div');
        // 调用jsapi的图例功能
        widget = new Legend({
          view,
          container: div,
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

export default Legendlist;
