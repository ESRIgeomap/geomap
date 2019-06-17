import { connect } from 'dva';
import _ from 'lodash';
import { ScrollContent } from '../layout';

import ClosePanel from './ClosePanel';

import * as Widgets from '../widgets';

const RightContent = ({ dispatch, toolbar, maxHeight }) => {
  function clear() {
    dispatch({ type: 'toolbar/updateCurrentView', payload: null });
  }

  function renderContent() {
    switch (toolbar.current) {
      case 'measure-2d': {
        return (
          <ClosePanel title="2D 测距" maxHeight={maxHeight} onClose={clear}>
            <Widgets.MeasureLine2D view={_.get(window.agsGlobal, 'view')} />
          </ClosePanel>
        );
      }
      default:
        break;
    }

    return null;
  }

  return renderContent();
};

export default connect(({ toolbar }) => {
  return { toolbar };
})(RightContent);
