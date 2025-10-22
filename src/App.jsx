import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Gallery from './pages/Gallery';
import ImageDetail from './pages/ImageDetail';
import { ImageProvider } from './context/ImageContext';
import './App.css'; 

const App = () => (
    <ImageProvider>
        <Router>
            <header className="app-header">
                <Link to="/" className="app-title-link">
                    <h1 className="app-title">🚀 NASA Image Explorer</h1>
                </Link>
            </header>
            <main className="app-main-content">
                <Routes>
                    <Route path="/" element={<Gallery />} />
                    <Route path="/image/:nasaId" element={<ImageDetail />} /> 
                </Routes>
            </main>
            <footer className="app-footer">
                <p>© 2023 NASA Image Explorer (Data via images-api.nasa.gov)</p>
            </footer>
        </Router>
    </ImageProvider>
);

export default App;