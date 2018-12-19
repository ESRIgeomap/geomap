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
    return this.props.agsmap.bookmarks.map((bookmark) => {
      const ButtonGroup = Button.Group;
      return (
        <div>
          <p>
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
          </p>
        </div>
      );
    });
  }

  render() {
    return (
      <div
        id="shuqian"
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
        }}
      >
        <Modal
          title="书签列表"
          visible={this.props.agsmap.bookflags}
          mask={false}
          style={{
            top: 66,
            right: '-20%',
            pointerEvents: 'all',
            overflow: 'auto',
            maxHeight: '400px',
            borderRadius: 0,
          }}
          maskClosable={false}
          width="288px"
          footer={null}
          onCancel={this.visblechange}
          wrapClassName={styles.wrapClassName}
          bodyStyle={{ padding: '10px', textAlign: 'center' }}
        >
          <div style={{ minHeight: '245px', overflow: 'auto' }}>
            {this.renderBookmarks()}
          </div>
          <p>
            <Button
              type="primary"
              onClick={this.addBookmark}
              style={{
                width: '80px',
                borderRadius: 0,
              }}
            >
              <Icon type="plus-circle" />添加
            </Button>
            <Button
              type="danger"
              style={{
                marginLeft: '24px',
                width: '80px',
                borderRadius: 0,
              }}
              onClick={this.deletBookmark}
            >
              <Icon type="close-circle" />清空
            </Button>
          </p>
        </Modal>
        <div>
          <Modal
            title="书签编辑"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="280px"
            footer={null}
            mask={false}
            maskClosable={false}
          >
            <p>书签名称： </p>
            <p>
              <Input
                onChange={this.nide}
                placeholder={this.state.geteditbookname}
                // value={this.state.geteditbookname}
                defaultValue={this.state.geteditbookname}
                style={{ borderRadius: 0 }}
              />
            </p>
            <p>
              <Button
                type="primary"
                style={{
                  'margin-left': '168px',
                  borderRadius: 0,
                }}
                onClick={this.edit}
              >
                确定
              </Button>
            </p>
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
