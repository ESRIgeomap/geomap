/**
 * 动态标绘公用辅助工具类
 * 
 * @class PlotHelper
 */
define('modules/PlotHelper',[], function() {
    var Widget = function(options) {
        this.options = $.extend({
        },options);
        this._init();
    };
    Widget.prototype = {
        LEFT_SIDE: "left",
        RIGHT_SIDE: "right",
        USE_BEZIER_FIT: "useBezierFit",
        USE_BSPLINE_FIT:"useBSplieFit",
        _init : function(){
        },
        /**
         * 根据起始点、结束点、偏移角度、距离、方向（左侧或右侧）计算第三点
         *
         * @param {<Forestar.Geometry.Point>} startPnt - 起点
         * @param {<Forestar.Geometry.Point>} endPnt - 终点
         * @param {<Number>} angle 偏移角度
         * @param {<Number>} length 长度
         * @param {<String>} side 方向(LEFT_SIDE,RIGHT_SIDE)
         * @return {<Forestar.Geometry.Point>} 计算点
         */
        getThirdPoint : function(startPnt,endPnt,angle,length,side){
            //阿尔法，(希腊语的第一个字母，在数学中一般用来表示角度)
            var alpha;
            //
            var azimuth = this.getAzimuthAngle(startPnt, endPnt);
            if (side == this.LEFT_SIDE){
                alpha = (azimuth + angle);
            } else {
                alpha = (azimuth - angle);
            };
            var dx = length * Math.cos(alpha);
            var dy = length * Math.sin(alpha);
            var x = endPnt.x + dx;
            var y = endPnt.y + dy;
            var point = {
                x:x,
                y:y
            };
            return point;
        },
        /**
         * 根据起始点、结束点计算方位角(此方法算出角度不是坐标方位角，还没弄明白为什么这么计算)
         *
         * @param {<Forestar.Geometry.Point>} startPnt - 起点
         * @param {<Forestar.Geometry.Point>} endPnt - 终点
         * @return {<Number>} 方位角
         */
        getAzimuthAngle : function(startPnt,endPnt){
            //定义方位角
            var azimuth;
            //两点连线与水平线夹角（锐角）
            var angle = Math.asin((Math.abs((endPnt.y - startPnt.y)) / this.distance(startPnt, endPnt)));
            //根据终点在起点的四个象限计算方位角
            //第一象限
            if ((endPnt.y >= startPnt.y) && (endPnt.x >= startPnt.x))
                azimuth = angle + Math.PI;
            //第二象限
            else if((endPnt.y >= startPnt.y) && (endPnt.x < startPnt.x))
                azimuth = 2 * Math.PI - angle;
            //第三象限
            else if((endPnt.y < startPnt.y) && (endPnt.x < startPnt.x))
                azimuth = angle;
            //第四象限
            else if((endPnt.y < startPnt.y) && (endPnt.x >= startPnt.x))
                azimuth = Math.PI - angle;
            return azimuth;
        },
        /**
         * 获取箭头头部点组
         * @param {[<Forestar.Geometry.Point>]}控制点数组组
         * @param {<Number>} headHeightFactor 头部高度因子
         * @param {<Number>} headWidthFactor 头部宽度因子
         * @param {<Number>} neckHeightFactor 肩部高度因子
         * @param {<Number>} neckWidthFactor 肩部宽度因子
         * @return {[<Forestar.Geometry.Point>]} 箭头头部点数组
         */
        getArrowHeadPoints:function(points, headHeightFactor, headWidthFactor, neckHeightFactor, neckWidthFactor)
        {
            //控制点总距离
            var allLen = this.getBaseLength(points);
            //头部高度
            var headHeight = allLen * headHeightFactor;
            //头部宽度
            var headWidth = headHeight * headWidthFactor;
            //肩部宽度
            var neckWidth = headHeight * neckWidthFactor;
            //控制点数组长度
            var n = points.length;
            //头部顶点
            var headPnt = points[(n - 1)];
            var len = this.distance(headPnt, points[(n - 2)]);
            //头部高度
            headHeight = (headHeight > len) ? len : headHeight;
            //肩部高度
            var neckHeight = headHeight * neckHeightFactor;
            //计算箭头上各点
            var headEndPnt = this.getThirdPoint(points[(n - 2)], headPnt, 0, headHeight, this.LEFT_SIDE);
            var neckEndPnt = this.getThirdPoint(points[(n - 2)], headPnt, 0, neckHeight, this.LEFT_SIDE);
            var headLeftPnt = this.getThirdPoint(headPnt, headEndPnt, (Math.PI * 1.5), headWidth, this.RIGHT_SIDE);
            var neckLeftPnt = this.getThirdPoint(headPnt, neckEndPnt, (Math.PI * 1.5), neckWidth, this.RIGHT_SIDE);
            var headRightPnt = this.getThirdPoint(headPnt, headEndPnt, (Math.PI * 1.5), headWidth, this.LEFT_SIDE);
            var neckRightPnt = this.getThirdPoint(headPnt, neckEndPnt, (Math.PI * 1.5), neckWidth, this.LEFT_SIDE);
            var headPoints = [];
            headPoints.push(neckLeftPnt, headLeftPnt, headPnt, headRightPnt, neckRightPnt);
            return headPoints;
        },
        /**
         * 获取箭身点组
         * @param {[<Forestar.Geometry.Point>]}控制点数组组
         * @param {<Forestar.Geometry.Point>} neckLeftPoint 肩部左侧点
         * @param {<Forestar.Geometry.Point>} neckRightPoint 肩部右侧点
         * @param {<Number>} tailWidthFactor 尾部宽度因子
         * @param {<Number>} leftFactor 尾部宽度因子
         * @param {<Number>} rightFactor 肩部宽度因子
         * @return {[<Forestar.Geometry.Point>]} 箭身点数组
         */
        getArrowBodyPoints:function(points, neckLeftPoint, neckRightPoint, tailWidthFactor, leftFactor, rightFactor)
        {
            var angle;
            var w;
            var allLen = this.wholeDistance(points);
            var len = this.getBaseLength(points);
            var tailWidth = (len * tailWidthFactor);
            var neckWidth = this.distance(neckLeftPoint, neckRightPoint);
            var widthDif = (tailWidth - (neckWidth / 2));
            var tempLen = 0;
            var lPoints = [];
            var rPoints = [];
            var j = 1;
            while (j < (points.length - 1)) {
                angle = (this.getAngleOfThreePoints(points[(j - 1)], points[j], points[(j + 1)]) / 2);
                tempLen = tempLen + this.distance(points[(j - 1)], points[j]);
                w = (tailWidth - ((tempLen / allLen) * widthDif)) / Math.sin(angle);
                lPoints.push(this.getThirdPoint(points[(j - 1)], points[j], angle, (w * leftFactor), this.RIGHT_SIDE));
                rPoints.push(this.getThirdPoint(points[(j - 1)], points[j], (Math.PI - angle), (w * rightFactor), this.LEFT_SIDE));
                j++;
            };
            return lPoints.concat(rPoints);
        },
        //根据贝塞尔曲线方程计算曲线
        getBezierPoints:function(points)
        {
            var x;
            var y;
            var index;
            var factor;
            var a;
            var b;
            if (points.length <= 2){
                return (points);
            };
            var bezierPoints = [];
            var n = (points.length - 1);
            var t = 0;
            while (t <= 1) {
                x = 0;
                y = 0;
                index = 0;
                while (index <= n) {
                    factor = this.getBinomialFactor(n, index);
                    a = Math.pow(t, index);
                    b = Math.pow((1 - t), (n - index));
                    x = x + ((factor * a) * b) * points[index].x;
                    y = y + ((factor * a) * b) * points[index].y;
                    index++;
                };
                bezierPoints.push({
                    x:x,
                    y:y
                });
                t = (t + 0.01);
            };
            bezierPoints.push(points[n]);
            return bezierPoints;
        },
        getAdvancedBezierPoints:function(points){
            var l1;
            var l2;
            var d12;
            var d1;
            var dx;
            var dy;
            points = points.slice();
            var n = points.length;
            points.push(points[0]);
            var aPnts = [];
            var i=0;
            while (i < n) {
                aPnts.push(this.getMidPoint(points[i], points[(i + 1)]));
                i++;
            };
            aPnts.push(aPnts[0]);
            points.push(points[1]);
            var bPnts = [];
            i = 0;
            while (i < n) {
                l1 = this.distance(points[i], points[(i + 1)]);
                l2 = this.distance(points[(i + 1)], points[(i + 2)]);
                d12 = this.distance(aPnts[i], aPnts[(i + 1)]);
                d1 = ((d12 * l1) / (l1 + l2));
                bPnts.push(this.getThirdPoint(aPnts[(i + 1)], aPnts[i], 0, d1, this.LEFT_SIDE));
                i++;
            };
            var mPnts = [];
            i = 0;
            while (i < n) {
                dx = (points[(i + 1)].x - bPnts[i].x);
                dy = (points[(i + 1)].y - bPnts[i].y);
                mPnts.push(
                    {
                        x : aPnts[i].x + dx,
                        y : aPnts[i].y + dy
                    });
                mPnts.push(points[(i + 1)]);
                mPnts.push(
                    {
                        x : aPnts[(i + 1)].x + dx,
                        y : aPnts[(i + 1)].y + dy
                    });
                i++;
            };
            var bezierPnts = [];
            var pnts = mPnts.slice();
            pnts.push(mPnts[0], mPnts[1]);
            i = 1;
            while (i < pnts.length) {
                bezierPnts = bezierPnts.concat(this.getBezierPoints(pnts.slice(i, (i + 4))));
                i = (i + 3);
            };
            return bezierPnts;
        },
        getBinomialFactor:function(n,index){
            return this.getFactorial(n) / (this.getFactorial(index) * this.getFactorial(n - index));
        },
        getFactorial:function(n){
            if (n <= 1){
                return 1;
            };
            if (n == 2){
                return 2;
            };
            if (n == 3){
                return 6;
            };
            if (n == 4){
                return 24;
            };
            if (n == 5){
                return 120;
            };
            var result= 1;
            var i= 1;
            while (i <= n) {
                result = result*i;
                i++;
            };
            return result;
        },
        getAngleOfThreePoints:function(pntA, pntB, pntC)
        {
            var angle = this.getAzimuthAngle(pntB, pntA) - this.getAzimuthAngle(pntB, pntC);
            if(angle < 0){
                angle = angle + (Math.PI * 2);
            };
            return angle;
        },
        /**
         * 根据两点计算距离
         * @param {<Forestar.Geometry.Point>} pnt1
         * @param {<Forestar.Geometry.Point>} pnt2
         * @return {<Number>} 距离
         */
        distance:function(pnt1,pnt2)
        {
            //两点距离公式
            return Math.sqrt((Math.pow((pnt1.x - pnt2.x), 2) + Math.pow((pnt1.y - pnt2.y), 2)));
        },
        /**
         * 根据两点计算中心点
         * @param {<Forestar.Geometry.Point>} pnt1
         * @param {<Forestar.Geometry.Point>} pnt2
         * @return {<Forestar.Geometry.Point>} midPoint
         */
        getMidPoint:function(pnt1,pnt2)
        {
            return {
                x:(pnt1.x+pnt2.x)/2,
                y:(pnt1.y+pnt2.y)/2
            };
        },
        /**
         * 计算点组总距离
         * @param {<[Forestar.Geometry.Point]>} points 点组
         * @return {<Number>} 总距离
         */
        getBaseLength:function(points)
        {
            var distance = this.wholeDistance(points);
            return distance;
        },
        /**
         * 计算点组所有点间总距离
         * @param {<[Forestar.Geometry.Point]>} points 点组
         * @return {<Number>} 总距离
         */
        wholeDistance:function(points){
            if (points.length <= 1){
                return 0;
            };
            var value = 0;
            var i = 0;
            while (i < (points.length - 1)){
                value = (value + this.distance(points[i], points[(i + 1)]));
                i++;
            };
            return value;
        },
        plotPrint : function(){
        }
    }
    return Widget;
});
