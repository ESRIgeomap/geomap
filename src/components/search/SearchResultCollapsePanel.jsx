import React from 'react';
import { connect } from 'dva';
import { Collapse, Icon } from 'antd';

import styles from './SearchResultCollapsePanel.css';
import SearchResultList from './SearchResultList';
import SearchResultDetail from './SearchResultDetail';
import * as SearchConsts from '../../constants/search';
import BusLineResult from './BusLineResult';
import DriveLineResult from './DriveLineResult';
import WalkLineResult from './WalkLineResult';
import RideLineResult from './RideLineResult';

const Panel = Collapse.Panel;

class SearchResultCollapsePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.activePanelKey = '';
    this.activePanelMaxHeight = 0;

    this.customPanelStyle = {
      marginBottom: 8,
      border: 0
    };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    this.handleSubLayerConfig();
    // this.updateDimensions();
  }

  // componentDidMount() {
  //   window.addEventListener('resize', this.updateDimensions);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updateDimensions);
  // }

  render() {
    this.activePanelKey = '';
    if (this.props.search.poi) {
      this.activePanelKey = 'detail';
    } else {
      this.props.search.foldFlag && Object.keys(this.props.search.foldFlag).forEach(mode => {
        if (!this.props.search.foldFlag[mode]) {
          this.activePanelKey = mode;
          return;
        }
      });
    }

    this.calcPanelMaxHeight();

    return (
      <div className={styles.searchResultCollapsePanel}
        style={{ top: this.props.search.toolbarMode === SearchConsts.MODE_DIRECTION ? 210 + 'px' : 114 + 'px' }}
      >
        <Collapse
          accordion // 手风琴模式，只展开一个
          // bordered={false}
          activeKey={this.activePanelKey + '-resultPanel'}
          className={styles.collapsePanel}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />
          }
        >
          {this.renderResultListPanel()}
          {this.renderSearchDetail()}

        </Collapse>
      </div>
    );
  }

  renderResultListPanel = () => {
    let panel = [];

    panel.push(this.renderFuzzyResultPanel());
    panel.push(this.renderIdentifyResultPanel());
    panel.push(this.renderSpatialResultPanel());
    panel.push(this.renderRouteResultPanel());

    return panel;
  }

  // 渲染模糊查询结果面板
  renderFuzzyResultPanel = () => {
    let mode = SearchConsts.MODE_LOCATION;
    if (this.props.search && this.props.search.list && this.props.search.list[mode] && this.props.search.list[mode].results.length > 0) {
      let data = this.props.search.list[mode];
      let bFoldResults = this.props.search.foldFlag[mode];
      let header = <div onMouseEnter={function () { this.handleMouseOver(mode); }.bind(this)}>{(this.activePanelKey === mode ? '' : '返回') + '模糊查询结果'}</div>;
      if (this.activePanelKey === mode)
        header = <div onMouseEnter={function () { this.handleMouseOver(mode); }.bind(this)}>模糊查询结果</div>;

      return (
        <Panel
          header={header}
          key={mode + '-resultPanel'}
          showArrow={false}
          style={this.customPanelStyle}
        >
          <div className={styles.resultContainer} id={mode + '_resultContainer'} style={this.activePanelKey === mode ? { overflowX: 'hidden', overflowY: 'auto', maxHeight: this.activePanelMaxHeight } : {}}>
            {/* <div className={bFoldResults ? styles.collapseTitleDiv : styles.hideCollapseTitleDiv} onClick={this.handleMouseClick} >&lt; 返回模糊查询结果列表，共找到{data.pageInfo.rowCount}条记录</div> */}
            <div className={bFoldResults ? styles.resultPanelClose : styles.resultPanelOpen}>
              <SearchResultList
                mode={mode}
                keyword={this.props.search.keyword}
                data={data}
                callbackFuncList={this.props.callbackFuncList[mode]}
              />
            </div>
          </div>
        </Panel>
      );
    }

    return null;
  }

  // 渲染属性查询结果面板
  renderIdentifyResultPanel = () => {
    let mode = SearchConsts.MODE_IDENTIFY;
    if (this.props.search && this.props.search.list && this.props.search.list[mode] && this.props.search.list[mode].results.length > 0) {
      let data = this.props.search.list[mode];
      let bFoldResults = this.props.search.foldFlag[mode];
      let header = <div onMouseEnter={function () { this.handleMouseOver(mode); }.bind(this)}>{(this.activePanelKey === mode ? '' : '返回') + '属性查询结果'}<Icon type="close" className={styles.panelCloseBtn} onClick={() => { this.onPanelClose(mode) }} /></div>;
      if (this.activePanelKey === mode)
        header = <div onMouseEnter={function () { this.handleMouseOver(mode); }.bind(this)}>{(this.activePanelKey === mode ? '' : '返回') + '属性查询结果'}<Icon type="close" className={styles.panelCloseBtn} onClick={() => { this.onPanelClose(mode) }} /></div>;
      return (
        <Panel
          header={header}
          key={mode + '-resultPanel'}
          showArrow={false}
          style={this.customPanelStyle}
        >
          <div className={styles.resultContainer} id={mode + '_resultContainer'} style={this.activePanelKey === mode ? { overflowX: 'hidden', overflowY: 'auto', maxHeight: this.activePanelMaxHeight } : {}}>
            {/* <div className={bFoldResults ? styles.collapseTitleDiv : styles.hideCollapseTitleDiv} onClick={this.handleMouseClick} >&lt; 返回属性查询结果列表，共找到{data.pageInfo.rowCount}条记录</div> */}
            <div className={bFoldResults ? styles.resultPanelClose : styles.resultPanelOpen}>
              <SearchResultList
                // <SearchResultList
                mode={mode}
                keyword={this.props.search.keyword}
                data={data}
                callbackFuncList={this.props.callbackFuncList[mode]}
                title={"属性查询结果"}
              />
            </div >
          </div >
        </Panel>
      );
    }
    // }

    return null;
  }

  // 当结果面板关闭时执行的事件
  onPanelClose = (mode) => {
    this.props.dispatch({
      type: 'search/clearSearch', payload: {
        mode: mode
      }
    });

    if (mode === SearchConsts.MODE_SPACE && window.agsGlobal.view.map.findLayerById('graphicLayer')) {
      window.agsGlobal.view.map.findLayerById('graphicLayer').removeAll();
    }
  }

  // 渲染空间查询结果面板
  renderSpatialResultPanel = () => {
    let mode = SearchConsts.MODE_SPACE;

    if (this.props.search && this.props.search.list && this.props.search.list[mode] && this.props.search.list[mode].results.length > 0) {
      let data = this.props.search.list[mode];
      let bFoldResults = this.props.search.foldFlag[mode];
      let header = <div onMouseEnter={function () { this.handleMouseOver(mode); }.bind(this)}><span className={styles.panelTitleReturn}>返回空间查询结果</span><Icon type="close" className={styles.panelCloseBtn} onClick={() => { this.onPanelClose(mode) }} /></div>;
      if (this.activePanelKey === mode)
        header = <div onMouseEnter={function () { this.handleMouseOver(mode); }.bind(this)}>空间查询结果<Icon type="close" className={styles.panelCloseBtn} onClick={() => { this.onPanelClose(mode) }} /></div>
      return (
        <Panel
          header={header}
          key={mode + '-resultPanel'}
          showArrow={false}
          style={this.customPanelStyle}
        >
          <div className={styles.resultContainer} id={mode + '_resultContainer'} style={this.activePanelKey === mode ? { overflowX: 'hidden', overflowY: 'auto', maxHeight: this.activePanelMaxHeight } : {}}>
            {/* <div className={bFoldResults ? styles.collapseTitleDiv : styles.hideCollapseTitleDiv} onClick={this.handleMouseClick} >&lt; 返回属性查询结果列表，共找到{data.pageInfo.rowCount}条记录</div> */}
            <div className={bFoldResults ? styles.resultPanelClose : styles.resultPanelOpen}>
              <SearchResultList
                mode={mode}
                keyword={this.props.search.keyword}
                data={data}
                callbackFuncList={this.props.callbackFuncList[mode]}
                title={"属性查询结果"}
              />
            </div >
          </div >
        </Panel>
      );
    }

    return null;
  }

  // 渲染详细属性信息面板
  renderSearchDetail = () => {
    // let mode = SearchConsts.SUBMODE_IDENTIFY_DETAIL;
    let mode = 'detail';
    if (this.props.search.poi) {
      return (
        <Panel header={<div>详细信息<Icon type="close" className={styles.panelCloseBtn} onClick={() => { this.onDeatilPanelClose(this.props.search.mode) }} /></div>} key={'detail-resultPanel'} style={this.customPanelStyle} showArrow={false}>
          <div className={styles.detailPanel} style={this.activePanelKey === mode ? { overflowX: 'hidden', overflowY: 'auto', maxHeight: this.activePanelMaxHeight } : {}}>
            <SearchResultDetail
              keyword={this.props.search.keyword}
            />
          </div>
        </Panel>
      );
    } else {
      return null;
    }
  }

  // 渲染路径规划结果面板
  renderRouteResultPanel = () => {
    let mode = SearchConsts.MODE_DIRECTION;

    let content = this.renderResults();
    if (content) {
      return (
        <Panel header={<div onMouseEnter={function () { this.handleMouseOver(mode); }.bind(this)}>导航结果</div>}
          key={mode + '-resultPanel'} style={this.customPanelStyle}>
          <div style={this.activePanelKey === mode ? { overflowX: 'hidden', overflowY: 'auto', maxHeight: this.activePanelMaxHeight } : {}} >
            {content}
          </div>
        </Panel>
      );
    }
  }

  renderResults() {
    // if (this.props.search.mode === SearchConsts.MODE_DIRECTION) {
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
    // }

    return null;
  }

  // 结果面板鼠标悬浮时打开该面板，并在地图中进行标号
  handleMouseOver = (mode) => {
    this.props.dispatch({
      type: 'search/clearPoi', payload: {
        subMode: SearchConsts.SUBMODE_IDENTIFY_LIST
      }
    });
    if (this.props.search.foldFlag[mode]) {
      this.updateFoldFlag(mode, false);
      if (mode !== SearchConsts.MODE_DIRECTION) {
        this.props.dispatch({
          type: 'search/drawSearchResultGraphics', payload: {
            mode: mode,
            list: this.props.search.list[mode],
          }
        });
      }
    }
  }

  // 控制面板开关状态
  updateFoldFlag = (mode, bFoldReuslt) => {
    this.props.dispatch({
      type: 'search/updateFoldFlag', payload: {
        mode: mode,
        bFoldReuslt: bFoldReuslt,
      }
    });
  }

  // 详细信息面板关闭事件
  onDeatilPanelClose = (mode) => {
    this.props.dispatch({
      type: 'search/clearPoi', payload: {
        subMode: mode
      }
    });
  }

  // 控件加载时，处理config.js中的layerFieldType,方便在查询结果面板展示子类名称
  async handleSubLayerConfig() {
    // eslint-disable-next-line no-extend-native
    String.prototype.replaceAll = function (FindText, RepText) {
      let regExp = new RegExp(FindText, 'g');
      return this.replace(regExp, RepText);
    };
    let subLayerConfig = {};
    window.geosearchcfg.layerFieldType.map((item, index) => {
      subLayerConfig[item.parentPlaceType] == null && (subLayerConfig[item.parentPlaceType] = {});
      let fieldName = item.filter.substring(0, item.filter.indexOf(':'));
      let fieldValues = [];
      subLayerConfig[item.parentPlaceType]['fieldName'] = fieldName;
      subLayerConfig[item.parentPlaceType]['subLayerValues'] == null && (subLayerConfig[item.parentPlaceType]['subLayerValues'] = []);
      let filter = item.filter;
      while (filter && filter.indexOf(':') > -1) {
        filter = filter.substring(filter.indexOf(':') + 1, filter.length);
        if (filter.toLowerCase().indexOf(' or ') > -1) {
          fieldValues.push(filter.substring(0, filter.indexOf(' ')));
        } else {
          fieldValues.push(filter.replaceAll(' ', ''));
        }
      }
      subLayerConfig[item.parentPlaceType]['subLayerValues'].push({
        title: item.title,
        fieldValues: fieldValues
      });
    });
    window.searchConfig.subLayerConfig = subLayerConfig;
  }

  // 计算展开面板的最大高度
  calcPanelMaxHeight = () => {
    let colPanelHeight = document.body.offsetHeight - (this.props.search.toolbarMode === SearchConsts.MODE_DIRECTION ? 210 : 114) - 15;

    let modeList = [SearchConsts.MODE_LOCATION, SearchConsts.MODE_IDENTIFY, SearchConsts.MODE_SPACE];
    modeList.map(mode => {
      if (this.props.search && this.props.search.list && this.props.search.list[mode] && this.props.search.list[mode].results.length > 0) {
        colPanelHeight = colPanelHeight - 42 - 8;
      }
    });

    if (this.props.search && this.props.search.poi) {
      colPanelHeight = colPanelHeight - 42 - 8;
    }

    if (this.props.search && ((this.props.search.dirmode === SearchConsts.MODE_DIR_BUS && this.props.search.lines && this.props.search.lines.length > 0) ||
      (this.props.search.dirmode === SearchConsts.MODE_DIR_DRIVE && this.props.search.driveresult && this.props.search.driveresult.length > 0) ||
      (this.props.search.dirmode === SearchConsts.MODE_DIR_WALK && this.props.search.walkresult && this.props.search.walkresult.length > 0) ||
      (this.props.search.dirmode === SearchConsts.MODE_DIR_RIDE && this.props.search.rideresult && this.props.search.rideresult.length > 0)
    )) {
      colPanelHeight = colPanelHeight - 42 - 8;
    }

    this.activePanelMaxHeight = colPanelHeight;
  }

  updateDimensions = () => {
    this.calcPanelMaxHeight();
  }
}

export default connect(({ agsmap, search }) => {
  return {
    agsmap,
    search,
  };
})(SearchResultCollapsePanel);
