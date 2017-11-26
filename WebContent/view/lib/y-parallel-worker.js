"use strict";
// FYI: waifu2x with convolving on sub workers (but slower than single worker)
self.importScripts("convolve.js", "rgb2yuv.js", "y-parallel-waifu2x.js");

self.postMessage({msg: "script loaded: " + typeof waifu2x});
self.postMessage({msg: "Promise available: " + typeof Promise});

self.addEventListener("message", function (ev) {
    self.postMessage({msg: "data accpeted: " + typeof ev.data});
    var model = ev.data.model, original = ev.data.original;
    waifu2x(original, model, function (progress, count) {
        self.postMessage({progress: progress, count: count});
    }).then(function (rgb2x) {
        self.postMessage({rgb2x: rgb2x});
    }).catch(function (err) {
        self.postMessage({msg: "error: " + err.toString() + "\n" + err.stack});
    })
}, false);
self.postMessage({boot: true});
