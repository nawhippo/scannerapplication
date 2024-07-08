function scanBarCodeFromVideoInput(){
function initialize() {
const video = document.querySelector("video");
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const constraints = {
  audio: false,
  video: true,
};
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    console.log(`Using video device: ${videoTracks[0].label}`);
    //convert source object to the stream outputted by the video device
    video.srcObject = stream;
  })
  .catch((error) => {
      console.error(`getUserMedia error: ${error.name}`, error);
    });
  if (!("BarcodeDetector" in globalThis)) {
    console.log("Barcode Detector is not supported by this browser.");
  } else {
    console.log("Barcode Detector supported!");
    // create new detector
    const barcodeDetector = new barcodeDetector({
      formats: ["code_39", "codabar", "ean_13"],
    });
  }
}

button = Document.getElementById('captureVideo')
button.addEventListener("click", captureFrame);

    function captureFrame(ctx, canvas){
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL('image/jpeg')
    const img = document.createElement('img');
    img.src = imageDataURL;
    document.appendChild(img);
    const frameWidth = 640;
    const frameHeight = 360;
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    video.addEventListener('play', function() {
        const interval = 1000 / 30;
        setInterval(function() {
            ctx.drawImage(video, 0, 0, frameWidth, frameHeight);
            const frameImage = canvas.toDataURL('image/jpeg');
        }, interval);
    })
}};