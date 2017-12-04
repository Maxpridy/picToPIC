window.addEventListener("load", function () {
    "use strict";

    var bar = document.getElementById("myProgressbar").ldBar;
    var models = document.getElementById("models");
    var file = document.getElementById("file");

    var source = document.getElementById("source");
    var image2x = document.getElementById("image2x");
    var result = document.getElementById("result");
    var fileresult = document.getElementById("fileresult");
    
    var progress = document.getElementById("progress");
    var time = document.getElementById("time");
    var expected = document.getElementById("expected");

    file.addEventListener("change", function (ev) {
        var imageFile = ev.target.files[0];
        if (!imageFile || !imageFile.type.match("image.*")) return;
        var reader = new FileReader();
        reader.addEventListener("load", function (ev) {
            var url = ev.target.result;
            file.disabled = true;
            models.disabled = true;
            progress.textContent = "loading model: " + models.value + " ...";
            Promise.all([
                loadImage(url), loadJson(models.value)
            ]).then(function (data) {
                runWorker(data[1], data[0]);
            }).catch(function (err) {
                console.log(err);
            });
        }, false);
        reader.readAsDataURL(imageFile);
    }, false);

    var loadImage = function (imageUrl) {
        return new Promise(function (f, r) {
            var src = document.createElement("img");
            src.addEventListener("load", function (ev) {f(src);}, false);
            src.src = imageUrl;
            source.appendChild(src);
        });
    };

    var runWorker = function (model, src) {
        //alert([src.width, src.height]);
        var original = img2rgb(src);
        console.log("image converted", original);
        var scale2x = resize2x(original);
        console.log("scale 2x", scale2x);
        image2x.appendChild(rgb2img(scale2x, "nearest2x"));

        progress.textContent = "initialize worker...";
        var start = Date.now();
        var worker = new Worker("worker.js");
        //var worker = new Worker("y-parallel-worker.js");
        worker.addEventListener("message", function (ev) {
            //console.log(ev.data);
            if (ev.data.msg) {
                console.log(ev.data.msg);
            } else if (ev.data.boot) {
                worker.postMessage({model: model, original: original});
            } else if (ev.data.count) {
                var now = Date.now();
                var spend = now - start;
                var percentage;
                time.textContent = spend/60000 + "m";
                var remain = spend / ev.data.progress *
                    (ev.data.count - ev.data.progress);
                expected.textContent = new Date(now + (0|remain));
                progress.textContent = ev.data.progress + "/" + ev.data.count;
                percentage = ev.data.progress / ev.data.count * 100;
                bar.set(percentage);
            } else if (ev.data.rgb2x) {
                console.log("finished:", ev.data.rgb2x);
                time.textContent = (Date.now() - start)/60000 + "m";
                var img = rgb2img(ev.data.rgb2x, "download");
                result.appendChild(img);
                
                var dataURI = $('#fileid')[0].src;
                var blob = dataURItoBlob(dataURI);
                var formData = new FormData();
                var randomFileName = makeFileName() + ".png";
                formData.append('file', blob, randomFileName);
                
                console.log(img);
                $.ajax({
	                async : true,
	                method : "post",
	                url : '/picToPIC/fileUpload',
	                processData : false, //true : data의 파일형태가 query String으로 전송. false : non-processed data 
	                data : formData,
	                contentType : false, // false : multipart/form-data 형태로 전송되기 위한 옵션값
	                success: function(data) {
	                    console.log("success");
	                },
	                error: function(data) {
	                    console.log("error");
	                    console.log(data);
	                }
                });
                
                bar.set(100);
                worker.terminate();
                file.disabled = false;
                models.disabled = false;
                $('#file').val('');
                
            } else {
                console.log("unknown message", ev.data);
            }
        }, false);
        worker.addEventListener("error", function (ev) {
            console.log(ev);
            worker.terminate();
            file.disabled = false;
            models.disabled = false;
        }, false);
    };

    var img2rgb = function (src) {
        var canvas = document.createElement("canvas");
        canvas.width = src.width, canvas.height = src.height;
        var c2d = canvas.getContext("2d");
        c2d.drawImage(src, 0, 0);
        var image = c2d.getImageData(0, 0, canvas.width, canvas.height);
        var rgb = new Uint8ClampedArray(3 * image.width * image.height);
        var alpha = new Uint8ClampedArray(image.width * image.height);
        for (var y = 0; y < image.height; y++) {
            for (var x = 0; x < image.width; x++) {
                var index = y * image.width + x;
                rgb[3 * index + 0] = image.data[4 * index + 0];
                rgb[3 * index + 1] = image.data[4 * index + 1];
                rgb[3 * index + 2] = image.data[4 * index + 2];
                alpha[index] = image.data[4 * index + 3];
            }
        }
        return {a: rgb, alpha: alpha, w: image.width, h: image.height};
    };

    var rgb2img = function (rgb, name) {
        var canvas = document.createElement("canvas");
        canvas.width = rgb.w, canvas.height = rgb.h;
        var c2d = canvas.getContext("2d");
        var image = c2d.createImageData(canvas.width, canvas.height);
        for (var y = 0; y < image.height; y++) {
            for (var x = 0; x < image.width; x++) {
                var index = y * image.width + x;
                image.data[4 * index + 0] = rgb.a[3 * index + 0];
                image.data[4 * index + 1] = rgb.a[3 * index + 1];
                image.data[4 * index + 2] = rgb.a[3 * index + 2];
                image.data[4 * index + 3] = rgb.alpha ? rgb.alpha[index] : 255;
            }
        }
        c2d.putImageData(image, 0, 0);
        var img = document.createElement("img");
        img.id = "fileid";
        var a = document.createElement("a");
        a.href = img.src = canvas.toDataURL("image/png");
        a.download = name + ".png";
        a.appendChild(img);
        return a;
    };
    
    var dataURItoBlob = function (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }
    
    var makeFileName = function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    
});

