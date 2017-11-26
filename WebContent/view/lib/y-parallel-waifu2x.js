// [FYI] Processing convolutions in sub workers
// NOTE1: It is slower than the single worker version on firefox
// NOTE2: Sub Worker(use "Worker" in Woker thread) not yet supported on Chrome
var waifu2x = function (rgb2d, model, callback) {
    "use strict";
    callback = callback || function (progress, count) {};
    var ycbcr2d = rgb2ycbcr(rgb2d);
    var ycbcr2d2x = resize2x(ycbcr2d);
    var ysU8 = getColors(ycbcr2d2x, 0);
    var ys = mulTo(new Float32Array(ysU8), 1/255);
    var padYs = edgePad({a: ys, w: ycbcr2d2x.w, h: ycbcr2d2x.h}, model.length);
    
    var count = model.reduce(function (sum, step) {
        return sum + step.nInputPlane * step.nOutputPlane;
    }, 0);
    var progress = 0;
    
    var workerSize = 3;
    var workers = [];
    for (var i = 0; i < workerSize; i++) {
        workers.push(new Worker("y-parallel-sub.js"));
    }
    
    var steps = model.slice();
    return Promise.all([padYs]).then(function doStep(planes) {
        var step = steps.shift();
        if (!step) return planes;
        
        return new Promise(function (f, r) {
            var nexts = new Array(step.bias.length);
            var accepts = 0;
            var handler = function (ev) {
                nexts[ev.data.i] = ev.data.next;
                accepts++;
                progress += planes.length;
                callback(progress, count);
                if (accepts === step.bias.length) {
                    workers.forEach(function (w) {
                        w.removeEventListener("message", handler, false);
                        w.removeEventListener("error", r, false);
                    });
                    f(nexts);
                }
            };
            workers.forEach(function (w) {
                w.addEventListener("message", handler, false);
                w.addEventListener("error", r, false);
            });
            for (var i = 0; i < step.bias.length; i++) {
                var bias = step.bias[i], weight = step.weight[i];
                workers[i % workerSize].postMessage({
                    planes: planes, bias: bias, weight: weight, i: i});
            }
        }).then(doStep);
    }).then(function (finished) {
        setColors(ycbcr2d2x, 0,
                  new Uint8ClampedArray(mulTo(finished[0].a, 255)));
        workers.forEach(function (w) {w.terminate();});
        return ycbcr2rgb(ycbcr2d2x);
    });
};

// TypedArray utility
var mulTo = function (a, v) {
    "use strict";
    for (var i = 0, l = a.length|0; i < l; i++) a[i] *= v;
    return a;
};
