import { connect } from 'dva';
import _ from 'lodash';
import { ScrollContent } from '../layout';

import ClosePanel from './ClosePanel';

import * as Widgets from '../widgets';
import {ACTION_MAP_PRINT_3D} from '../../constants/action-types';

const RightContent = ({ dispatch, toolbar, maxHeight ,Lightshadow}) => {
  function clear() {
    dispatch({ type: 'toolbar/updateCurrentView', payload: null });
  }

  function renderContent() {
    switch (toolbar.current) {
      case 'measure-line-2d': {
        return (
          <ClosePanel title="2D 测距" maxHeight={maxHeight} onClose={clear}>
            <Widgets.MeasureLine2D view={_.get(window.agsGlobal, 'view')} />
          </ClosePanel>
        );
      }
      case 'measure-area-2d': {
        return (
          <ClosePanel title="2D 测面" maxHeight={maxHeight} onClose={clear}>
            <Widgets.MeasureArea2D view={_.get(window.agsGlobal, 'view')} />
          </ClosePanel>
        );
      }
      case 'legend': {
        return (
          <ClosePanel title="地图图例" maxHeight={maxHeight} onClose={clear}>
            <Widgets.Legend view={_.get(window.agsGlobal, 'view')} />
          </ClosePanel>
        );
      }
      case 'measure-line-3d': {
        return (
          <ClosePanel title="3D 测距" maxHeight={maxHeight} onClose={clear}>
            <Widgets.MeasureLine3D view={_.get(window.agsGlobal, 'view')} />
          </ClosePanel>
        );
      }
      case 'measure-area-3d': {
        return (
          <ClosePanel title="3D 测面" maxHeight={maxHeight} onClose={clear}>
            <Widgets.MeasureArea3D view={_.get(window.agsGlobal, 'view')} />
          </ClosePanel>
        );
      }
      case 'map-print-3d': {
        dispatch({
          type: ACTION_MAP_PRINT_3D,
        });
        break;
      }
      default:break;
    }

    return null;
  }

  return renderContent();
};

export default connect(({ toolbar,Lightshadow }) => {
  return { 
    toolbar,
    Lightshadow,
   };
})(RightContent);
