/**
 * a:declare
 * b:Point
 */
define(["dojo/_base/declare", "esri/geometry/Point"], function (declare, b) {
    return declare("CalculatePlot", null, {
        constructor: function () {
        },
        TWO_PI: 6.28318530717959,
        HALF_PI: 1.5707963267949,
        FITTING_COUNT: 100,
        ZERO_TOLERANCE: 0.0001,

        /**
         * 计算x1点与x2点间的距离
         * @param c x1点
         * @param d x2点
         * @returns {number} x1点与x2点间的距离
         */
        fa: function (c, d) {
            return (Math.sqrt((Math.pow((c.x - d.x), 2) + Math.pow((c.y - d.y), 2))))
        },
        /**
         * 计算点坐标
         * @param d 存储单击点与当前鼠标点坐标对象的数组ArrayD
         * @returns {number}各点之间距离差的和
         */
        fb: function (d) {
            var e = 0;
            var c = 0;
            while (c < (d.length - 1)) {
                e = (e + this.fa(d[c], d[(c + 1)]));
                c++
            }
            return (e)
        },
        /**
         * 建立c与d的中点
         * @param c point点
         * @param d point点
         * @returns {*} 一个新的Point点 为c与d点的中点
         */
        fc: function (c, d) {
            return (new b(((c.x + d.x) / 2), ((c.y + d.y) / 2), c.spatialReference))
        },
        /**
         *
         * @param c 存储单击点与当前鼠标点坐标对象的数组ArrayD？
         * @returns {number} 各点之间距离差的和的0.99次方
         */
        fd: function (c) {
            return (Math.pow(this.fb(c), 0.99))
        },
        /**
         *
         * @param c
         * @param i
         * @param h
         * @returns {*}
         */
        fe: function (c, i, h) {
            var g = new b(((c.x + i.x) / 2), ((c.y + i.y) / 2), c.spatialReference);
            var f = new b(((g.x - c.y) + i.y), ((g.y + c.x) - i.x), c.spatialReference);
            var e = new b(((c.x + h.x) / 2), ((c.y + h.y) / 2), c.spatialReference);
            var d = new b(((e.x - c.y) + h.y), ((e.y + c.x) - h.x), c.spatialReference);
            return (this.ff(g, f, e, d))
        },
        /**
         *
         * @param i
         * @param h
         * @param g
         * @param d
         * @returns {*}
         */
        ff: function (i, h, g, d) {
            var j;
            var c;
            var l;
            var k;
            if (i.y == h.y) {
                j = ((d.x - g.x) / (d.y - g.y));
                c = ((j * (i.y - g.y)) + g.x);
                l = i.y;
                return (new b(c, l, i.spatialReference))
            }
            if (g.y == d.y) {
                k = ((h.x - i.x) / (h.y - i.y));
                c = ((k * (g.y - i.y)) + i.x);
                l = g.y;
                return (new b(c, l, i.spatialReference))
            }
            k = ((h.x - i.x) / (h.y - i.y));
            j = ((d.x - g.x) / (d.y - g.y));
            l = (((((k * i.y) - i.x) - (j * g.y)) + g.x) / (k - j));
            c = (((k * l) - (k * i.y)) + i.x);
            return (new b(c, l, i.spatialReference))
        },
        /**
         * 调整方向？
         * @param d
         * @param c
         * @returns {*}e 有偏差的pi值
         */
        fg: function (d, c) {
            var e;
            var f = Math.asin((Math.abs((c.y - d.y)) / this.fa(d, c)));//f=c d点间y坐标差值除以两点间间距
            if ((((c.y >= d.y)) && ((c.x >= d.x)))) {
                e = (f + Math.PI)
            } else {
                if ((((c.y >= d.y)) && ((c.x < d.x)))) {
                    e = (this.TWO_PI - f)
                } else {
                    if ((((c.y < d.y)) && ((c.x < d.x)))) {
                        e = f
                    } else {
                        if ((((c.y < d.y)) && ((c.x >= d.x)))) {
                            e = (Math.PI - f)
                        }
                    }
                }
            }
            return (e)
        },
        /**
         *
         * @param e point点
         * @param d point点
         * @param c point点
         * @returns {number}
         */
        fh: function (e, d, c) {
            var f = (this.fg(d, e) - this.fg(d, c));
            return ((((f < 0)) ? (f + this.TWO_PI) : f))
        },
        /**
         *
         * @param c
         * @param e
         * @param d
         * @returns {boolean}
         */
        fi: function (c, e, d) {
            return ((((d.y - c.y) * (e.x - c.x)) > ((e.y - c.y) * (d.x - c.x))))
        },
        /**
         *
         * @param f
         * @param e
         * @param d
         * @returns {*}
         */
        fj: function (f, e, d) {
            var c = (e.x + (f * (d.x - e.x)));
            var g = (e.y + (f * (d.y - e.y)));
            return (new b(c, g, e.spatialReference))
        },
        /**
         *
         * @param n
         * @param l
         * @param m
         * @param k
         * @param f
         * @returns {*}
         */
        fk: function (n, l, m, k, f) {
            n = Math.max(Math.min(n, 1), 0);
            var j = (1 - n);
            var g = (n * n);
            var e = (g * n);
            var d = (j * j);
            var c = (d * j);
            var i = ((((c * l.x) + (((3 * d) * n) * m.x)) + (((3 * j) * g) * k.x)) + (e * f.x));
            var h = ((((c * l.y) + (((3 * d) * n) * m.y)) + (((3 * j) * g) * k.y)) + (e * f.y));
            return (new b(i, h, l.spatialReference))
        },
        /**
         *
         * @param h point点
         * @param g point点
         * @param d Pi相关值
         * @param c 高度或宽度
         * @param f bool值
         * @returns {*} 返回了一个新点
         */
        fl: function (h, g, d, c, f) {
            if (typeof(f) === "undefined" || f == null || f === undefined) {
                f = true
            }
            var j = this.fg(h, g);
            var e = ((f) ? (j + d) : (j - d));
            var k = (c * Math.cos(e));
            var i = (c * Math.sin(e));
            return (new b((g.x + k), (g.y + i), h.spatialReference))
        },
        /**
         *
         * @param c
         * @param j
         * @param k
         * @param d
         * @returns {Array}
         */
        fm: function (c, j, k, d) {
            var m;
            var l;
            var e;
            var f = [];
            var h = (d - k);
            h = (((h < 0)) ? (h + this.TWO_PI) : h);
            var g = 0;
            while (g <= this.FITTING_COUNT) {
                e = (k + ((h * g) / this.FITTING_COUNT));
                m = (c.x + (j * Math.cos(e)));
                l = (c.y + (j * Math.sin(e)));
                f.push(new b(m, l));
                g++
            }
            return (f)
        },
        /**
         *
         *
         * @param q
         * @param h
         * @param f
         * @param e
         * @returns {*[]}
         */
        fn: function (q, h, f, e) {
            var g;
            var p;
            var n;
            var k;
            var o;
            var l = this.fo(h, f, e);
            var m = Math.sqrt(((l.x * l.x) + (l.y * l.y)));
            var j = (l.x / m);
            var i = (l.y / m);
            var d = this.fa(h, f);
            var c = this.fa(f, e);
            if (m > this.ZERO_TOLERANCE) {
                if (this.fi(h, f, e)) {
                    g = (q * d);
                    p = (f.x - (g * i));
                    n = (f.y + (g * j));
                    k = new b(p, n, f.spatialReference);
                    g = (q * c);
                    p = (f.x + (g * i));
                    n = (f.y - (g * j));
                    o = new b(p, n, f.spatialReference)
                } else {
                    g = (q * d);
                    p = (f.x + (g * i));
                    n = (f.y - (g * j));
                    k = new b(p, n, f.spatialReference);
                    g = (q * c);
                    p = (f.x - (g * i));
                    n = (f.y + (g * j));
                    o = new b(p, n, f.spatialReference)
                }
            } else {
                p = (f.x + (q * (h.x - f.x)));
                n = (f.y + (q * (h.y - f.y)));
                k = new b(p, n, f.spatialReference);
                p = (f.x + (q * (e.x - f.x)));
                n = (f.y + (q * (e.y - f.y)));
                o = new b(p, n, f.spatialReference)
            }
            return ([k, o])
        },
        /**
         *
         * @param g
         * @param f
         * @param e
         * @returns {*}
         */
        fo: function (g, f, e) {
            var m = (g.x - f.x);
            var k = (g.y - f.y);
            var d = Math.sqrt(((m * m) + (k * k)));
            m = (m / d);
            k = (k / d);
            var l = (e.x - f.x);
            var j = (e.y - f.y);
            var c = Math.sqrt(((l * l) + (j * j)));
            l = (l / c);
            j = (j / c);
            var i = (m + l);
            var h = (k + j);
            return (new b(i, h, f.spatialReference))
        },
        /**
         *
         * @param n
         * @param p
         * @returns {Array}
         */
        fp: function (n, p) {
            var f;
            var e;
            var d;
            var j;
            var l = 0;
            var c;
            var h = this.fq(p);
            var k = [h];
            var g = 0;
            while (g < (p.length - 2)) {
                f = p[g];
                e = p[(g + 1)];
                d = p[(g + 2)];
                j = this.fn(n, f, e, d);
                k = k.concat(j);
                g++
            }
            var o = this.fr(p);
            k.push(o);
            var m = [];
            g = 0;
            while (g < (p.length - 1)) {
                f = p[g];
                e = p[(g + 1)];
                m.push(f);
                l = 0;
                while (l < this.FITTING_COUNT) {
                    c = this.fk((l / this.FITTING_COUNT), f, k[(g * 2)], k[((g * 2) + 1)], e);
                    m.push(c);
                    l++
                }
                m.push(e);
                g++
            }
            return (m)
        },
        /**
         *
         * @param s
         * @param l
         * @returns {*}
         */
        fq: function (s, l) {
            if (typeof(l) === "undefined" || l == null || l === undefined) {
                l = 0
            }
            var v;
            var h;
            var g;
            var A;
            var u;
            var p;
            var m;
            var j;
            var i;
            var q;
            var f;
            var e;
            var d;
            var c;
            var z = s[0];
            var x = s[1];
            var w = s[2];
            var o = this.fn(l, z, x, w);
            var k = o[0];
            var y = this.fo(z, x, w);
            var r = Math.sqrt(((y.x * y.x) + (y.y * y.y)));
            if (r > this.ZERO_TOLERANCE) {
                v = this.fc(z, x);
                h = (z.x - v.x);
                g = (z.y - v.y);
                A = this.fa(z, x);
                u = (2 / A);
                p = (-(u) * g);
                m = (u * h);
                j = ((p * p) - (m * m));
                i = ((2 * p) * m);
                q = ((m * m) - (p * p));
                f = (k.x - v.x);
                e = (k.y - v.y);
                d = ((v.x + (j * f)) + (i * e));
                c = ((v.y + (i * f)) + (q * e))
            } else {
                d = (z.x + (l * (x.x - z.x)));
                c = (z.y + (l * (x.y - z.y)))
            }
            return (new b(d, c, z.spatialReference))
        },
        /**
         *
         * @param s
         * @param l
         * @returns {*}
         */
        fr: function (s, l) {
            if (typeof(l) === "undefined" || l == null || l === undefined) {
                l = 0
            }
            var w;
            var h;
            var g;
            var B;
            var u;
            var p;
            var m;
            var j;
            var i;
            var q;
            var f;
            var e;
            var d;
            var c;
            var k = s.length;
            var A = s[(k - 3)];
            var y = s[(k - 2)];
            var x = s[(k - 1)];
            var o = this.fn(l, A, y, x);
            var v = o[1];
            var z = this.fo(A, y, x);
            var r = Math.sqrt(((z.x * z.x) + (z.y * z.y)));
            if (r > this.ZERO_TOLERANCE) {
                w = this.fc(y, x);
                h = (x.x - w.x);
                g = (x.y - w.y);
                B = this.fa(y, x);
                u = (2 / B);
                p = (-(u) * g);
                m = (u * h);
                j = ((p * p) - (m * m));
                i = ((2 * p) * m);
                q = ((m * m) - (p * p));
                f = (v.x - w.x);
                e = (v.y - w.y);
                d = ((w.x + (j * f)) + (i * e));
                c = ((w.y + (i * f)) + (q * e))
            } else {
                d = (x.x + (l * (y.x - x.x)));
                c = (x.y + (l * (y.y - x.y)))
            }
            return (new b(d, c, x.spatialReference))
        },
        /**
         *
         * @param k
         * @returns {*}
         */
        fs: function (k) {
            var j;
            var f;
            var d = 0;
            var e;
            var i;
            var g;
            if (k.length <= 2) {
                return (k)
            }
            var h = [];
            var c = (k.length - 1);
            var l = 0;
            while (l <= 1) {
                j = 0;
                f = 0;
                d = 0;
                while (d <= c) {
                    e = this.ft(c, d);
                    i = Math.pow(l, d);
                    g = Math.pow((1 - l), (c - d));
                    j = (j + (((e * i) * g) * k[d].x));
                    f = (f + (((e * i) * g) * k[d].y));
                    d++
                }
                h.push(new b(j, f, k[0].spatialReference));
                l = (l + 0.01)
            }
            h.push(k[c]);
            return (h)
        },
        /**
         *
         * @param d
         * @param c
         * @returns {number}
         */
        ft: function (d, c) {
            return ((this.fu(d) / (this.fu(c) * this.fu((d - c)))))
        },
        /**
         *
         * @param e
         * @returns {number}
         */
        fu: function (e) {
            if (e <= 1) {
                return (1)
            }
            if (e == 2) {
                return (2)
            }
            if (e == 3) {
                return (6)
            }
            if (e == 4) {
                return (24)
            }
            if (e == 5) {
                return (120)
            }
            var c = 1;
            var d = 1;
            while (d <= e) {
                c = (c * d);
                d++
            }
            return (c)
        },
        /**
         *
         * @param o 单击点
         * @returns {*}
         */
        fv: function (o) {
            var p;
            var l;
            var j;
            var f = 0;
            var h;
            if (o.length <= 2) {
                return (o)
            }
            var c = 2;
            var e = [];
            var d = ((o.length - c) - 1);
            e.push(o[0]);
            var g = 0;
            while (g <= d) {
                p = 0;
                while (p <= 1) {
                    l = 0;
                    j = 0;
                    f = 0;
                    while (f <= c) {
                        h = this.fw(f, p);
                        l = (l + (h * o[(g + f)].x));
                        j = (j + (h * o[(g + f)].y));
                        f++
                    }
                    e.push(new b(l, j));
                    p = (p + 0.05)
                }
                g++
            }
            e.push(o[(o.length - 1)]);
            return (e)
        },
        /**
         *
         * @param c
         * @param d
         * @returns {number}
         */
        fw: function (c, d) {
            if (c == 0) {
                return ((Math.pow((d - 1), 2) / 2))
            }
            if (c == 1) {
                return (((((-2 * Math.pow(d, 2)) + (2 * d)) + 1) / 2))
            }
            if (c == 2) {
                return ((Math.pow(d, 2) / 2))
            }
            return (0)
        }
    })
});