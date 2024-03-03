(function () {
    
        /****************
         * OSC Over UDP *
         ****************/

        // コピペ
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
    
        // UDPポートの設定
        var udpPort = new osc.UDPPort({
            localAddress: "0.0.0.0",
            localPort: 57121,
            remoteAddress: "127.0.0.1",
            remotePort: 9000 // OSC Data Monitor の待ち受けポート番号
        });
        
        // コピペ
        udpPort.on("ready", function () {
            var ipAddresses = getIPAddresses(),
                addressPortStrings = [];
    
            ipAddresses.forEach(function (address) {
                addressPortStrings.push(address + ":" + udpPort.options.localPort);
            });
            
        });
        
        udpPort.on("error", function (err) {
            throw new Error(err);
        });
        
        udpPort.open();
    
    
        //映像取得
    
        // カメラから映像を取得するためのvideo要素
        const videoElem = document.createElement("video");
        // スタート・ストップボタン
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
            oscmsg = null //kill
        }
    

        //画像処理


        // OSCメッセージの準備
        // addressとargs.valueは後に書き換えられる
        let oscmsg = {
            address: `/pluginname/debug`,
            args: [{ type:"i", value: 0 }]
        }
    
        function main() {
            
            // 画像処理用のオフスクリーンCanvas
            const offscreen = document.createElement("canvas");
            const offscreenCtx = offscreen.getContext("2d");

            // streamの読み込み完了
            videoElem.onloadedmetadata = () => {
    
                //video.play();
                videoElem.play();
                
                // Canvasのサイズを合わせる
                videoElem.width = offscreen.width = 256
                videoElem.height = offscreen.height = 144
                
                setInterval(() => {

                      // カメラの映像をCanvasに描画する
                      offscreenCtx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
                    
                      // イメージデータを取得する（[r,g,b,a,r,g,b,a,...]のように1次元配列で取得できる）
                      const imageData = offscreenCtx.getImageData(0, 0, offscreen.width, offscreen.height);

                      // OSCを送信する
                      oscsenderfunction(imageData.data)
                    
                }, 1000);
            };
            
            // OSC送信の関数
            function oscsenderfunction(data) {

                //一度に4pxのデータを送る
                for (let i = 0, lt = 0; i < data.length; i += 16, lt++) {
                    
                    oscmsg["address"] = `/pluginname/${lt}`

                    //int型への変換
                    oscmsg.args["value"] = parseInt(
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

                    //OSC送信
                    udpPort.send(oscmsg)

                }
            }
        }
          
         main();
         
}());
