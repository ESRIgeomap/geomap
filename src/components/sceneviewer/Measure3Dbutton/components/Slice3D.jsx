/**
 * 剖析微件
 * @author wangxd
 */
import { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Spin, Icon } from 'antd';
import * as jsapi from '../../../../utils/jsapi';

let widget;

const Slice3D = props => {
  const domRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (domRef.current) {
      jsapi.load(['esri/widgets/Slice']).then(([Slice]) => {
        setLoading(false);

        const div = document.createElement('div');
        widget = new Slice({
          view: props.view,
          container: div,
        });
        domRef.current.appendChild(div);
        // changeLineUnit();
      });
    } else if (!props.agsmap.deactivate3) {
      widget.destroy();
      console.log('删除');
    }

    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, [props.agsmap.deactivate3]);

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

export default connect(({ agsmap }) => {
  return { agsmap };
})(Slice3D);
