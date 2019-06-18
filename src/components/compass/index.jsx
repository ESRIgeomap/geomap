import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as jsapi from '../../utils/jsapi';
import styles from './index.css';

function toRotationTransform(orientation) {
  return {
    display: 'inline-block',
    fontSize: '24px',
    transform: `rotateZ(${orientation.z}deg)`,
  };
}
/**
 * 罗盘微件
 */
const Compass = props => {
  const { view } = props;
  const [vm,setVm] = useState(null);
  const [orientation, setOrientation] = useState({
    z: 0,
  });

  useEffect(() => {
    let handle;
    // view 有三种取值，undefine，2d，3d
    if (view) {
      if (handle) {
        handle.remove();
      }
      handle = createWidget(window.agsGlobal.view);
    }
  }, [view]);

  const createWidget = view => {
    jsapi.load(['esri/widgets/Compass/CompassViewModel']).then(([CompassViewModel]) => {
      const vmstate = new CompassViewModel();
      vmstate.view = view;
      vmstate.watch('orientation', orientation => {
        setOrientation(orientation);
      });
      setVm(vmstate);
    });
  };

  const reset = () => {
    vm.reset();
  };

  return (
    <div {...props}>
      <a className={styles.compassBtn} onClick={reset}>
        <span className="esri-icon-compass" style={toRotationTransform(orientation)} />
      </a>
    </div>
  );
};

export default connect(({ agsmap }) => {
  return { agsmap };
})(Compass);
