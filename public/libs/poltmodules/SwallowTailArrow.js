/**
 * Created by chenzpa on 2015/10/30.
 */
define([
	"dojo/_base/declare",
	'modules/GeneralArrow'
], function (declare,GeneralArrow) {
	return declare([GeneralArrow], {
		af:0.1,
		ag:1,
		constructor: function (pts) {
		},
		getFgc :function(){
			return 2;
		},
		draw:function(pnts){
			//只有最少两个点才能绘制
			if(!pnts|| pnts.length < 2)
				return;
			var rings = [];
			var tailPnts = this.fz(pnts);
			var headPnts = this.fx(pnts, tailPnts[0], tailPnts[2]);
			var neckLeft = headPnts[0];
			var neckRight = headPnts[4];
			var bodyPnts = this.fy(pnts, neckLeft, neckRight, this.af);
			var count = bodyPnts.length;
			var leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, (count / 2)));
			leftPnts.push(neckLeft);
			var rightPnts = [tailPnts[2]].concat(bodyPnts.slice((count / 2), count));
			rightPnts.push(neckRight);
			leftPnts = this.c0.fv(leftPnts);
			rightPnts =this.c0.fv(rightPnts);
			rings = leftPnts.concat(headPnts, rightPnts.reverse(), [tailPnts[1], leftPnts[0]]);
			return rings;
		},
		/**
		 * 获取尾部
		 */
		fz:function(points, tailLeft, tailRight) {
			var allLen = this.c0.fd(points);
			var tailWidth = (allLen * this.af);
			var tailLeft = this.c0.fl(points[1], points[0], this.c0.HALF_PI, tailWidth, false);
			var tailRight = this.c0.fl(points[1], points[0],  this.c0.HALF_PI, tailWidth, true);
			var len = (tailWidth * this.ag);
			var swallowTailPnt = this.c0.fl(points[1], points[0], 0, len, true);
			return ([tailLeft, swallowTailPnt, tailRight]);
		}
	});
}) ;