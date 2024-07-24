document.addEventListener("DOMContentLoaded", function() {
    initialize();
});

function initialize() {
    console.log("initializing js");
    const video = document.getElementById("video");
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const button = document.getElementById('captureBarcode');
    button.addEventListener("click", () => {
        captureFrame(ctx, canvas, video);
    });

    const constraints = {
        audio: false,
        video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
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

function submitForm(event) {
    event.preventDefault();
    let quantity = document.getElementById('quantity').value;
    quantity = quantity || 1;

    const formData = {
        quantity: quantity
    };

    const formDataSubmission = JSON.stringify(formData);
    axios.put("/api/medications", formDataSubmission, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response ', response.data);
        const medicineinfo = document.getElementById("medicineId");
        medicineinfo.innerHTML = response.data.id;
        const medicineName = document.getElementById("medicineName");
        medicineName.innerHTML = response.data.name;
        const medicineQuantity = document.getElementById("drugQuantity");
        medicineQuantity.innerHTML = response.data.supply;
    })
    .catch(error => {
        console.log('Error: ', error);
    });
}

function submitNewMedicationForm(event){
    event.preventDefault();
    const name = document.getElementById('name').value;
    let quantity = document.getElementById('quantity').value;
    quantity = quantity || 1;

    const formData = {
        name: name,
        quantity: quantity
    };

    const formDataSubmission = JSON.stringify(formData);
    axios.post("/api/medications", formDataSubmission, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response ', response.data);
        const medicineIdArea = document.getElementById("medicineId");
        medicineIdArea.innerHTML = response.data.id;
        const medicineName = document.getElementById("medicineName");
        medicineName.innerHTML = response.data.name;
        const medicineQuantity = document.getElementById("medicineQuantity");
        medicineQuantity.innerHTML = response.data.quantity;
    })
    .catch(error => {
        console.log('Error: ', error);
    });
}

function captureFrame(ctx, canvas, video) {
    const barcodeDetector = new BarcodeDetector({
        formats: ["code_39", "codabar", "ean_13"],
    });

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    barcodeDetector
        .detect(imageData)
        .then((barcodes) => {
            if (barcodes.length > 0) {
                axios.get(`/api/medications/${barcodes[0].rawValue}`)
                .then(response => handleResponse(response))
                .catch(error => handleError(error));
            }
        });
}

function handleResponse(response) {
    const formArea = document.getElementById("drugCreationForm");
    formArea.innerHTML = ''; 

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.id = 'quantity';
    quantityInput.placeholder = 'Enter amount (negative to subtract)';

    if (response.data == null) {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'name';
        nameInput.placeholder = 'Enter drug name';

        formArea.appendChild(nameInput);
        formArea.appendChild(quantityInput);

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit';
        formArea.appendChild(submitButton);

        formArea.addEventListener('submit', submitNewMedicationForm);
    } else {
        formArea.appendChild(quantityInput);
        const medicineIdArea = document.getElementById("medicineId");
        medicineIdArea.innerHTML = response.data.id;
        const medicineName = document.getElementById("medicineName");
        medicineName.innerHTML = response.data.name;
        const medicineQuantity = document.getElementById("medicineQuantity");
        medicineQuantity.innerHTML = response.data.quantity;
        formArea.addEventListener('submit', submitForm);
    }
}

function handleError(error) {
    if (error.response && error.response.status === 404) {
        console.log("Drug not found in database. It hasn't been created yet.");
    } else {
        console.error('Error: ', error);
    }
}