import React from 'react';
import { useImageContext } from '../context/ImageContext';
import LoadingSpinner from '../components/LoadingSpinner'; 
import DebouncedSearch from '../components/DebouncedSearch';
import ImageCard from '../components/ImageCard'; 
import ErrorMessage from '../components/ErrorMessage'; 
import './Gallery.css'; 

const Gallery = () => {
    const { 
        images, 
        loading, 
        error, 
        currentQuery, 
        page, 
        totalPages, 
        handlePageChange,
        isInitialLoad 
    } = useImageContext();

    const handleNext = () => handlePageChange(page + 1);
    const handlePrev = () => handlePageChange(page - 1);

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (isInitialLoad && loading) {
        return <LoadingSpinner text="Fetching initial NASA images..." />;
    }

    const galleryTitle = currentQuery && currentQuery !== 'space'
        ? `Search Results for "${currentQuery}"` 
        : "Featured NASA Images";
        
    let content;

    if (loading) {
        content = <LoadingSpinner text="Searching for images..." />;
    } else if (images.length === 0) {
        content = <ErrorMessage message={`No results found for "${currentQuery}". Try a different query.`} />;
    } else {
        content = (
            <>
                <div className="image-grid">
                    {images.map(image => (
                        <ImageCard key={image.nasa_id} image={image} />
                    ))}
                </div>
                
                <div className="pagination-controls">
                    <button onClick={handlePrev} disabled={page === 1 || loading} className="pagination-button">
                        &larr; Previous
                    </button>
                    <span className="pagination-info">Page {page} of {totalPages}</span>
                    <button onClick={handleNext} disabled={page >= totalPages || loading} className="pagination-button">
                        Next &rarr;
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="gallery-container">
            <DebouncedSearch />
            <h2 className="gallery-title">{galleryTitle}</h2>
            {content}
        </div>
    );
};

export default Gallery;
