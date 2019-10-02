import React from 'react';
import { connect } from 'dva';
import FuzzyQuery from './FuzzyQuery';
import IdentifyQuery from './IdentifyQuery';
import RoutePlan from './RoutePlan';
import SearchResultCollapsePanel from './SearchResultCollapsePanel';
import env from '../../utils/env';
import styles from './Search.css';
import SpaceQuery from '../spacequery/SpaceQuery';
import * as SearchConsts from '../../constants/search';
// import GeometryService from 'esri/tasks/geometryService';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.callbackFuncList = {};
    this.widgetList = {};
    this.callbackFuncList[SearchConsts.MODE_LOCATION] = {};
    this.callbackFuncList[SearchConsts.MODE_DIRECTION] = {};
    this.callbackFuncList[SearchConsts.MODE_IDENTIFY] = {};
    this.callbackFuncList[SearchConsts.MODE_SPACE] = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // const geomServ = new GeometryService({
    //   url: window.appcfg.geometryService,
    // });
  }

  render() {
    return (
      <div className='searchContainer'>
        <FuzzyQuery setCallBackFuncList={this.setCallBackFuncList} />
        <SpaceQuery setCallBackFuncList={this.setCallBackFuncList} />
        <IdentifyQuery setCallBackFuncList={this.setCallBackFuncList} />
        <RoutePlan setCallBackFuncList={this.setCallBackFuncList} />
        <SearchResultCollapsePanel
          callbackFuncList={this.callbackFuncList}
        />
      </div>
    );
  }

  onComponentRef = (mode,ref ) => {
    this.widgetList[mode] = ref;
  }

  setCallBackFuncList =(mode, funcList)=>{
    this.callbackFuncList[mode] = funcList;
  }
}

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(Search);
