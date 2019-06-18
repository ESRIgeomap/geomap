import React, { Component, useState, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Button, Icon, Input, notification, Tooltip } from 'antd';
import styles from './Bookmark.css';
import { ConfigProvider } from 'antd';

const Bookmark = ({ bookmark,dispatch }) => {

  const [bookname, setBookName] = useState(null); //添加标签panel中input的值
  const [status, setStatus] = useState('add'); //根据该值修改添加（修改）书签panel的标题
  const [bookmarknames, setBookmarkNames] = useState([]); //书签名数组
  const [visible, setVisible] = useState(false); //是否显示添加（修改）书签panel
  const [geteditbookname, setGetEditBookName] = useState(null);  //修改标签panel中input的值

  const bookMarkDivRef = useRef(null);

  /**
   * 关闭按钮回调
   * author:pensiveant
   */
  const visblechange = () => {
    if (bookmark.bookflags) {
      // prepare();
     dispatch({
        type: 'bookmark/bookmarkChangeState',
        payload: false,
      });
    } else {
     dispatch({
        type: 'bookmark/bookmarkChangeState',
        payload: true,
      });
    }
  }



  /**
   * 添加书签按钮点击回调
   * author:pensiveant
   * @memberof Bookmark
   */
  const addBookmark = () => {
    setVisible(true);
    setGetEditBookName('');
    setBookName('');
  }

  /**
   * 书签名input change事件回调
   * author:pensiveant
   * @param {*} e
   * @memberof Bookmark
   */
  const nide = (e) => {
    const value = e.target.value;
    setBookName(value);
  }

  /**
  * 书签名填完，确认按钮点击回调
  * author：pensiveant
  */
  const edit = () => {
    if (geteditbookname === null || geteditbookname === '') { //添加书签
      if (bookname !== null && bookname !== undefined && bookname.trim() !== '') {
        if (bookmarknames.indexOf(bookname) >= 0) {
          notification.open({
            message: '警告',
            description: '已存在该书签，请修改书签名后添加！',
          });
        } else {
          bookmarknames.push(bookname);
         dispatch({
            type: 'bookmark/addBookmark',
            payload: bookname,
          });
         handleOk();
        }
      } else {
        notification.open({
          message: '警告',
          description: '书签名不可为空！',
        });
      }
    } else if (geteditbookname !== null && geteditbookname !== '') { //修改书签
      if (bookname !== null && bookname !== undefined && bookname.trim() !== '') {
        if (bookmarknames.indexOf(bookname) >= 0) {
          notification.open({
            message: '警告',
            description: '已存在该书签，请修改书签名后添加！',
          });
        } else {
          bookmarknames.forEach((element) => {
            if (element === geteditbookname) {
              const index = bookmarknames.indexOf(element);
              bookmarknames.splice(index, 1);
            }
          });
          bookmarknames.push(bookname);
         dispatch({
            type: 'bookmark/editBookmark',
            payload: {
              newname: bookname,
              oldname: geteditbookname,
            },
          });
         handleOk();
        }
      } else {
        notification.open({
          message: '警告',
          description: '书签名不可为空！',
        });
      }
    }
  }


  /**
   * 书签添加成功处理
   * author：pensiveant
   * @memberof Bookmark
   */
  const handleOk = () => {
    setVisible(false);
    setBookName('');
  }




  /**
   * 清除按钮点击回调
   * author:pensiveant
   * @memberof Bookmark
   */
  const deletBookmark = () => {
    if (bookmarknames.length > 0) {
      Modal.confirm({
        title: '确定清空书签?',
        content: '清空后所有书签将被删除，且无法恢复...',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          dodelet();
        },
        onCancel() {
        },
      });
    } else {
      notification.open({
        message: '警告',
        description: '已清空书签！',
      });
    }
  }

  /**
   * 清除书签是按钮丁点击回调
   * author:pensiveant
   * @memberof Bookmark
   */
  const dodelet = () => {
   setBookmarkNames([]);
   dispatch({
      type: 'bookmark/deletBookmark',
    });
  }

  /**
   * 定位到书签位置点击回调
   * author:pensiveant
   * @param {*} e
   * @memberof Bookmark
   */
  const gotoBookmark = (e) => {
   dispatch({
      type: 'bookmark/gotoBookmark',
      payload: e.currentTarget.innerText,
    });
  }

  /**
   * 删除单条书签点击回调
   * author:pensiveant
   * @param {*} e
   * @memberof Bookmark
   */
  const deletthisBookmark = (e) => {
    const self = this;
    const text = e.target.offsetParent.firstChild.innerText;
    Modal.confirm({
      title: '确定删除该书签?',
      content: '删除后该书签无法恢复...',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        dodeletthis(text);
      },
      onCancel() {
      },
    });
  }

  /**
   * 删除单条书签，点击确认回调
   * author:pensiveant
   * @param {*} text
   * @memberof Bookmark
   */
  const dodeletthis = (text) => {
    bookmarknames.forEach((element) => {
      if (element === text) {
        const index = bookmarknames.indexOf(element);
        bookmarknames.splice(index, 1);
      }
    });
   dispatch({
      type: 'bookmark/deletthisBookmark',
      payload: text,
    });
  }

  /**
   * 编辑单条书签点击回调,初始化为原始值
   * author：pensiveant
   * @param {*} e
   * @memberof Bookmark
   */
  const showModal = (e) => {
    setVisible(true);
    setStatus('edit');
    setGetEditBookName(e.target.offsetParent.firstChild.innerText);
    setBookName(e.target.offsetParent.firstChild.innerText);
  }


  /**
   * 取消书签添加回调
   * author：pensiveant
   * @memberof Bookmark
   */
  const handleCancel = () => {
    setVisible(false);
  }

  /**
   * 书签组件鼠标按下拖拽事件回调
   * author:pensiveant
   * @memberof Bookmark
   */
  const drag = (e) => {
    const Drag =bookMarkDivRef.current;
    const ev = e || window.event;
    e.stopPropagation();
    const disX = ev.clientX - Drag.offsetLeft;
    const disY = ev.clientY - Drag.offsetTop;
    document.onmousemove = function (event) {
      const ev = event || window.event;
      Drag.style.left = ev.clientX - disX + 'px';
      Drag.style.top = ev.clientY - disY + 'px';
      Drag.style.cursor = 'move';
    };
  }

  /**
   * 书签组件mouseup移除拖拽回调
   * author:pensiveant
   * @memberof Bookmark
   */
  const removeDrag = (e) => {
    document.onmousemove = null;
    const Drag = bookMarkDivRef.current;
    Drag.style.cursor = 'default';
  }



  const renderBookmarks = () => {
    return bookmark.bookmarks.map((bookmark, index) => {
      const ButtonGroup = Button.Group;
      return (
        <div key={index}>
          <div>
            <ButtonGroup>
            <ConfigProvider autoInsertSpaceInButton={false}>
              <Button
                style={{
                  width: 180,
                  border: 'none',
                  textAlign: 'left',
                  marginRight: '12px',
                }}
                onClick={gotoBookmark}
              >
                {bookmark.name}
              </Button>
              </ConfigProvider>
              <Tooltip title="编辑">
                <Button
                  onClick={showModal}
                  size="small"
                  style={{
                    border: 'none',
                  }}
                >
                  <Icon type="edit" />
                </Button>
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  onClick={deletthisBookmark}
                  size="small"
                  type="danger" ghost
                  style={{
                    border: 'none',
                  }}
                >
                  <Icon type="close-circle" />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </div>
        </div>
      );
    });
  }

  return (
    <div
      id="shuqian"
      className={styles.modal}
      style={{ display: bookmark.bookflags ? 'block' : 'none' }}
      ref={bookMarkDivRef}
    >
      <div className={styles.title} onMouseDown={drag} onMouseUp={removeDrag}>
        书签
          <Tooltip title="关闭">
          <div onClick={visblechange} className={styles.close}>
            <Icon type="close" />
          </div>
        </Tooltip>
      </div>
      <div className={styles.modalbody}>{renderBookmarks()}</div>
      <p className={styles.btnDiv}>
        <Button
          type="primary"
          onClick={addBookmark}
          style={{
            width: '120px',
            borderRadius: 2,
          }}
        >
          <Icon type="plus-circle" />
          添加
          </Button>
        <Button
          type="danger"
          style={{
            marginLeft: '24px',
            width: '120px',
            borderRadius: 2,
          }}
          onClick={deletBookmark}
        >
          <Icon type="close-circle" />
          清空
          </Button>
      </p>
      <div>
        <Modal
          title={status === 'add' ? '添加书签' : '编辑书签'}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          width="280px"
          footer={null}
          mask={false}
          maskClosable={false}
        >
          <p className={styles.labelmargin}>书签名称： </p>
          <div className={styles.labelmargin}>
            <Input
              onChange={nide}
              // placeholder={geteditbookname}
              value={bookname}
              // defaultValue={geteditbookname}
              style={{ borderRadius: 0, backgroundColor: 'transparent' }}
            />
          </div>
          <div>
            <Button
              type="primary"
              style={{
                marginLeft: '168px',
                borderRadius: 0,
              }}
              onClick={edit}
            >
              确定
              </Button>
          </div>
        </Modal>
      </div>
    </div>
  );

}

export default connect(({ bookmark }) => {
  return {
    bookmark,
  };
})(Bookmark);
