import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Icon, Input, notification, Tooltip } from 'antd';
import styles from './Bookmark.css';

class Bookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookname: null,
      bookmarknames: [],
      visible: false,
      geteditbookname: null,
    };
    this.visblechange = this.visblechange.bind(this);
    this.addBookmark = this.addBookmark.bind(this);
    this.deletBookmark = this.deletBookmark.bind(this);
    this.dodelet = this.dodelet.bind(this);
    this.gotoBookmark = this.gotoBookmark.bind(this);
    this.edit = this.edit.bind(this);
    this.deletthisBookmark = this.deletthisBookmark.bind(this);
    this.nide = this.nide.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.drag = this.drag.bind(this);
    this.removeDrag = this.removeDrag.bind(this);
  }

  visblechange() {
    if (this.props.agsmap.bookflags) {
      // prepare();
      this.props.dispatch({
        type: 'agsmap/bookmarkChangeState',
        payload: false,
      });
    } else {
      this.props.dispatch({
        type: 'agsmap/bookmarkChangeState',
        payload: true,
      });
    }
  }

  nide(e) {
    const value = e.target.value;
    this.setState({ bookname: value });
  }

  addBookmark() {
    this.setState({
      visible: true,
      geteditbookname: '',
    });
  }

  deletBookmark() {
    if (this.state.bookmarknames.length > 0) {
      const self = this;
      Modal.confirm({
        title: '确定清空书签?',
        content: '清空后所有书签将被删除，且无法恢复...',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          self.dodelet();
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
  dodelet() {
    this.state.bookmarknames = [];
    this.props.dispatch({
      type: 'agsmap/deletBookmark',
    });
  }

  gotoBookmark(e) {
    this.props.dispatch({
      type: 'agsmap/gotoBookmark',
      payload: e.currentTarget.innerText,
    });
  }

  deletthisBookmark(e) {
    const self = this;
    const text = e.target.offsetParent.firstChild.innerText;
    Modal.confirm({
      title: '确定删除该书签?',
      content: '删除后该书签无法恢复...',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        self.dodeletthis(text);
      },
      onCancel() {
      },
    });
  }
  dodeletthis(text) {
    this.state.bookmarknames.forEach((element) => {
      if (element === text) {
        const index = this.state.bookmarknames.indexOf(element);
        this.state.bookmarknames.splice(index, 1);
      }
    });
    this.props.dispatch({
      type: 'agsmap/deletthisBookmark',
      payload: text,
    });
  }

  showModal(e) {
    this.setState({
      visible: true,
      geteditbookname: e.target.offsetParent.firstChild.innerText,
    });
  }
  handleOk() {
    this.setState({
      visible: false,
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  //onMouseDown
  drag = e => {
    const Drag = this.refs.bookMarkDiv;
    const ev = e || window.event;
    e.stopPropagation();
    const disX = ev.clientX - Drag.offsetLeft;
    const disY = ev.clientY - Drag.offsetTop;
    document.onmousemove = function(event) {
      const ev = event || window.event;
      Drag.style.left = ev.clientX - disX + 'px';
      Drag.style.top = ev.clientY - disY + 'px';
      Drag.style.cursor = 'move';
    };
  }
  //onMouseUp
  removeDrag = e => {
    document.onmousemove = null;
    const Drag = this.refs.bookMarkDiv;
    Drag.style.cursor = 'default';
  }

  edit() {
    if (
      this.state.geteditbookname === null ||
      this.state.geteditbookname === ''
    ) {
      if (
        this.state.bookname !== null &&
        this.state.bookname !== undefined &&
        this.state.bookname.trim() !== ''
      ) {
        if (this.state.bookmarknames.indexOf(this.state.bookname) >= 0) {
          notification.open({
            message: '警告',
            description: '已存在该书签，请修改书签名后添加！',
          });
        } else {
          this.state.bookmarknames.push(this.state.bookname);
          this.props.dispatch({
            type: 'agsmap/addBookmark',
            payload: this.state.bookname,
          });
          this.handleOk();
        }
      } else {
        notification.open({
          message: '警告',
          description: '书签名不可为空！',
        });
      }
    } else if (
      this.state.geteditbookname !== null &&
      this.state.geteditbookname !== ''
    ) {
      if (
        this.state.bookname !== null &&
        this.state.bookname !== undefined &&
        this.state.bookname.trim() !== ''
      ) {
        if (this.state.bookmarknames.indexOf(this.state.bookname) >= 0) {
          notification.open({
            message: '警告',
            description: '已存在该书签，请修改书签名后添加！',
          });
        } else {
          this.state.bookmarknames.forEach((element) => {
            if (element === this.state.geteditbookname) {
              const index = this.state.bookmarknames.indexOf(element);
              this.state.bookmarknames.splice(index, 1);
            }
          });
          this.state.bookmarknames.push(this.state.bookname);
          this.props.dispatch({
            type: 'agsmap/editBookmark',
            payload: {
              newname: this.state.bookname,
              oldname: this.state.geteditbookname,
            },
          });
          this.handleOk();
        }
      } else {
        notification.open({
          message: '警告',
          description: '书签名不可为空！',
        });
      }
    }
  }

  renderBookmarks() {
    return this.props.agsmap.bookmarks.map((bookmark, index) => {
      const ButtonGroup = Button.Group;
      return (
        <div key={index}>
          <div>
            <ButtonGroup>
              <Button
                style={{
                  width: 180,
                  border: 'none',
                  textAlign: 'left',
                  marginRight: '12px',
                }}
                onClick={this.gotoBookmark}
              >
                {bookmark.name}
              </Button>
              <Tooltip title="编辑">
                <Button
                  onClick={this.showModal}
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
                  onClick={this.deletthisBookmark}
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

  render() {
    return (
      <div
        id="shuqian"
        className={styles.modal}
        style={{ display: this.props.agsmap.bookflags ? 'block' : 'none' }}
        ref="bookMarkDiv"
      >
        <div className={styles.title} onMouseDown={this.drag} onMouseUp={this.removeDrag}>
          书签
          <Tooltip title="关闭">
            <div onClick={this.visblechange} className={styles.close}>
              <Icon type="close" />
            </div>
          </Tooltip>
        </div>
        <div className={styles.modalbody}>{this.renderBookmarks()}</div>
        <p className={styles.btnDiv}>
          <Button
            type="primary"
            onClick={this.addBookmark}
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
            onClick={this.deletBookmark}
          >
            <Icon type="close-circle" />
            清空
          </Button>
        </p>
        <div>
          <Modal
            title={this.state.status === 'add' ? '添加书签' : '编辑书签'}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="280px"
            footer={null}
            mask={false}
            maskClosable={false}
          >
            <p className={styles.labelmargin}>书签名称： </p>
            <div className={styles.labelmargin}>
              <Input
                onChange={this.nide}
                // placeholder={this.state.geteditbookname}
                value={this.state.bookname}
                // defaultValue={this.state.geteditbookname}
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
                onClick={this.edit}
              >
                确定
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(Bookmark);
