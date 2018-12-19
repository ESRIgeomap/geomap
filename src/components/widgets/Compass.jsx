import React from 'react';
import * as jsapi from '../../utils/jsapi';
import styles from './WidgetButtons.css';

function toRotationTransform(orientation) {
  return {
    display: 'inline-block',
    fontSize: '24px',
    transform: `rotateZ(${orientation.z}deg)`,
  };
}

class Compass extends React.Component {
  constructor(props) {
    super(props);
    this.vm = null;
    this.state = {
      orientation: {
        z: 0,
      },
    };

    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.props.view.when(async view => {
      const [CompassViewModel] = await jsapi.load(['esri/widgets/Compass/CompassViewModel']);
      this.vm = new CompassViewModel();
      this.vm.view = view;
      this.vm.watch('orientation', orientation => {
        this.setState({
          orientation,
        });
      });
    });
  }

  reset() {
    this.vm.reset();
  }

  render() {
    const { orientation } = this.state;

    return (
      <div
        style={{
          position: 'absolute',
          bottom: '160px',
          right: '0',
          zIndex: 12,
        }}
      >
        <a className={styles.compassBtn} onClick={this.reset}>
          <span className="esri-icon-compass" style={toRotationTransform(orientation)} />
        </a>
      </div>
    );
  }
}

export default Compass;
