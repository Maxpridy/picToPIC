// translated from https://marcan.st/transf/waifu2x.py
var waifu2x = function (rgb2d, model, callback) {
    "use strict";
    callback = callback || function (progress, count) {};
    //return rgb2d;
    //return resize2x(rgb2d);
    var ycbcr2d = rgb2ycbcr(rgb2d);
    //return ycbcr2d;
    //return ycbcr2rgb(ycbcr2d);
    var ycbcr2d2x = resize2x(ycbcr2d);
    //return ycbcr2rgb(ycbcr2d2x);
    var ysU8 = getColors(ycbcr2d2x, 0);
    //setColors(ycbcr2d2x, 0, ysU8);
    //return ycbcr2rgb(ycbcr2d2x);
    var ys = mulTo(new Float32Array(ysU8), 1/255);
    //setColors(ycbcr2d2x, 0, new Uint8ClampedArray(mulTo(ys, 255)));
    //return ycbcr2rgb(ycbcr2d2x);
    var padYs = edgePad({a: ys, w: ycbcr2d2x.w, h: ycbcr2d2x.h}, model.length);
    
    var count = model.reduce(function (sum, step) {
        return sum + step.nInputPlane * step.nOutputPlane;
    }, 0);
    var progress = 0;

    //var sumConvolve = sumConvolve3x3s;
    //var sumConvolve = sumConvolve3x3sEx;
    var sumConvolve = sumConvolve3x3sEx8;
    if (typeof SIMD === "object") sumConvolve = sumConvolve3x3sExSIMD;
    var finished = model.reduce(function (planes, step) {
        return step.bias.map(function (bias, index) {
            // [NOTE] specialized 3x3 convolutions addition
            var next = sumConvolve(planes, step.weight[index|0]);
            for (var i = 0, na = next.a, l = na.length|0; i < l; i++) {
                var v = na[i] + bias;
                na[i] = v < 0 ? 0.1 * v : v;
            }
            progress += planes.length;
            callback(progress, count);
            return next;
        });
    }, [padYs]);
    setColors(ycbcr2d2x, 0, new Uint8ClampedArray(mulTo(finished[0].a, 255)));
    return ycbcr2rgb(ycbcr2d2x);
};

// TypedArray utility
var mulTo = function (a, v) {
    "use strict";
    for (var i = 0, l = a.length|0; i < l; i++) a[i] *= v;
    return a;
};
