import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as jsapi from '../../utils/jsapi';
import styles from './Compass.css';

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
  let vm = null;
  const [orientation, setOrientation] = useState({
    z: 0,
  });

  useEffect(() => {
    if (props.agsmap.sceneviewCreated) {
      createWidget(window.agsGlobal.view);
    }
  }, [props.agsmap.sceneviewCreated]);

  const createWidget = view => {
    jsapi.load(['esri/widgets/Compass/CompassViewModel']).then(([CompassViewModel]) => {
      vm = new CompassViewModel();
      vm.view = view;
      vm.watch('orientation', orientation => {
        setOrientation(orientation);
      });
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
