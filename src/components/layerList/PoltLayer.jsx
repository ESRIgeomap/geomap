import React from 'react';
import { connect } from 'dva';
import {
  Button,
  Spin,
  Tooltip,
  message,
  List,
  Popconfirm,
  Switch,
  Modal,
  Icon,
  Input,
  Pagination,
  Select,
  Menu,
  Dropdown,
} from 'antd';
//import { FormattedMessage, setLocale, getLocale, formatMessage } from 'umi/locale';
import styles from './PoltLayer.less';
import {
  POLT_SHOWLAYER_BYITEMID,
  POLT_EDIT_ACTIVE,
  POLT_EDIT_DEACTIVE,
  POLT_EDIT_SAVE,
  POLT_EDIT_CANCEL,
  POLT_EDITOR_CREATE,
  POLT_EDITOR_REMOVE,
  POLT_EDIT_ACTIVE_COLLECTION,
  POLT_EDIT_SAVE_COLLECTIN,
  POLT_DOWNLOAD_FILE_BYTYPE,
  POLT_DOWNLOAD_COLLECTION_BYTYPE,
  POLT_REMOVElAYER_BY_ITEMID,
  POLT_ADDPOLTFILE_LAYERITEM,
} from '../../constants/action-types';
import util from '../../utils/common';
const Option = Select.Option;
class PoltLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comheight: 400,
      conentheight: 660,
      modalvisible: false,

      filename: '',
      layertype: '',
      layerdescription: '',
      file: null,
      type: '',
      checkedPoltlayerlist: [],
      pageInfo: {
        start: 0,
        size: 10,
        page: 1,
      },
      activePoltEditItem: '',
      saveState: false,
    };
  }
  componentDidMount() {
    const height = document.body.clientHeight - 210;
    this.setState({
      comheight: height,
      conentheight:height-100
    });
    this.props.dispatch({
      type: 'layerList/getPoltlayerList',
      payload: this.state.pageInfo,
    });
  }
  shouPoltPanel = () => {
    this.props.dispatch({
      type: 'layerList/changePoltPanelVisible',
      payload: true,
    });
  };
  showModal = () => {
    this.setState({
      modalvisible: true,
    });
  };
  handleUploadOk = () => {
    const { filename, file, layertype, type, layerdescription } = this.state;
    if (!file) {
      message.warn('请选择上传文件！');
      return;
    }
    this.props.dispatch({
      type: POLT_ADDPOLTFILE_LAYERITEM,
      payload: {
        filename,
        file,
        layertype,
        type,
        layerdescription,
      },
    });
    this.props.dispatch({
      type:'layerList/changePoltlayerOptionsLoad',
      payload:true
    });
    this.setState({
      modalvisible: false,
    });
  };
  handleUploadCancel = () => {
    this.setState({
      modalvisible: false,
    });
  };
  handleFileChange = info => {
    if (info.target.files[0]) {
      const filename = info.target.files[0].name.split('.')[0];
      const file = info.target.files[0];
      const type = info.target.files[0].name.split('.')[1];
      this.setState({
        filename,
        type,
        file,
      });
    }
  };
  selectFile = () => {
    document.getElementById('file').click();
  };
  onFileNameChange = e => {
    const value = e.target.value;
    this.setState({
      filename: value,
    });
  };
  onLayertypeChange = e => {
    const value = e.target.value;
    this.setState({
      layertype: value,
    });
  };

  onLayerdescriptionChange = e => {
    const value = e.target.value;
    this.setState({
      layerdescription: value,
    });
  };
  deletePoltFileItem = itemid => {
    this.props.dispatch({
      type: 'layerList/changePoltlayerOptionsLoad',
      payload: true,
    });
    this.props.dispatch({
      type: POLT_REMOVElAYER_BY_ITEMID,
      payload: { itemid, pageInfo: this.state.pageInfo },
    });
  };
  poltlayerVisible = async (checked, item) => {
    const arr = JSON.parse(JSON.stringify(this.state.checkedPoltlayerlist));
    if (checked) {
      arr.push(item.id);
      this.setState({
        checkedPoltlayerlist: arr,
      });
    } else {
      if (this.state.activePoltEditItem === item.id) {
        this.props.dispatch({
          type: POLT_EDITOR_REMOVE,
        });
      }
      const list = util.deleteArrItem(arr, item.id);
      this.setState({
        checkedPoltlayerlist: list,
      });
    }
    this.props.dispatch({
      type: POLT_SHOWLAYER_BYITEMID,
      payload: { checked, item },
    });
  };
  pageChangeHandle = (page, pagesize) => {
    const start = (page - 1) * pagesize + 1;
    this.setState(
      {
        pageInfo: {
          ...this.state.pageInfo,
          start,
          page,
        },
      },
      () => {
        this.props.dispatch({
          type: 'layerList/getPoltlayerList',
          payload: this.state.pageInfo,
        });
      }
    );
  };
  activeEdit = item => {
    this.setState({
      saveState: true,
    });
    if (item.type === 'Feature Service') {
      // const itemid = item.id;
      // if (this.state.activePoltEditItem === '') {
      //   this.setState({
      //     activePoltEditItem: itemid,
      //   });
      //   this.props.dispatch({
      //     type: POLT_EDIT_ACTIVE,
      //     payload: itemid,
      //   });
      // } else {
      //   if (this.state.activePoltEditItem === itemid) {
      //     this.setState({
      //       activePoltEditItem: '',
      //     });
      //     this.props.dispatch({
      //       type: POLT_EDITOR_REMOVE,
      //     });
      //   } else {
      //     this.setState({
      //       activePoltEditItem: itemid,
      //     });
      //     this.props.dispatch({
      //       type: POLT_EDIT_ACTIVE,
      //       payload: itemid,
      //     });
      //   }
      // }
    }
    if (item.type === 'Feature Collection') {
      this.props.changeTab('1');
      const itemid = item.id;
      this.props.dispatch({
        type: 'layerList/changePoltEditToolbarVisible',
        payload: true,
      });
      this.props.dispatch({
        type: POLT_EDIT_ACTIVE_COLLECTION,
        payload: item.id,
      });
      this.setState({
        activePoltEditItem: itemid,
      });
    }
  };
  cancelEdit = itemid => {
    this.props.dispatch({
      type: POLT_EDIT_CANCEL,
      payload: itemid,
    });
    this.setState({
      activePoltEditItem: '',
    });
  };

  locate2Layer = () => {};
  handleDownTypeClick = ({ key }) => {
    const type = key.split('-')[0];
    const itemid = key.split('-')[1];
    const itemtype = key.split('-')[2];
    this.props.dispatch({
      type: 'layerList/changePoltlayerOptionsLoad',
      payload: true,
    });
    if (itemtype === 'Feature Service') {
      this.props.dispatch({
        type: POLT_DOWNLOAD_FILE_BYTYPE,
        payload: { type, itemid: itemid },
      });
    }
    if (itemtype === 'Feature Collection') {
      this.props.dispatch({
        type: POLT_DOWNLOAD_COLLECTION_BYTYPE,
        payload: { type, itemid: itemid },
      });
    }
  };
  saveEditPoltCollection = item => {
    const itemid = item.id;
    this.setState({
      saveState: false,
    });
    if (item.type === 'Feature Collection') {
      this.props.dispatch({
        type: POLT_EDIT_SAVE_COLLECTIN,
        payload: item,
      });
      // this.props.dispatch({
      //   type: 'layerList/changePoltEditToolbarVisible',
      //   payload: false,
      // });
    } else {
      // this.props.dispatch({
      //   type: POLT_EDITOR_REMOVE,
      // });
    }
  };
  renderPoltLayerList = () => {
    return (
      <div className={styles.poltlist}>
        {this.props.layerList.poltlayerlist.results.map(item => {
          const dataUrl = `${window.appcfg.portal}sharing/rest/content/items/${
            item.id
          }/data?token=${sessionStorage.token}`;
          return (
            <div className={styles.poltitem} key={item.id}>
              <div className={styles.poltitemmeta}>
                <div className={styles.poltitemload}>
                  <Switch
                    checked={this.state.checkedPoltlayerlist.includes(item.id) ? true : false}
                    onChange={checked => {
                      this.poltlayerVisible(checked, item);
                    }}
                    size="small"
                  />
                </div>
                <Tooltip title={item.title}>
                  <div className={styles.poltitemcontent} onClick={this.locate2Layer}>
                    <h4 className={styles.poltitemtitle}>{item.title.substr(0, 8)} </h4>
                    <div className={styles.poltitemdescription}>
                      {item.type === 'Document Link'
                        ?'标绘数据'
                        : item.type}
                    </div>
                  </div>
                </Tooltip>
              </div>
              <div className={styles.poltitemaction}>
                <span>
                  {(item.type === 'Feature Collection') &&
                  this.state.checkedPoltlayerlist.includes(item.id) ? (
                    <Tooltip title='编辑'>
                      {' '}
                      <Icon
                        type="edit"
                        onClick={() => {
                          this.activeEdit(item);
                        }}
                      />
                    </Tooltip>
                  ) : null}
                  {(item.type === 'Feature Collection') &&
                  this.state.checkedPoltlayerlist.includes(item.id) &&
                  this.state.activePoltEditItem === item.id &&
                  this.state.saveState ? (
                    <Tooltip title={'保存'}>
                      {' '}
                      <Icon
                        style={{ marginRight: '0px', marginLeft: '10px' }}
                        type="save"
                        onClick={() => {
                          this.saveEditPoltCollection(item);
                        }}
                      />
                    </Tooltip>
                  ) : null}
                  {/* Feature Service 包含 geojson、 shapefile、csv */}
                  {item.type === 'Feature Service' || item.type === 'Feature Collection' ? (
                    <Dropdown
                      overlay={
                        <Menu onClick={this.handleDownTypeClick}>
                          <Menu.Item key={`Shapefile-${item.id}-${item.type}`}>Shapefile</Menu.Item>
                          <Menu.Item key={`CSV-${item.id}-${item.type}`}>CSV</Menu.Item>
                          <Menu.Item key={`GeoJson-${item.id}-${item.type}`}>GeoJson</Menu.Item>
                        </Menu>
                      }
                    >
                      <Icon type="download" 
                        style={{ marginRight: '0px', marginLeft: '10px' }}
                      />
                    </Dropdown>
                  ) : null}
                  {item.type === 'KML' ? (
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key={`Shapefile-${item.id}`}>
                            <a href={dataUrl}>KML</a>
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <Icon type="download" 
                        style={{ marginRight: '0px', marginLeft: '10px' }}                        
                      />
                    </Dropdown>
                  ) : null}
                  <Popconfirm
                    title='确认删除?'
                    onConfirm={() => {
                      this.deletePoltFileItem(item.id);
                    }}
                    okText='确定'
                    cancelText= '取消'
                  >
                    <Tooltip title= '删除'>
                      {' '}
                      <Icon type="delete" 
                        style={{ marginRight: '0px', marginLeft: '10px' }}                        
                      />{' '}
                    </Tooltip>
                  </Popconfirm>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className={styles.wrap}  style={{height:this.state.comheight}}>
        <div className={styles.btnWrap}>
          <Button block className={styles.btnStyle} icon="plus" onClick={this.showModal}>
          添加本地文件{' '}
          </Button>
        </div>
        <Spin
          style={{
            position: 'absolute',
            left: 200,
            top: 220,
            display: this.props.layerList.poltlayeroptionsload ? 'block' : 'none',
          }}
        />
        <div className={styles.layerItemWrap}
          style={{height:this.state.conentheight}}
        >
        {this.renderPoltLayerList()}
        </div>
        <Pagination
          hideOnSinglePage
          current={this.state.pageInfo.page}
          pageSize={this.state.pageInfo.size}
          total={this.props.layerList.poltlayerlist.total}
          onChange={this.pageChangeHandle}
        />

        <Modal
          title='添加本地文件'
          visible={this.state.modalvisible}
          onOk={this.handleUploadOk}
          onCancel={this.handleUploadCancel}
          mask={false}
          cancelText='取消'
          okText= '确定'
        >
          <div className={styles.filecontent}>
            <div className={styles.left}> 标题：</div>
            <div className={styles.right}>
              <Input value={this.state.filename} onChange={this.onFileNameChange} />
            </div>
          </div>
          <div className={styles.filecontent}>
            <div className={styles.left}>类型：</div>
            <div className={styles.right}>
              <Input value={this.state.layertype} onChange={this.onLayertypeChange} />
            </div>
          </div>
          <div className={styles.filecontent}>
            <div className={styles.left}> 描述：</div>
            <div className={styles.right}>
              <Input value={this.state.layerdescription} onChange={this.onLayerdescriptionChange} />
            </div>
          </div>
          <div className={styles.filecontent}>
            <div className={styles.left}> 选择本地文件：</div>
            <div className={styles.right}>
              <Button onClick={this.selectFile}>
                <Icon type="upload" /> 选择本地文件
              </Button>
            </div>
          </div>
        </Modal>

        <input
          style={{ display: 'none' }}
          type="file"
          name="file"
          id="file"
          multiple
          accept=".zip, .geojson, .csv , .kml"
          onChange={this.handleFileChange}
        />
      </div>
    );
  }
}
PoltLayer.propTypes = {};
export default connect(({ layerList }) => {
  return { layerList };
})(PoltLayer);
