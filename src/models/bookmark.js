/*
 * 书签组件的model层
 * author:pensiveant
 */

import {
    ACTION_ADDBOOKMARK_2D,
    ACTION_GOTOBOOKMARK_2D,
    ACTION_DELETBOOKMARK_2D,
    ACTION_DELETTHISBOOKMARK_2D,
    ACTION_EDITBOOKMARK_2D,
  } from '../constants/action-types';

export default {
    namespace: 'bookmark',
    state: {
        bookflags: false, //是否显示书签组件
        bookmarks: [],  // 所有书签数据数组
        bookname: null, //
    },
    subscriptions:{

    },
    effects:{
        *addBookmark({ payload }, { put }) {
            yield put({ type: ACTION_ADDBOOKMARK_2D, payload });
        },
        *editBookmark({ payload }, { put }) {
            yield put({ type: ACTION_EDITBOOKMARK_2D, payload });
          },
        *deletBookmark({ payload }, { put }) {
            yield put({ type: ACTION_DELETBOOKMARK_2D, payload });
        },
        *deletthisBookmark({ payload }, { put }) {
            yield put({ type: ACTION_DELETTHISBOOKMARK_2D, payload });
        },
        *gotoBookmark({ payload }, { put }) {
            yield put({ type: ACTION_GOTOBOOKMARK_2D, payload });
          },
    },
    reducers:{
        bookmarkChangeState(state, action) {
            return { ...state, bookflags: action.payload };
          },
        updateBookmarks(state, action) {
            return { ...state, bookmarks: action.payload };
          },
    }
}