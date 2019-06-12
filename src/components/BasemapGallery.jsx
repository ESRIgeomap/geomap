import React from 'react';

import { jsapi } from '../constants/geomap-utils';

class BasemapGallery extends React.PureComponent {
  componentDidMount() {
    if (this.props.view) {
      this.createWidget(this.props.view);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.view) {
      this.createWidget(nextProps.view);
    }
  }

  async createWidget(view) {
    const [BasemapGalleryWidget] = await jsapi.load(['esri/widgets/BasemapGallery']);
    const div = document.createElement('div');
    div.className = 'map-basemaps';
    const basemapGallery = new BasemapGalleryWidget({
      container: div,
      view: view,
    });
    this.container.innerHTML = '';
    this.container.appendChild(div);
  }

  render() {
    return <div {...this.props} ref={node => (this.container = node)} />;
  }
}

export default BasemapGallery;
