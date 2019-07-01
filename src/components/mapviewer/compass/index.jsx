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
 * @author  lee  
 */
const Compass = props => {
  const [vm,setVm] = useState(null);
  const [orientation, setOrientation] = useState({
    z: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.agsGlobal.view) {
        clearInterval(timer);
        createWidget(window.agsGlobal.view);
      }
    }, 300);
  }, []);

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
