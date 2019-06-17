import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Button, Tooltip } from 'antd';

import * as RouteComponents from './routes';

// import CircuitTypeSelector from './CircuitTypeSelector';
// import TerminalSelector from './TerminalSelector';
// import RouteLocationSelector from './RouteLocationSelector';
// import BusLineResult from './BusLineResult';
// import DriveLineResult from './DriveLineResult';
// import RideLineResult from './RideLineResult';
// import WalkLineResult from './WalkLineResult';
// import BusyIndicator from './BusyIndicator';
// import ErrorIndicator from './ErrorIndicator';

import SearchResultList from './SearchResultList';
import SearchResultDetail from './SearchResultDetail';
import Classquery from './ClassificationQuery';

import * as SearchConsts from '../../constants/search';
import styles from './GeoSearch.css';
import { VIEW_MODE_2D } from '../../constants/action-types';

function displayText(text) {
  if (text.length < 4) {
    return text;
  }

  return `${text.substr(0, 4)}...`;
}

class GeoSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      hint: '搜地点、查公交、找路线',
      nearbycode: null,
      nearbytext: '',
    };
    this.enterDirectionMode = ::this.enterDirectionMode;
    this.leaveDirectionMode = ::this.leaveDirectionMode;
    this.onDirectionModeChange = ::this.onDirectionModeChange;
    this.handleStartInput = ::this.handleStartInput;
    this.handleSearch = ::this.handleSearch;
    this.handleSearchtwo = ::this.handleSearchtwo;
    this.handleEndInput = ::this.handleEndInput;
    this.handleOptSelect = ::this.handleOptSelect;
    this.clearSearchResult = ::this.clearSearchResult;
    this.handleClassqueryVisble = ::this.handleClassqueryVisble;
    this.handleClassqueryNone = ::this.handleClassqueryNone;
    this.handleDetailReturn = ::this.handleDetailReturn;
    this.handleNearbyClick = ::this.handleNearbyClick;
    this.closeNearbySearch = ::this.closeNearbySearch;
    this.handleReturnFromNearbyList = ::this.handleReturnFromNearbyList;
    this.handleNearbyDetailReturn = ::this.handleNearbyDetailReturn;
  }

  componentDidMount() {
    const body = document.getElementsByTagName('body')[0];
    body.onclick = this.handleClassqueryNone;
  }

  onDirectionModeChange(dirmode) {
    this.props.dispatch({ type: 'search/switchDirMode', payload: dirmode });
  }

  handleStartInput(text) {
    this.props.dispatch({
      type: 'search/searchsolr',
      payload: {
        text,
        ltdir: '起点',
        start: 0,
      },
    });
  }

  handleEndInput(text) {
    this.props.dispatch({
      type: 'search/searchsolr',
      payload: {
        text,
        ltdir: '终点',
        start: 0,
      },
    });
  }

  handleOptSelect(opt) {
    this.props.dispatch({
      type: 'search/selectOpt',
      payload: opt,
    });
  }

  handleSearch(e) {
    e.preventDefault();
    if (
      this.props.search.submode === SearchConsts.SUBMODE_LOCATION_NEARBY &&
      this.state.nearbytext
    ) {
      this.props.dispatch({
        type: 'search/searchNearby',
        payload: {
          point: this.props.search.poi,
          keyword: this.state.nearbytext,
        },
      });
    } else if (this.state.text) {
      this.props.dispatch({
        type: 'search/searchPoi',
        payload: {
          keyword: this.state.text,
          bound: window.tdtCfg.maxBound,
        },
      });
    }
  }

  handleSearchtwo(item) {
    if (this.props.search.submode === SearchConsts.SUBMODE_LOCATION_NEARBY) {
      this.setState({ nearbycode: item.code, nearbytext: item.alias });
      this.props.dispatch({
        type: 'search/searchNearbyCategory',
        payload: {
          keyword: item.alias,
          point: this.props.search.poi,
          tolerance: '3000',
          bound: window.tdtCfg.maxBound,
        },
      });
    } else {
      this.setState({ text: item.alias });
      this.props.dispatch({
        type: 'search/searchCategory',
        payload: {
          keyword: item.alias,
          bound: window.tdtCfg.maxBound,
        },
      });
    }
  }

  handleReturnFromNearbyList() {
    this.props.dispatch({
      type: 'search/switchSubmode',
      payload: SearchConsts.SUBMODE_LOCATION_DETAIL,
    });
    this.props.dispatch({
      type: 'search/clearNearbyData',
    });
    if (this.props.search.list) {
      this.props.dispatch({
        type: SearchConsts.MAP_ACTION_DRAW_POI,
        payload: {
          result: this.props.search.list,
          page: this.props.search.poipager.current,
        },
      });
    } else {
      this.props.dispatch({
        type: SearchConsts.MAP_ACTION_CLEAR,
      });
    }
  }

  enterDirectionMode() {
    this.props.dispatch({
      type: 'search/switchMode',
      payload: SearchConsts.MODE_DIRECTION,
    });
    this.props.dispatch({
      type: 'search/changeClassquery',
      payload: false,
    });
  }

  leaveDirectionMode() {
    this.props.dispatch({
      type: 'search/switchMode',
      payload: SearchConsts.MODE_LOCATION,
    });
    // this.props.dispatch({ type: 'search/clearSearch' });
    this.props.dispatch({
      type: 'search/clearSearch',
      payload: SearchConsts.MODE_LOCATION,
    });
  }

  clearSearchResult() {
    this.props.dispatch({ type: 'search/clearSearch' });
  }

  closeNearbySearch() {
    this.props.dispatch({
      type: 'search/switchSubmode',
      payload: SearchConsts.SUBMODE_LOCATION_DETAIL,
    });
    this.props.dispatch({
      type: 'search/clearNearbyData',
    });
    if (this.props.search.list) {
      this.props.dispatch({
        type: SearchConsts.MAP_ACTION_DRAW_POI,
        payload: {
          result: this.props.search.list,
          page: this.props.search.poipager.current,
        },
      });
    } else {
      this.props.dispatch({
        type: SearchConsts.MAP_ACTION_CLEAR,
      });
    }
  }

  handleClassqueryVisble() {
    this.props.dispatch({
      type: 'search/changeClassquery',
      payload: true,
    });
  }

  handleClassqueryNone() {
    this.props.dispatch({
      type: 'search/changeClassquery',
      payload: false,
    });
  }

  handleClassqueryChoose() {
    if (this.props.search.groupquery) {
      this.handleClassqueryNone();
    } else {
      this.handleClassqueryVisble();
    }
  }

  handleDetailReturn() {
    this.props.dispatch({ type: 'search/clearPoi' });
  }

  handleNearbyDetailReturn() {
    this.props.dispatch({ type: 'search/clearNearbyPoi' });
  }

  handleNearbyClick() {
    this.setState({ nearbytext: '' });
    this.props.dispatch({ type: 'search/clearNearbyState' });
  }

  renderContent() {
    if (this.props.search.mode === SearchConsts.MODE_LOCATION) {
      switch (this.props.search.submode) {
        case SearchConsts.SUBMODE_LOCATION_NEARBY:
        case SearchConsts.SUBMODE_LOCATION_NEARBY_DETAIL:
          return (
            <div className={styles.inputgroup}>
              <span className={styles.inputhint}>
                在
                <a
                  title={this.props.search.poi.attributes[window.poiCfg[0].displayField]}
                >{`${displayText(
                  this.props.search.poi.attributes[window.poiCfg[0].displayField]
                )}`}</a>
                附近搜索
              </span>
              <Input
                className={styles.input}
                value={this.state.nearbytext}
                placeholder={this.state.hint}
                onChange={evt => {
                  this.setState({ nearbytext: evt.target.value });
                }}
                onClick={() => {
                  if (!this.state.nearbytext) {
                    this.handleClassqueryChoose();
                  }
                }}
              />
            </div>
          );
        default:
          return (
            <Input
              className={styles.input}
              value={this.state.text}
              placeholder={this.state.hint}
              onChange={evt => {
                this.setState({ text: evt.target.value });
              }}
              onClick={() => {
                if (
                  !this.state.text &&
                  this.props.search.submode !== SearchConsts.SUBMODE_LOCATION_DETAIL
                ) {
                  this.handleClassqueryChoose();
                }
              }}
            />
          );
      }
    }

    return (
      <RouteComponents.TypeSelector
        className={styles.dirselector}
        onChange={this.onDirectionModeChange}
      />
    );
  }

  renderDirButton() {
    if (this.props.search.mode === SearchConsts.MODE_LOCATION) {
      if (this.props.search.searching) {
        return (
          <div className={styles.dirbtnwrap}>
            <span className={styles.dirbtnstub} />
            <Button icon="loading" className={styles.dirclosebtn} />
          </div>
        );
      }

      switch (this.props.search.submode) {
        case SearchConsts.SUBMODE_LOCATION_LIST:
        case SearchConsts.SUBMODE_LOCATION_DETAIL:
          return (
            <Tooltip title="退出">
              <div className={styles.dirbtnwrap}>
                <span className={styles.dirbtnstub} />
                <Button
                  icon="close"
                  className={styles.dirclosebtn}
                  onClick={this.clearSearchResult}
                />
              </div>
            </Tooltip>
          );
        case SearchConsts.SUBMODE_LOCATION_NEARBY:
        case SearchConsts.SUBMODE_LOCATION_NEARBY_DETAIL:
          return (
            <Tooltip title="关闭附近搜索">
              <div className={styles.dirbtnwrap}>
                <span className={styles.dirbtnstub} />
                <Button
                  icon="close-circle"
                  className={styles.dirclosebtn}
                  style={{ fontSize: '18px' }}
                  onClick={this.closeNearbySearch}
                />
              </div>
            </Tooltip>
          );
        default:
          return (
            <Tooltip title="路线">
              <div className={styles.dirbtnwrap}>
                <span className={styles.dirbtnstub} />
                <Button icon="swap" className={styles.dirbtn} onClick={this.enterDirectionMode} />
              </div>
            </Tooltip>
          );
      }
    } else if (this.props.search.mode === SearchConsts.MODE_DIRECTION) {
      return (
        <Tooltip title="关闭路线">
          <div className={styles.dirbtnwrap}>
            <span className={styles.dirbtnstub} />
            <Button icon="close" className={styles.dirclosebtn} onClick={this.leaveDirectionMode} />
          </div>
        </Tooltip>
      );
    }

    return null;
  }

  renderRouteBox() {
    if (this.props.search.mode === SearchConsts.MODE_DIRECTION) {
      return (
        <RouteComponents.StartEndSelector onStartInput={this.handleStartInput} onEndInput={this.handleEndInput} />
      );
    }

    return null;
  }

  renderLocationOptSelector() {
    if (this.props.search.diropts) {
      return (
        <RouteComponents.RouteLSelector
          title={`${this.props.search.dirlttext} - ${this.props.search.diropttext}`}
          onSelect={this.handleOptSelect}
        />
      );
    }

    return null;
  }

  renderBusyIndicator() {
    if (this.props.search.loading) {
      return <RouteComponents.BusyTpl />;
    }

    return null;
  }

  renderResults() {
    if (this.props.search.mode === SearchConsts.MODE_DIRECTION) {
      if (this.props.search.dirmode === SearchConsts.MODE_DIR_BUS) {
        if (this.props.search.lines) {
          return <RouteComponents.BusLineList />;
        }
      } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_DRIVE) {
        if (this.props.search.driveresult) {
          return <RouteComponents.DriveLineList />;
        }
      } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_WALK) {
        if (this.props.search.walkresult) {
          return <RouteComponents.WalkLineList />;
        }
      } else if (this.props.search.dirmode === SearchConsts.MODE_DIR_RIDE) {
        if (this.props.search.rideresult) {
          return <RouteComponents.RideLineList />;
        }
      }
    }

    return null;
  }

  renderSearchList() {
    if (this.props.search.mode === SearchConsts.MODE_LOCATION) {
      if (
        this.props.search.submode === SearchConsts.SUBMODE_LOCATION_LIST &&
        this.props.search.list
      ) {
        return (
          <SearchResultList data={this.props.search.list} restype={SearchConsts.LIST_RESULT_FIND} />
        );
      } else if (
        this.props.search.submode === SearchConsts.SUBMODE_LOCATION_NEARBY &&
        this.props.search.nearbylist
      ) {
        return (
          <SearchResultList
            data={this.props.search.nearbylist}
            restype={SearchConsts.LIST_RESULT_QUERY}
            onHandleReturn={this.handleReturnFromNearbyList}
          />
        );
      }
    }

    return null;
  }

  renderSearchDetail() {
    if (this.props.search.mode === SearchConsts.MODE_LOCATION) {
      if (
        this.props.search.submode === SearchConsts.SUBMODE_LOCATION_DETAIL &&
        this.props.search.poi
      ) {
        return (
          <SearchResultDetail
            restype={SearchConsts.LIST_RESULT_FIND}
            keyword={this.state.text}
            onReturnClick={this.handleDetailReturn}
            onNearbyClick={this.handleNearbyClick}
          />
        );
      } else if (
        this.props.search.submode === SearchConsts.SUBMODE_LOCATION_NEARBY_DETAIL &&
        this.props.search.nearbypoi
      ) {
        return (
          <SearchResultDetail
            keyword={this.state.nearbytext}
            restype={SearchConsts.LIST_RESULT_QUERY}
            onReturnClick={this.handleNearbyDetailReturn}
          />
        );
      }
    }

    return null;
  }

  renderErrorMsg() {
    if (this.props.search.hasError) {
      return <RouteComponents.ErrorTpl msg={this.props.search.errMsg} />;
    }

    return null;
  }

  renderClassQuery() {
    if (this.props.search.mode === SearchConsts.MODE_LOCATION) {
      return <Classquery onItemClick={this.handleSearchtwo} />;
    }
  }

  render() {
    return (
      <div
        className={styles.leftPanel}
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
          left: this.props.agsmap.menusflags ? '280px' : '70px',
          top: this.props.agsmap.splitflags ? '-280px' : '20px',
        }}
      >
        <div className={styles.wrap}>
          {this.renderContent()}
          {this.renderDirButton()}
          <Tooltip title="搜索">
            <Button
              type="primary"
              icon="search"
              className={styles.searchbtn}
              onClick={this.handleSearch}
            />
          </Tooltip>
        </div>
        {this.renderRouteBox()}
        {this.renderLocationOptSelector()}
        {this.renderBusyIndicator()}
        {this.renderResults()}
        {this.renderErrorMsg()}
        {this.renderSearchList()}
        {this.renderSearchDetail()}
        {this.renderClassQuery()}
      </div>
    );
  }
}

GeoSearch.propTypes = {
  dispatch: PropTypes.func,
};

export default connect(({ search, agsmap }) => {
  return {
    search,
    agsmap,
  };
})(GeoSearch);
