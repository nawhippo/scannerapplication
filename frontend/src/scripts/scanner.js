document.addEventListener("DOMContentLoaded", function() {
  initialize();
});

function initialize() {
console.log("initializing js")
const video = document.getElementById("video");
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(hello);
console.log(document.getElementById("test"))
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
  }
}

function submitForm() {
  const name = document.getElementById('name').value;
  const quantity = document.getElementById('quantity').value;

  const FormData = {
    name: name,
    quantity: quantity
  };

  const FormDataSubmission = JSON.stringify(FormData);
  axios.post("", FormDataSubmission, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => 
    console.log(response)
  )


}



    function captureFrame(ctx, canvas, barcodeDetector, video){
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);

    canvas.width = frameWidth;
    canvas.height = frameHeight;
    //barcode detector detects the image grabbed from the video source. 
    barcodeDetector
    .detect(imageData)
    .then((barcodes) => axios.put("localhost:3000", {
      medicationId : barcodes[0].rawValue
    }))
  .then(response => 
    console.log(response)
    if (error.response.status === 404){
      console.log("Drug not found in database. It hasn't been created yet.")
    };
    if (response == null){
        formArea = document.getElementById("drugCreationForm");
        nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'name';
        nameInput.placeholder = 'Enter drug name';
        quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.id = 'quantity';
        formArea.addEventListener('submit', submitForm);
          
    }

}
