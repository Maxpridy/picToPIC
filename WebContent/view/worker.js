"use strict";

self.importScripts("lib/convolve.js", "lib/rgb2yuv.js", "lib/waifu2x.js");

self.postMessage({msg: "script loaded: " + typeof waifu2x});
self.postMessage({msg: "Promise available: " + typeof Promise});

self.addEventListener("message", function (ev) {
    self.postMessage({msg: "data accpeted: " + typeof ev.data});
    try {
        var model = ev.data.model, original = ev.data.original;
        var rgb2x = waifu2x(original, model, function (progress, count) {
            self.postMessage({progress: progress, count: count});
        });
        self.postMessage({rgb2x: rgb2x});
    } catch (err) {
        self.postMessage({msg: "error: " + err.toString() + "\n" + err.stack});
    }
}, false);
self.postMessage({boot: true});


