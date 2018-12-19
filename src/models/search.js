import * as SearchConst from '../constants/search';
import { queryBusStation } from '../services/tianditu/searchpoi';
import { planBusLine } from '../services/tianditu/busline';
import { planDriveLine } from '../services/tianditu/driveline';
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

    mode: SearchConst.MODE_LOCATION,
    submode: '',
    dirmode: SearchConst.MODE_DIR_BUS,

    start: null,
    starttext: '',
    startsearching: false,

    end: null,
    endtext: '',
    endsearching: false,

    loading: false,
    hasError: false,
    errMsg: '',

    lines: null,

    driveresult: null, // xml document

    // 查询结果的列表
    list: null,
    poi: null,
    searching: false,
    poipager: {
      size: 'small',
      current: 1,
      pageSize: 6,
    },
    classquery: false,
    groupquery: false,
    groupname: null,

    nearbylist: null,
    nearbypoi: null,
    nearbypager: {
      size: 'small',
      current: 1,
      pageSize: 6,
    },
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
      const response = searchResp.data;
      if (response && Array.isArray(response.pois)) {
        yield put({
          type: 'updateDirOptions',
          payload: {
            data: response.pois,
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
      if (data) {
        switch (data.resultCode) {
          case 0: {
            const lines = data.results.filter(line => (line.lineType & 1) === 1);
            if (lines.length > 0) {
              yield put({
                type: 'updateResults',
                payload: lines[0].lines,
              });
            }
            break;
          }
          case 1:
            yield put({ type: 'showError', payload: '找不到起点' });
            break;
          case 2:
            yield put({ type: 'showError', payload: '找不到终点' });
            break;
          case 3:
            yield put({ type: 'showError', payload: '规划线路失败' });
            break;
          case 4:
            yield put({
              type: 'showError',
              payload: '起终点距离200米以内，不规划线路，建议步行',
            });
            break;
          case 5:
            yield put({
              type: 'showError',
              payload: '起终点距离500米内，返回线路',
            });
            break;
          case 6:
            yield put({
              type: 'showError',
              payload: '输入参数错误',
            });
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
      if (data) {
        yield put({ type: 'updateDriveResult', payload: data });
        yield put({
          type: SearchConst.MAP_ACTION_DRAW_DRIVELINE,
          payload: data,
        });
      }
    },
    *highlightDriveSegment({ payload }, { put }) {
      yield put({ type: SearchConst.MAP_ACTION_HIGHLIGHT_DRIVE, payload });
    },
    *clearSearch({ payload }, { put }) {
      yield put({ type: 'clearSearchState' });
      yield put({ type: SearchConst.MAP_ACTION_CLEAR });
    },
    *searchPoi({ payload }, { put, call }) {
      const { keyword, bound } = payload;
      yield put({
        type: 'switchSubmode',
        payload: SearchConst.SUBMODE_LOCATION_LIST,
      });
      yield put({ type: 'startSearching' });
      const result = yield call(searchCategory, keyword, bound);
      yield put({ type: 'updateSearchList', payload: result });
      yield put({ type: SearchConst.MAP_ACTION_DRAW_POI, payload: { result, page: 1 } });
    },
    *searchCategory({ payload }, { put, call }) {
      const { keyword, bound } = payload;
      yield put({ type: 'startSearching' });
      yield put({
        type: 'switchSubmode',
        payload: SearchConst.SUBMODE_LOCATION_LIST,
      });
      const result = yield call(searchCategory, keyword, bound);
      yield put({ type: 'updateSearchList', payload: result });
      // 这里因为Antd的pager组件分页是从1开始计数，
      // 所以第一页传1保持与modal的值一致
      yield put({ type: SearchConst.MAP_ACTION_DRAW_POI, payload: { result, page: 1 } });
    },
    *selectPoiByLabel({ payload }, { put }) {
      const { item } = payload;
      yield put({
        type: 'switchSubmode',
        payload: SearchConst.SUBMODE_LOCATION_DETAIL,
      });
      yield put({ type: 'updateSelectedPoi', payload: item });
    },
    *selectPoi({ payload }, { put }) {
      const { item, index } = payload;
      yield put({
        type: 'switchSubmode',
        payload: SearchConst.SUBMODE_LOCATION_DETAIL,
      });
      yield put({ type: 'updateSelectedPoi', payload: item });
      yield put({ type: SearchConst.MAP_ACTION_HIGHLIGHT_POI, payload: index });
    },
    *clearPoi({ payload }, { put }) {
      yield put({ type: 'clearSelectedPoi' });
      yield put({ type: SearchConst.MAP_ACTION_CLEAR_HIGHLIGHT_POI });
    },
    *searchNearby({ payload }, { put, call }) {
      const { point, keyword, tolerance, bound } = payload;
      yield put({ type: 'startSearching' });
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
  },

  reducers: {
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
        list: null,
      };
    },
    switchMode(state, action) {
      return { ...state, mode: action.payload };
    },
    switchSubmode(state, action) {
      return { ...state, submode: action.payload };
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
      return {
        ...state,
        start: action.payload,
        starttext: action.payload.name,
        diropts: null,
      };
    },
    updateStartAndPlan(state, action) {
      return {
        ...state,
        start: action.payload,
        starttext: action.payload.name,
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
      return {
        ...state,
        end: action.payload,
        endtext: action.payload.name,
        diropts: null,
      };
    },
    updateEndAndPlan(state, action) {
      return {
        ...state,
        end: action.payload,
        endtext: action.payload.name,
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
    updateSearchList(state, action) {
      return { ...state, list: action.payload, searching: false };
    },
    updateSelectedPoi(state, action) {
      return { ...state, poi: action.payload };
    },
    clearSelectedPoi(state) {
      return {
        ...state,
        poi: null,
        submode: SearchConst.SUBMODE_LOCATION_LIST,
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
    clearSearchState(state) {
      return {
        ...state,
        hasError: false,
        errMsg: '',
        loading: false,
        lines: null,
        diropts: null,
        start: null,
        starttext: '',
        end: null,
        endtext: '',

        submode: '',
        list: null,
        poi: null,
      };
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
  },
};
