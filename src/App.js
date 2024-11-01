import "./styles.css";
import { Canvas } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { ThemeControls } from './components/ThemeControls';
import { Scene } from './components/Scene';

export default function App() {
  const [modelUrl, setModelUrl] = useState(null)
  const [modelType, setModelType] = useState(null)
  const [theme, setTheme] = useState('dark')
  const [isAscii, setIsAscii] = useState(true)

  const themes = {
    dark: {
      background: 'black'
    },
    light: {
      background: 'white'
    }
  }

  useEffect(() => {
    console.log('Theme changed to:', theme)
  }, [theme])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const type = file.name.split('.').pop().toLowerCase()
      console.log('File uploaded:', { 
        name: file.name, 
        type: type, 
        url: url 
      })
      setModelUrl(url)
      setModelType(type)
    }
  }

  const toggleAscii = () => {
    setIsAscii(prev => !prev)
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Toggle Button */}
      <button 
        onClick={toggleAscii}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '8px 12px',
          background: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 2  // Increased z-index to ensure it stays above the ASCII canvas
        }}
      >
        {isAscii ? 'Switch to Normal' : 'Switch to ASCII'}
      </button>

      {/* Theme and File Controls */}
      <ThemeControls theme={theme} setTheme={setTheme} handleFileUpload={handleFileUpload} />
      
      {/* Three.js Canvas */}
      <Canvas 
        camera={{ 
          position: [0, 2, 5],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true
        }}
        style={{
          width: '100%',
          height: '100vh'
        }}
      >
        <Scene 
          modelUrl={modelUrl}
          modelType={modelType}
          theme={theme}
          themes={themes}
          isAscii={isAscii} // Pass the state to control ASCII rendering
        />
      </Canvas>
    </div>
  );
}
