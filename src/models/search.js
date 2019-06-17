import {message} from 'antd';
import * as SearchConst from '../constants/search';
// import { queryBusStation } from '../services/tianditu/searchpoi';
// import { planBusLine } from '../services/tianditu/busline';
// import { planDriveLine } from '../services/tianditu/driveline';

import { queryBusStation } from '../services/baiduAPI/searchpoi';
import { planBusLine } from '../services/baiduAPI/busline';
import { planDriveLine } from '../services/baiduAPI/driveline';
import { planWalkLine } from '../services/baiduAPI/walkline';
import { planRideLine } from '../services/baiduAPI/rideline';
import {ACTION_SPACE_QUERY_CLEAR } from '../constants/action-types';

import {
  // searchPoi,
  searchCategory,
  searchSurround,
  // searchSurroundCat
} from '../services/search';

export default {
  namespace: 'search',

  state: {
    // 根据关键字查询出来的待选项
    diropts: null,

    // 用户输入的关键字
    diropttext: '',

    // 起点或终点
    dirlttext: '',

    toolbarMode: SearchConst.MODE_LOCATION,
    toolbarSubmode: '',

    mode: SearchConst.MODE_LOCATION,
    submode: '',
    dirmode: SearchConst.MODE_DIR_BUS,

    start: null,
    starttext: '',
    startsearching: false,
    locationStartSearching: false,

    end: null,
    endtext: '',
    endsearching: false,

    loading: false,
    hasError: false,
    errMsg: '',

    lines: null,

    driveresult: null, // xml document

    walkresult: null,

    rideresult: null,

    // 查询结果的列表
    list: {
      order: []
    },
    poi: null,
    searching: false,
    poipager: {
      size: 'small',
      current: 1,
      pageSize: 10,
    },
    classquery: false,
    groupquery: false,
    groupname: null,

    nearbylist: null,
    nearbypoi: null,
    nearbypager: {
      size: 'small',
      current: 1,
      pageSize: 10,
    },
    //显示导航窗口
    navigationVisible: false,

    // 智能提示查询结果
    smartTipList:null,
    // 标识各查询结果面板折叠状态
    foldFlag:{},

    // 标识各查询结果面板更多类型是否显示
    moreTypesVisible:{},

    // 标识各查询结果面板当前展示的数据类型
    queryDataType:{},

    // 是否通过选择分类进行查询
    bFromClassQuery: false,

    // 已经选中的分类列表，layerId
    checkedTypeList: [],
  },

  effects: {
    *searchsolr({ payload }, { call, put }) {
      const { text, start, ltdir } = payload;
      if (ltdir === '起点') {
        yield put({ type: 'updateStartLoading', payload: true });
      } else {
        yield put({ type: 'updateEndLoading', payload: true });
      }
      const searchResp = yield call(queryBusStation, text, start);
      // 百度地图结果处理 开始
      let queryResults = searchResp.data;
      let resultList = [];
      if (queryResults.result){
        queryResults.result.map(item=>{
          if (item.location){
            item['lonlat'] = item.location.lng +' '+item.location.lat;
            resultList.push(item);
          }
        });
      }
      // 百度地图结果处理 结束
      const response = {result:resultList};

      if (response && Array.isArray(response.result)) {
        yield put({
          type: 'updateDirOptions',
          payload: {
            data: response.result,
            ltdir,
            text,
          },
        });
      } else {
        yield put({
          type: 'dirOptionsError',
        });
      }
    },
    *selectOpt({ payload }, { put, select }) {
      const dirmode = yield select(store => store.search.dirmode);
      const text = yield select(store => store.search.dirlttext);
      const currStart = yield select(store => store.search.start);
      const currEnd = yield select(store => store.search.end);
      switch (text) {
        case '起点':
          yield put({ type: SearchConst.PIN_START, payload });
          if (!currEnd) {
            yield put({ type: 'updateStart', payload });
          } else {
            yield put({ type: 'updateStartAndPlan', payload });
            let start = yield select(store => store.search.start);
            let end = yield select(store => store.search.end);
            yield put({ type: SearchConst.PIN_START_END, payload:{start:start, end:end} });
            switch (dirmode) {
              case SearchConst.MODE_DIR_BUS: {
                yield put({
                  type: 'planBusLine',
                  payload: {
                    start: payload,
                    end: currEnd,
                  },
                });
                break;
              }
              case SearchConst.MODE_DIR_DRIVE: {
                yield put({
                  type: 'planDriveLine',
                  payload: {
                    start: payload,
                    end: currEnd,
                  },
                });
                break;
              }
              case SearchConst.MODE_DIR_WALK: {
                yield put({
                  type: 'planWalkLine',
                  payload: {
                    start: payload,
                    end: currEnd,
                  },
                });
                break;
              }
              case SearchConst.MODE_DIR_RIDE: {
                yield put({
                  type: 'planRideLine',
                  payload: {
                    start: payload,
                    end: currEnd,
                  },
                });
                break;
              }
              default:
                break;
            }
          }
          break;
        case '终点':
          yield put({ type: SearchConst.PIN_END, payload });
          if (!currStart) {
            yield put({ type: 'updateEnd', payload });
          } else {
            yield put({ type: 'updateEndAndPlan', payload });
            let start = yield select(store => store.search.start);
            let end = yield select(store => store.search.end);
            yield put({ type: SearchConst.PIN_START_END, payload:{start:start, end:end} });
            switch (dirmode) {
              case SearchConst.MODE_DIR_BUS: {
                yield put({
                  type: 'planBusLine',
                  payload: {
                    start: currStart,
                    end: payload,
                  },
                });
                break;
              }
              case SearchConst.MODE_DIR_DRIVE: {
                yield put({
                  type: 'planDriveLine',
                  payload: {
                    start: currStart,
                    end: payload,
                  },
                });
                break;
              }
              case SearchConst.MODE_DIR_WALK: {
                yield put({
                  type: 'planWalkLine',
                  payload: {
                    start: currStart,
                    end: payload,
                  },
                });
                break;
              }
              case SearchConst.MODE_DIR_RIDE: {
                yield put({
                  type: 'planRideLine',
                  payload: {
                    start: currStart,
                    end: payload,
                  },
                });
                break;
              }
              default:
                break;
            }
          }
          break;
        default:
          break;
      }
    },
    *planBusLine({ payload }, { put, call }) {
      const { start, end } = payload;
      const planResp = yield call(
        planBusLine,
        start.lonlat.replace(' ', ','),
        end.lonlat.replace(' ', ',')
      );

      const { data } = planResp;
      // 百度地图结果处理 开始
      data.resultCode = data.status;// 0：成功;1：服务器内部错误;2：参数无效;1001：没有公交方案;1002：没有匹配的POI
      if (data && data.result && data.result.routes && data.result.routes.length > 0) {
        data.results={
          lineType:1
        };
        let lines = [];
        data.result.routes.map((item,index) => {
          let lineName = '';
          let segments = [];
          item.steps.map((step,index)=>{
            let segment={};
            if (step[0].vehicle.name !== ''){
              if (lineName!==''){
                lineName+=' ';
              }

              lineName+=step[0].vehicle.name +' |';
            }

            segment.stationEnd={}
            segment.stationEnd.name = step[0].vehicle.end_name;
            if (!segment.stationEnd.name){
              segment.stationEnd.name = step[0].instruction;
            }
            segment.stationEnd.uuid = "";
            segment.stationEnd.lonlat = step[0].end_location.lng+','+step[0].end_location.lat;

            segment.segmentType= step[0].type

            segment.segmentLine = [{
              "linePoint": step[0].start_location.lng+','+step[0].start_location.lat+';'+ step[0].path+';'+step[0].end_location.lng+','+step[0].end_location.lat+';',
              "segmentTime": 8,
              "byuuid": "",
              "lineName": "",
              "segmentDistance": step[0].distance,
              "segmentStationCount": step[0].vehicle.stop_num,
              "direction": "",
            }];

            segment.stationStart={}
            segment.stationStart.name = step[0].vehicle.start_name;
            segment.stationStart.uuid = "";
            segment.stationStart.lonlat = step[0].start_location.lng+','+step[0].start_location.lat;

            segments.push(segment);

          })

          let line = {
            lineName:lineName,
            segments:segments
          };

          lines.push(line);
        });
        data.results.lines = lines;
      }

      // 百度地图结果处理 结束

      if (data) {
        switch (data.resultCode) {
          case 0: {
            // 天地图
            // const lines = data.results.filter(line => (line.lineType & 1) === 1);
            const lines = data.results.lines
            if (lines.length > 0) {
              yield put({
                type: 'updateResults',
                payload: lines,
              });
            }

            break;
          }
          case 1:
            // yield put({ type: 'showError', payload: '找不到起点' });//天地图
            yield put({ type: 'showError', payload: '服务器内部错误' });//百度
            break;
          case 2:
            // yield put({ type: 'showError', payload: '找不到终点' });//天地图
            yield put({ type: 'showError', payload: '参数无效' });//百度
            break;
          case 3:
            yield put({ type: 'showError', payload: '规划线路失败' });//天地图
            break;
          case 1001:
            yield put({ type: 'showError', payload: '没有公交方案' });//百度
            break;
          case 1002:
            yield put({ type: 'showError', payload: '没有匹配的POI' });//百度
            break;
          case 4:
            yield put({
              type: 'showError',
              payload: '起终点距离200米以内，不规划线路，建议步行',
            });//天地图
            break;
          case 5:
            yield put({
              type: 'showError',
              payload: '起终点距离500米内，返回线路',
            });//天地图
            break;
          case 6:
            yield put({
              type: 'showError',
              payload: '输入参数错误',
            });//天地图
            break;
          default:
            break;
        }
      }
    },

    *planWalkLine({ payload }, { put, call }) {
      const { start, end } = payload;
      const planResp = yield call(
        planWalkLine,
        start.lonlat.replace(' ', ','),
        end.lonlat.replace(' ', ',')
      );

      const { data } = planResp;

      if (data) {
        switch (data.status) {
          case 0: {
            // 天地图
            // const lines = data.results.filter(line => (line.lineType & 1) === 1);
            const lines = data.result.routes[0];
            if (lines) {
              yield put({
                type: 'updateWalkResult',
                payload: lines,
              });
              yield put({
                type: SearchConst.MAP_ACTION_DRAW_WALKLINE,
                payload: lines.steps,
              });
            }

            break;
          }
          case 1:
            // yield put({ type: 'showError', payload: '找不到起点' });//天地图
            yield put({ type: 'showError', payload: '服务器内部错误' });//百度
            break;
          case 2:
            // yield put({ type: 'showError', payload: '找不到终点' });//天地图
            yield put({ type: 'showError', payload: '参数无效' });//百度
            break;
          case 3:
            yield put({ type: 'showError', payload: '规划线路失败' });//天地图
            break;
          case 1001:
            yield put({ type: 'showError', payload: '没有公交方案' });//百度
            break;
          case 1002:
            yield put({ type: 'showError', payload: '没有匹配的POI' });//百度
            break;
          case 4:
            yield put({
              type: 'showError',
              payload: '起终点距离200米以内，不规划线路，建议步行',
            });//天地图
            break;
          case 5:
            yield put({
              type: 'showError',
              payload: '起终点距离500米内，返回线路',
            });//天地图
            break;
          case 6:
            yield put({
              type: 'showError',
              payload: '输入参数错误',
            });//天地图
            break;
          default:
            break;
        }
      }
    },

    *planRideLine({ payload }, { put, call }) {
      const { start, end } = payload;
      const planResp = yield call(
        planRideLine,
        start.lonlat.replace(' ', ','),
        end.lonlat.replace(' ', ',')
      );

      const { data } = planResp;

      if (data) {
        switch (data.status) {
          case 0: {
            // 天地图
            // const lines = data.results.filter(line => (line.lineType & 1) === 1);
            const lines = data.result.routes[0];
            if (lines) {
              yield put({
                type: 'updateRideResult',
                payload: lines,
              });
              yield put({
                type: SearchConst.MAP_ACTION_DRAW_RIDELINE,
                payload: lines.steps,
              });
            }

            break;
          }
          case 1:
            // yield put({ type: 'showError', payload: '找不到起点' });//天地图
            yield put({ type: 'showError', payload: '服务器内部错误' });//百度
            break;
          case 2:
            // yield put({ type: 'showError', payload: '找不到终点' });//天地图
            yield put({ type: 'showError', payload: '参数无效' });//百度
            break;
          case 3:
            yield put({ type: 'showError', payload: '规划线路失败' });//天地图
            break;
          case 1001:
            yield put({ type: 'showError', payload: '没有公交方案' });//百度
            break;
          case 1002:
            yield put({ type: 'showError', payload: '没有匹配的POI' });//百度
            break;
          case 4:
            yield put({
              type: 'showError',
              payload: '起终点距离200米以内，不规划线路，建议步行',
            });//天地图
            break;
          case 5:
            yield put({
              type: 'showError',
              payload: '起终点距离500米内，返回线路',
            });//天地图
            break;
          case 6:
            yield put({
              type: 'showError',
              payload: '输入参数错误',
            });//天地图
            break;
          default:
            break;
        }
      }
    },


    *drawBusLine({ payload }, { put, select }) {
      const lines = yield select(store => store.search.lines);
      if (lines && lines.length > payload) {
        const line = lines[payload];
        yield put({ type: SearchConst.MAP_ACTION_DRAWLINE, payload: line });
      }
    },
    *highlightSegment({ payload }, { put }) {
      yield put({ type: SearchConst.MAP_ACTION_HIGHLIGHT, payload });
    },
    *planDriveLine({ payload }, { call, put }) {
      const { start, end } = payload;
      const planResp = yield call(
        planDriveLine,
        start.lonlat.replace(' ', ','),
        end.lonlat.replace(' ', ',')
      );
      const { data } = planResp;
      const pushdiverData = data.result.routes[0].steps
      if (pushdiverData) {
        yield put({ type: 'updateDriveResult', payload: data });
        yield put({
          type: SearchConst.MAP_ACTION_DRAW_DRIVELINE,
          payload: pushdiverData,
        });
      }
    },

    *highlightDriveSegment({ payload }, { put }) {
      yield put({ type: SearchConst.MAP_ACTION_HIGHLIGHT_DRIVE, payload });
    },

    *clearSearch({ payload }, { put }) {
      yield put({ type: 'clearSearchState', payload});
      yield put({ type: SearchConst.MAP_ACTION_CLEAR });
    },

    *searchPoi({ payload }, { put, call }) {
      const { mode, keyword, bound, types, param, pageInfo, bSmartTips} = payload;
      if (mode === SearchConst.MODE_LOCATION){
        yield put({
          type: 'switchToolbarSubmode',
          payload: SearchConst.SUBMODE_LOCATION_LIST,
        });
        yield put({
          type: 'switchSubmode',
          payload: SearchConst.SUBMODE_LOCATION_LIST,
        });
        yield put({ type: 'locationStartSearching' });
      }else if (mode === SearchConst.MODE_IDENTIFY){
          yield put({
            type: 'switchSubmode',
            payload: SearchConst.SUBMODE_IDENTIFY_LIST,
          });
      }

      yield put({ type: 'clearSelectedPoi', payload });
      yield put({ type: SearchConst.MAP_ACTION_CLEAR_HIGHLIGHT_POI });

      if(mode !== SearchConst.MODE_LOCATION){
        // yield put({ type: 'changMoreTypesVisible',payload:{ mode:mode, bShowMoreTypes: false} });
      }
      yield put({ type: 'startSearching' });
      yield put({ type: 'updateSearchOrder', mode: mode });

      let tempResult = yield call(searchCategory, keyword, bound, types, param, pageInfo, bSmartTips);

      if(mode === SearchConst.MODE_SPACE&&tempResult.results.length ===0){
        yield put({type:ACTION_SPACE_QUERY_CLEAR});
        message.info('No Data');
      }
      let result = {};
      result[mode] = tempResult;

      yield put({ type: 'updateSearchList', payload: result, mode: mode });
      // pageInfo = result.pageInfo;
      result = result[mode].results;
      let bFromIdentify = param ? param.bFromIdentify : null;
      yield put({ type: SearchConst.MAP_ACTION_DRAW_POI, payload: { result, page: 1, pageInfo, bFromIdentify } });
    },

    *smartTip({ payload }, { put, call }) {
      const { keyword, bound, types, param, pageInfo, bSmartTips} = payload;
      let result = yield call(searchCategory, keyword, bound, types, param, pageInfo, bSmartTips);
      yield put({ type: 'updateSmartTipList', payload: result });
    },

    *searchCategory({ payload }, { put, call }) {
      const { mode, keyword, bound, types, param, pageInfo, bSmartTips } = payload;
      yield put({ type: 'startSearching' });
      yield put({ type: 'locationStartSearching' });

      yield put({
        type: 'switchSubmode',
        payload: SearchConst.SUBMODE_LOCATION_LIST,
      });
      yield put({
        type: 'switchToolbarSubmode',
        payload: SearchConst.SUBMODE_LOCATION_LIST,
      });
      let result = yield call(searchCategory, keyword, bound, types, param, pageInfo, bSmartTips);
      yield put({ type: 'updateSearchList', payload: result, mode: mode });
      // 这里因为Antd的pager组件分页是从1开始计数，
      // 所以第一页传1保持与modal的值一致
      result = result;
      yield put({ type: SearchConst.MAP_ACTION_DRAW_POI, payload: { result, page: 1 } });
    },
    *selectPoiByLabel({ payload }, { put }) {
      const { item } = payload;
      yield put({
        type: 'switchSubmode',
        payload: SearchConst.SUBMODE_LOCATION_DETAIL,
      });
      yield put({
        type: 'switchToolbarSubmode',
        payload: SearchConst.SUBMODE_LOCATION_DETAIL,
      });
      yield put({ type: 'updateSelectedPoi', payload: item });
    },
    *selectPoi({ payload }, { put }) {
      const { item, index, subMode } = payload;
      if (subMode){
        yield put({
          type: 'switchSubmode',
          payload: subMode,
        });
      }
      // yield put({
      //   type: 'switchToolbarSubmode',
      //   payload: SearchConst.SUBMODE_LOCATION_DETAIL,
      // });
      yield put({ type: 'updateSelectedPoi', payload: item });
      yield put({ type: SearchConst.MAP_ACTION_HIGHLIGHT_POI, payload: payload });
    },
    // *showPoiInfos({ payload }, { put }) {
    //   const { graphics, pageInfo } = payload;

    //   // const { keyword, bound, types, param, pageInfo,bSmartTips} = payload;
    //   yield put({
    //     type: 'switchSubmode',
    //     payload: SearchConst.SUBMODE_LOCATION_LIST,
    //   });
    //   yield put({ type: 'startSearching' });
    //   // let result = yield call(searchCategory, keyword, bound, types,  param, pageInfo,bSmartTips);
    //   yield put({ type: 'updateSearchList', payload: result });

    //   yield put({ type: SearchConst.MAP_ACTION_DRAW_POI, payload: { result, page: 1, pageInfo } });


    //   // yield put({
    //   //   type: 'switchSubmode',
    //   //   payload: SearchConst.SUBMODE_LOCATION_DETAIL,
    //   // });
    //   // yield put({ type: 'updateSelectedPoi', payload: item });
    //   // let graphic = item;
    //   // yield put({ type: SearchConst.MAP_ACTION_CLICK_HIGHLIGHT, payload: graphic });
    // },
    *clearPoi({ payload }, { put }) {
      yield put({ type: 'clearSelectedPoi', payload });
      yield put({ type: SearchConst.MAP_ACTION_CLEAR_HIGHLIGHT_POI });
    },
    *searchNearby({ payload }, { put, call }) {
      const { point, keyword, tolerance, bound } = payload;
      yield put({ type: 'startSearching' });
      yield put({ type: 'locationStartSearching' });
      const result = yield call(searchSurround, point, keyword, tolerance, bound);
      yield put({ type: 'updateNearbyList', payload: result });
      yield put({
        type: SearchConst.MAP_ACTION_DRAW_NEARBY,
        payload: {
          point,
          result,
          page: 1,
        },
      });
    },
    *searchNearbyCategory({ payload }, { put, call }) {
      const { point, keyword, tolerance, bound } = payload;
      yield put({ type: 'startSearching' });
      yield put({ type: 'locationStartSearching' });
      const result = yield call(searchSurround, point, keyword, tolerance, bound);
      yield put({ type: 'updateNearbyList', payload: result });
      yield put({
        type: SearchConst.MAP_ACTION_DRAW_NEARBY,
        payload: {
          point,
          result,
          page: 1,
        },
      });
    },
    *selectNearbyPoi({ payload }, { put }) {
      const { item, index } = payload;
      yield put({
        type: 'switchSubmode',
        payload: SearchConst.SUBMODE_LOCATION_NEARBY_DETAIL,
      });
      yield put({
        type: 'switchToolbarSubmode',
        payload: SearchConst.SUBMODE_LOCATION_NEARBY_DETAIL,
      });
      yield put({ type: 'updateSelectedNearbyPoi', payload: item });
      yield put({
        type: SearchConst.MAP_ACTION_HIGHLIGHT_NEARBY,
        payload: index,
      });
    },
    *clearNearbyPoi({ payload }, { put }) {
      yield put({ type: 'clearSelectedNearbyPoi' });
      yield put({ type: SearchConst.MAP_ACTION_CLEAR_HIGHLIGHT_NEARBY });
    },
    *switchDirMode({ payload }, { put, select }) {
      yield put({ type: 'updateDirMode', payload });
      const start = yield select(store => store.search.start);
      const end = yield select(store => store.search.end);
      if (start && end) {
        switch (payload) {
          case SearchConst.MODE_DIR_BUS: {
            yield put({
              type: 'planBusLine',
              payload: {
                start,
                end,
              },
            });
            break;
          }
          case SearchConst.MODE_DIR_DRIVE: {
            yield put({
              type: 'planDriveLine',
              payload: {
                start,
                end,
              },
            });
            break;
          }
          case SearchConst.MODE_DIR_WALK: {
            yield put({
              type: 'planWalkLine',
              payload: {
                start,
                end,
              },
            });
            break;
          }
          case SearchConst.MODE_DIR_RIDE: {
            yield put({
              type: 'planRideLine',
              payload: {
                start,
                end,
              },
            });
            break;
          }
          default:
            break;
        }
      }
    },
    *gotoPage({ payload }, { put, select }) {
      // 列表翻页
      yield put({ type: 'gotoListPage', payload });

      const result = yield select(store => store.search.list);

      // 地图重新绘制当前页的要素
      yield put({ type: SearchConst.MAP_ACTION_DRAW_POI, payload: { result, page: payload } });
    },
    *gotoNearbyPage({ payload }, { put, select }) {
      // 列表翻页
      yield put({ type: 'gotoNearbyListPage', payload });

      const point = yield select(store => store.search.poi);
      const result = yield select(store => store.search.nearbylist);

      // 地图重新绘制当前页的要素
      yield put({
        type: SearchConst.MAP_ACTION_DRAW_NEARBY,
        payload: {
          point,
          result,
          page: payload,
        },
      });
    },

    *drawSearchResultGraphics({ payload }, { put, select }) {
      const {mode, list} = payload;
      yield put({ type: SearchConst.MAP_ACTION_DRAW_POI, payload: { result: list.results, page: list.pageInfo.pageIndex, pageInfo: list.pageInfo, bFromIdentify: false } });
    },

    // *changMoreTypesVisible({ payload }, { put, select }) {
    //   yield put({ type: 'changMoreTypesVisible', payload });
    // },

  },

  reducers: {
    changMoreTypesVisible(state, action) {
      let { mode, bShowMoreTypes } = action.payload;
      bShowMoreTypes = (bShowMoreTypes === null ? false :bShowMoreTypes);
      state.moreTypesVisible[mode] = bShowMoreTypes;
      return {
        ...state,
        moreTypesVisible: state.moreTypesVisible
      }
    },

    setQueryDataType(state, action) {
      let { mode, featureType } = action.payload;
      state.queryDataType[mode] = featureType;
      return {
        ...state,
        queryDataType: state.queryDataType
      }
    },

    updateClassQueryState(state, action) {
      let { bFromClassQuery } = action.payload;
      state.bFromClassQuery = bFromClassQuery;
      return {
        ...state,
        bFromClassQuery: state.bFromClassQuery
      }
    },

    updateCheckedTypeList(state, action) {
      let { checkedTypeList } = action.payload;
      state.checkedTypeList = checkedTypeList;
      return {
        ...state,
        checkedTypeList: state.checkedTypeList
      }
    },

    updateDirMode(state, action) {
      return {
        ...state,
        dirmode: action.payload,
        hasError: false,
        errMsg: '',
        loading: false,
        lines: null,
        diropts: null,

        submode: '',
        list: {
          order:[]
        },
      };
    },
    switchMode(state, action) {
      return { ...state, mode: action.payload };
    },
    switchSubmode(state, action) {
      return { ...state, submode: action.payload };
    },
    switchToolbarMode(state, action) {
      return { ...state, toolbarMode: action.payload };
    },
    switchToolbarSubmode(state, action) {
      return { ...state, toolbarSubmode: action.payload };
    },

    updateDirOptions(state, action) {
      return {
        ...state,
        diropts: action.payload.data,
        dirlttext: action.payload.ltdir,
        diropttext: action.payload.text,
        startsearching: false,
        endsearching: false,
        hasError: false,
        errMsg: '',
        loading: false,
      };
    },
    dirOptionsError(state, action) {
      return {
        ...state,
        startsearching: false,
        endsearching: false,
        hasError: true,
        errMsg: '未找到指定关键词相关的兴趣点',
      };
    },
    updateStart(state, action) {
      let data = action.payload.data, dirlttext = action.payload.dirlttext;
      data =data?data:action.payload;
      return {
        ...state,
        start:data ,
        starttext: data?data.name:null,
        diropts: null,
        dirlttext:dirlttext?dirlttext:state.dirlttext,
      };
    },
    updateStartAndPlan(state, action) {
      return {
        ...state,
        start: action.payload,
        starttext: action.payload?action.payload.name:null,
        diropts: null,
        loading: true,
      };
    },
    updateStartText(state, action) {
      return { ...state, starttext: action.payload };
    },
    updateStartLoading(state, action) {
      return { ...state, startsearching: action.payload };
    },
    updateEnd(state, action) {
      let data = action.payload.data, dirlttext = action.payload.dirlttext;
      data =data?data:action.payload;
      return {
        ...state,
        end:data ,
        endtext: data?data.name:null,
        diropts: null,
        dirlttext:dirlttext?dirlttext:state.dirlttext,
      };
    },
    updateEndAndPlan(state, action) {
      return {
        ...state,
        end: action.payload,
        endtext: action.payload?action.payload.name:null,
        diropts: null,
        loading: true,
      };
    },
    updateEndText(state, action) {
      return { ...state, endtext: action.payload };
    },
    updateEndLoading(state, action) {
      return { ...state, endsearching: action.payload };
    },
    updateResults(state, action) {
      return { ...state, lines: action.payload, loading: false };
    },
    updateDriveResult(state, action) {
      return { ...state, driveresult: action.payload, loading: false };
    },
    updateWalkResult(state, action) {
      return { ...state, walkresult: action.payload, loading: false };
    },
    updateRideResult(state, action) {
      return { ...state, rideresult: action.payload, loading: false };
    },
    updateSearchList(state, action) {
      let list = state.list;
      let mode = action.mode;
      list[mode] = action.payload[mode];
      if(list['order'].indexOf(mode) > -1){
        list['order'].splice(list['order'].indexOf(mode), 1);
      }
      list['order'].push(mode);

      // if(list['order'].indexOf(mode) < 0){
      //   list['order'].push(mode);
      // }
      let foldFlag = state.foldFlag;
      Object.keys(foldFlag).map(key => {
        if (key === mode){
          foldFlag[key] = false;
        }else{
          foldFlag[key] = true;
        }
      });

      return { ...state, list: list, foldFlag: foldFlag, searching: false, locationStartSearching: false };
    },
    updateSearchOrder(state, action) {
      let list = state.list;
      let mode = action.mode;

      if(list['order'].indexOf(mode) > -1){
        list['order'].splice(list['order'].indexOf(mode), 1);
      }
      list['order'].push(mode);

      return { ...state, list: list};
    },
    updateSmartTipList(state, action) {
      return { ...state, smartTipList: action.payload, searching: false };
    },
    updateFoldFlag(state, action) {
      const {mode, bFoldReuslt} = action.payload;

      if (!bFoldReuslt){
        Object.keys(state.foldFlag).map(key => {
          if (key !== mode)
            state.foldFlag[key] = true;
        });
      }

      state.foldFlag[mode] = bFoldReuslt;
      if (!bFoldReuslt){
        return { ...state, foldFlag: state.foldFlag, mode: mode };
      }else
        return { ...state, foldFlag: state.foldFlag };
    },

    foldAllPanel(state) {
      Object.keys(state.foldFlag).map(key => {
          state.foldFlag[key] = true;
      });

      return { ...state, foldFlag: state.foldFlag };
    },

    updateSelectedPoi(state, action) {
      return { ...state, poi: action.payload };
    },
    clearSelectedPoi(state, action) {
      return {
        ...state,
        poi: null,
        submode: action.payload.subMode,
      };
    },
    clearSelectedNearbyPoi(state) {
      return {
        ...state,
        nearbypoi: null,
        submode: SearchConst.SUBMODE_LOCATION_NEARBY,
      };
    },
    updateSelectedNearbyPoi(state, action) {
      return { ...state, nearbypoi: action.payload };
    },
    clearSearchState(state, action) {
      const {mode} = action.payload;
      let list = state.list;
      list[mode] = null;
      if(list['order'].indexOf(mode) > -1){
        list['order'].splice(list['order'].indexOf(mode), 1);
      }

      if (mode === SearchConst.MODE_LOCATION){
        return {
          ...state,
          hasError: false,
          errMsg: '',
          loading: false,
          // lines: null,
          diropts: null,
          start: null,
          starttext: '',
          end: null,
          endtext: '',
          checkedTypeList:[],
          submode: '',
          toolbarSubmode: '',
          list: list,
          poi: null,
        };
      }else if (mode === SearchConst.MODE_DIRECTION){
        return {
          ...state,
          hasError: false,
          errMsg: '',
          loading: false,
          lines: null,
          driveresult: null,
          walkresult: null,
          rideresult: null,
          diropts: null,
          start: null,
          starttext: '',
          end: null,
          endtext: '',

          submode: '',
          toolbarSubmode: '',
          list: list,
          poi: null,
        };
      }else if (mode === SearchConst.MODE_IDENTIFY || mode === SearchConst.MODE_SPACE){
        return {
          ...state,
          hasError: false,
          errMsg: '',
          loading: false,
          // lines: null,
          diropts: null,
          start: null,
          starttext: '',
          end: null,
          endtext: '',

          submode: '',
          list: list,
          poi: null,
        };
      }

      return state;
    },
    showError(state, action) {
      return {
        ...state,
        hasError: true,
        errMsg: action.payload,
        loading: false,
      };
    },
    changeClassquery(state, action) {
      return { ...state, classquery: action.payload };
    },
    changeGroupquery(state, action) {
      return { ...state, groupquery: action.payload };
    },
    selectGroupquery(state, action) {
      return { ...state, groupname: action.payload };
    },
    startSearching(state) {
      return { ...state, searching: true };
    },
    locationStartSearching(state) {
      return { ...state, locationStartSearching: true };
    },
    clearNearbyState(state) {
      return {
        ...state,
        submode: SearchConst.SUBMODE_LOCATION_NEARBY,
        nearbylist: null,
        nearbypoi: null,
        nearbypager: {
          ...state.nearbypager,
          current: 1,
        },
      };
    },
    clearNearbyData(state) {
      return {
        ...state,
        nearbylist: null,
        nearbypoi: null,
        nearbypager: {
          ...state.nearbypager,
          current: 1,
        },
      };
    },
    gotoListPage(state, action) {
      return {
        ...state,
        poipager: { ...state.poipager, current: action.payload },
      };
    },
    gotoNearbyListPage(state, action) {
      return {
        ...state,
        nearbypager: { ...state.nearbypager, current: action.payload },
      };
    },
    updateNearbyList(state, action) {
      return { ...state, nearbylist: action.payload, searching: false };
    },
    showNavigation(state, action) {
      return { ...state, navigationVisible: action.payload };
    },
  },
};
