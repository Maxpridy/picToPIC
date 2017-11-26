// from http://stackoverflow.com/questions/7041172/
var rgb2ycbcr = function (rgb2d) {
    "use strict";
    var rgb = rgb2d.a, w = rgb2d.w|0, h = rgb2d.h|0;
    var ret = new Uint8ClampedArray(w * h * 3);
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var ofs = 3 * (y * w + x) |0;
            var R = rgb[ofs + 0 |0], G = rgb[ofs + 1 |0], B = rgb[ofs + 2 |0];
            ret[ofs + 0 |0] =  0.29900 * R + 0.58700 * G + 0.11400 * B;
            ret[ofs + 1 |0] = -0.16874 * R - 0.33126 * G + 0.50000 * B + 128;
            ret[ofs + 2 |0] =  0.50000 * R - 0.41869 * G - 0.08131 * B + 128;
        }
    }
    return {a: ret, alpha: rgb2d.alpha, w: w, h: h};
};

var ycbcr2rgb = function (ycbcr2d) {
    "use strict";
    var ycbcr = ycbcr2d.a, w = ycbcr2d.w|0, h = ycbcr2d.h|0;
    var ret = new Uint8ClampedArray(w * h * 3);
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var ofs = 3 * (y * w + x) |0;
            var Y = ycbcr[ofs + 0 |0];
            var Cb = ycbcr[ofs + 1|0] - 128 |0, Cr = ycbcr[ofs + 2|0] - 128 |0;
            ret[ofs + 0|0] = Y                + 1.40200 * Cr;
            ret[ofs + 1|0] = Y - 0.34414 * Cb - 0.71414 * Cr;
            ret[ofs + 2|0] = Y + 1.77200 * Cb;
        }
    }
    return {a: ret, alpha: ycbcr2d.alpha, w: w, h: h};
};

var resize2x = function (color3bmp2d) {
    "use strict";
    var color3bmp = color3bmp2d.a, w = color3bmp2d.w|0, h = color3bmp2d.h|0;
    var rw = 2 * w|0, rh = 2 * h|0;
    var r = new Uint8ClampedArray(rw * rh * 3);
    var alpha = new Uint8ClampedArray(rw * rh);
    for (var y = 0; y < rh; y++) {
        for (var x = 0; x < rw; x++) {
            var i = y * rw + x |0;
            var hi = (y >> 1) * w + (x >> 1) |0; // nearest
            //var hi = (y % h) * w + (x % w); // loop 
            r[3 * i + 0 |0] = color3bmp[3 * hi + 0 |0];
            r[3 * i + 1 |0] = color3bmp[3 * hi + 1 |0];
            r[3 * i + 2 |0] = color3bmp[3 * hi + 2 |0];
            alpha[i] = color3bmp2d.alpha ? color3bmp2d.alpha[hi] : 255;
        }
    }
    return {a: r, alpha: alpha, w: rw, h: rh};
};

var getColors = function (color3bmp2d, index) {
    "use strict";
    var color3bmp = color3bmp2d.a, w = color3bmp2d.w|0, h = color3bmp2d.h|0;
    var r = new Uint8ClampedArray(4 * w * h);
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var i = y * w + x |0;
            r[i] = color3bmp[3 * i + index |0];
        }
    }
    return r;
};
var setColors = function (color3bmp2d, index, colors) {
    "use strict";
    var color3bmp = color3bmp2d.a, w = color3bmp2d.w|0, h = color3bmp2d.h|0;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var i = y * w + x |0;
            color3bmp[3 * i + index|0] = colors[i];
        }
    }
    return color3bmp2d;
};
