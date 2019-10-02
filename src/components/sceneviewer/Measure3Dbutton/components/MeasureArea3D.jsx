/**
 * 三维面积测量
 * @author dengd
 */

import { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Spin, Icon } from 'antd';
import * as jsapi from '../../../../utils/jsapi';

let widget;

const MeasureArea3D = props => {
  const domRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (domRef.current) {
      jsapi.load(['esri/widgets/AreaMeasurement3D']).then(([AreaMeasurement3D]) => {
        setLoading(false);

        const div = document.createElement('div');
        // 调用jsapi的三维测面微件
        widget = new AreaMeasurement3D({
          view: props.view,
          container: div,
        });
        domRef.current.appendChild(div);

        // 修改默认单位
        // changeAreaUnit();
      });
    } else if (!props.agsmap.deactivate) {
      widget.destroy();
      console.log('删除');
    }

    return () => {
      if (widget) {
        // 如果widget存在，则删除该widget
        widget.destroy();
        console.log('删除');
      }
    };
  }, [props.agsmap.deactivate]);

  /**
   * 修改测量微件默认单位
   */
  function changeAreaUnit() {
    const interval4areaMeasureUnit = setInterval(() => {
      if (props.view.activeTool) {
        props.view.activeTool.unit = 'square-meters';
        clearInterval(interval4areaMeasureUnit);
      }
    }, 10);
    const interval4areaMeasurePanel = setInterval(() => {
      if (document.getElementsByClassName('esri-area-measurement-3d__units-select esri-select')) {
        if (
          document.getElementsByClassName('esri-area-measurement-3d__units-select esri-select')
            .length > 0
        ) {
          clearInterval(interval4areaMeasurePanel);
          const dom = document.getElementsByClassName(
            'esri-area-measurement-3d__units-select esri-select'
          );
          const ops = dom[0];
          if (ops) {
            if (ops.length > 0) {
              for (let i = 0; i < ops.length; i += 1) {
                const tempValue = ops[i].value;
                if (tempValue === 'square-meters') {
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

// export default MeasureArea3D;
export default connect(({ agsmap }) => {
  return { agsmap };
})(MeasureArea3D);
