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

  const officeLocation = {
    lat: 17.418236, // Your fixed location
    lng: 78.384777
  };
  const allowedRadiusMeters = 200;

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  const handleAttendance = async () => {
    console.log("sda")
    try {
      const userLocation = await getCurrentLocation();
      const distance = getDistanceFromLatLonInMeters(
        Number(officeLocation.lat),
        Number(officeLocation.lng),
        Number(userLocation.lat),
        Number(userLocation.lng)
      );
      console.log(distance);
      if (distance <= allowedRadiusMeters) {
        alert('✅ You are within allowed area. Marking attendance.');
        // proceed with face capture or submission
      } else {
        alert('❌ You are outside the allowed geofence.');
      }
    } catch (err) {
      alert('Error getting location: ' + err);
      console.log(err);
    }
  };
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

  function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude.toFixed(6),
            lng: pos.coords.longitude.toFixed(6)
          };
          resolve(coords);
        },
        (err) => {
          reject(err.message || 'Location error');
        }
      );
    });
  }
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
      <button onClick={handleAttendance}>Mark Attendance</button>

      <button onClick={captureDescriptor} disabled={!modelsLoaded}>
        Register Face
      </button>
      <button onClick={matchFace} disabled={!faceDescriptor}>
        Match Face
      </button>
      {/* <button onClick={getLocation}>Get GPS Location</button> */}
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
