import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { useUserContext } from '../UserContext';
import axios from "axios";

const QRCodeScanner = () => {
    const userContext = useUserContext();
    const videoRef = useRef(null);
    const [drug, setDrug] = useState(null);
    const [scannedCode, setScannedCode] = useState('');
    const [alterationAmount, setAlterationAmount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const codeReader = new BrowserQRCodeReader();
        let selectedDeviceId;

        const initScanner = async () => {
            try {
                const videoInputDevices = await codeReader.listVideoInputDevices();
                if (videoInputDevices.length === 0) {
                    console.error("No video input devices found");
                    return;
                }

                selectedDeviceId = videoInputDevices[0].deviceId;
                codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
                    if (result) {
                        setScannedCode(result.text);
                        getDrug(result.text);
                        codeReader.reset();
                    }
                    if (err) {
                        console.error(err);
                    }
                });
            } catch (error) {
                console.error("Error initializing ZXing:", error);
            }
        };

        initScanner();

        return () => {
            codeReader.reset();
        };
    }, []);

    const changeAlterationAmount = (e) => {
        setAlterationAmount(e.target.value);
    }

    const getDrug = (drugId) => {
        axios.get(`/api/getMedication/${drugId}`)
            .then(response => {
                setDrug(response.data);
            })
            .catch(error => {
                setError("Error fetching drug data: " + error.message);
            });
    }

    const submitDrug = (e) => {
        e.preventDefault();
        if (!scannedCode) {
            setError("No scanned code found");
            return;
        }
        axios.get(`/api/getMedication/${scannedCode}`)
            .then(response => {
                if (!response.data) {
                    axios.post('/api/createMedication', {
                        medicationId: scannedCode,
                        username: userContext.username,
                        quantity: alterationAmount
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response2 => {
                        setDrug(response2.data);
                    })
                    .catch(error => {
                        console.error("Error creating medication: ", error);
                        setError("Error creating medication: " + error.message);
                    });
                } else {
                    setDrug(response.data);
                }
            })
            .catch(error => {
                setError("Error checking medication: " + error.message);
            });
    }

    return (
        <div>
            <h1>QR Code Scanner</h1>
            <video ref={videoRef} style={{ width: '500px' }} />
            {scannedCode ? (
                drug ? (
                    <div>
                        <p>ID: {drug.id}</p>
                        <p>Name: {drug.name}</p>
                        <p>Supply: {drug.supply}</p>
                        <form onSubmit={submitDrug}>
                            <input 
                                type='number' 
                                placeholder='Input Amount (negative to subtract)' 
                                value={alterationAmount}
                                onChange={changeAlterationAmount} 
                            />
                            <button type="submit">Submit Drug</button>
                        </form>
                    </div>
                ) : (
                    <p>Loading drug information...</p>
                )
            ) : (
                <p>Scan a QR Code</p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default QRCodeScanner;