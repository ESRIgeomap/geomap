/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import envs from '../../utils/envs';
import env from '../../utils/env';
import { Spin } from 'antd';

import * as SearchConsts from '../../constants/search';
import styles from './IdentifyQuery.css';
import { VIEW_MODE_2D } from '../../constants/action-types';
import common from '../../utils/common';

class IdentifyQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mousePoint: [],
    };
    this.viewEventHandlers = null;
    this.mode = SearchConsts.MODE_IDENTIFY;
  }

  // 组件渲染后调用
  componentDidMount() {
    this.registerEvents();

    this.props.setCallBackFuncList(this.mode, {
      onTypeChange: this.onResultTypeChange.bind(this),
      onPageChange: this.onResultPageChange.bind(this),
    });
  }

  async registerEvents(evt) {
    if (this.viewEventHandlers) {
      this.viewEventHandlers.map(item => {
        item.remove();
      });
      this.viewEventHandlers = null;
      document.body.onmousemove = null;
    }
    let timer = window.setInterval(async function () {
      if (window.agsGlobal.view) {
        this.view = window.agsGlobal.view;
        this.viewEventHandlers = [];

        this.props.dispatch({
          type: 'agsmap/identifyChangeState',
          payload: true,
        });

        let self = this;
        let viewClickHandler = window.agsGlobal.view.on('click', function (evt) {
          if (!self.props.agsmap.identifyflags) {
            return;
          }
          window.setTimeout(function () {
            if (self.view && self.view.popup && self.view.popup.features && self.view.popup.features.length === 0) {
              self.props.dispatch({
                type: 'search/switchMode',
                payload: self.mode,
              });

              let geo = {
                latitude: evt.mapPoint.latitude,
                longitude: evt.mapPoint.longitude,
                type: 'point'
              };
              self.handleSearch(null, geo);
            }

          }, 100);
        });

        document.body.onmousemove = function (evt) {
          this.setState({
            mousePoint: [evt.clientX, evt.clientY]
          });
        }.bind(this);

        this.viewEventHandlers.push(viewClickHandler); // , viewPointerDownHandler, viewMouseWheelHandler
        window.clearInterval(timer);
      }
    }.bind(this), 50);
  }

  handleSearch = (e, mapPoint) => {
    if (e)
      e.preventDefault();

    this.props.dispatch({
      type: 'search/setQueryDataType',
      payload: {
        mode: this.mode,
        featureType: null
      }
    });
    this.updateFoldFlag(false);

    const { featureTypes, filters } = this.getVisibleTypes();
    let searchFilter = dojo.toJson(filters);
    let queryUrl = 'search/searchPoi';
    this.props.dispatch({
      type: queryUrl,
      payload: {
        mode: this.mode,
        keyword: null,
        bound: window.tdtCfg.maxBound,
        types: featureTypes.length > 0 ? featureTypes : '',
        param: {
          geometry: mapPoint ? mapPoint : null,
          bFromIdentify: true,
          center: (mapPoint.latitude + ',' + mapPoint.longitude),
          searchFilter: searchFilter,
          bQueryVisibleLayer: true,
          visibleLayerTypes: featureTypes,
        },
        pageInfo: { 'pageIndex': 1, 'pageSize': window.searchConfig.pageSize },
        bSmartTips: false
      },
    });

  }

  // clearSearchResult = () => {
  //   this.props.dispatch({ type: 'search/clearSearch' });
  // }

  // 判断图层可见性逻辑
  getVisibleTypes = () => {
    const view = envs.getParamAgs().view;
    const layers = view.map.layers;
    let types = [];
    const placeTypes = [];
    const filters = {};
    layers.map(l => {
      let typeitem = null;
      let filter = null;
      typeitem = window.searchConfig.typeList.find(t => {
        return t.layerName === (l.title && l.title.trim());
      });
      filter = window.geosearchcfg.layerFieldType.find(t => {
        return t.title === (l.title && l.title.trim());
      });
      if (typeitem && (filter == null || (typeitem.layerName !== filter.title))) {
        placeTypes.push(typeitem);
      }

      if (filter) {
        if (filters[filter.parentPlaceType] == null) {
          filters[filter.parentPlaceType] = filter.filter;
        } else {
          filters[filter.parentPlaceType] += ' or ' + filter.filter;
        }
        // types.push(filter.parentPlaceType);
      }
    });

    placeTypes.filter(Boolean).map(ty => {
      types.push(ty.placeType);
    });

    types = common.arrUnique(types);
    const featureTypes = [];
    types.map(ft => {
      featureTypes.push({ featureType: ft });
    });

    return {
      featureTypes: featureTypes,
      filters: filters
    };
  }

  getNamebyPnType(layerId) {
    var typeName = '';
    if (layerId === 'all') {
      typeName = '全部';
      return typeName;
    }

    var server;
    window.searchConfig.typeList.forEach(typeInfos => {
      if (typeInfos.layerId === layerId) {
        server = typeInfos;
        return false;
      }
    });
    if (!!server && !!server.layerName) {
      typeName = server.layerName;
    }
    return typeName;
  }

  updateFoldFlag = (bFoldReuslt) => {
    this.props.dispatch({
      type: 'search/updateFoldFlag', payload: {
        mode: this.mode,
        bFoldReuslt: bFoldReuslt,
      }
    });
  }

  handleDetailReturn = () => {
    this.props.dispatch({
      type: 'search/clearPoi', payload: {
        subMode: SearchConsts.SUBMODE_IDENTIFY_LIST
      }
    });
    this.updateFoldFlag(false);
  }

  onResultTypeChange(featureType) {
    this.props.dispatch({
      type: 'search/setQueryDataType',
      payload: {
        mode: this.mode,
        featureType: featureType
      },
    });

    // let filter = window.geosearchcfg.layerFieldType.find(t => {
    //   return t.parentPlaceType === (featureType && featureType.trim());
    // });

    let searchParams = this.props.search.list[this.mode];
    searchParams.pageInfo.pageIndex = 1;
    searchParams.param['bQueryDataBySingleType'] = true;
    this.props.dispatch({
      type: 'search/searchPoi',
      payload: {
        mode: this.mode,
        keyword: searchParams.keyword,
        bound: searchParams.bound,
        // types: filter != null ? '' : [{featureType: featureType }],
        types: [{ featureType: featureType }],
        param: searchParams.param,
        pageInfo: searchParams.pageInfo,
      },
    });
  }

  onResultPageChange(page) {
    let searchParams = this.props.search.list[this.mode];
    searchParams.pageInfo.pageIndex = page;
    this.props.dispatch({
      type: 'search/searchPoi',
      payload: {
        mode: this.mode,
        keyword: searchParams.keyword,
        bound: searchParams.bound,
        types: this.props.search.queryDataType[this.mode] ? [{ featureType: this.props.search.queryDataType[this.mode] }] : this.props.search.list[this.mode].types,
        param: searchParams.param,
        pageInfo: searchParams.pageInfo,
      },
    });
  }

  renderLoading = () => {
    if (this.props.search.mode === this.mode && this.props.search.searching) {
      return (
        <div className={styles.loadingPic} style={{ top: (this.state.mousePoint[1] - 10) + 'px', left: (this.state.mousePoint[0] + 10) + 'px' }}>
          <img src='../images/loading.gif' alt='' />
        </div>
      );
    }
  }

  render() {
    let top = 110;
    return (
      <div
        key='IdentifyQueryContainer'
        className={styles.leftPanel}
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
          left: this.props.agsmap.menusflags ? '280px' : '15px',
          top: this.props.agsmap.splitflags ? '-280px' : (top + 'px'),
        }}
      >
        {this.renderLoading()}
      </div>
    );
  }
}

IdentifyQuery.propTypes = {
  dispatch: PropTypes.func,
};

export default connect(({ search, agsmap }) => {
  return {
    search,
    agsmap,
  };
})(IdentifyQuery);
