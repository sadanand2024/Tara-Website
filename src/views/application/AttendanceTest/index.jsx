import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const FaceAttendance = () => {
  const webcamRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [matchStatus, setMatchStatus] = useState('');
  const [location, setLocation] = useState(null);
  const [webcamReady, setWebcamReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const captureDescriptor = async () => {
    if (!webcamReady) {
      alert('Webcam is not ready yet. Please wait.');
      return;
    }
    const screenshot = webcamRef.current?.getScreenshot?.();
    if (!screenshot) {
      alert('Screenshot failed. Is your webcam working?');
      return;
    }

    try {
      const img = await faceapi.fetchImage(screenshot);
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

      if (detection) {
        setFaceDescriptor(detection.descriptor);
        alert('Face registered. Try matching.');
      } else {
        alert('Face not detected. Try again.');
      }
    } catch (err) {
      console.error('Face detection failed', err);
      alert('Face detection error. Check console.');
    }
  };

  const matchFace = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    const img = await faceapi.fetchImage(screenshot);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      setMatchStatus('Face not detected.');
      return;
    }

    const distance = faceapi.euclideanDistance(detection.descriptor, faceDescriptor);

    setMatchStatus(distance < 0.6 ? '✅ Match!' : '❌ No Match');
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6)
      });
    });
  };

  return (
    <div>
      <h2>Face Attendance (Frontend Only)</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        onUserMedia={() => setWebcamReady(true)}
        onUserMediaError={(err) => {
          console.error('Webcam error:', err);
          alert('Camera access denied or failed.');
        }}
      />
      <br />
      <button onClick={captureDescriptor} disabled={!modelsLoaded}>
        Register Face
      </button>
      <button onClick={matchFace} disabled={!faceDescriptor}>
        Match Face
      </button>
      <button onClick={getLocation}>Get GPS Location</button>
      <h3>{matchStatus}</h3>
      {location && (
        <p>
          📍 Lat: {location.lat}, Lng: {location.lng}
        </p>
      )}
    </div>
  );
};

export default FaceAttendance;
