"use strict";

self.importScripts("convolve.js");

var sumConvolve = sumConvolve3x3sEx8;
if (typeof SIMD === "object") sumConvolve = sumConvolve3x3sExSIMD;
self.addEventListener("message", function (ev) {
    var planes = ev.data.planes, weight = ev.data.weight, bias = ev.data.bias;
    var next = sumConvolve(planes, weight);
    for (var i = 0, na = next.a, l = na.length|0; i < l; i++) {
        var v = na[i] + bias;
        na[i] = v < 0 ? 0.1 * v : v;
    }
    self.postMessage({next: next, i: ev.data.i});
}, false);
