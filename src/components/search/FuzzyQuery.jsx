import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Button, Tooltip, Tag, Icon, AutoComplete, Spin } from 'antd';


import ErrorIndicator from './ErrorIndicator';
import SearchResultList from './SearchResultList';
import request from '../../utils/request';

import * as SearchConsts from '../../constants/search';
import styles from './FuzzyQuery.css';
import { VIEW_MODE_2D } from '../../constants/action-types';

class FuzzyQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      hint: "路线",
      bShowMoreTypes: false, // 是否显示更多分类
      // checkedTypeList: [], // 已经选中的分类列表，layerId
      bShowTypeList: false, // 搜索输入框下方是否显示分类列表，是：显示分类模块；否：隐藏分类模块
      bShowSmartTips: false, // 是否显示搜索框智能提示下拉列表
    };
    this.viewEventHandlers = null;
    this.mode = SearchConsts.MODE_LOCATION;
  }

  // 组件渲染后调用
  componentDidMount() {
    const body = document.getElementsByTagName('body')[0];
    body.onclick = this.onBodyClick.bind(this);

    this.registerEvents();

    this.props.setCallBackFuncList(this.mode, {
      onTypeChange: this.onResultTypeChange.bind(this),
      onPageChange: this.onResultPageChange.bind(this),
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.onBodyClick.bind(this));
  }

  componentWillMount() {
    this.getTypeList();
  }

  async getTypeList() {
    const p = new URLSearchParams();
    let typeList = await request(`${window.searchConfig.typeListQueryUrl}?${p.toString()}`, {
      method: 'GET',
    });
    if (typeList && typeList.data) {
      window.searchConfig.typeList = typeList.data;
    }
  }

  onBodyClick(e) {
    if (e.target && e.target.matches && (e.target.matches('#dataTypeSelector') || e.target.matches('#select-keyword-input') || e.target.matches('#type-selector-more') || e.target.matches('#type-selector-close') || e.target.parentNode.matches('.ant-select-search__field__wrap'))) {
      return;
    }

    if (!e.target || !e.target.parentNode.matches('.ant-select-search__field__wrap')) {
      this.setState({
        bShowSmartTips: false
      })
    }
    this.setState({
      bShowTypeList: false
    })
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
        let viewPointerDownHandler = window.agsGlobal.view.on('drag', function (evt) {
          this.updateFoldFlag(true);
        }.bind(this));

        let viewMouseWheelHandler = window.agsGlobal.view.on('mouse-wheel', function (evt) {
          this.updateFoldFlag(true);
        }.bind(this));

        this.viewEventHandlers.push(viewPointerDownHandler, viewMouseWheelHandler); // viewClickHandler,
        window.clearInterval(timer);
      }
    }.bind(this), 50);
  }

  handleSearch = (e, featureType, bSmartTips, keyword, mapPoint) => {
    if (e)
      e.preventDefault();

    this.props.dispatch({
      type: 'search/switchToolbarMode',
      payload: this.mode,
    });
    this.props.dispatch({
      type: 'search/switchMode',
      payload: this.mode,
    });

    if (!bSmartTips) {
      this.updateFoldFlag(false);
      // this.props.dispatch({
      //   type: 'search/changMoreTypesVisible',
      //   payload: {
      //     mode: this.mode,
      //     bShowMoreTypes: false
      //   },
      // });
    }
    if (featureType) {
      this.props.dispatch({
        type: 'search/updateClassQueryState',
        payload: {
          bFromClassQuery: true
        }
      });
      this.props.dispatch({
        type: 'search/setQueryDataType',
        payload: {
          mode: this.mode,
          featureType: featureType
        }
      });
    } else {
      this.props.dispatch({
        type: 'search/changMoreTypesVisible',
        payload: {
          mode: this.mode,
          bShowMoreTypes: false
        },
      });

      if (this.props.search.checkedTypeList.length > 0) {
        featureType = this.props.search.checkedTypeList[0].layerId;
        this.props.dispatch({
          type: 'search/updateClassQueryState',
          payload: {
            bFromClassQuery: true
          }
        });
        this.props.dispatch({
          type: 'search/setQueryDataType',
          payload: {
            mode: this.mode,
            featureType: featureType
          }
        });
      } else {
        this.props.dispatch({
          type: 'search/setQueryDataType',
          payload: {
            mode: this.mode,
            featureType: null
          }
        });
        this.props.dispatch({
          type: 'search/updateClassQueryState',
          payload: {
            bFromClassQuery: false
          }
        });
      }
    }

    let queryUrl = 'search/searchPoi';
    if (bSmartTips) {
      queryUrl = 'search/smartTip'
    }
    this.props.dispatch({
      type: queryUrl,
      payload: {
        mode: this.mode,
        keyword: keyword ? keyword : this.state.text,
        bound: window.tdtCfg.maxBound,
        types: featureType ? [{ featureType: featureType }] : '',
        param: {
          geometry: mapPoint ? mapPoint : null,
          // center: (!this.bFromIdentify ? null : (mapPoint.y +','+mapPoint.x) )
        },
        pageInfo: { 'pageIndex': 1, 'pageSize': window.searchConfig.pageSize },
        bSmartTips: bSmartTips
      },
    });
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
      payload: this.mode,
    });
    this.props.dispatch({
      type: 'search/clearSearch', payload: {
        mode: this.mode
      }
    });
  }

  clearSearchResult = () => {
    this.props.dispatch({
      type: 'search/clearSearch', payload: {
        mode: this.mode
      }
    });
    this.setState({
      text: '',
      // checkedTypeList: []
    });
    this.props.dispatch({
      type: 'search/updateCheckedTypeList', payload: {
        checkedTypeList: []
      }
    });
  }

  handleDetailReturn = () => {
    this.props.dispatch({
      type: 'search/clearPoi', payload: {
        subMode: SearchConsts.SUBMODE_LOCATION_LIST
      }
    });
    this.updateFoldFlag(false);
  }

  changMoreTypesVisible() {
    this.setState({
      bShowTypeList: true,
      bShowMoreTypes: !this.state.bShowMoreTypes,
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

  onTypeChange(evt, layerId, layerName) {
    this.setState({
      text: '',
      // checkedTypeList: [{
      //   layerId: layerId,
      //   layerName: layerName
      // }]
    });

    this.props.dispatch({
      type: 'search/updateCheckedTypeList', payload: {
        checkedTypeList: [{
          layerId: layerId,
          layerName: layerName
        }]
      }
    });

    this.handleSearch(evt, layerId);
  }

  onResultTypeChange(featureType) {
    this.props.dispatch({
      type: 'search/setQueryDataType',
      payload: {
        mode: this.mode,
        featureType: featureType
      },
    });

    let searchParams = this.props.search.list[this.mode];
    searchParams.pageInfo.pageIndex = 1;
    this.props.dispatch({
      type: 'search/searchPoi',
      payload: {
        mode: this.mode,
        keyword: this.state.text,
        bound: searchParams.bound,
        types: [{ num: 0, featureType: featureType }],
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
        keyword: this.state.text,
        bound: searchParams.bound,
        types: this.props.search.queryDataType[this.mode] ? [{ featureType: this.props.search.queryDataType[this.mode] }] : this.props.search.list[this.mode].types,
        param: searchParams.param,
        pageInfo: searchParams.pageInfo,
      },
    });
  }

  renderContent() {
    if (this.props.search.toolbarMode === this.mode) {
      switch (this.props.search.toolbarSubmode) {

        default:
          return (
            <div key='searchBarContent'>
              {this.getSearchBarContent()}

            </div>
          );
      }
    }
  }

  getSearchBarContent = () => {
    let content = [];
    let { checkedTypeList } = this.props.search;
    let typeInfos;
    let typeName = '';
    let inputWidth = 319;
    if (checkedTypeList && checkedTypeList.length > 0) {
      typeInfos = checkedTypeList[0];
      typeName = typeInfos.layerName;
      if (typeName.length > 4) {
        typeName = typeName.substr(0, 4) + '...';
        inputWidth = 130;
      } else if (typeName.length === 4) {
        inputWidth = 138;
      } else if (typeName.length === 3) {
        inputWidth = 154;
      } else if (typeName.length === 2) {
        inputWidth = 212;
      } else if (typeName.length === 1) {
        inputWidth = 226;
      }
    }

    content.push(
      <div key='searchBoxType' className={styles.searchBoxType} style={{ display: typeInfos ? 'inline' : 'none' }}>在<span className={styles.searchBoxTypeName} title={typeInfos ? typeName : ''}>{typeInfos ? typeName : ''}</span>中搜索</div>
    );

    content.push(
      <AutoComplete
        // allowClear={true}
        defaultActiveFirstOption={false}
        dataSource={this.getAutoCompleteList()}
        onSelect={this.onSmartTipSelect.bind(this)}
        onSearch={this.onAutoCompleteSearch.bind(this)}
        key='select-keyword-input'
        id='select-keyword-input'
        className={styles.input}
        placeholder={this.state.hint}
        style={{ width: inputWidth + 'px' }}
        open={this.state.bShowSmartTips}
        value={this.state.text}
        // onDropdownVisibleChange={this.onDropdownVisibleChange.bind(this)}
        onChange={text => {
          this.setState({ text: text });
          if (text != null && text.replace(/\s+/g, "") !== '') {

          } else {
            if (this.props.search.checkedTypeList === null || this.props.search.checkedTypeList.length === 0) {
              this.setState({
                bShowSmartTips: false,
                bShowTypeList: true,
              });
            } else {
              this.setState({
                bShowSmartTips: false,
                bShowTypeList: false,
              });
            }
          }
        }
        }

        onFocus={this.onSmartTipFocus.bind(this)}
        onBlur={(e) => { }}
      >
        <Input id='fuzzyQueryKeywordIpt'></Input>
      </AutoComplete>
    );

    return content;
  }

  getAutoCompleteList = () => {
    let smartTipList = [];

    if (document.getElementById('fuzzyQueryKeywordIpt')) {
      let iptValue = document.getElementById('fuzzyQueryKeywordIpt').value;
      var re = new RegExp(iptValue, 'g'); //定义正则
      this.props && this.props.search && this.props.search.smartTipList && this.props.search.smartTipList.map && this.props.search.smartTipList.map((item, index) => {
        let text = item.text;
        text = text.replace(re, `<span class="search-result-keyword">${iptValue}</span>`); //进行替换
        smartTipList.push({
          value: '{id:`' + item.value + '`,text:`' + item.text + '`}',
          // text: (<span dangerouslySetInnerHTML={{ __html: text }}></span>)
          text: item.text
        });
      });
    }
    return smartTipList;
  }

  onAutoCompleteSearch = (keyword) => {
    let featureType;
    this.setState({
      text: keyword,
      // bShowSmartTips: true,
    });

    this.handleSearch(null, featureType, true, keyword);
    if (keyword != null && keyword.replace(/\s+/g, "") !== '') {
      this.setState({
        bShowSmartTips: true,
        bShowTypeList: false,
      });
    }
  }

  onSmartTipSelect = (id, input) => {
    window.setTimeout(function () {
      let item = dojo.fromJson(id);
      this.setState({
        text: item.text,
        bShowSmartTips: false,
      });

      this.handleSearch(null, null, null, item.text);
    }.bind(this), 50);
  }

  updateFoldFlag = (bFoldReuslt) => {
    this.props.dispatch({
      type: 'search/updateFoldFlag', payload: {
        mode: this.mode,
        bFoldReuslt: bFoldReuslt,
      }
    });
  }

  onSmartTipFocus = () => {
    this.setState({
      bShowMoreTypes: false,
    });

    if (this.props.search.checkedTypeList === null || this.props.search.checkedTypeList.length === 0) {
      if (this.state.text === '') {
        this.setState({
          bShowTypeList: true,
          bShowSmartTips: false,
        });
      } else {
        this.setState({
          bShowTypeList: false,
          bShowSmartTips: false,
        });
      }
    } else {
      this.setState({
        bShowTypeList: false,
        bShowSmartTips: false,
      });
    }
  }

  renderDirButton() {
    if (this.props.search.toolbarMode === this.mode) {
      // if (this.props.search.searching) {
      //   return (
      //     <div className={styles.dirbtnwrap}>
      //       {/*<span className={styles.dirbtnstub} />*/}
      //       <Button icon="loading" className={styles.dirclosebtn} />
      //     </div>
      //   );
      // }

      switch (this.props.search.toolbarSubmode) {
        case SearchConsts.SUBMODE_LOCATION_LIST:
        case SearchConsts.SUBMODE_LOCATION_DETAIL:
          return (
            <Tooltip title="退出">
              <div className={styles.dirbtnwrap}>
                {/*<span className={styles.dirbtnstub} />*/}
                <Button
                  icon="close"
                  className={styles.dirclosebtn}
                  onClick={this.clearSearchResult}
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
    } else if (this.props.search.toolbarMode === SearchConsts.MODE_DIRECTION) {
      // return (
      //   <Tooltip title="关闭路线">
      //     <div className={styles.dirbtnwrap}>
      //       <span className={styles.dirbtnstub} />
      //       <Button icon="close" className={styles.dirclosebtn} onClick={this.leaveDirectionMode} />
      //     </div>
      //   </Tooltip>
      // );
    }

    return null;
  }

  renderSearchTypeList() {
    let _self = this;

    let contentList = [];
    const typeList = window.searchConfig.typeList;
    typeList && typeList.map((item, index) => {
      contentList.push(_self.getTypeContent(item, index));
    });

    return contentList;
  }

  getTypeContent(item, index) {
    let content = [];
    content.push(
      <a key={'type_' + item.featureType + index} href='javacript:void(0);' className={styles.categoryItem} style={index < 4 ? {} : { display: (this.state.bShowMoreTypes ? 'inline-block' : 'none') }} featuretype={item.layerId} title={this.getNamebyPnType(item.layerId)} onClick={(e, layerId, layerName) => this.onTypeChange(e, item.layerId, item.layerName)}>{this.getNamebyPnType(item.layerId)}</a>
    )

    if (index === 3) {
      content.push(
        <a id='type-selector-more' key={item.featureType + index + '+more'} className={styles.controlBtn} href='javacript:void(0);' style={{ display: (this.state.bShowMoreTypes ? 'none' : 'inline-block') }} onClick={this.changMoreTypesVisible.bind(this)}>
          更多<Icon type="caret-down" key='moreBtnIcon' />
        </a>,

        <a id='type-selector-close' key='moreTypeBtn_' className={styles.controlBtn} href='javacript:void(0);' style={{ display: (this.state.bShowMoreTypes ? 'inline-block' : 'none') }} onClick={this.changMoreTypesVisible.bind(this)}>
          收起<Icon type="caret-up" key='closeTypeBtnIcon' />
        </a>,
        <br key='br' />
      )
    } else if (index === window.searchConfig.typeList.length - 1) {

    }

    return content;
  }

  getTypeCheckTag = (item, index) => {
    return (<Tag key={'typeTag-' + item.layerId} closable onClose={(e, layerId, layerName) => this.onTypeTagClose(e, item.layerId, item.layerName)}>{item.layerName}</Tag>);
  }

  onTypeTagClose = (e, layerId, layerName) => {
    let { checkedTypeList } = this.props.search;
    checkedTypeList.map((item, index) => {
      if (item.layerId === layerId) {
        checkedTypeList.splice(index, 1)
        // this.setState({
        //   checkedTypeList: checkedTypeList
        // });
        this.props.dispatch({
          type: 'search/updateCheckedTypeList', payload: {
            checkedTypeList: checkedTypeList
          }
        });

        return false;
      }
    });
  }

  handleMouseOver = () => {
    this.props.dispatch({
      type: 'search/clearPoi', payload: {
        subMode: SearchConsts.SUBMODE_IDENTIFY_LIST
      }
    });
    if (this.props.search.foldFlag[this.mode]) {
      this.updateFoldFlag(false);
      this.props.dispatch({
        type: 'search/drawSearchResultGraphics', payload: {
          mode: this.mode,
          list: this.props.search.list[this.mode],
        }
      });
    }
  }

  handleMouseClick = () => {
    this.props.dispatch({
      type: 'search/clearPoi', payload: {
        subMode: SearchConsts.SUBMODE_IDENTIFY_LIST
      }
    });
    if (this.props.search.foldFlag[this.mode]) {
      this.updateFoldFlag(false);
      this.props.dispatch({
        type: 'search/drawSearchResultGraphics', payload: {
          mode: this.mode,
          list: this.props.search.list[this.mode],
        }
      });
    }
  }

  renderErrorMsg() {
    if (this.props.search.hasError) {
      return <ErrorIndicator msg={this.props.search.errMsg} />;
    }

    return null;
  }

  renderSearchButton = () => {
    if (this.props.search.toolbarMode === this.mode && this.props.search.locationStartSearching) {
      return (
        <div className={styles.dirbtnwrap}>
          {/*<span className={styles.dirbtnstub} />*/}
          <Button icon="loading" className={styles.dirclosebtn} />
        </div>
      );
    } else if (this.props.search.toolbarMode === this.mode) {
      return (
        <Tooltip title="搜索">
          <Button
            icon="search"
            className={styles.searchbtn}
            onClick={this.handleSearch.bind(this)}
          />
        </Tooltip>
      )
    }
  }

  render() {
    return (
      <div
        key='fuzzyQueryContainer'
        className={styles.leftPanel}
        style={{
          display: this.props.agsmap.mode === VIEW_MODE_2D ? 'block' : 'none',
          left: this.props.agsmap.menusflags ? '280px' : '15px',
          top: this.props.agsmap.splitflags ? '-280px' : '70px',
        }}
      >
        <div className={styles.wrap} key='fuzzyQueryInnerContainer' id='fuzzyQueryInnerContainer'>
          {this.renderContent()}
          {this.renderSearchButton()}
          {this.renderDirButton()}
          <div id='dataTypeSelector' key='dataTypeSelector' className={styles.typeContainer} style={{ display: this.state.bShowTypeList ? 'inline-block' : 'none' }}>
            {this.renderSearchTypeList()}
          </div>
        </div>

        {this.renderErrorMsg()}

      </div>
    );
  }
}

FuzzyQuery.propTypes = {
  dispatch: PropTypes.func,
};

export default connect(({ search, agsmap }) => {
  return {
    search,
    agsmap,
  };
})(FuzzyQuery);
