import React, { useState, useEffect } from 'react';
import { BrowserQRCodeReader, NotFoundException, ChecksumException, FormatException } from '@zxing/library';

const App = () => {
  const [result, setResult] = useState('');
  const codeReader = new BrowserQRCodeReader();

  useEffect(() => {
    let selectedDeviceId = '';

    codeReader.getVideoInputDevices()
      .then((devices) => {
        if (devices.length > 0) {
          selectedDeviceId = devices[0].deviceId;
          codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
            if (result) {
              setResult(result.text);
            }
            if (err) {
              if (err instanceof NotFoundException) {
                console.log('No QR code found.');
              }
              if (err instanceof ChecksumException) {
                console.log('A code was found, but it\'s read value was not valid.');
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

  return (
    <div>
      <video id="video" width="300" height="200" style={{ border: '1px solid gray' }}></video>
      <div>Result: {result}</div>
    </div>
  );
};

export default App;