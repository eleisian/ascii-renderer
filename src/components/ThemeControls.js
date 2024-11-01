export function ThemeControls({ theme, setTheme, handleFileUpload }) {
  const handleThemeChange = (newTheme) => {
    console.log('Changing theme to:', newTheme)
    setTheme(newTheme)
  }

  return (
    <div className="controls">
      <input
        className="file-input"
        type="file"
        accept=".glb,.gltf,.fbx,.obj"
        onChange={handleFileUpload}
      />
      <button 
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => handleThemeChange('dark')}
      >
        Dark Mode
      </button>
      <button 
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => handleThemeChange('light')}
      >
        Light Mode
      </button>
    </div>
  )
}