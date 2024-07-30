import { BrowserQRCodeReader } from '@zxing/browser';

document.addEventListener("DOMContentLoaded", function() {
    console.log("Document loaded, initializing...");
    initialize();
});

async function initialize() {
    console.log("Initializing...");
    const button = document.getElementById('captureBarcode');
    button.addEventListener("click", () => {
        console.log("Capture button clicked");
        captureFrame();
    });

    try {
        const codeReader = new BrowserQRCodeReader();
        console.log("ZXing code reader initialized");

        const videoInputDevices = codeReader.listVideoInputDevices();
        console.log("Video input devices:", videoInputDevices);

        if (videoInputDevices.length === 0) {
            console.error("No video input devices found");
            return;
        }

        const selectedDeviceId = videoInputDevices[0].deviceId;
        console.log(`Started decode from camera with id ${selectedDeviceId}`);

        const previewElem = document.querySelector('#test-area-qr-code-webcam > video');
        if (!previewElem) {
            console.error("Preview element not found");
            return;
        }

        const videoArea = document.getElementById('videoPreviewArea');
        if (!videoArea) {
            console.error("Video preview area not found");
            return;
        }

        videoArea.appendChild(previewElem);
        console.log("Preview element added to video area");

    } catch (error) {
        console.error("Error initializing ZXing:", error);
    }
}

function submitForm(event) {
    event.preventDefault();
    console.log("Submit form event triggered");

    let quantity = document.getElementById('quantity').value;
    quantity = quantity || 1;
    console.log("Quantity:", quantity);

    const formData = {
        quantity: quantity
    };

    const formDataSubmission = JSON.stringify(formData);
    console.log("Form data submission:", formDataSubmission);

    axios.put("/api/medications", formDataSubmission, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response:', response.data);
        const medicineinfo = document.getElementById("medicineId");
        medicineinfo.innerHTML = response.data.id;
        const medicineName = document.getElementById("medicineName");
        medicineName.innerHTML = response.data.name;
        const medicineQuantity = document.getElementById("drugQuantity");
        medicineQuantity.innerHTML = response.data.supply;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function submitNewMedicationForm(event) {
    event.preventDefault();
    console.log("Submit new medication form event triggered");

    const name = document.getElementById('name').value;
    let quantity = document.getElementById('quantity').value;
    quantity = quantity || 1;
    console.log("Name:", name, "Quantity:", quantity);

    const formData = {
        name: name,
        quantity: quantity
    };

    const formDataSubmission = JSON.stringify(formData);
    console.log("Form data submission:", formDataSubmission);

    axios.post("/api/medications", formDataSubmission, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response:', response.data);
        const medicineIdArea = document.getElementById("medicineId");
        medicineIdArea.innerHTML = response.data.id;
        const medicineName = document.getElementById("medicineName");
        medicineName.innerHTML = response.data.name;
        const medicineQuantity = document.getElementById("medicineQuantity");
        medicineQuantity.innerHTML = response.data.quantity;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function captureFrame(codeReader) {
    console.log("Capturing frame...");
    const source = document.getElementById('videoPreviewArea').childNodes[0];
    if (!source) {
        console.error("Source element not found");
        return;
    }
    
    try {
        const result = codeReader.decodeFromVideoUrl(source);
        console.log("Capture frame result:", result);
        return result;
    } catch (error) {
        console.error("Error capturing frame:", error);
    }
}

function handleResponse(response) {
    console.log("Handling response:", response);
    const formArea = document.getElementById("drugCreationForm");
    formArea.innerHTML = '';

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.id = 'quantity';
    quantityInput.placeholder = 'Enter amount (negative to subtract)';
    formArea.appendChild(quantityInput);

    if (response.data == null) {
        console.log("Response data is null, creating new medication form");

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = 'name';
        nameInput.placeholder = 'Enter drug name';
        formArea.appendChild(nameInput);

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit';
        formArea.appendChild(submitButton);

        formArea.addEventListener('submit', submitNewMedicationForm);
    } else {
        console.log("Response data found, updating existing medication");

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
    console.error("Handling error:", error);
    if (error.response && error.response.status === 404) {
        console.log("Drug not found in database. It hasn't been created yet.");
    } else {
        console.error('Error:', error);
    }
}
