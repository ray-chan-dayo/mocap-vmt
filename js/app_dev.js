(function () {

    
    let oscmsg = {
        address: null,
        args: [{ type:"i", value: null }]
    }
/*
    document.getElementById("kill").addEventListener("click", function (evt) {
        oscmsg = null
    }, false);*/
//カッコは即時関数
/*
    var oscMessageListener = function (oscMessage) {
        example.mapOSCToSynth(oscMessage, example.synth, example.synthValueMap);
        $("#message").text(fluid.prettyPrintJSON(oscMessage));
    };

    /****************
     * OSC Over UDP *
     ****************/

    var getIPAddresses = function () {
        var ipAddresses = [];
        chrome.system.network.getNetworkInterfaces(function (interfaces) {
            interfaces.forEach(function (iface) {
                if (iface.prefixLength === 24) {
                    ipAddresses.push(iface.address);
                }
            });
        });

        return ipAddresses;
    };

    // Also bind to a UDP socket.
    var udpPort = new osc.UDPPort({
        localAddress: "0.0.0.0",
        localPort: 57121,
        remoteAddress: "127.0.0.1",
        remotePort: 9000 // OSC Data Monitor の待ち受けポート番号
    });

    udpPort.on("ready", function () {
        var ipAddresses = getIPAddresses(),
            addressPortStrings = [];

        ipAddresses.forEach(function (address) {
            addressPortStrings.push(address + ":" + udpPort.options.localPort);
        });

        //$("#udpStatus").append("<div>UDP: <span>" + addressPortStrings.join(",") + "</span></div>");
        
    });

    //udpPort.on("message", oscMessageListener);
    udpPort.on("error", function (err) {
        throw new Error(err);
    });
    
    udpPort.open();





    //const videoElem = document.getElementById("video");
    const videoElem = document.createElement("video");
    const startElem = document.getElementById("start");
    const stopElem = document.getElementById("stop");

    // Options for getDisplayMedia()
    var displayMediaOptions = {
        video: {
            cursor: "always"
        },
        audio: false
    };

    // Set event listeners for the start and stop buttons
    startElem.addEventListener("click", function (evt) {
        startCapture();
    }, false);

    stopElem.addEventListener("click", function (evt) {
        stopCapture();
        oscmsg = null //kill
    }, false);

    async function startCapture() {
        try {
            videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        } catch (err) {
            console.error("Error: " + err);
        }
    }

    function stopCapture(evt) {
        let tracks = videoElem.srcObject.getTracks();

        tracks.forEach(track => track.stop());
        videoElem.srcObject = null;
    }

        
    /*const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    setInterval(() => {
        if (canvas && ctx){
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            let imagedata = ctx.getImageData(1, 1, 1, 1);
        }
    }, 20);*/
    







    //画像処理

    /*async */function main() {
        /*
        // 表示用のCanvas
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        // 画像処理用のオフスクリーンCanvas
        const offscreen = document.createElement("canvas");
        const offscreenCtx = offscreen.getContext("2d");
        // カメラから映像を取得するためのvideo要素
        const video = document.createElement("video");
      
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      
        video.srcObject = stream;*/
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const offscreen = document.createElement("canvas");
        const offscreenCtx = offscreen.getContext("2d");
        // streamの読み込み完了
        //video.onloadedmetadata = () => {

        videoElem.onloadedmetadata = () => {

            //video.play();
            videoElem.play();
            
            // Canvasのサイズを映像に合わせる
            //offscreen.width = videoElem.videoWidth;
            //offscreen.height = videoElem.videoHeight;
            videoElem.width = offscreen.width = 256
            videoElem.height = offscreen.height = 144
            
            //tick();
            setInterval(() => {
                /*
                if (canvas && ctx){
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    let imagedata = ctx.getImageData(1, 1, 1, 1);
                    }*/
                // 1フレームごとに呼び出される処理
                //function tick() {
                  // カメラの映像をCanvasに描画する
                  offscreenCtx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
                
                  // イメージデータを取得する（[r,g,b,a,r,g,b,a,...]のように1次元配列で取得できる）
                  const imageData = offscreenCtx.getImageData(0, 0, offscreen.width, offscreen.height);
                  // imageData.dataはreadonlyなのでfilterメソッドで直接書き換える
                  filter(imageData.data);
                
                  // オフスクリーンCanvasを更新する
                  //offscreenCtx.putImageData(imageData, 0, 0);
                
                  // 表示用Canvasに描画する
                  //ctx.drawImage(offscreen, 0, 0);
                
                  //console.log("framecall")
                  // 次フレームを処理する
                  //window.requestAnimationFrame(tick);
                //}
                
            }, 1000);
        };
        
        function filter(data) {
            /*
            let oscmsg = {
                address: "/a",
                args: []
            }*/
            let lt = 0
            //let tmp
            for (let i = 0; i < data.length; i += 16) {
                // (r+g+b)/3
                /*
                const color = (data[i] + data[i+1] + data[i+2]) / 3;
                data[i] = data[i+1] = data[i+2] = color
                getint32
                */

                const temp = parseInt(
                //tmp = parseInt(
                    data[i].toString(2).substring(0,3)
                    + data[i+1].toString(2).substring(0,3)
                    + data[i+2].toString(2).substring(0,2)
    
                    + data[i+4].toString(2).substring(0,3)
                    + data[i+5].toString(2).substring(0,3)
                    + data[i+6].toString(2).substring(0,2)
    
                    + data[i+8].toString(2).substring(0,3)
                    + data[i+9].toString(2).substring(0,3)
                    + data[i+10].toString(2).substring(0,2)
    
                    + data[i+12].toString(2).substring(0,3)
                    + data[i+13].toString(2).substring(0,3)
                    + data[i+14].toString(2).substring(0,2)
                ,2)-2147483648

                oscmsg["address"] = `/pluginname/${lt}`
                oscmsg.args["value"] = temp

                //oscmsg.args[lt] = { type:"i", value: temp };
                //tempaddress = `/${lt}`
                
                udpPort.send(oscmsg)
                lt++
            }//endfor
            /*console.log(oscmsg)
            udpPort.send(oscmsg)
            let dbgoscmsg = {
                address: "/b",
                args: [{ type:"i", value: 0 }]
            }
            udpPort.send(dbgoscmsg)*/
            //window.requestAnimationFrame(tick);
        }
    }
      
      main();


/*
    window.onunload = function () {
       oscmsg = null
       //return false
    }*/
}());
/*

data.args[array.length] = { type:"f", value: 443 };

*/