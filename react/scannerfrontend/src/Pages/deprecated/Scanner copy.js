import React, { useEffect, useRef, useState } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';
import axios from 'axios';

const QRCodeScanner = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null); 
    const [drug, setDrug] = useState(null);
    const [scannedCode, setScannedCode] = useState('');
    const [alterationAmount, setAlterationAmount] = useState('');
    const [error, setError] = useState('');
    const codeReaderRef = useRef(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [isScanning, setIsScanning] = useState(true); // New state to control scanning

    useEffect(() => {
        const init = async () => {
            codeReaderRef.current = new BrowserBarcodeReader();

            try {
                const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
                if (videoInputDevices.length === 0) {
                    console.error("No video input devices found");
                    return;
                }

                const deviceId = videoInputDevices[0].deviceId;
                setSelectedDeviceId(deviceId);

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error initializing ZXing:", error);
                setError("Error initializing camera: " + error.message);
            }
        };

        init();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        const decodeLoop = async () => {
            if (!isScanning) return;

            const canvas = canvasRef.current;
            if (!canvas) {
                console.log("Canvas is not available");
                return;
            }
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.log("Failed to get canvas context");
                return;
            }

            const video = videoRef.current;
            if (!video) {
                console.log('Video reference is not available');
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const image = new Image();
            image.src = canvas.toDataURL('image/png');

            await new Promise((resolve) => {
                image.onload = resolve;
                image.onerror = () => {
                    console.log("Failed to load image from canvas");
                    setError("Failed to process image");
                };
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => {
                    setError("Please Try Again.");
                    reject(new Error('Operation timed out'));
                }, 100) 
            );

            const decodePromise = codeReaderRef.current.decodeFromImage(image);

            try {
                const result = await Promise.race([decodePromise, timeoutPromise]);

                if (result.text && result.text !== scannedCode) {
                    setScannedCode(result.text);
                    // Fetch drug data if scanned code changes
                    axios.get(`/api/getMedication/${result.text}`)
                        .then(response => {
                            setDrug(response.data);
                        })
                        .catch(error => {
                            setError("Error fetching drug data: " + error.message);
                        });
                }
            } catch (err) {
                if (err.message !== 'Operation timed out') {
                    console.error('Error decoding barcode:', err);
                }
            }

            // Continue scanning
            requestAnimationFrame(decodeLoop);
        };

        decodeLoop();

        return () => {
            setIsScanning(false); // Stop scanning when the component unmounts
        };
    }, [scannedCode, isScanning]);

    const changeAlterationAmount = (e) => {
        setAlterationAmount(e.target.value);
    };

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
    };

    return (
        <div>
            <h1>QR Code Scanner</h1>
            <video ref={videoRef} style={{ width: '500px' }} autoPlay />
            <canvas ref={canvasRef} style={{ display: 'none' }} /> 
            
            {scannedCode ? (
                <div>
                    {error ? 
                    <p>{error}</p>
                        :
                    null
                }
                    <p>Scanned Code: {scannedCode}</p>
                    {drug ? (
                        <div className="card">
                            <div className="card-body">
                                <p>ID: {drug.id}</p>
                                <p>Name: {drug.name}</p>
                                <p>Supply: {drug.supply}</p>
                            </div>
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
                    )}
                </div>
            ) : (
                <p>Scanning...</p>
            )}
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default QRCodeScanner;
