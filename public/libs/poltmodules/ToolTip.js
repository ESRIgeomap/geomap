define('modules/ToolTip',[
    "dojo/_base/declare",
    "dojo/_base/lang",
    'dojo/dom-construct',
    "dojo/on"
], function(declare,lang,domConstruct,on) {
    var ToolTip = declare([], {
        declaredClass: "ToolTip",
        constructor: function (options) {
            declare.safeMixin(this, options);
            this.creatTipDiv();
        },
        //����TipDiv Tip����Ĭ��Ϊ������ʼ����
        creatTipDiv:function(){
            this.tipDiv = domConstruct.create("div",{class:"toolTip", style:"position: fixed;display:none" });
            this.mapView.root.appendChild(this.tipDiv);
        },
        //����Tip��ʾ����
        //tip:string Tip��ʾ����
        setTipContent:function(tip){
            this.tipDiv.innerHTML=tip;
        },
        activeTip : function(yOffset){
            this.onMouseMove(yOffset);
        },
        deactivateTip : function(){
            if(this.tipMouseMoveFn){
                this.tipMouseMoveFn.pause();
                this.tipDiv.style.display = "none";
            }
        },
        //����ƶ�ʱTip������
        //e:Object ���ص�����
        onMouseMove:function(yOffset){
            if(this.tipMouseMoveFn)
                this.tipMouseMoveFn.resume();
            else{
                this.tipMouseMoveFn = on.pausable(this.mapView.container,"mousemove",lang.hitch(this,function(e){
                    var x = e.clientX + 5;
                    var y = e.clientY + 20;
                    this.tipDiv.style.left=x+"px";
                    var yOff = 0;
                    if (!!yOffset) {
                        yOff = yOffset;
                    }
                    this.tipDiv.style.top=(y+yOff)+"px";
                    this.tipDiv.style.display="block";
                }));
            }
        }
    });
    return ToolTip;
});