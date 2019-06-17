/**
 * 双箭头类 
 * 
 * @class DouleTailArrow
 * @author rongc
 * @date 2016-06-19
 */
define('modules/DoubleArrow',[
	"modules/PlotHelper"
], function(PlotHelper) {
	var Widget = function(options) {
		this.options = $.extend({
		},options);
		$.extend(this,{
			//双箭头的第四个点
			pnt4:null,
			//尾部中点
			midTailPoint:null,
			//头部高度因子
			headHeightFactor:0.2,
			//头部宽度因子
			headWidthFactor:0.4,
			//肩部高度因子
			neckHeightFactor:0.75,
			//肩部宽度因子
			neckWidthFactor:0.15,
			//控制点组
			points:null,
			//标绘工具类
			plotHelper : null
		});
		this._init();
	};
	Widget.prototype = {
		_init : function(){
			this.plotHelper = new PlotHelper();
		},
		/**
		 * 根据控制点数组进行绘制
		 * @param {[<Forestar.Geometry.Point>]} points 控制点数组
		 */
		draw : function(points){
			//绘制的第一个点
			var pnt1;
			//绘制的第二个点
			var pnt2;
			//绘制的第三个点
			var pnt3;
			//左侧箭头控制点数组
			var leftArrowPnts;
			//右侧箭头控制点数组
			var rightArrowPnts;
			var m;
			var t;
			//左侧箭头左边箭身控制点数组
			var llBodyPnts;
			//左侧箭头头部控制点
			var lArrowPnts;
			//左侧箭头右边箭身控制点数组
			var lrBodyPnts;
			//右侧箭头左边箭身控制点数组
			var rlBodyPnts;
			//右侧箭头头部控制点数组
			var rArrowPnts;
			//右侧箭头右边箭身控制点数组
			var rrBodyPnts;
			//箭身控制点数组
			var bodyPnts;
			//全部控制点组成的rings
			var allPoints;
			this.points = points;
			//控制点长度
			var n = this.points.length;
			//只有最少两个点才能绘制
			if(!points|| points.length < 2)
				return null;
			allPoints = [];
			var rings = [];
			if(n==2)
			{
				rings.push([points[0].x,points[0].y]);
				rings.push([points[1].x,points[1].y]);
			}
			//如果长度大于等于3并且最后两点不重合
			else if ((n >= 3) && !(this.points[(n - 1)] == this.points[(n - 2)])){
				pnt1 = points[0];
				pnt2 = points[1];
				pnt3 = points[2];
				//如果只有三个控制点，计算第四个控制点
				if (n == 3){
					this.pnt4 = this.calculateFouthPoint(pnt1, pnt2, pnt3);
				} else {
					this.pnt4 = points[3];
				};
				//if (this.plotState == DRAWING){
				this.midTailPoint = this.plotHelper.getMidPoint(pnt1, pnt2);
				//};
				leftArrowPnts = this.calculateControlPoints(pnt1, this.midTailPoint, this.pnt4, this.plotHelper.LEFT_SIDE);
				rightArrowPnts = this.calculateControlPoints(this.midTailPoint, pnt2, pnt3, this.plotHelper.RIGHT_SIDE);
				m = leftArrowPnts.length;
				t = ((m - 5) / 2);
				llBodyPnts = leftArrowPnts.slice(0, t);
				lArrowPnts = leftArrowPnts.slice(t, (t + 5));
				lrBodyPnts = leftArrowPnts.slice((t + 5), m);
				rlBodyPnts = rightArrowPnts.slice(0, t);
				rArrowPnts = rightArrowPnts.slice(t, (t + 5));
				rrBodyPnts = rightArrowPnts.slice((t + 5), m);
				llBodyPnts = this.plotHelper.getBezierPoints(llBodyPnts);
				bodyPnts = this.plotHelper.getBezierPoints(lrBodyPnts.concat(rlBodyPnts));
				rrBodyPnts = this.plotHelper.getBezierPoints(rrBodyPnts);
				allPoints = llBodyPnts.concat(lArrowPnts, bodyPnts, rArrowPnts, rrBodyPnts);
				for(var i=0;i<allPoints.length;i++)
				{
					var value = [allPoints[i].x,allPoints[i].y];
					rings.push(value);
				}
				//将环闭合
				rings.push([points[0].x,points[0].y]);
			};
			return rings;
		},
		/**
		 * 根据三个控制点和方向计算全部控制点
		 * @param {<Forestar.Geometry.Point>} pnt1 控制点1
		 * @param {<Forestar.Geometry.Point>} pnt2 控制点2
		 * @param {<Forestar.Geometry.Point>} pnt3 控制点3
		 * @param {<String>} side 方向
		 */
		calculateControlPoints:function(pnt1,pnt2,pnt3,side){
			//计算pnt1和pnt2的中心点
			var midPnt = this.plotHelper.getMidPoint(pnt1, pnt2);
			//计算中心点到pnt3的距离
			var len = this.plotHelper.distance(midPnt, pnt3);
			//计算第三点
			var midPnt1 = this.plotHelper.getThirdPoint(pnt3, midPnt, 0, (len * 0.3), this.plotHelper.LEFT_SIDE);
			var midPnt2 = this.plotHelper.getThirdPoint(pnt3, midPnt, 0, (len * 0.5), this.plotHelper.LEFT_SIDE);
			var midPnt3 = this.plotHelper.getThirdPoint(pnt3, midPnt, 0, (len * 0.7), this.plotHelper.LEFT_SIDE);
			midPnt1 = this.plotHelper.getThirdPoint(midPnt, midPnt1, (Math.PI * 1.5), (len / 4), side);
			midPnt2 = this.plotHelper.getThirdPoint(midPnt, midPnt2, (Math.PI * 1.5), (len / 4), side);
			midPnt3 = this.plotHelper.getThirdPoint(midPnt, midPnt3, (Math.PI * 1.5), (len / 4), side);
			//
			var points = [midPnt, midPnt1, midPnt2, midPnt3, pnt3];
			//箭头上全部控制点
			var arrowPnts = this.plotHelper.getArrowHeadPoints(points, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor);
			//箭头肩部左侧点
			var neckLeftPoint = arrowPnts[0];
			//箭头肩部右侧点
			var neckRightPoint = arrowPnts[4];
			//尾部宽度因子
			var tailWidthFactor = ((this.plotHelper.distance(pnt1, pnt2) / this.plotHelper.getBaseLength(points)) / 2);
			//左侧因子
			var leftFactor = ((side == this.plotHelper.LEFT_SIDE)) ? 1 : 0.01;
			//右侧因子
			var rightFactor = ((side == this.plotHelper.LEFT_SIDE)) ? 0.01 : 1;
			//箭身
			var bodyPnts = this.plotHelper.getArrowBodyPoints(points, neckLeftPoint, neckRightPoint, tailWidthFactor, leftFactor, rightFactor);
			var n = bodyPnts.length;
			var lPoints = bodyPnts.slice(0, (n / 2));
			var rPoints = bodyPnts.slice((n / 2), n);
			lPoints.push(neckLeftPoint);
			rPoints.push(neckRightPoint);
			lPoints = lPoints.reverse();
			lPoints.push(pnt1);
			rPoints = rPoints.reverse();
			rPoints.push(pnt2);
			return lPoints.reverse().concat(arrowPnts, rPoints);
		},
		calculateFouthPoint:function(linePnt1,linePnt2,point){
			var symPnt;
			var distance1;
			var distance2;
			var mid;
			var midPnt = this.plotHelper.getMidPoint(linePnt1, linePnt2);
			var len = this.plotHelper.distance(midPnt, point);
			var angle = this.plotHelper.getAngleOfThreePoints(linePnt1, midPnt, point);
			if (angle < (Math.PI / 2)){
				distance1 = len * Math.sin(angle);
				distance2 = len * Math.cos(angle);
				mid = this.plotHelper.getThirdPoint(linePnt1, midPnt, (Math.PI * 1.5), distance1, this.plotHelper.LEFT_SIDE);
				symPnt = this.plotHelper.getThirdPoint(midPnt, mid, (Math.PI * 1.5), distance2, this.plotHelper.RIGHT_SIDE);
			}
			else if(angle >= (Math.PI / 2) && angle < Math.PI)
			{
				distance1 = len * Math.sin(Math.PI - angle);
				distance2 = len * Math.cos(Math.PI - angle);
				mid = this.plotHelper.getThirdPoint(linePnt1, midPnt, (Math.PI * 1.5), distance1, this.plotHelper.LEFT_SIDE);
				symPnt = this.plotHelper.getThirdPoint(midPnt, mid, (Math.PI * 1.5), distance2, this.plotHelper.LEFT_SIDE);
			}
			else if(angle >= Math.PI && angle < (Math.PI * 1.5)){
				distance1 = len * Math.sin(angle - Math.PI);
				distance2 = len * Math.cos(angle - Math.PI);
				mid = this.plotHelper.getThirdPoint(linePnt1, midPnt, (Math.PI * 1.5), distance1, this.plotHelper.RIGHT_SIDE);
				symPnt = this.plotHelper.getThirdPoint(midPnt, mid, (Math.PI * 1.5), distance2, this.plotHelper.RIGHT_SIDE);
			}
			else{
				distance1 = len * Math.sin((Math.PI * 2) - angle);
				distance2 = len * Math.cos((Math.PI * 2) - angle);
				mid = this.plotHelper.getThirdPoint(linePnt1, midPnt, (Math.PI * 1.5), distance1, this.plotHelper.RIGHT_SIDE);
				symPnt = this.plotHelper.getThirdPoint(midPnt, mid, (Math.PI * 1.5), distance2, this.plotHelper.LEFT_SIDE);
			};
			return symPnt;
		}
	}
	return Widget;
});
