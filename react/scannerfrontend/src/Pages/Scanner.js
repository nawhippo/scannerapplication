import React, { useState, useEffect, useRef } from 'react';
import { NotFoundException, ChecksumException, FormatException, BrowserBarcodeReader } from '@zxing/library';
import axios from 'axios';
import { useUserContext } from "../UserContext";
import beepSound from './sounds/beep.mp3';
const QRCodeScanner = () => {
    const [scannedCode, setScannedCode] = useState('');
    const [alterationAmount, setAlterationAmount] = useState('');
    const [error, setError] = useState('');
    const [drug, setDrug] = useState('');
    const videoRef = useRef(null);
    const user = useUserContext();
    const codeReader = new BrowserBarcodeReader();
    const audioRef = new useRef(null);
    useEffect(() => {
        let selectedDeviceId = '';

        //TODO: color quantization mapping
        codeReader.getVideoInputDevices()
            .then((devices) => {
                if (devices.length > 0) {
                    selectedDeviceId = devices[0].deviceId;
                    codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, videoRef.current, (result, err) => {
                        if (result) {
                            setScannedCode(result.text);
                            audioRef.current.play();
                        }
                        if (err) {
                            if (err instanceof NotFoundException) {
                                console.log('No QR code found.');
                            }
                            if (err instanceof ChecksumException) {
                                console.log('A code was found, but its read value was not valid.');
                            }
                            if (err instanceof FormatException) {
                                console.log('A code was found, but it was in an invalid format.');
                            }
                        }
                    });
                }
            })
            .catch((err) => console.error(err));

        return () => {
            codeReader.reset();
        };
    }, [codeReader]);


    const handleSubmitDrug = async (e) => {
        e.preventDefault();
        if (!scannedCode) {
            setError("No scanned code found");
            return;
        }

        try {
            const response = await axios.get(`/api/getMedication/${scannedCode}`);
            if (response.data) {
                await axios.put('/api/alterMedication', null, {
                    params: {
                        medicationId: scannedCode,
                        quantity: alterationAmount,
                        username: user.username
                    }
                });

                setDrug({ ...response.data, quantity: alterationAmount });
            } else {
                // If medication does not exist, create it
                const response2 = await axios.post('/api/createMedication', {
                    medicationId: scannedCode,
                    quantity: alterationAmount
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setDrug(response2.data);
            }
        } catch (error) {
            setError("Error processing medication: " + error.message);
        }
    };

    const handleAlterationAmountChange = (e) => setAlterationAmount(e.target.value);

    return (
        <div>
            <audioRef ref={audioRef} src={beepSound} />
            {error ? (
                <p>{error}</p>
            ) : (
                null
            )}
            {scannedCode ? (
                <p>Scanned Code: {scannedCode}</p>
            ) : null}

            {drug ? (
                <div className="card">
                    <div className="card-body">
                        <p>ID: {drug.id}</p>
                        <p>Name: {drug.name}</p>
                        <p>Supply: {drug.supply}</p>
                    </div>
                    <form onSubmit={handleSubmitDrug}>
                        <input
                            type="number"
                            placeholder="Input Amount (negative to subtract)"
                            value={alterationAmount}
                            onChange={handleAlterationAmountChange}
                        />
                        <button type="submit">Submit Drug</button>
                    </form>
                </div>
            ) : (
                <p>Loading drug information...</p>
            )}

            <video ref={videoRef} id="video" width="300" height="200" style={{ border: '1px solid gray' }}></video>
        </div>
    )
};

export default QRCodeScanner;
