import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Menu, Icon, Card, Input } from 'antd';
import * as jsapi from '../../../../utils/jsapi';
import env from '../../../../utils/env';
import totalWebScene from '../../../../services/portal4ags/item/totalWebScene';
import totalSceneLayerItem from '../../../../services/portal4ags/item/totalSceneLayerItem';
import totalFeatureLayerItem from '../../../../services/portal4ags/item/totalFeatureLayerItem';


const { Meta } = Card;
const { TextArea } = Input;
let ags;
let mySelf;
let layer;
const ChangeDataSource = props => {
  const domainName = env.getDomainName();
  const webAdaptorName = env.getWebAdaptorName();
  const getUsername4searchItems = env.getUsername4searchItems();
  const websceneImgClickedPre = '';
  const featureLayerImgClickedPre = '';
  const sceneLayerImgClickedPre = '';

  const websceneIdClicked = '';
  const featureLayerItemIdClicked = '';
  const sceneLayerItemIdClicked = '';
  const layerUrlArray = [];

  const dataSourceType = 'webscene';

  const [websceneArray, setWebsceneArray] = useState([]);
  const [featureLayerItemArray, setFeatureLayerItemArray] = useState([]);
  const [sceneLayerItemArray, setSceneLayerItemArray] = useState([]);

  useEffect(() => {
    initQueryWebScene();
    initQueryLayerItem();
  });

  function initQueryWebScene() {
    const param4totalItem = {
      domainName: domainName,
      webAdaptorName: webAdaptorName,
      owner: getUsername4searchItems,
    };
    totalWebScene(param4totalItem).then(response => {
      if (response) {
        const websceneArrayFirst = response.results;
        // 处理 缩略图 地址
        for (let i = 0; i < websceneArrayFirst.length; i++) {
          websceneArrayFirst[i].thumbnailUrl =
            'http://' +
            domainName +
            '/' +
            webAdaptorName +
            '/sharing/rest/content/items/' +
            websceneArrayFirst[i].id +
            '/info/' +
            websceneArrayFirst[i].thumbnail;

          websceneArrayFirst[i].modified2 = dateToString4all(websceneArrayFirst[i].modified);
        }
        setWebsceneArray(websceneArrayFirst);
      }
    });
  }
  function initQueryLayerItem() {
    const param4totalItem = {
      domainName: domainName,
      webAdaptorName: webAdaptorName,
      owner: getUsername4searchItems,
    };
    totalFeatureLayerItem(param4totalItem).then(response => {
      if (response) {
        const layerItemArrayFirst = response.results;
        // 处理 缩略图 地址
        for (let i = 0; i < layerItemArrayFirst.length; i++) {
          if (layerItemArrayFirst[i].thumbnail) {
            layerItemArrayFirst[i].thumbnailUrl =
              'http://' +
              mySelf.domainName +
              '/' +
              mySelf.webAdaptorName +
              '/sharing/rest/content/items/' +
              layerItemArrayFirst[i].id +
              '/info/' +
              layerItemArrayFirst[i].thumbnail;
          } else {
            layerItemArrayFirst[i].thumbnailUrl =
              'http://esrichina3d.arcgisonline.cn/portal/home/10.6/js/arcgisonline/css/images/default_thumb.png';
          }
          layerItemArrayFirst[i].modified2 = mySelf.dateToString4all(
            layerItemArrayFirst[i].modified
          );
        }
        setFeatureLayerItemArray(layerItemArrayFirst);
      }
    });
    totalSceneLayerItem(param4totalItem).then(response => {
      if (response) {
        const layerItemArrayFirst = response.results;
        // 处理 缩略图 地址
        for (let i = 0; i < layerItemArrayFirst.length; i++) {
          if (layerItemArrayFirst[i].thumbnail) {
            layerItemArrayFirst[i].thumbnailUrl =
              'http://' +
              mySelf.domainName +
              '/' +
              mySelf.webAdaptorName +
              '/sharing/rest/content/items/' +
              layerItemArrayFirst[i].id +
              '/info/' +
              layerItemArrayFirst[i].thumbnail;
          } else {
            layerItemArrayFirst[i].thumbnailUrl =
              'http://esrichina3d.arcgisonline.cn/portal/home/10.6/js/arcgisonline/css/images/default_thumb.png';
          }
          layerItemArrayFirst[i].modified2 = dateToString4all(
            layerItemArrayFirst[i].modified
          );
        }
        setSceneLayerItemArray(layerItemArrayFirst);
      }
    });
  }

  function dateToString4all(obj4date) {
    if (obj4date) {
      var now = new Date(obj4date);
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      var newMonth = month < 10 ? '0' + month : month;
      var newDate = date < 10 ? '0' + date : date;
      var newHour = hour < 10 ? '0' + hour : hour;
      var newMinute = minute < 10 ? '0' + minute : minute;
      var newSecond = second < 10 ? '0' + second : second;
      return (
        year + '-' + newMonth + '-' + newDate + ' ' + newHour + ':' + newMinute + ':' + newSecond
      );
    } else {
      return 'obj4date 为 null';
    }
  }

  function handleOk() {
    // 获取全局ags对象，用于其他组件获取其中的view对象
    ags = env.getParamAgs();
    props.dispatch({
      type: 'agsmap/changeDataSourcePanelChangeState',
      payload: false,
    });
    if (dataSourceType === 'webscene') {
      changeWebScene(websceneIdClicked);
    } else if (dataSourceType === 'featureLayerItem') {
      addFeatureLayerToWebScene(featureLayerItemIdClicked);
    } else if (dataSourceType === 'sceneLayerItem') {
      addSceneLayerToWebScene(sceneLayerItemIdClicked);
    } else if (dataSourceType === 'layerUrl') {
      //清空viewDiv
      // document.getElementById('viewDiv').innerHTML = "";
      // 先获取 图层 url地址的数组
      const textAreaValue = document.getElementById('textArea4layerUrl').value;
      const textAreaValueFinal = textAreaValue.replace(/\s*/g, ''); //去空格
      const layerUrlArrayFirst = textAreaValueFinal.split(';'); //拆分字符串,解析出所有的图层url
      const layerUrlArrayFinal = [];
      // 处理数组
      let layerUrl;
      for (let i = 0; i < layerUrlArrayFirst.length; i++) {
        layerUrl = layerUrlArrayFirst[i];
        if (layerUrl !== '') {
          if (layerUrl.indexOf('FeatureServer') != -1) {
            layerUrlArrayFinal.push({ type: 'feature', url: layerUrl });
          }
          if (layerUrl.indexOf('SceneServer') != -1) {
            layerUrlArrayFinal.push({ type: 'scene', url: layerUrl });
          }
        }
      }
      layerUrlArray = layerUrlArrayFinal;
      addlayerUrlToWebScene(layerUrlArray);
    }
  }
  async function changeWebScene(websceneId) {
    //清空viewDiv
    document.getElementById('viewDiv').innerHTML = '';
    const [WebScene, Sceneview, Home, Zoom, Compass] = await jsapi.load([
      'esri/WebScene',
      'esri/views/SceneView',
      'esri/widgets/Home',
      'esri/widgets/Zoom',
      'esri/widgets/Compass',
    ]);
    const scene = new WebScene({
      portalItem: {
        id: websceneId,
        portal: env.getPortal4datasource(),
      },
    });
    ags.view = new Sceneview({
      container: 'viewDiv',
      map: scene,
      ui: {
        components: [],
      },
    });
    const home = new Home({
      view: ags.view,
    });
    ags.view.ui.add(home, 'top-right');
    const zoom = new Zoom({
      view: ags.view,
    });
    ags.view.ui.add(zoom, 'top-right');
    const compass = new Compass({
      view: ags.view,
    });
    ags.view.ui.add(compass, 'top-right');
    ags.view.when(() => {
      const websceneTitle = scene.portalItem.title;
      if (websceneTitle.indexOf('南京BIM') != -1) {
        mySelf.props.dispatch({
          type: 'agsmap/changeToolbar4bimPanelState',
          payload: true,
        });
      } else {
        mySelf.props.dispatch({
          type: 'agsmap/changeToolbar4bimPanelState',
          payload: false,
        });
      }
    });
  }
  async function addFeatureLayerToWebScene(featureLayerId) {
    //清空viewDiv
    // document.getElementById('viewDiv').innerHTML = "";
    const scene = ags.view.map;
    // const scene = new WebScene({
    //   basemap:'osm'
    // });
    const [FeatureLayer] = await jsapi.load(['esri/layers/FeatureLayer']);
    const layer = new FeatureLayer({
      portalItem: {
        // autocasts as new PortalItem()
        id: featureLayerId,
        portal: env.getPortal4datasource(),
      }, // the first layer in the service is returned
    });
    scene.add(layer);
    // Once the layer loads, set the view's extent to the layer's fullextent
    if (layer) {
      layer.when(function() {
        ags.view.extent = layer.fullExtent;
      });
    }
  }
  async function addSceneLayerToWebScene(sceneLayerId) {
    //清空viewDiv
    // document.getElementById('viewDiv').innerHTML = "";
    const scene = ags.view.map;
    const [SceneLayer] = await jsapi.load(['esri/layers/SceneLayer']);
    const layer = new SceneLayer({
      portalItem: {
        // autocasts as new PortalItem()
        id: sceneLayerId,
        portal: env.getPortal4datasource(),
      }, // the first layer in the service is returned
    });
    scene.add(layer);
    if (layer) {
      layer.when(function() {
        ags.view.extent = layer.fullExtent;
      });
    }
  }
  async function addlayerUrlToWebScene(layerUrlArray) {
    const scene = ags.view.map;
    const [FeatureLayer, SceneLayer] = await jsapi.load([
      'esri/layers/FeatureLayer',
      'esri/layers/SceneLayer',
    ]);
    let layerUrlObj;
    for (let i = 0; i < layerUrlArray.length; i++) {
      layerUrlObj = layerUrlArray[i];
      if (layerUrlObj.type === 'feature') {
        layer = new FeatureLayer({
          // URL to the service
          url: layerUrlObj.url,
        });
      } else if (layerUrlObj.type === 'scene') {
        layer = new SceneLayer({
          // URL to the service
          url: layerUrlObj.url,
        });
      }
      scene.add(layer);
    }
    if (layer) {
      layer.when(function() {
        ags.view.extent = layer.fullExtent;
      });
    }
  }

  function handleCancel() {
    props.setVisible(false);
  }

  function handleClick4menu(evt) {
    console.log('evt' + evt);
    const key = evt.key;
    if (key === 'webscene') {
      // alert('选择图层item添加到场景');
      document.getElementById('div4webscene').style.display = 'block';
      document.getElementById('div4featureLayerItem').style.display = 'none';
      document.getElementById('div4sceneLayerItem').style.display = 'none';
      document.getElementById('div4layerUrl').style.display = 'none';
      dataSourceType = 'webscene';
    } else if (key === 'featureLayerItem') {
      // alert('选择图层item添加到场景');
      document.getElementById('div4webscene').style.display = 'none';
      document.getElementById('div4featureLayerItem').style.display = 'block';
      document.getElementById('div4sceneLayerItem').style.display = 'none';
      document.getElementById('div4layerUrl').style.display = 'none';
      dataSourceType = 'featureLayerItem';
    } else if (key === 'sceneLayerItem') {
      // alert('选择图层item添加到场景');
      document.getElementById('div4webscene').style.display = 'none';
      document.getElementById('div4featureLayerItem').style.display = 'none';
      document.getElementById('div4sceneLayerItem').style.display = 'block';
      document.getElementById('div4layerUrl').style.display = 'none';
      dataSourceType = 'sceneLayerItem';
    } else if (key === 'layerUrl') {
      // alert('通过图层url添加到场景');
      document.getElementById('div4webscene').style.display = 'none';
      document.getElementById('div4featureLayerItem').style.display = 'none';
      document.getElementById('div4sceneLayerItem').style.display = 'none';
      document.getElementById('div4layerUrl').style.display = 'block';
      dataSourceType = 'layerUrl';
    }
  }
  function onWebSceneImgClick(e) {
    if (websceneImgClickedPre.style) {
      websceneImgClickedPre.style.border = '10px solid #e8e8e8';
    }
    websceneImgClickedPre = e.currentTarget;
    e.currentTarget.style.border = '3px solid #006DB5';
    // const clickParam = e.currentTarget.children[0].children[0].title;
    websceneIdClicked = e.currentTarget.children[0].children[0].alt;
  }
  function onFeatureLayerItemImgClick(e) {
    if (featureLayerImgClickedPre.style) {
      featureLayerImgClickedPre.style.border = '10px solid #e8e8e8';
    }
    featureLayerImgClickedPre = e.currentTarget;
    e.currentTarget.style.border = '3px solid #006DB5';
    // const clickParam = e.currentTarget.children[0].children[0].title;
    featureLayerItemIdClicked = e.currentTarget.children[0].children[0].alt;
  }
  function onSceneLayerItemImgClick(e) {
    if (sceneLayerImgClickedPre.style) {
      sceneLayerImgClickedPre.style.border = '10px solid #e8e8e8';
    }
    sceneLayerImgClickedPre = e.currentTarget;
    e.currentTarget.style.border = '3px solid #006DB5';
    // const clickParam = e.currentTarget.children[0].children[0].title;
    sceneLayerItemIdClicked = e.currentTarget.children[0].children[0].alt;
  }

  return (
    <Modal
      style={{ overflowY: 'hidden' }}
      width={1600}
      height={800}
      title="修改数据源"
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <div style={{ marginBottom: '30px', marginTop: '-20px' }}>
        <Menu
          onClick={handleClick4menu}
          mode="horizontal"
        >
          <Menu.Item key="webscene" style={{ fontSize: 27 }}>
            <Icon type="webscene" />
            选择WebScene切换场景
          </Menu.Item>
          <Menu.Item key="featureLayerItem" style={{ fontSize: 27 }}>
            <Icon type="featureLayerItem" />
            选择要素图层添加到场景
          </Menu.Item>
          <Menu.Item key="sceneLayerItem" style={{ fontSize: 27 }}>
            <Icon type="sceneLayerItem" />
            选择场景图层添加到场景
          </Menu.Item>
          <Menu.Item key="layerUrl" style={{ fontSize: 27 }}>
            <Icon type="layerUrl" />
            通过图层url添加到场景
          </Menu.Item>
        </Menu>
      </div>
      <div id="div4webscene" style={{ display: 'block', height: '500px', overflowY: 'auto' }}>
        <div>
          <p style={{ fontSize: 20, color: '#1890ff' }}>
            总共搜索出{websceneArray.length}个WebScene资源：
          </p>
        </div>
        {websceneArray &&
          websceneArray.map((item, index) => {
            return (
              <Card
                hoverable
                style={{ width: 240, height: 240, float: 'left', border: '10px solid #e8e8e8' }}
                cover={
                  <img
                    alt={item.id}
                    title={item.title}
                    style={{ height: 113 }}
                    src={item.thumbnailUrl}
                  />
                }
                onClick={onWebSceneImgClick}
                key={index}
              >
                <Meta
                  title={item.title}
                  description={'类型：' + item.type + ',修改于：' + item.modified2}
                />
              </Card>
            );
          })}
      </div>
      <div
        id="div4featureLayerItem"
        style={{ display: 'none', height: '500px', overflowY: 'auto' }}
      >
        <div>
          <p style={{ fontSize: 20, color: '#1890ff' }}>
            总共搜索出{featureLayerItemArray.length}个要素图层item资源：
          </p>
        </div>
        {featureLayerItemArray &&
          featureLayerItemArray.map((item, index) => {
            return (
              <Card
                hoverable
                style={{ width: 240, height: 240, float: 'left', border: '10px solid #e8e8e8' }}
                cover={
                  <img
                    alt={item.id}
                    title={item.title}
                    style={{ height: 113 }}
                    src={item.thumbnailUrl}
                  />
                }
                onClick={onFeatureLayerItemImgClick}
                key={index}
              >
                <Meta
                  title={item.title}
                  description={'类型：' + item.type + ',修改于：' + item.modified2}
                />
              </Card>
            );
          })}
      </div>
      <div id="div4sceneLayerItem" style={{ display: 'none', height: '500px', overflowY: 'auto' }}>
        <div>
          <p style={{ fontSize: 20, color: '#1890ff' }}>
            总共搜索出{sceneLayerItemArray.length}个场景图层item资源：
          </p>
        </div>
        {sceneLayerItemArray &&
          sceneLayerItemArray.map((item, index) => {
            return (
              <Card
                hoverable
                style={{ width: 240, height: 240, float: 'left', border: '10px solid #e8e8e8' }}
                cover={
                  <img
                    alt={item.id}
                    title={item.title}
                    style={{ height: 113 }}
                    src={item.thumbnailUrl}
                  />
                }
                onClick={onSceneLayerItemImgClick}
                key={index}
              >
                <Meta
                  title={item.title}
                  description={'类型：' + item.type + ',修改于：' + item.modified2}
                />
              </Card>
            );
          })}
      </div>
      <div id="div4layerUrl" style={{ display: 'none', height: '500px', overflowY: 'auto' }}>
        <p style={{ fontSize: 20, color: '#1890ff' }}>
          输入图层的URL地址(支持批量输入,中间用分号隔开即可,添加完成后缩放到最后一个图层的位置)：
        </p>
        <div style={{ margin: '24px 0' }} />
        <TextArea
          id="textArea4layerUrl"
          placeholder="
              http://esrichina3d.arcgisonline.cn/arcgis/rest/services/Hosted/building4floor/SceneServer;
              http://esrichina3d.arcgisonline.cn/arcgis/rest/services/Hosted/chinaCityPolygonShp/FeatureServer;
              http://esrichina3d.arcgisonline.cn/arcgis/rest/services/Hosted/GHFA1_JZ/SceneServer;
              http://esrichina3d.arcgisonline.cn/arcgis/rest/services/Hosted/Buildings4shanghai/FeatureServer;
              "
          autosize={{ minRows: 2, maxRows: 6 }}
        />
      </div>
    </Modal>
  );
};

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(ChangeDataSource);
