import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Button, Tooltip, Tag, Icon, AutoComplete, Spin } from 'antd';

import CircuitTypeSelector from './CircuitTypeSelector';
import TerminalSelector from './TerminalSelector';
import RouteLocationSelector from './RouteLocationSelector';
import BusLineResult from './BusLineResult';
import DriveLineResult from './DriveLineResult';
import WalkLineResult from './WalkLineResult';
import RideLineResult from './RideLineResult';
import BusyIndicator from './BusyIndicator';
import ErrorIndicator from './ErrorIndicator';
import request from '../../../utils/request';

import * as SearchConsts from '../../../constants/search';
import styles from './RoutePlan.css';
import { VIEW_MODE_2D } from '../../../constants/action-types';

class RoutePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      hint: "路线",
      bShowMoreTypes: false, // 是否显示更多分类
      checkedTypeList: [], // 已经选中的分类列表，layerId
      bShowTypeList: false, // 搜索输入框下方是否显示分类列表，是：显示分类模块；否：隐藏分类模块
      bShowSmartTips: false, // 是否显示搜索框智能提示下拉列表
      bCollapseResults: false,
    };
    this.viewEventHandlers = null;
    this.mode = SearchConsts.MODE_DIRECTION;
  }

  // 组件渲染后调用
  componentDidMount() {
    this.registerEvents();
  }

  // 报错

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
        let viewPointerDownHandler = window.agsGlobal.view.on('drag', function (evt) {
          this.setState({
            bCollapseResults: true,
          });
        }.bind(this));

        let viewMouseWheelHandler = window.agsGlobal.view.on('mouse-wheel', function (evt) {
          this.setState({
            bCollapseResults: true,
          });
        }.bind(this));

        this.viewEventHandlers.push(viewPointerDownHandler, viewMouseWheelHandler); // viewClickHandler,
        window.clearInterval(timer);
      }
    }.bind(this), 50);
  }

  componentWillUnmount = () => {
    if (this.viewEventHandlers) {
      this.viewEventHandlers.map(item => {
        item.remove();
      });
      this.viewEventHandlers = null;
      document.body.onmousemove = null;
    }
    this.setState = (state, callback) => {
      return;
    };
  }

  onDirectionModeChange = (dirmode) => {
    this.props.dispatch({ type: 'search/switchDirMode', payload: dirmode });
  }

  handleStartInput = (text) => {
    this.props.dispatch({
      type: 'search/searchsolr',
      payload: {
        text,
        ltdir: '起点',
        start: 0,
      },
    });
  }

  handleEndInput = (text) => {
    this.props.dispatch({
      type: 'search/searchsolr',
      payload: {
        text,
        ltdir: '终点',
        start: 0,
      },
    });
  }

  handleOptSelect = (opt) => {
    this.props.dispatch({
      type: 'search/switchMode',
      payload: this.mode,
    });
    this.updateFoldFlag(false);
    this.props.dispatch({
      type: 'search/selectOpt',
      payload: opt,
    });
  }

  onReverDir = () => {
    let start = this.props.search.start;
    let end = this.props.search.end;

    this.props.dispatch({
      type: 'search/clearSearch', payload: {
        mode: SearchConsts.MODE_DIRECTION
      }
    });

    if (end) {
      this.props.dispatch({
        type: 'search/updateStart', payload: {
          mode: SearchConsts.MODE_DIRECTION,
          data: end,
          dirlttext: '起点',
        }
      });
      this.handleOptSelect(end);
    }
    if (start) {
      this.props.dispatch({
        type: 'search/updateEnd', payload: {
          mode: SearchConsts.MODE_DIRECTION,
          data: start,
          dirlttext: '终点',
        }
      });
      this.handleOptSelect(start);
    }

  }

  updateFoldFlag = (bFoldReuslt) => {
    this.props.dispatch({
      type: 'search/updateFoldFlag', payload: {
        mode: this.mode,
        bFoldReuslt: bFoldReuslt,
      }
    });
  }

  handleSearch = (e, featureType, bSmartTips, keyword, mapPoint) => {
    if (e)
      e.preventDefault();

    if (this.props.search.dirmode === SearchConsts.MODE_DIR_BUS) { // 公交导航

    } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_DRIVE) { // 开车导航

    } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_RIDE) { // 骑行导航

    } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_WALK) { // 步行导航

    }
  }

  enterDirectionMode = () => {
    this.props.dispatch({
      type: 'search/switchToolbarMode',
      payload: SearchConsts.MODE_DIRECTION,
    });
    this.props.dispatch({
      type: 'search/switchMode',
      payload: SearchConsts.MODE_DIRECTION,
    });
  }

  leaveDirectionMode = () => {
    this.props.dispatch({
      type: 'search/switchToolbarMode',
      payload: SearchConsts.MODE_LOCATION,
    });
    this.props.dispatch({
      type: 'search/switchMode',
      payload: SearchConsts.MODE_LOCATION,
    });
    this.props.dispatch({
      type: 'search/clearSearch', payload: {
        mode: SearchConsts.MODE_DIRECTION
      }
    });
  }

  handleDetailReturn = () => {
    this.props.dispatch({ type: 'search/clearPoi' });
    this.setState({
      bCollapseResults: false,
    });
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

  renderContent() {
    if (this.props.search.toolbarMode === SearchConsts.MODE_DIRECTION) {
      return <CircuitTypeSelector className={styles.dirselector} onChange={this.onDirectionModeChange.bind(this)} test='test' />
    }
  }

  renderDirButton() {
    if (this.props.search.toolbarMode === SearchConsts.MODE_DIRECTION) {
      return (
        <Tooltip title={"Close"}>
          <div className={styles.dirbtnwrap}>
            <span className={styles.dirbtnstub} />
            <Button icon="close" className={styles.dirclosebtn} onClick={this.leaveDirectionMode} />
          </div>
        </Tooltip>
      );
    }

    // return null;
  }

  renderRouteBox() {
    if (this.props.search.toolbarMode === SearchConsts.MODE_DIRECTION) {
      return (
        <TerminalSelector onStartInput={this.handleStartInput} onEndInput={this.handleEndInput} onReverDir={this.onReverDir.bind(this)} />
      );
    }

    return null;
  }

  renderLocationOptSelector() {
    if (this.props.search.diropts) {
      return (
        <RouteLocationSelector
          title={`${this.props.search.dirlttext} - ${this.props.search.diropttext}`}
          onSelect={this.handleOptSelect}
        />
      );
    }

    return null;
  }

  renderBusyIndicator() {
    if (this.props.search.loading) {
      return <BusyIndicator />;
    }

    return null;
  }

  renderResults() {
    if (this.props.search.mode === SearchConsts.MODE_DIRECTION) {
      if (this.props.search.dirmode === SearchConsts.MODE_DIR_BUS) {
        if (this.props.search.lines) {
          return <BusLineResult />;
        }
      } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_DRIVE) {
        if (this.props.search.driveresult) {
          return <DriveLineResult />;
        }
      } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_WALK) {
        if (this.props.search.walkresult) {
          return <WalkLineResult />;
        }
      } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_RIDE) {
        if (this.props.search.rideresult) {
          return <RideLineResult />;
        }
      }
    }

    return null;
  }

  renderErrorMsg() {
    if (this.props.search.hasError) {
      return <ErrorIndicator msg={this.props.search.errMsg} />;
    }

    return null;
  }

  renderSearchButton = () => {
    if (this.props.search.toolbarMode === SearchConsts.MODE_DIRECTION) {
      if (this.props.search.toolbarMode === SearchConsts.MODE_DIRECTION && this.props.search.searching) {
        return (
          <div className={styles.dirbtnwrap}>
            {/*<span className={styles.dirbtnstub} />*/}
            <Button icon="loading" className={styles.dirclosebtn} />
          </div>
        );
      } else {
        return (
          <Tooltip title={"Search"}>
            <Button
              icon="search"
              className={styles.searchbtn}
              onClick={this.handleSearch.bind(this)}
            />
          </Tooltip>
        )
      }
    }
  }

  calcPanelPosition = () => {
    let top = 40;
    let height = 0;
    if (this.props.search && this.props.search.list && this.props.search.list.order && this.props.search.list.order.length > 0) {
      let order = this.props.search.list.order;
      for (let index = 0; index < order.length; index++) {
        let mode = order[index];
        if (mode === this.mode) {
          break;
        }
        if (this.props.search.foldFlag[mode]) {
          top += 50;
        } else if (document.getElementById(mode + '_resultContainer')) {
          top += document.getElementById(mode + '_resultContainer').clientHeight + 5;
        }

      };

      height = document.body.offsetHeight - 115 - (order.length - 1) * 55 - 10;
    }
    return {
      top: top,
      height: height
    };
  }

  render() {
    let panelPosition = this.calcPanelPosition();
    return (
      <div
        key='fuzzyQueryContainer'
        className={styles.leftPanel}
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? (this.props.search.toolbarMode === this.mode ? 'block' : 'none') : 'none',
          left: this.props.agsmap.menusflags ? '280px' : '15px',
          top: this.props.agsmap.splitflags ? '-280px' : '70px',
        }}
      >
        <div className={styles.wrap} key='fuzzyQueryInnerContainer' id='fuzzyQueryInnerContainer'>
          {this.renderContent()}
          {/* {this.renderSearchButton()} */}
          {this.renderDirButton()}
        </div>
        <div className={styles.resultContainer} id={this.mode + '_resultContainer'}
          style={{ top: panelPosition.top + 'px', height: panelPosition.height + 'px', }}
        >
          {this.renderRouteBox()}
          {this.renderLocationOptSelector()}
          {/* {this.renderBusyIndicator()} */}
          {/* {this.renderResults()} */}
        </div>
        {this.renderErrorMsg()}
        {/* {this.renderSearchList()}
        {this.renderSearchDetail()} */}

      </div>
    );
  }
}

RoutePlan.propTypes = {
  dispatch: PropTypes.func,
};

export default connect(({ search, agsmap }) => {
  return {
    search,
    agsmap,
  };
})(RoutePlan);
