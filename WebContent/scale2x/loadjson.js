var loadJson = function (url) {
    "use strict";
    return new Promise(function (f, r) {
        if (typeof XMLHttpRequest === "function") {
            var req = new XMLHttpRequest();
            req.addEventListener("error", function (ev) {
                r(req.statusText);
            }, false);
            req.addEventListener("load", function (ev) {
                f(req.response);
            }, false);
            req.open("GET", url, true);
            req.responseType = "json";
            req.send();
        } else {
            require("fs").readFile(url, function (err, data) {
                if (err) r(err);
                else f(JSON.parse(data));
            });
        }
    });
};

/*
loadJson("scale2.0x_model.json").then(function (json) {
    console.log(json);
});
*/
