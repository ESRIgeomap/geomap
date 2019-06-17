define('modules/PlotDrawTool',[
    'modules/GeneralArrow',
    'modules/SwallowTailArrow',
    "modules/DoubleArrow",
    "modules/PlotSymbol",
    "modules/ToolTip",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/Graphic",
    "dojo/on",
    "dojo/topic",
    "dojo/_base/lang",
    "dojo/_base/declare"
], function(GeneralArrow,SwallowTailArrow,DoubleArrow,PlotSymbol,ToolTip,GraphicsLayer,Polyline,Polygon,Graphic,on,topic,lang,declare) {
    var PlotDrawTool = declare([ToolTip],{
        declaredClass: "PlotDrawTool",
        mapView : null,
        controlPoints : [],
        plotType:"",
        //绘制点计算器
        drawControl : null,
        //单击方法
        mouseClickFn : null,
        //绘制图层
        drawLayer : null,
        constructor: function (options) {
            declare.safeMixin(this, options);
            this.plotSymbol = new PlotSymbol();
            // topic.subscribe(window.Plat.Events.PLOTDRAWTOOL_DEACTIVATE,lang.hitch(this,this.deactivate));
            this.initLayer();
        },
        initLayer : function(){
            if(!this.mapView.map.findLayerById("drawLayer")){                
                this.drawLayer = new GraphicsLayer({
                        id: "drawLayer",
                        title: "",
                        elevationInfo: {
                        mode: "relative-to-ground",
                        offset: 10,
                        unit: "meters"
                        },
                });
                this.mapView.map.add(this.drawLayer);
            }else{
                this.drawLayer = this.mapView.map.findLayerById("drawLayer");
            }
        },
        goprepoint : function(event){
            if(event.ctrlKey == true && event.keyCode == 90){
                this.controlPoints.pop();                
            }            
        },
        active : function(type){   
            this.mapView.container.style.cursor = "crosshair";  
            this.goprepointhandle = on(document,'keydown',lang.hitch(this,this.goprepoint));
            //取消绘制工具的激活状态
            // topic.publish(window.Plat.Events.DRAWTOOL_DEACTIVATE);
            // this.activeTip();
            this.setTipContent("单击以开始绘制");
            // this.mapView.gestureManager.inputManager.gestures["double-click"].options.enable = false;
            //如果没有注册鼠标单击事件，则注册
            if(!this.mouseClickFn)
                // this.mouseClickFn = on(this.mapView,"click",lang.hitch(this,this.addControlPnt));   
                this.mouseClickFn = this.mapView.on("click",lang.hitch(this,this.addControlPnt));            
            //开始绘制时清空控制点数组
            this.controlPoints = [];
            this.plotType = type;
            switch(this.plotType){
                //实例化普通箭头绘制类
                case "general_arrow":
                {
                    this.drawControl = new GeneralArrow();
                    break;
                }
                //实例化燕尾箭头绘制类
                case "swallowtail_arrow":
                {
                    this.drawControl = new SwallowTailArrow([]);
                    break;
                }
                //实例化双箭头类
                case "double_arrow":
                {
                    this.drawControl = new DoubleArrow();
                    break;
                }                
            }
        },
        /**
         *鼠标单击事件处理方法,添加控制点
         */
        addControlPnt : function(evt){
            //当前添加点
            var clickPoint = evt.mapPoint;
            //绘制双箭头时，点击第四个点，直接结束绘制
            if(this.plotType == "double_arrow"){
                if(this.controlPoints.length<3)
                    this.setTipContent("单击继续绘制");
                else if(this.controlPoints.length==3)
                    this.setTipContent("单击结束绘制");
                else if(this.controlPoints.length==4){
                    this.endDraw(evt);
                    return;
                }
            }
            else
                this.setTipContent("单击继续绘制，双击完成");
            if(this.controlPoints.length>1)
                this.controlPoints.splice(this.controlPoints.length-1,1);
            //将当前绘制点添加到控制点数组中
            this.controlPoints.push(clickPoint);
            this.isMovedAfterClick = false;
            //如果没有注册鼠标移动事件，则注册
            if(!this.mouseMoveFn)
                // this.mouseMoveFn = on(this.mapView.container,"mousemove",lang.hitch(this,this.draw));
                this.mouseMoveFn = this.mapView.on("pointer-move",lang.hitch(this,this.draw));
            //如果没有注册鼠标双击事件
            if(!this.mouseDoubleClickFn)
                this.mouseDoubleClickFn =this.mapView.on('double-click',lang.hitch(this,this.endDraw));

        },
        /**
         *鼠标移动事件处理方法
         *以鼠标当前焦点为结束点绘制图形，并清除上一个结束点图形
         */
        draw : function(evt){
            // evt.stopPropagation();
            //鼠标当前焦点作为标绘结束点
            this.endPoint =this.toMapPoint(evt);
            //去除上一个移动点
            if(this.isMovedAfterClick){
                this.controlPoints.splice(this.controlPoints.length - 1,1);
            }
            //将当前鼠标焦点添加到控制点数组中
            this.controlPoints.push(this.endPoint);

            //清除之前的绘制图形
            this.drawLayer.removeAll();
            //绘制
            var rings = this.drawControl.draw(this.controlPoints);
            this.addToEsriMap(rings);
            this.isMovedAfterClick = true;
        },
        /**
         *鼠标双击事件处理方法
         *结束绘制
         */
        endDraw : function(evt){
            evt.stopPropagation();
            this.mapView.container.style.cursor = "default"; 
            // alert('冒泡');
            
            this.goprepointhandle.remove();
            this.drawLayer.removeAll();
            this.deactivateTip();
            //取消鼠标单击事件绑定
            this.mouseClickFn.remove();
            //取消鼠标移动事件绑定
            this.mouseMoveFn.remove();
            //取消鼠标双击事件绑定
            this.mouseDoubleClickFn.remove();
            this.mouseClickFn = null;
            this.mouseMoveFn = null;
            this.mouseDoubleClickFn = null;
            // this.mapView.gestureManager.inputManager.gestures["double-click"].options.enable = true;
            
            var endPnt = evt.screenPoint || evt;
            topic.publish("plot-drawEnd",{
                type:this.plotType,
                graphic:this.finallyGraphic,
                endPnt:endPnt
            });       
        },
        reSet : function(){
            this.mapView.container.style.cursor = "default"; 
            this.goprepointhandle&&this.goprepointhandle.remove();
            this.drawLayer&&this.drawLayer.removeAll();
            this.deactivateTip();
            //取消鼠标单击事件绑定
            this.mouseClickFn&&this.mouseClickFn.remove();
            //取消鼠标移动事件绑定
            this.mouseMoveFn&&this.mouseMoveFn.remove();
            //取消鼠标双击事件绑定
            this.mouseDoubleClickFn&&this.mouseDoubleClickFn.remove();
            this.mouseClickFn = null;
            this.mouseMoveFn = null;
            this.mouseDoubleClickFn = null;
        },
        /**
         *添加到地图上
         */
        addToEsriMap : function(rings){
            if(!rings)
                return;
            var spatialReference = this.mapView.spatialReference;
            var graphic = null;
            //绘制双箭头的第二个点时
            if(this.plotType == "double_arrow" && this.controlPoints.length == 2){
                //绘制双箭头尾部
                var polyline = new Polyline({
                    paths:rings,
                    spatialReference : spatialReference
                });
                var double_arrow_line = this.symbol||this.plotSymbol.symbol[this.plotType];
                graphic = new Graphic(polyline,double_arrow_line);
            }
            else{
                //军标上所有点绘制完毕，构建点串集合rings
                var polygon = new Polygon({
                    spatialReference : spatialReference
                });
                polygon.addRing(rings);
                var symbol = this.symbol||this.plotSymbol.symbol[this.plotType];
                graphic = new Graphic({
                    geometry:polygon,
                    symbol:symbol
                });
            }
            if(graphic){
                this.finallyGraphic = graphic;
                //将graphic发出去
            }
            this.drawLayer.add(graphic);
        },
        toMapPoint: function (evt) {
            return this.mapView.toMap({x: evt.x, y: evt.y});
        },
        onDrawEnd : function(func){
            this.drawEndHandler = this.drawEndHandler || topic.subscribe("plot-drawEnd",func);
        },
        deactivate : function(){
            if(this.mouseClickFn){
                //取消鼠标单击事件绑定
                this.mouseClickFn.remove();
                this.mouseClickFn = null;
            }
            if(this.mouseMoveFn){
                //取消鼠标移动事件绑定
                this.mouseMoveFn.remove();
                this.mouseMoveFn = null;
            }
            if(this.mouseDoubleClickFn){
                //取消鼠标双击事件绑定
                this.mouseDoubleClickFn.remove();
                this.mouseDoubleClickFn = null;
            }
            this.deactivateTip();
        },
        clear : function(){
            this.drawLayer.removeAll();
        }
    });
    return PlotDrawTool;
});