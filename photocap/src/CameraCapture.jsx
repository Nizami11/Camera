import React, { useRef, useState, useEffect } from 'react';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captureCount, setCaptureCount] = useState(0);
  const [images, setImages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [filter, setFilter] = useState('none');

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('capturedImages')) || [];
    setImages(storedImages);
    setCaptureCount(storedImages.length);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access was denied or is not available.');
    }
  };

  const captureImage = () => {
    if (!streaming) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');

      const updatedImages = [...images, imageData];
      setImages(updatedImages);
      setCaptureCount(updatedImages.length);
      localStorage.setItem('capturedImages', JSON.stringify(updatedImages));

      uploadToServer(imageData);
    }
  };

  const uploadToServer = async (imageData) => {
    try {
      await fetch('http://localhost:5000/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData }),
      });
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  const clearImages = () => {
    localStorage.removeItem('capturedImages');
    setImages([]);
    setCaptureCount(0);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setBrightness(100);
    setContrast(100);
    setFilter('none');
  };

  const applyStyle = () => {
    return {
      filter: `
        brightness(${brightness}%)
        contrast(${contrast}%)
        ${filter !== 'none' ? filter + '(1)' : ''}
      `,
      border: '1px solid gray',
      borderRadius: '4px',
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📸 My Camera</h2>

      <video
        ref={videoRef}
        width="300"
        height="200"
        autoPlay
        playsInline
        style={{ border: '1px solid black' }}
      />

      <canvas
        ref={canvasRef}
        width="300"
        height="200"
        style={{ display: 'none' }}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={startCamera} style={{ marginRight: '10px' }}>
          Start Camera
        </button>
        <button onClick={captureImage} style={{ marginRight: '10px' }}>
          Capture Image
        </button>
        <button onClick={clearImages} style={{ backgroundColor: 'red', color: 'white' }}>
          Clear Images
        </button>
      </div>

      <p>Images Captured: <strong>{captureCount}</strong></p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {images.map((img, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <img
              src={img}
              alt={`capture-${index}`}
              width="100"
              style={editingIndex === index ? applyStyle() : {
                border: '1px solid gray', borderRadius: '4px'
              }}
            />
            <div># {index + 1}</div>
            <button onClick={() => handleEdit(index)}>Edit</button>
          </div>
        ))}
      </div>

      {editingIndex !== null && (
        <div style={{ marginTop: '20px' }}>
          <h4>Edit Image #{editingIndex + 1}</h4>
          <label>Brightness: </label>
          <input type="range" min="50" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
          <br />
          <label>Contrast: </label>
          <input type="range" min="50" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} />
          <br />
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="none">None</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
