
var convolve = function (src2d, mat) {
    "use strict";
    var src = src2d.a, w = src2d.w, h = src2d.h;
    var n = (mat.length - 1) / 2;
    var off = n - 1;
    var rw = w - 2 * n, rh = h - 2 * n;
    var r = new Float32Array(rw * rh);

    // [hand-optimized] to use flat matrix and remove forEach
    var mh = mat.length, mw = mat[0].length;
    var mat2 = new Float32Array(mh * mw);
    for (var j = 0; j < mh; j++) {
        for (var i = 0; i < mw; i++) mat2[j * mw + i] = mat[j][i];
    }
    
    for (var y = 0; y < rh; y++) {
        var yoff = y - off, yrw = y * rw;
        for (var x = 0; x < rw; x++) {
            var xoff = x - off, s = 0;
            for (var j = 0; j < mh; j++) {
                var jmw = j * mw, yjwx = (yoff + j) * w + xoff;
                for (var i = 0; i < mw; i++) {
                    s += mat2[jmw + i] * src[yjwx + i];
                }
            }
            r[yrw + x] = s;
        }
    }
    return {a: r, w: rw, h: rh};
};

var convolve3x3 = function (src2d, mat) {
    "use strict";
    //if (mat.length !== 3) return convolve(src2d, mat);
    var src = src2d.a, w = src2d.w, h = src2d.h;
    var rw = w - 2, rh = h - 2;
    var r = new Float32Array(rw * rh);

    // [hand-optimized] to use extracted matrix
    var m00 = mat[0][0], m01 = mat[0][1], m02 = mat[0][2],
        m10 = mat[1][0], m11 = mat[1][1], m12 = mat[1][2],
        m20 = mat[2][0], m21 = mat[2][1], m22 = mat[2][2];
    var off00 = 0*w + 0, off01 = 0*w + 1, off02 = 0*w + 2,
        off10 = 1*w + 0, off11 = 1*w + 1, off12 = 1*w + 2,
        off20 = 2*w + 0, off21 = 2*w + 1, off22 = 2*w + 2;
    for (var y = 0; y < rh; y++) {
        var yrw = y * rw, yw = y * w;
        for (var x = 0; x < rw; x++) {
            var ri = yrw + x, i = yw + x;
            r[ri] =
                m00 * src[off00+i] + m01 * src[off01+i] + m02 * src[off02+i] +
                m10 * src[off10+i] + m11 * src[off11+i] + m12 * src[off12+i] +
                m20 * src[off20+i] + m21 * src[off21+i] + m22 * src[off22+i];
        }
    }
    return {a: r, w: rw, h: rh};
};

var sumConvolve3x3s = function (src2ds, mats) {
    "use strict";

    var w = src2ds[0].w|0, h = src2ds[0].h|0;
    var rw = w - 2|0, rh = h - 2|0;
    var r = new Float32Array(rw * rh|0);
    var o00 =       0 |0, o01 =       1 |0, o02 =       2 |0,
        o10 =   w + 0 |0, o11 =   w + 1 |0, o12 =   w + 2 |0,
        o20 = 2*w + 0 |0, o21 = 2*w + 1 |0, o22 = 2*w + 2 |0;

    for (var si = 0, sl = src2ds.length|0; si < sl; si++) { 
        var s = src2ds[si].a, m = mats[si];
        var m0 = m[0], m1 = m[1], m2 = m[2];
        var m00 = m0[0], m01 = m0[1], m02 = m0[2],
            m10 = m1[0], m11 = m1[1], m12 = m1[2],
            m20 = m2[0], m21 = m2[1], m22 = m2[2];
        for (var y = 0; y < rh; y++) {
            var yrw = y * rw |0, yw = y * w |0;
            for (var x = 0; x < rw; x++) {
                var ri = yrw + x |0, i = yw + x |0;
                r[ri] += 
                    m00 * s[o00+i|0] + m01 * s[o01+i|0] + m02 * s[o02+i|0] +
                    m10 * s[o10+i|0] + m11 * s[o11+i|0] + m12 * s[o12+i|0] +
                    m20 * s[o20+i|0] + m21 * s[o21+i|0] + m22 * s[o22+i|0];
            }
        }
    }
    
    return {a: r, w: rw, h: rh};
};

var sumConvolve3x3sEx = function (src2ds, mats) {
    "use strict";

    var w = src2ds[0].w|0, h = src2ds[0].h|0;
    var rw = w - 2|0, rh = h - 2|0;
    var r = new Float32Array(rw * rh|0);
    var ww = w << 1 |0;
    var o00 = 0, o10 = w    |0, o20 = ww    |0,
        o01 = 1, o11 = w + 1|0, o21 = ww + 1|0,
        o02 = 2, o12 = w + 2|0, o22 = ww + 2|0,
        o03 = 3, o13 = w + 3|0, o23 = ww + 3|0,
        o04 = 4, o14 = w + 4|0, o24 = ww + 4|0,
        o05 = 5, o15 = w + 5|0, o25 = ww + 5|0;
        
    var rr4 = rw % 4 |0;
    var rw4 = rw - rr4 |0;

    for (var si = 0, sl = src2ds.length|0; si < sl; si++) { 
        var s = src2ds[si].a, m = mats[si];
        var m0 = m[0], m1 = m[1], m2 = m[2];
        var m00 = m0[0], m01 = m0[1], m02 = m0[2],
            m10 = m1[0], m11 = m1[1], m12 = m1[2],
            m20 = m2[0], m21 = m2[1], m22 = m2[2];
        for (var y = 0; y < rh; y++) {
            var yrw = y * rw |0, yw = y * w |0;
            // extract loop 
            for (var x = 0; x < rw4; x += 4) {
                var ri = yrw + x|0, i = yw + x|0;
                var s00 = s[o00+i|0], s10 = s[o10+i|0], s20 = s[o20+i|0],
                    s01 = s[o01+i|0], s11 = s[o11+i|0], s21 = s[o21+i|0],
                    s02 = s[o02+i|0], s12 = s[o12+i|0], s22 = s[o22+i|0],
                    s03 = s[o03+i|0], s13 = s[o13+i|0], s23 = s[o23+i|0],
                    s04 = s[o04+i|0], s14 = s[o14+i|0], s24 = s[o24+i|0],
                    s05 = s[o05+i|0], s15 = s[o15+i|0], s25 = s[o25+i|0];
                r[ri] += 
                    m00 * s00 + m01 * s01 + m02 * s02 +
                    m10 * s10 + m11 * s11 + m12 * s12 +
                    m20 * s20 + m21 * s21 + m22 * s22;
                r[ri+1|0] += 
                    m00 * s01 + m01 * s02 + m02 * s03 +
                    m10 * s11 + m11 * s12 + m12 * s13 +
                    m20 * s21 + m21 * s22 + m22 * s23;
                r[ri+2|0] += 
                    m00 * s02 + m01 * s03 + m02 * s04 +
                    m10 * s12 + m11 * s13 + m12 * s14 +
                    m20 * s22 + m21 * s23 + m22 * s24;
                r[ri+3|0] += 
                    m00 * s03 + m01 * s04 + m02 * s05 +
                    m10 * s13 + m11 * s14 + m12 * s15 +
                    m20 * s23 + m21 * s24 + m22 * s25;
            }
            /*
            // this extracted code run slow on chrome
            var ri = yrw + rw4|0, i = yw + rw4|0;
            switch (rr4) {
            case 3: var s04 = s[o04+i|0], s14 = s[o14+i|0], s24 = s[o24+i|0];
            case 2: var s03 = s[o03+i|0], s13 = s[o13+i|0], s23 = s[o23+i|0];
            case 1: var s02 = s[o02+i|0], s12 = s[o12+i|0], s22 = s[o22+i|0],
                        s01 = s[o01+i|0], s11 = s[o11+i|0], s21 = s[o21+i|0],
                        s00 = s[o00+i|0], s10 = s[o10+i|0], s20 = s[o20+i|0];
            case 0:;
            }
            switch (rr4) {
            case 3: r[ri+2|0] += 
                    m00 * s02 + m01 * s03 + m02 * s04 +
                    m10 * s12 + m11 * s13 + m12 * s14 +
                    m20 * s22 + m21 * s23 + m22 * s24;
            case 2: r[ri+1|0] += 
                    m00 * s01 + m01 * s02 + m02 * s03 +
                    m10 * s11 + m11 * s12 + m12 * s13 +
                    m20 * s21 + m21 * s22 + m22 * s23;
            case 1: r[ri] += 
                    m00 * s00 + m01 * s01 + m02 * s02 +
                    m10 * s10 + m11 * s11 + m12 * s12 +
                    m20 * s20 + m21 * s21 + m22 * s22;
            case 0:;
            }
            */
            for (var x = rw4; x < rw; x++) {
                var ri = yrw + x |0, i = yw + x |0;
                r[ri] +=
                    m00 * s[o00+i|0] + m01 * s[o01+i|0] + m02 * s[o02+i|0] +
                    m10 * s[o10+i|0] + m11 * s[o11+i|0] + m12 * s[o12+i|0] +
                    m20 * s[o20+i|0] + m21 * s[o21+i|0] + m22 * s[o22+i|0];
            }
        }
    }
    
    return {a: r, w: rw, h: rh};
};


var sumConvolve3x3sEx8 = function (src2ds, mats) {
    "use strict";

    var w = src2ds[0].w|0, h = src2ds[0].h|0;
    var rw = w - 2|0, rh = h - 2|0;
    var r = new Float32Array(rw * rh|0);
    var ww = w << 1 |0;
    var o00 = 0, o10 = w    |0, o20 = ww    |0,
        o01 = 1, o11 = w + 1|0, o21 = ww + 1|0,
        o02 = 2, o12 = w + 2|0, o22 = ww + 2|0,
        o03 = 3, o13 = w + 3|0, o23 = ww + 3|0,
        o04 = 4, o14 = w + 4|0, o24 = ww + 4|0,
        o05 = 5, o15 = w + 5|0, o25 = ww + 5|0,
        o06 = 6, o16 = w + 6|0, o26 = ww + 6|0,
        o07 = 7, o17 = w + 7|0, o27 = ww + 7|0,
        o08 = 8, o18 = w + 8|0, o28 = ww + 8|0,
        o09 = 9, o19 = w + 9|0, o29 = ww + 9|0;
        
    var rr8 = rw % 8 |0;
    var rw8 = rw - rr8 |0;

    for (var si = 0, sl = src2ds.length|0; si < sl; si++) { 
        var s = src2ds[si].a, m = mats[si];
        var m0 = m[0], m1 = m[1], m2 = m[2];
        var m00 = m0[0], m01 = m0[1], m02 = m0[2],
            m10 = m1[0], m11 = m1[1], m12 = m1[2],
            m20 = m2[0], m21 = m2[1], m22 = m2[2];
        for (var y = 0; y < rh; y++) {
            var yrw = y * rw |0, yw = y * w |0;
            // extract loop 
            for (var x = 0; x < rw8; x += 8) {
                var ri = yrw + x|0, i = yw + x|0;
                var s00 = s[o00+i|0], s10 = s[o10+i|0], s20 = s[o20+i|0],
                    s01 = s[o01+i|0], s11 = s[o11+i|0], s21 = s[o21+i|0],
                    s02 = s[o02+i|0], s12 = s[o12+i|0], s22 = s[o22+i|0],
                    s03 = s[o03+i|0], s13 = s[o13+i|0], s23 = s[o23+i|0],
                    s04 = s[o04+i|0], s14 = s[o14+i|0], s24 = s[o24+i|0],
                    s05 = s[o05+i|0], s15 = s[o15+i|0], s25 = s[o25+i|0],
                    s06 = s[o06+i|0], s16 = s[o16+i|0], s26 = s[o26+i|0],
                    s07 = s[o07+i|0], s17 = s[o17+i|0], s27 = s[o27+i|0],
                    s08 = s[o08+i|0], s18 = s[o18+i|0], s28 = s[o28+i|0],
                    s09 = s[o09+i|0], s19 = s[o19+i|0], s29 = s[o29+i|0];
                r[ri] += 
                    m00 * s00 + m01 * s01 + m02 * s02 +
                    m10 * s10 + m11 * s11 + m12 * s12 +
                    m20 * s20 + m21 * s21 + m22 * s22;
                r[ri+1|0] += 
                    m00 * s01 + m01 * s02 + m02 * s03 +
                    m10 * s11 + m11 * s12 + m12 * s13 +
                    m20 * s21 + m21 * s22 + m22 * s23;
                r[ri+2|0] += 
                    m00 * s02 + m01 * s03 + m02 * s04 +
                    m10 * s12 + m11 * s13 + m12 * s14 +
                    m20 * s22 + m21 * s23 + m22 * s24;
                r[ri+3|0] += 
                    m00 * s03 + m01 * s04 + m02 * s05 +
                    m10 * s13 + m11 * s14 + m12 * s15 +
                    m20 * s23 + m21 * s24 + m22 * s25;
                r[ri+4|0] += 
                    m00 * s04 + m01 * s05 + m02 * s06 +
                    m10 * s14 + m11 * s15 + m12 * s16 +
                    m20 * s24 + m21 * s25 + m22 * s26;
                r[ri+5|0] += 
                    m00 * s05 + m01 * s06 + m02 * s07 +
                    m10 * s15 + m11 * s16 + m12 * s17 +
                    m20 * s25 + m21 * s26 + m22 * s27;
                r[ri+6|0] += 
                    m00 * s06 + m01 * s07 + m02 * s08 +
                    m10 * s16 + m11 * s17 + m12 * s18 +
                    m20 * s26 + m21 * s27 + m22 * s28;
                r[ri+7|0] += 
                    m00 * s07 + m01 * s08 + m02 * s09 +
                    m10 * s17 + m11 * s18 + m12 * s19 +
                    m20 * s27 + m21 * s28 + m22 * s29;
            }
            /*
            //NOTE: this extracted code run slow on chrome
            var ri = yrw + rw8|0, i = yw + rw8|0;
            switch (rr8) {
            case 7: var s08 = s[o08+i|0], s18 = s[o18+i|0], s28 = s[o28+i|0];
            case 6: var s07 = s[o07+i|0], s17 = s[o17+i|0], s27 = s[o27+i|0];
            case 5: var s06 = s[o06+i|0], s16 = s[o16+i|0], s26 = s[o26+i|0];
            case 4: var s05 = s[o05+i|0], s15 = s[o15+i|0], s25 = s[o25+i|0];
            case 3: var s04 = s[o04+i|0], s14 = s[o14+i|0], s24 = s[o24+i|0];
            case 2: var s03 = s[o03+i|0], s13 = s[o13+i|0], s23 = s[o23+i|0];
            case 1: var s02 = s[o02+i|0], s12 = s[o12+i|0], s22 = s[o22+i|0],
                        s01 = s[o01+i|0], s11 = s[o11+i|0], s21 = s[o21+i|0],
                        s00 = s[o00+i|0], s10 = s[o10+i|0], s20 = s[o20+i|0];
            case 0:;
            }
            switch (rr8) {
            case 7: r[ri+6|0] += 
                    m00 * s06 + m01 * s07 + m02 * s08 +
                    m10 * s16 + m11 * s17 + m12 * s18 +
                    m20 * s26 + m21 * s27 + m22 * s28;
            case 6: r[ri+5|0] += 
                    m00 * s05 + m01 * s06 + m02 * s07 +
                    m10 * s15 + m11 * s16 + m12 * s17 +
                    m20 * s25 + m21 * s26 + m22 * s27;
            case 5: r[ri+4|0] += 
                    m00 * s04 + m01 * s05 + m02 * s06 +
                    m10 * s14 + m11 * s15 + m12 * s16 +
                    m20 * s24 + m21 * s25 + m22 * s26;
            case 4: r[ri+3|0] += 
                    m00 * s03 + m01 * s04 + m02 * s05 +
                    m10 * s13 + m11 * s14 + m12 * s15 +
                    m20 * s23 + m21 * s24 + m22 * s25;
            case 3: r[ri+2|0] += 
                    m00 * s02 + m01 * s03 + m02 * s04 +
                    m10 * s12 + m11 * s13 + m12 * s14 +
                    m20 * s22 + m21 * s23 + m22 * s24;
            case 2: r[ri+1|0] += 
                    m00 * s01 + m01 * s02 + m02 * s03 +
                    m10 * s11 + m11 * s12 + m12 * s13 +
                    m20 * s21 + m21 * s22 + m22 * s23;
            case 1: r[ri] += 
                    m00 * s00 + m01 * s01 + m02 * s02 +
                    m10 * s10 + m11 * s11 + m12 * s12 +
                    m20 * s20 + m21 * s21 + m22 * s22;
            case 0:;
            }
            */
            
            for (var x = rw8; x < rw; x++) {
                var ri = yrw + x |0, i = yw + x |0;
                r[ri] +=
                    m00 * s[o00+i|0] + m01 * s[o01+i|0] + m02 * s[o02+i|0] +
                    m10 * s[o10+i|0] + m11 * s[o11+i|0] + m12 * s[o12+i|0] +
                    m20 * s[o20+i|0] + m21 * s[o21+i|0] + m22 * s[o22+i|0];
            }
        }
    }
    
    return {a: r, w: rw, h: rh};
};



var sumConvolve3x3sSIMD = function (src2ds, mats) {
    "use strict";
    // very very slow
    var f4 = SIMD.Float32x4;
    var f4add = f4.add, f4mul = f4.mul, f4ld3 = f4.load3,
        f4ex = f4.extractLane, f4sw = f4.swizzle, f4re = f4.replaceLane;
    var w = src2ds[0].w|0, h = src2ds[0].h|0;
    var rw = w - 2|0, rh = h - 2|0;
    var r = new Float32Array(rw * rh|0);
    var o00 =       0 |0, o01 =       1 |0, o02 =       2 |0,
        o10 =   w + 0 |0, o11 =   w + 1 |0, o12 =   w + 2 |0,
        o20 = 2*w + 0 |0, o21 = 2*w + 1 |0, o22 = 2*w + 2 |0;

    for (var si = 0, sl = src2ds.length|0; si < sl; si++) { 
        var s = src2ds[si].a, m = mats[si];
        var m0 = m[0], m1 = m[1], m2 = m[2];
        var m00 = m0[0], m01 = m0[1], m02 = m0[2],
            m10 = m1[0], m11 = m1[1], m12 = m1[2],
            m20 = m2[0], m21 = m2[1], m22 = m2[2];
        var f4mf = f4(m00, m01, m02, m10);
        var f4mr = f4(m20, m21, m22, m12);
        
        for (var y = 0; y < rh; y++) {
            var yrw = y * rw |0, yw = y * w |0;
            for (var x = 0; x < rw; x++) {
                var ri = yrw + x |0, i = yw + x |0;
                var f4sf = f4re(f4ld3(s, o00+i), 3, s[o10+i|0]);
                var f4sr = f4re(f4ld3(s, o20+i), 3, s[o12+i|0]);
                var f4r = f4add(f4mul(f4mf, f4sf), f4mul(f4mr, f4sr));
                f4r = f4add(f4r, f4sw(f4r, 1, 0, 3, 2));
                f4r = f4add(f4r, f4sw(f4r, 2, 3, 0, 1));
                r[ri] += f4ex(f4r, 0) + m11*s[o11+i|0];
            }
        }
    }
    
    return {a: r, w: rw, h: rh};
};

var sumConvolve3x3sExSIMD = function (src2ds, mats) {
    "use strict";
    // modified from http://inside.pixiv.net/entry/2015/07/28/230317
    var f4 = SIMD.Float32x4;
    var f4add = f4.add, f4mul = f4.mul, f4ld = f4.load, f4st = f4.store,
        f4sp = f4.splat;
    var w = src2ds[0].w|0, h = src2ds[0].h|0;
    var rw = w - 2|0, rh = h - 2|0;
    var r = new Float32Array(rw * rh|0);
    var o00 =       0 |0, o01 =       1 |0, o02 =       2 |0,
        o10 =   w + 0 |0, o11 =   w + 1 |0, o12 =   w + 2 |0,
        o20 = 2*w + 0 |0, o21 = 2*w + 1 |0, o22 = 2*w + 2 |0;
    var rw4 = rw - rw % 4 |0;

    for (var si = 0, sl = src2ds.length|0; si < sl; si++) { 
        var s = src2ds[si].a, m = mats[si];
        var m0 = m[0], m1 = m[1], m2 = m[2];
        var m00 = m0[0], m01 = m0[1], m02 = m0[2],
            m10 = m1[0], m11 = m1[1], m12 = m1[2],
            m20 = m2[0], m21 = m2[1], m22 = m2[2];
        var f4m00 = f4sp(m00), f4m01 = f4sp(m01), f4m02 = f4sp(m02),
            f4m10 = f4sp(m10), f4m11 = f4sp(m11), f4m12 = f4sp(m12),
            f4m20 = f4sp(m20), f4m21 = f4sp(m21), f4m22 = f4sp(m22);
        
        for (var y = 0; y < rh; y++) {
            var yrw = y * rw |0, yw = y * w |0;
            // extract loop 
            for (var x = 0; x < rw4; x += 4) {
                var ri = yrw + x|0, i = yw + x|0;
                var f4r = f4mul(f4m00, f4ld(s, o00+i));
                f4r = f4add(f4r, f4mul(f4m01, f4ld(s, o01+i)));
                f4r = f4add(f4r, f4mul(f4m02, f4ld(s, o02+i)));
                f4r = f4add(f4r, f4mul(f4m10, f4ld(s, o10+i)));
                f4r = f4add(f4r, f4mul(f4m11, f4ld(s, o11+i)));
                f4r = f4add(f4r, f4mul(f4m12, f4ld(s, o12+i)));
                f4r = f4add(f4r, f4mul(f4m20, f4ld(s, o20+i)));
                f4r = f4add(f4r, f4mul(f4m21, f4ld(s, o21+i)));
                f4r = f4add(f4r, f4mul(f4m22, f4ld(s, o22+i)));
                f4st(r, ri, f4add(f4r, f4ld(r, ri)));
            }
            
            for (var x = rw4; x < rw; x++) {
                var ri = yrw + x |0, i = yw + x |0;
                r[ri] += 
                    m00 * s[o00+i|0] + m01 * s[o01+i|0] + m02 * s[o02+i|0] +
                    m10 * s[o10+i|0] + m11 * s[o11+i|0] + m12 * s[o12+i|0] +
                    m20 * s[o20+i|0] + m21 * s[o21+i|0] + m22 * s[o22+i|0];
            }
        }
    }
    
    return {a: r, w: rw, h: rh};
};


var edgePad = function (src2d, len) {
    "use strict";
    var src = src2d.a, w = src2d.w|0, h = src2d.h|0;
    var rw = (w + 2 * len)|0, rh =  (h + 2 * len)|0;
    var r = new Float32Array(rw * rh);
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            r[(y + len) * rw + x + len|0] = src[y * w + x|0];
        }
    }
    for (var i = 0; i < len; i++) {
        var xs = len - i|0, ys = len - i|0;
        var xe = len + w - 1 + i|0, ye = len + h - 1 + i|0;
        for (var j = 0; j < w + 2 * i; j++) {
            r[(ys - 1) * rw + xs + j|0] = r[ys * rw + xs + j|0];
            r[(ye + 1) * rw + xs + j|0] = r[ye * rw + xs + j|0];
        }
        for (var j = 0; j < h + 2 * i; j++) {
            r[(ys + j) * rw + xs - 1|0] = r[(ys + j) * rw + xs|0];
            r[(ys + j) * rw + xe + 1|0] = r[(ys + j) * rw + xe|0];
        }
        r[(ys - 1) * rw + xs - 1|0] = r[ys * rw + xs|0];
        r[(ys - 1) * rw + xe + 1|0] = r[ys * rw + xe|0];
        r[(ye + 1) * rw + xe + 1|0] = r[ye * rw + xe|0];
        r[(ye + 1) * rw + xs - 1|0] = r[ye * rw + xs|0];
    }
    return {a: r, w: rw, h: rh};
};


/*
var w = 3, h = 3;
var src = {a: new Float32Array(w * h), w: w, h: h};
for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
        src.a[y * w + x] = y * w + x + 1;
    }
}
//console.log(src.a);
var pad = edgePad(src, 2);
//console.log(pad.a);
var mat = [
    [1/8, 1/8, 1/8],
    [1/8, 0/8, 1/8],
    [1/8, 1/8, 1/8],
];
var r = convolve(pad, mat);
console.log(r.a);
*/
