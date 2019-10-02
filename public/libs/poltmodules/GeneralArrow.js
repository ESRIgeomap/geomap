/**
 * Created by chenzpa on 2015/10/30.
 */
define([
    "dojo/_base/declare",
    'modules/CalculatePlot'
], function (declare,CalculatePlot) {
    return declare("GeneralArrow", [], {
        headHeightFactor : 0.18,
        headWidthFactor: 0.3,
        neckHeightFactor: 0.85,
        neckWidthFactor: 0.15,
        headTailFactor: 0.8,
        af:0.1,
        c0: new CalculatePlot(),
        constructor: function () {
        },
        getFgc :function(){
            return 3;
        },
        draw:function(pnts){
            //ֻ��������������ܻ���
            if(!pnts|| pnts.length < 2)
                return;
            var rings = [];
            var tailPnts = this.fz(pnts);
            var headPnts = this.fx(pnts, tailPnts[0], tailPnts[1]);
            var neckLeft = headPnts[0];
            var neckRight = headPnts[4];
            var bodyPnts = this.fy(pnts, neckLeft, neckRight, this.af);
            var count = bodyPnts.length;
            var leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, (count / 2)));
            leftPnts.push(neckLeft);
            var rightPnts = [tailPnts[1]].concat(bodyPnts.slice((count / 2), count));
            rightPnts.push(neckRight);
            leftPnts = this.c0.fv(leftPnts);
            rightPnts =this.c0.fv(rightPnts);
            rings = leftPnts.concat(headPnts, rightPnts.reverse(),leftPnts[0]);
            return rings;
        },
        /**
         * ��ȡβ��
         */
        fz:function(points, tailLeft, tailRight) {
            var allLen = this.c0.fd(points);
            var tailWidth = (allLen * this.af);
            var tailLeft = this.c0.fl(points[1], points[0], this.c0.HALF_PI, tailWidth, false);
            var tailRight = this.c0.fl(points[1], points[0],  this.c0.HALF_PI, tailWidth, true);
            return ([tailLeft, tailRight]);
        },
        /**
         * ��ȡͷ��
         * @param points
         * @param tailLeft
         * @param tailRight
         * @returns {*[]}
         */
        fx:function(points, tailLeft, tailRight){
            var len = this.c0.fd(points);
            var headHeight = (len * this.headHeightFactor);
            var headPnt = points[(points.length - 1)];
            len = this.c0.fa(headPnt, points[(points.length - 2)]);
            var tailWidth = this.c0.fa(tailLeft, tailRight);
            if (headHeight > (tailWidth * this.headTailFactor)){
                headHeight = (tailWidth * this.headTailFactor);
            }
            var headWidth = (headHeight * this.headWidthFactor);
            var neckWidth = (headHeight * this.neckWidthFactor);
            headHeight = (((headHeight > len)) ? len : headHeight);
            var neckHeight = (headHeight * this.neckHeightFactor);
            var headEndPnt = this.c0.fl(points[(points.length - 2)], headPnt, 0, headHeight, true);
            var neckEndPnt = this.c0.fl(points[(points.length - 2)], headPnt, 0, neckHeight, true);
            var headLeft = this.c0.fl(headPnt, headEndPnt, this.c0.HALF_PI, headWidth, false);
            var headRight = this.c0.fl(headPnt, headEndPnt, this.c0.HALF_PI, headWidth, true);
            var neckLeft = this.c0.fl(headPnt, neckEndPnt, this.c0.HALF_PI, neckWidth, false);
            var neckRight = this.c0.fl(headPnt, neckEndPnt, this.c0.HALF_PI, neckWidth, true);
            return ([neckLeft, headLeft, headPnt, headRight, neckRight]);
        },
        fy:function(points, neckLeft, neckRight, tailWidthFactor){
            var angle;
            var w;
            var left;
            var right;
            var allLen = this.c0.fb(points);
            var len = this.c0.fd(points);
            var tailWidth = (len * tailWidthFactor);
            var neckWidth = this.c0.fa(neckLeft, neckRight);
            var widthDif = ((tailWidth - neckWidth) / 2);
            var tempLen = 0;
            var leftBodyPnts = [];
            var rightBodyPnts = [];
            var i = 1;
            while (i < (points.length - 1)) {
                angle = (this.c0.fh(points[(i - 1)], points[i], points[(i + 1)]) / 2);
                tempLen = (tempLen + this.c0.fa(points[(i - 1)], points[i]));
                w = (((tailWidth / 2) - ((tempLen / allLen) * widthDif)) / Math.sin(angle));
                left = this.c0.fl(points[(i - 1)], points[i], (Math.PI - angle), w, true);
                right = this.c0.fl(points[(i - 1)], points[i], angle, w, false);
                leftBodyPnts.push(left);
                rightBodyPnts.push(right);
                i++;
            }
            return (leftBodyPnts.concat(rightBodyPnts));
        }
    });
}) ;