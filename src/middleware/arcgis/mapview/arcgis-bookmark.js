import {
  ACTION_ADDBOOKMARK_2D,
  ACTION_GOTOBOOKMARK_2D,
  ACTION_DELETBOOKMARK_2D,
  ACTION_DELETTHISBOOKMARK_2D,
  ACTION_EDITBOOKMARK_2D,
} from '../../../constants/action-types';
import env from '../../../utils/env';
// 获取全局ags对象，用于其他组件获取其中的view对象
const ags = env.getParamAgs();

function bookmarks(opts = {}) {
  if (opts.getState && opts.dispatch) {
    return () => next => action => next(action);
  }

  return store => next => async action => {
    switch (action.type) {

      case ACTION_ADDBOOKMARK_2D: {
        if (ags.view) {
          const extent = ags.view.extent;
          // 保存
          store.dispatch({
            type: 'agsmap/updateBookmarks',
            payload: [
              ...store.getState().agsmap.bookmarks,
              {
                name: action.payload,
                newextent: extent,
              },
            ],
          });
        }
        break;
      }
      case ACTION_GOTOBOOKMARK_2D: {
        if (ags.view) {
          const bookname = action.payload;
          const books = store.getState().agsmap.bookmarks;
          books.forEach(element => {
            if (element.name === bookname) {
              ags.view.goTo(element.newextent.extent);
            }
          });
        }
        break;
      }
      case ACTION_DELETBOOKMARK_2D: {
        if (ags.view) {
          store.dispatch({
            type: 'agsmap/updateBookmarks',
            payload: [],
          });
        }
        break;
      }
      case ACTION_DELETTHISBOOKMARK_2D: {
        if (ags.view) {
          const bookname = action.payload;
          const books = store.getState().agsmap.bookmarks;
          books.forEach(element => {
            if (element.name === bookname) {
              const index = books.indexOf(element);
              books.splice(index, 1);
            }
          });
          store.dispatch({
            type: 'agsmap/updateBookmarks',
            payload: books,
          });
        }
        break;
      }
      case ACTION_EDITBOOKMARK_2D: {
        if (ags.view) {
          const oldname = action.payload.oldname;
          const newname = action.payload.newname;
          const books = store.getState().agsmap.bookmarks;
          const extent = ags.view.extent;
          const newelement = {
            name: newname,
            newextent: extent,
          };
          books.forEach(element => {
            if (element.name === oldname) {
              const index = books.indexOf(element);
              books.splice(index, 1, newelement);
            }
          });
          store.dispatch({
            type: 'agsmap/updateBookmarks',
            payload: books,
          });
        }
        break;
      }
      default: {
        next(action);
        break;
      }
    }

    return Promise.resolve();
  };
}

export { bookmarks };
