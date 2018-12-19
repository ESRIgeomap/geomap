import React from 'react';
import { Tooltip } from 'antd';
import * as jsapi from '../../utils/jsapi';
import styles from './WidgetButtons.css';

class BasemapGallery extends React.Component {
  constructor(props) {
    super(props);
    this.status = {
      vm: {},
      view: {},
      destroy: false,
    };
    this.createBasemapGallery = this.createBasemapGallery.bind(this);
  }

  componentDidMount() {
    this.props.view.when(view => {
      this.status.view = view;
    });
  }

  async createBasemapGallery() {
    if (!this.state.destroy) {
      const [BasemapGalleryViewModel] = await jsapi.load([
        'esri/widgets/BasemapGallery/BasemapGalleryViewModel',
      ]);
      this.status.vm = new BasemapGalleryViewModel();
      this.status.vm.view = this.status.view;
      this.status.destroy = true;
    } else {
      this.status.vm.destroy();
      this.status.destroy = false;
    }
  }
  render() {
    return (
      <div>
        <Tooltip placement="left" title="底图">
          <a className={styles.btn} onClick={this.createBasemapGallery}>
            <span className="esri-icon-pan" />
          </a>
        </Tooltip>
        <br />
      </div>
    );
  }
}

export default BasemapGallery;
