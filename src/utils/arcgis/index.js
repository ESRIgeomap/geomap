import _ from 'lodash';

export default {
  isViewReady() {
    return _.get(window.agsGlobal, 'view');
  },
};
