import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Modal, Menu, Icon, Card, Input } from 'antd';
import * as jsapi from '../../utils/jsapi';
import $ from 'jquery';
import env from '../../utils/env';
import totalWebScene from '../../services/portal4ags/item/totalWebScene';
import totalSceneLayerItem from '../../services/portal4ags/item/totalSceneLayerItem';
import totalFeatureLayerItem from '../../services/portal4ags/item/totalFeatureLayerItem';
import Overviewmap from '../../components/overviewmap/Overviewmap';



const overmapDiv = {};
const expandDiv = {};

const { Meta } = Card;
const { TextArea } = Input;
let ags;
let mySelf;
let layer;
class ChangeDataSource extends Component {
  constructor(props) {
    super(props);
    mySelf = this;
    this.domainName = env.getDomainName();
    this.webAdaptorName = env.getWebAdaptorName();
    this.getUsername4searchItems = env.getUsername4searchItems();
    this.websceneImgClickedPre = '';
    this.featureLayerImgClickedPre = '';
    this.sceneLayerImgClickedPre = '';

    this.websceneIdClicked = '';
    this.featureLayerItemIdClicked = '';
    this.sceneLayerItemIdClicked = '';
    this.layerUrlArray = [];

    this.dataSourceType = 'webscene';

    this.state = {
      websceneArray: [],
      featureLayerItemArray: [],
      sceneLayerItemArray: []
    };
    // let websceneArrayInit = [];
    // const itemThumbnaillUrl = 'http://esrichina3d.arcgisonline.cn/portal/sharing/rest/content/items/860aa43a69c94cbfa74ac4d76ec9aceb/info/thumbnail/ago_downloaded.jpg';
    // for (let i = 0; i < 10; i++) {
    //   websceneArrayInit.push({ id: '860aa43a69c94cbfa74ac4d76ec9aceb',title:'长江大保护_数据展示场景', thumbnailUrl: itemThumbnaillUrl });
    // }
    // this.state.websceneArray = websceneArrayInit;
    this.initQueryWebScene = this.initQueryWebScene.bind(this);
    this.initQueryLayerItem = this.initQueryLayerItem.bind(this);
    this.dateToString4all = this.dateToString4all.bind(this);

    this.changeWebScene = this.changeWebScene.bind(this);
    this.addFeatureLayerToWebScene = this.addFeatureLayerToWebScene.bind(this);
    this.addSceneLayerToWebScene = this.addSceneLayerToWebScene.bind(this);
    this.addlayerUrlToWebScene = this.addlayerUrlToWebScene.bind(this);

    this.initSceneView = this.initSceneView.bind(this);
    this.createLayerList = this.createLayerList.bind(this);
    this.defineActions = this.defineActions.bind(this);
    this.createBasemapGallery = this.createBasemapGallery.bind(this);
    this.createQualityWidget = this.createQualityWidget.bind(this);
    this.registerRadioEvents = this.registerRadioEvents.bind(this);

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClick4menu = this.handleClick4menu.bind(this);
    this.onWebSceneImgClick = this.onWebSceneImgClick.bind(this);
    this.onFeatureLayerItemImgClick = this.onFeatureLayerItemImgClick.bind(this);
    this.onSceneLayerItemImgClick = this.onSceneLayerItemImgClick.bind(this);

    // this.initQueryWebScene().then(function (data) {
    //   const result = data;
    // })
    this.initQueryWebScene();
    this.initQueryLayerItem();
  }

  initQueryWebScene() {
    const param4totalItem = {
      domainName: this.domainName,
      webAdaptorName: this.webAdaptorName,
      owner: this.getUsername4searchItems
    };
    totalWebScene(param4totalItem).then(response => {
      if (response) {
        const websceneArrayFirst = response.results;
        // 处理 缩略图 地址
        for(let i=0;i<websceneArrayFirst.length;i++){
          // http://esrichina3d.arcgisonline.cn/portal/sharing/rest/content/items/860aa43a69c94cbfa74ac4d76ec9aceb/info/thumbnail/ago_downloaded.jpg
          websceneArrayFirst[i].thumbnailUrl = "http://"+mySelf.domainName+"/"+
          mySelf.webAdaptorName+"/sharing/rest/content/items/"+
          websceneArrayFirst[i].id+"/info/"+
          websceneArrayFirst[i].thumbnail;

          websceneArrayFirst[i].modified2 = mySelf.dateToString4all(websceneArrayFirst[i].modified);

          // console.log('url:'+websceneArrayFirst[i].thumbnailUrl);
        }
        mySelf.setState({
          websceneArray: websceneArrayFirst
        });
      }
    });
  }
  initQueryLayerItem() {
    const param4totalItem = {
      domainName: this.domainName,
      webAdaptorName: this.webAdaptorName,
      owner: this.getUsername4searchItems
    };
    totalFeatureLayerItem(param4totalItem).then(response => {
      if (response) {
        const layerItemArrayFirst = response.results;
        // 处理 缩略图 地址
        for(let i=0;i<layerItemArrayFirst.length;i++){
          if (layerItemArrayFirst[i].thumbnail) {
            // http://esrichina3d.arcgisonline.cn/portal/sharing/rest/content/items/860aa43a69c94cbfa74ac4d76ec9aceb/info/thumbnail/ago_downloaded.jpg
            layerItemArrayFirst[i].thumbnailUrl = "http://" + mySelf.domainName + "/" +
              mySelf.webAdaptorName + "/sharing/rest/content/items/" +
              layerItemArrayFirst[i].id + "/info/" +
              layerItemArrayFirst[i].thumbnail;
          } else {
            layerItemArrayFirst[i].thumbnailUrl = 'http://esrichina3d.arcgisonline.cn/portal/home/10.6/js/arcgisonline/css/images/default_thumb.png';
          }
          layerItemArrayFirst[i].modified2 = mySelf.dateToString4all(layerItemArrayFirst[i].modified);
          // console.log('url:'+websceneArrayFirst[i].thumbnailUrl);
        }
        mySelf.setState({
          featureLayerItemArray: layerItemArrayFirst
        });
      }
    });
    totalSceneLayerItem(param4totalItem).then(response => {
      if (response) {
        const layerItemArrayFirst = response.results;
        // 处理 缩略图 地址
        for(let i=0;i<layerItemArrayFirst.length;i++){
          if (layerItemArrayFirst[i].thumbnail) {
            // http://esrichina3d.arcgisonline.cn/portal/sharing/rest/content/items/860aa43a69c94cbfa74ac4d76ec9aceb/info/thumbnail/ago_downloaded.jpg
            layerItemArrayFirst[i].thumbnailUrl = "http://" + mySelf.domainName + "/" +
              mySelf.webAdaptorName + "/sharing/rest/content/items/" +
              layerItemArrayFirst[i].id + "/info/" +
              layerItemArrayFirst[i].thumbnail;
          } else {
            layerItemArrayFirst[i].thumbnailUrl = 'http://esrichina3d.arcgisonline.cn/portal/home/10.6/js/arcgisonline/css/images/default_thumb.png';
          }
          layerItemArrayFirst[i].modified2 = mySelf.dateToString4all(layerItemArrayFirst[i].modified);
          // console.log('url:'+websceneArrayFirst[i].thumbnailUrl);
        }
        mySelf.setState({
          sceneLayerItemArray: layerItemArrayFirst
        });
      }
    });
  }

  dateToString4all (obj4date) {
    if (obj4date) {
        var now = new Date(obj4date);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        var newMonth = (month < 10) ? "0" + month : month;
        var newDate = (date < 10) ? "0" + date : date;
        var newHour = (hour < 10) ? "0" + hour : hour;
        var newMinute = (minute < 10) ? "0" + minute : minute;
        var newSecond = (second < 10) ? "0" + second : second;
        return year + "-" + newMonth + "-" + newDate + " " + newHour + ":" + newMinute + ":" + newSecond;
    } else {
        return "obj4date 为 null";
    }
  }

  handleOk() {
    // 获取全局ags对象，用于其他组件获取其中的view对象
    ags = env.getParamAgs();
    this.props.dispatch({
      type: 'agsmap/changeDataSourcePanelChangeState',
      payload: false,
    });
    // alert(this.websceneIdClicked);
    if (this.dataSourceType === 'webscene') {
      this.changeWebScene(this.websceneIdClicked);
    } else if (this.dataSourceType === 'featureLayerItem') {
      this.addFeatureLayerToWebScene(this.featureLayerItemIdClicked);
    } else if (this.dataSourceType === 'sceneLayerItem') {
      this.addSceneLayerToWebScene(this.sceneLayerItemIdClicked);
    } else if (this.dataSourceType === 'layerUrl') {
      //清空viewDiv
      // document.getElementById('viewDiv').innerHTML = "";
      // 先获取 图层 url地址的数组
      const textAreaValue = document.getElementById('textArea4layerUrl').value;
      const textAreaValueFinal = textAreaValue.replace(/\s*/g,"");//去空格
      const layerUrlArrayFirst = textAreaValueFinal.split(";");//拆分字符串,解析出所有的图层url
      const layerUrlArrayFinal = [];
      // 处理数组
      let layerUrl;
      for(let i=0;i<layerUrlArrayFirst.length;i++){
        layerUrl = layerUrlArrayFirst[i];
        if(layerUrl !== ''){
          if(layerUrl.indexOf("FeatureServer") != -1){
            layerUrlArrayFinal.push({type:'feature',url:layerUrl});
          }
          if(layerUrl.indexOf("SceneServer") != -1){
            layerUrlArrayFinal.push({type:'scene',url:layerUrl});
          }
        }
      }
      this.layerUrlArray = layerUrlArrayFinal;
      this.addlayerUrlToWebScene(this.layerUrlArray);
    }
  }
  async changeWebScene (websceneId) {
    //清空viewDiv
    document.getElementById('viewDiv').innerHTML = "";
    const [WebScene, Sceneview, Home, Zoom, Compass] = await jsapi.load(['esri/WebScene', 'esri/views/SceneView', 'esri/widgets/Home', 'esri/widgets/Zoom', 'esri/widgets/Compass']);
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
    })
    ags.view.ui.add(home, "top-right");
    const zoom = new Zoom({
      view: ags.view,
    })
    ags.view.ui.add(zoom, "top-right");
    const compass = new Compass({
      view: ags.view,
    })
    ags.view.ui.add(compass, "top-right");
    ags.view.when(() => {
      mySelf.initSceneView();
      const websceneTitle = scene.portalItem.title;
      if(websceneTitle.indexOf('南京BIM') != -1){
        mySelf.props.dispatch({
          type: 'agsmap/changeToolbar4bimPanelState',
          payload: true,
        });
      }else{
        mySelf.props.dispatch({
          type: 'agsmap/changeToolbar4bimPanelState',
          payload: false,
        });
      }
    });
  }
  async addFeatureLayerToWebScene (featureLayerId) {
    //清空viewDiv
    // document.getElementById('viewDiv').innerHTML = "";
    const scene = ags.view.map;
    // const scene = new WebScene({
    //   basemap:'osm'
    // });
    const [FeatureLayer] = await jsapi.load(['esri/layers/FeatureLayer']);
    const layer = new FeatureLayer({
      portalItem: {  // autocasts as new PortalItem()
        id: featureLayerId,
        portal: env.getPortal4datasource(),
      }  // the first layer in the service is returned
    });
    scene.add(layer);
    // mySelf.initSceneView();
    // Once the layer loads, set the view's extent to the layer's fullextent
    if (layer) {
      layer.when(function () {
        ags.view.extent = layer.fullExtent;
      });
    }
    // ags.view = new Sceneview({
    //   container: 'viewDiv',
    //   map: scene,
    //   ui: {
    //     components: [],
    //   },
    // });
    // ags.view.when(() => {
    //   mySelf.initSceneView();
    //   // Once the layer loads, set the view's extent to the layer's fullextent
    //   if(layer){
    //     layer.when(function () {
    //       ags.view.extent = layer.fullExtent;
    //     });
    //   }
    // });
  }
  async addSceneLayerToWebScene (sceneLayerId) {
    //清空viewDiv
    // document.getElementById('viewDiv').innerHTML = "";
    const scene = ags.view.map;
    const [SceneLayer] = await jsapi.load(['esri/layers/SceneLayer']);
    const layer = new SceneLayer({
      portalItem: {  // autocasts as new PortalItem()
        id: sceneLayerId,
        portal: env.getPortal4datasource(),
      }  // the first layer in the service is returned
    });
    scene.add(layer);
    if(layer){
      layer.when(function () {
        ags.view.extent = layer.fullExtent;
      });
    }
  }
  async addlayerUrlToWebScene (layerUrlArray) {
    const scene = ags.view.map;
    const [FeatureLayer,SceneLayer] = await jsapi.load(['esri/layers/FeatureLayer','esri/layers/SceneLayer']);
    let layerUrlObj;
    for (let i = 0; i < layerUrlArray.length; i++) {
      layerUrlObj = layerUrlArray[i];
      if (layerUrlObj.type === 'feature') {
        layer = new FeatureLayer({
          // URL to the service
          url: layerUrlObj.url
        });
      } else if (layerUrlObj.type === 'scene') {
        layer = new SceneLayer({
          // URL to the service
          url: layerUrlObj.url
        });
      }
      scene.add(layer);
    }
    if(layer){
      layer.when(function () {
        ags.view.extent = layer.fullExtent;
      });
    }
  }
  initSceneView(){
    this.createLayerList();
    this.createBasemapGallery();
    this.createQualityWidget();
    this.create3DToolButtons(); //先隐藏掉鹰眼功能 20180908
    // 获取所有的幻灯片
    const flySlides = ags.view.map.presentation.slides;
    const slides = flySlides.items;
    this.props.dispatch({
      type: 'agsmap/slidesState',
      payload: slides,
    });
  }
  async createLayerList() {
    expandDiv.dom = document.createElement('div');
    expandDiv.dom.class = 'layerList';
    const [LayerList,Expand] = await jsapi.load(['esri/layerList','esri/widgets/Expand']);
    var layerList = new LayerList({
      view: ags.view,
      container: expandDiv.dom,
      // executes for each ListItem in the LayerList
      listItemCreatedFunction: mySelf.defineActions
    });
  
    var bgExpand = new Expand({
      view: ags.view,
      content: layerList,
      expandTooltip: '图层列表',
    });
  
    ags.view.ui.add(bgExpand, 'top-right');
    layerList.on("trigger-action", function(event) {
      var operationalLayer = event.item.layer;
      // Capture the action id.
      var id = event.action.id;

      if (id === "full-extent") {
        // if the full-extent action is triggered then navigate
        // to the full extent of the visible layer
        ags.view.goTo(operationalLayer.fullExtent);
      }  else if (id === "removeLayer") {
        ags.view.map.remove(operationalLayer);
      } 
    });
  }
  defineActions(event) {
    // The event object contains an item property.
    // is is a ListItem referencing the associated layer
    // and other properties. You can control the visibility of the
    // item, its title, and actions using this object.

    var item = event.item;

    if (item.title !== "abcdefg") {
      // An array of objects defining actions to place in the LayerList.
      // By making this array two-dimensional, you can separate similar
      // actions into separate groups with a breaking line.

      item.actionsSections = [
        [
          {
            title: "缩放到图层",
            className: "esri-icon-zoom-out-fixed",
            id: "full-extent"
          },
          {
            title: "移除该图层",
            className: "esri-icon-trash",
            id: "removeLayer"
          },
        ]
      ];
    }
  }
  
  async createBasemapGallery() {
    expandDiv.dom = document.createElement('div');
    expandDiv.dom.class = 'basemapGallery';
    const [BasemapGallery,Expand] = await jsapi.load(['esri/widgets/BasemapGallery','esri/widgets/Expand']);
    var basemapGallery = new BasemapGallery({
      view: ags.view,
      container: expandDiv.dom,
    });
  
    var bgExpand = new Expand({
      view: ags.view,
      content: basemapGallery,
      expandTooltip: '底图切换',
    });
  
    ags.view.ui.add(bgExpand, 'top-right');
  }
  async create3DToolButtons() {
    // lih 2018-07-20 生成鹰眼dom
    overmapDiv.dom = document.createElement('div');
    ReactDOM.render(<Overviewmap view={ags.view} />, overmapDiv.dom);
    overmapDiv.dom.style.display = 'block';
    const [Expand] = await jsapi.load(['esri/widgets/Expand']);
    var omExpand = new Expand({
      view: ags.view,
      content: overmapDiv.dom,
      expandIconClass: "esri-icon-minimize",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
      expandTooltip: '鹰眼图',
    });

    ags.view.ui.add(omExpand, 'bottom-right');
  }
  
  async createQualityWidget() {
    expandDiv.dom = document.createElement('div');
    expandDiv.dom.class = 'Quality';
    expandDiv.dom.innerHTML =
      "<div class='qualityContent'><span><input type='radio' name='mapQuality' value='low' class='qualityRadio'/>性能</span><span><input type='radio' checked name='mapQuality' value='medium' class='qualityRadio'/>平衡</span><span><input type='radio' name='mapQuality' value='high' class='qualityRadio'/>质量</div></span>";
    const [Expand] = await jsapi.load(['esri/widgets/Expand']);
    var bgExpand = new Expand({
      view: ags.view,
      content: expandDiv.dom,
      expandIconClass: 'esri-icon-applications',
      expandTooltip: '优化 3D 图形',
    });
  
    ags.view.ui.add(bgExpand, 'top-right');
  
    this.registerRadioEvents();
  }
  
  registerRadioEvents() {
    if ($('.qualityRadio').length > 0) {
      $('.qualityRadio').on('click', function(evt, a) {
        let mapQuality = $("input[name='mapQuality']:checked").val();
        ags.view.qualityProfile = mapQuality;
      });
    } else {
      window.setTimeout(mySelf.registerRadioEvents.bind(this), 50);
    }
  }

  handleCancel() {
    this.props.dispatch({
      type: 'agsmap/changeDataSourcePanelChangeState',
      payload: false,
    });
  }

  handleClick4menu(evt) {
    console.log('evt' + evt);
    const key = evt.key;
    if (key === 'webscene') {
      // alert('选择图层item添加到场景');
      document.getElementById('div4webscene').style.display = "block";
      document.getElementById('div4featureLayerItem').style.display = "none";
      document.getElementById('div4sceneLayerItem').style.display = "none";
      document.getElementById('div4layerUrl').style.display = "none";
      this.dataSourceType = 'webscene';
    } else if (key === 'featureLayerItem') {
      // alert('选择图层item添加到场景');
      document.getElementById('div4webscene').style.display = "none";
      document.getElementById('div4featureLayerItem').style.display = "block";
      document.getElementById('div4sceneLayerItem').style.display = "none";
      document.getElementById('div4layerUrl').style.display = "none";
      this.dataSourceType = 'featureLayerItem';
    } else if (key === 'sceneLayerItem') {
      // alert('选择图层item添加到场景');
      document.getElementById('div4webscene').style.display = "none";
      document.getElementById('div4featureLayerItem').style.display = "none";
      document.getElementById('div4sceneLayerItem').style.display = "block";
      document.getElementById('div4layerUrl').style.display = "none";
      this.dataSourceType = 'sceneLayerItem';
    } else if (key === 'layerUrl') {
      // alert('通过图层url添加到场景');
      document.getElementById('div4webscene').style.display = "none";
      document.getElementById('div4featureLayerItem').style.display = "none";
      document.getElementById('div4sceneLayerItem').style.display = "none";
      document.getElementById('div4layerUrl').style.display = "block";
      this.dataSourceType = 'layerUrl';
    }
  }
  onWebSceneImgClick(e) {
    if (this.websceneImgClickedPre.style) {
      this.websceneImgClickedPre.style.border = '10px solid #e8e8e8';
    }
    this.websceneImgClickedPre = e.currentTarget;
    e.currentTarget.style.border = '3px solid #006DB5';
    // const clickParam = e.currentTarget.children[0].children[0].title;
    this.websceneIdClicked = e.currentTarget.children[0].children[0].alt;
  }
  onFeatureLayerItemImgClick(e) {
    if (this.featureLayerImgClickedPre.style) {
      this.featureLayerImgClickedPre.style.border = '10px solid #e8e8e8';
    }
    this.featureLayerImgClickedPre = e.currentTarget;
    e.currentTarget.style.border = '3px solid #006DB5';
    // const clickParam = e.currentTarget.children[0].children[0].title;
    this.featureLayerItemIdClicked = e.currentTarget.children[0].children[0].alt;
  }
  onSceneLayerItemImgClick(e) {
    if (this.sceneLayerImgClickedPre.style) {
      this.sceneLayerImgClickedPre.style.border = '10px solid #e8e8e8';
    }
    this.sceneLayerImgClickedPre = e.currentTarget;
    e.currentTarget.style.border = '3px solid #006DB5';
    // const clickParam = e.currentTarget.children[0].children[0].title;
    this.sceneLayerItemIdClicked = e.currentTarget.children[0].children[0].alt;
  }

  render() {
    return (
        <Modal
          style={{overflowY: 'hidden'}}
          width={1600}
          height={800}
          title="修改数据源"
          visible={this.props.agsmap.changeDataSourcePanelState}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <div style={{ marginBottom: '30px',marginTop:'-20px' }}>
            <Menu onClick={this.handleClick4menu} selectedKeys={[this.state.current]} mode="horizontal">
              <Menu.Item key="webscene" style={{ fontSize:27}}>
                <Icon type="webscene" />
                选择WebScene切换场景
              </Menu.Item>
              <Menu.Item key="featureLayerItem" style={{ fontSize:27}}>
                <Icon type="featureLayerItem" />
                选择要素图层添加到场景
              </Menu.Item>
              <Menu.Item key="sceneLayerItem" style={{ fontSize:27}}>
                <Icon type="sceneLayerItem" />
                选择场景图层添加到场景
              </Menu.Item>
              <Menu.Item key="layerUrl" style={{ fontSize:27}}>
                <Icon type="layerUrl" />
                通过图层url添加到场景
              </Menu.Item>
            </Menu>
          </div>
          <div id="div4webscene" style={{ display: 'block', height: '500px', overflowY: 'auto' }}>
            <div><p style={{ fontSize: 20, color: '#1890ff' }}>总共搜索出{this.state.websceneArray.length}个WebScene资源：</p></div>
            {
              this.state.websceneArray && this.state.websceneArray.map((item, index) => {
                return (
                  <Card
                    hoverable
                    style={{ width: 240, height: 240, float: 'left', border: '10px solid #e8e8e8' }}
                    cover={<img alt={item.id} title={item.title} style={{ height: 113 }} src={item.thumbnailUrl} />}
                    onClick={this.onWebSceneImgClick}
                    key={index}
                  >
                    <Meta title={item.title} description={"类型：" + item.type + ",修改于：" + item.modified2} />
                  </Card>
                )
              })
            }
          </div>
          <div id="div4featureLayerItem" style={{ display: 'none', height: '500px', overflowY: 'auto' }}>
            <div><p style={{ fontSize: 20, color: '#1890ff' }}>总共搜索出{this.state.featureLayerItemArray.length}个要素图层item资源：</p></div>
            {
              this.state.featureLayerItemArray && this.state.featureLayerItemArray.map((item, index) => {
                return (
                  <Card
                    hoverable
                    style={{ width: 240, height: 240, float: 'left', border: '10px solid #e8e8e8' }}
                    cover={<img alt={item.id} title={item.title} style={{ height: 113 }} src={item.thumbnailUrl} />}
                    onClick={this.onFeatureLayerItemImgClick}
                    key={index}
                  >
                    <Meta title={item.title} description={"类型：" + item.type + ",修改于：" + item.modified2} />
                  </Card>
                )
              })
            }
          </div>
          <div id="div4sceneLayerItem" style={{ display: 'none', height: '500px', overflowY: 'auto' }}>
            <div><p style={{ fontSize: 20, color: '#1890ff' }}>总共搜索出{this.state.sceneLayerItemArray.length}个场景图层item资源：</p></div>
            {
              this.state.sceneLayerItemArray && this.state.sceneLayerItemArray.map((item, index) => {
                return (
                  <Card
                    hoverable
                    style={{ width: 240, height: 240, float: 'left', border: '10px solid #e8e8e8' }}
                    cover={<img alt={item.id} title={item.title} style={{ height: 113 }} src={item.thumbnailUrl} />}
                    onClick={this.onSceneLayerItemImgClick}
                    key={index}
                  >
                    <Meta title={item.title} description={"类型：" + item.type + ",修改于：" + item.modified2} />
                  </Card>
                )
              })
            }
          </div>
          <div id="div4layerUrl" style={{ display: 'none', height: '500px', overflowY: 'auto' }}>
            <p style={{ fontSize:20,color: '#1890ff'}}>输入图层的URL地址(支持批量输入,中间用分号隔开即可,添加完成后缩放到最后一个图层的位置)：</p>
            <div style={{ margin: '24px 0' }} />
            <TextArea id="textArea4layerUrl"
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
  }
}

export default connect(({ agsmap }) => {
  return {
    agsmap,
  };
})(ChangeDataSource);
