document.addEventListener("DOMContentLoaded", function() {
  initialize();
});

function initialize() {
console.log("initializing js")
const video = document.getElementById("video");
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
canvas.fillRect(0, 0, 500, 500);
document.body.appendChild(canvas);
const hello = document.createElement("p");
hello.textContent = "what's good";
document.body.appendChild(hello);
const button = document.getElementById('captureBarcode');

button.addEventListener("click", () => {
captureFrame(ctx, canvas, barcodeDetector, video);
const barcodeDetector = new BarcodeDetector({
  formats: ["code_39", "codabar", "ean_13"],
});
captureFrame(ctx, canvas, barcodeDetector, video);
});

const constraints = {
  audio: false,
  video: true,
};
navigator.mediaDevices.getUserMedia(constraints)
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
  
  }
}


    function captureFrame(ctx, canvas, barcodeDetector, video){
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    //add an image to our html
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    //the barcode detector will then detect the image grabbed from the video source. 
    barcodeDetector
    .detect(imageData)
    .then((barcodes) => axios.put("localhost:3000/", {
      medicationId : barcodes[0].rawValue
    })
  .then(response => 
    console.log(response)
  ))
}

