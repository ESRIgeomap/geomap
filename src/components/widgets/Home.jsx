import React from 'react';
import * as jsapi from '../../utils/jsapi';
import styles from './WidgetButtons.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.vm = null;
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.props.view.when(async view => {
      const [HomeViewModel] = await jsapi.load(['esri/widgets/Home/HomeViewModel']);
      this.vm = new HomeViewModel();
      this.vm.view = view;
    });
  }

  reset() {
    this.vm.go(this.vm.view.map.initialViewProperties.viewpoint);
  }

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '130px',
          right: '10px',
          zIndex: 12,
        }}
      >
        <a className={styles.tranfBtn} onClick={this.reset}>
          <span className="esri-icon-home" />
        </a>
      </div>
    );
  }
}

export default Home;
