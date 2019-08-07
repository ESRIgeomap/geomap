import React from 'react';
import ReactDOM from 'react-dom';
import Overviewmap from '../components/overviewmap/Overviewmap';

export default {
  // 鹰眼
  createOverView(view) {
    const overmapDiv = document.createElement('div');
    overmapDiv.id = "overmapDiv";
    view.ui.add(overmapDiv, {
      position: 'bottom-left',
    });
    ReactDOM.render(<Overviewmap view={view} />, overmapDiv);
    // 默认2d不显示鹰眼
    overmapDiv.style.display = 'none';
  },
};
