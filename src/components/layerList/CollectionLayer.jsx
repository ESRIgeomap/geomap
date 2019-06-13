//pensiveant:LayerList的子组件

import React from 'react';
import { connect } from 'dva';
import { Button, message, Checkbox, Tooltip, Carousel, Icon, Card, Row, Col, Spin } from 'antd';
import styles from './CollectionLayer.less';
import util from '../../utils/common';
import defaultmap from './img/defaultmap.png';
import moment from 'moment';

import { LAYERLIST_SUBJECT_SWITCH,LAYERLIST_TOP_COLLECTION ,LAYERLIST_SUBJECT_REMOVE} from '../../constants/action-types';
//import { FormattedMessage, setLocale, getLocale, formatMessage } from 'umi/locale';

const { Meta } = Card;

class CollectionLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedWebmaps: [],
      activeWebMap: '',
    };
  }
  componentDidMount() {
    this.initCollectionWebMap();
  }
  initCollectionWebMap = () => {
    this.props.dispatch({
      type: 'layerList/getCollectionWebMap',
    });
  };
  switchWebMap = e => {
    const webmapid = e.target.dataset.itemid;
    this.props.dispatch({
      type: LAYERLIST_SUBJECT_SWITCH,
      payload: webmapid,
    });
    this.setState({
      activeWebMap: webmapid,
    });
  };
  renderCollectionWebMap = () => {
    const nowWebMaps = this.props.layerList.collectionWebMaps;
    if (!nowWebMaps) return null;
    const topOne = nowWebMaps.find(item => {
      if (item !== undefined) return item.tags.indexOf('topone') !== -1;
    });
    if (topOne === undefined || topOne === null) {
    } else {
      nowWebMaps.splice(nowWebMaps.indexOf(topOne), 1);
      nowWebMaps.unshift(topOne);
    }
    const groups = util.sliceArrayBySize(nowWebMaps, 3);
    return groups.map((group, index) => {
      return (
        <div key={`collection-group${index}`}>
          <Row gutter={5}>
            {group.map(webmap => {
              return (
                <Col span={8} className={styles.item} key={webmap.id}>
                  <Card
                    className={this.state.activeWebMap === webmap.id ? styles.active : ''}
                    cover={
                      <img
                        data-itemid={webmap.id}
                        onClick={this.switchWebMap}
                        src={
                          webmap.thumbnail
                            ? `${window.appcfg.portal}sharing/rest/content/items/${
                                webmap.id
                              }/info/${webmap.thumbnail}?token=${sessionStorage.token}`
                            : defaultmap
                        }
                        title={webmap.title}
                      />
                    }
                    hoverable={true}
                    bordered={true}
                  >
                    <Meta
                      title={webmap.title}
                      description={moment(webmap.created).format('YYYY-MM-DD')}
                    />
                  </Card>
                  <Button className={(topOne&&topOne.id) === webmap.id ? styles.topone : styles.up}>
                   置顶
                  </Button>
                </Col>
              );
            })}
          </Row>
        </div>
      );
    });
  };
  renderPreAndNext = () => {
    const nowWebMaps = this.props.layerList.collectionWebMaps;
    if (nowWebMaps.length === 0) {
      return null;
    } else {
      return (
        <>
          <span className={styles.goPrev}>
            {' '}
            <Icon type="left-circle" onClick={this.prev} />
          </span>
          <span className={styles.goNext}>
            <Icon type="right-circle" onClick={this.next} />
          </span>
          <Spin style={{display:this.props.layerList.webmapTopload?'block':'none'}}/>
        </>
      );
    }
  };
  delWebmap = () => {
    if(this.state.activeWebMap===''){
      message.warn('请选择要删除的收藏');
      return 
    }
    this.props.dispatch({
      type: LAYERLIST_SUBJECT_REMOVE,
      payload: this.state.activeWebMap,
    });   
    this.props.dispatch({
      type:'layerList/changeWebmapTopload',
      payload: true,
    });
  };
  checkWebmap = (checked, webmapid) => {
    const checkArr = JSON.parse(JSON.stringify(this.state.checkedWebmaps));
    if (checked) {
      checkArr.push(webmapid);
    } else {
      checkArr.splice(checkArr.indexOf(webmapid), 1);
    }
    this.setState({
      checkedWebmaps: checkArr,
    });
  };
  placeTopPage = () => {
    if (this.state.activeWebMap) {
      this.props.dispatch({
        type:'layerList/changeWebmapTopload',
        payload: true,
      });
      this.props.dispatch({
        type: LAYERLIST_TOP_COLLECTION,
        payload: this.state.activeWebMap,
      });     
    } else {
      message.warn('请选择要置顶的专题!');
    }
  }; 
  next = () => {
    const slider = this.refs.slider;
    slider.slick.slickNext();
  };
  prev = () => {
    const slider = this.refs.slider;
    slider.slick.slickPrev();
  };
  render() {
    const lunboSetting = {
      dots: false,
      autoplay: false,
    };
    const nowWebMaps = this.props.layerList.collectionWebMaps;
    return (
      <div className={styles.wrap}>
        <Row className={styles.toolbar}>
          <ul className={styles.countbar}>
            <li>
              <span>
                {nowWebMaps.length} 个专题
              </span>
            </li>
          </ul>
          <ul className={styles.actionbar}>
            <li>
              <Tooltip title='置顶'>
                <Button
                  key="totop"
                  className={styles.noeffect}
                  icon="pushpin"
                  onClick={this.placeTopPage}
                >
                 置顶
                </Button>
              </Tooltip>
            </li>
            <li>
              <Tooltip title='删除'>
                <Button
                  key="delete"
                  className={styles.noeffect}
                  icon="delete"
                  onClick={this.delWebmap}
                >
                 删除
                </Button>
              </Tooltip>
            </li>
          </ul>
        </Row>
        <Carousel {...lunboSetting} ref="slider">
          {this.renderCollectionWebMap()}
        </Carousel>
        {this.renderPreAndNext()}
      </div>
    );
  }
}
CollectionLayer.propTypes = {};
export default connect(({ layerList }) => {
  return { layerList };
})(CollectionLayer);
