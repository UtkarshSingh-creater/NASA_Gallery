import React from 'react';
import { Link } from 'react-router-dom';
import './ImageCard.css'; 

const ImageCard = ({ image }) => {
    const { 
        nasa_id, 
        title, 
        date_created, 
        center, 
        thumbnail_url 
    } = image;

    const formattedDate = date_created ? new Date(date_created).toLocaleDateString() : 'N/A';

    return (
        <Link to={`/image/${nasa_id}`} className="image-card-link">
            <div className="image-card">
                <div className="card-front">
                    {thumbnail_url ? (
                        <img 
                            src={thumbnail_url} 
                            alt={title} 
                            className="card-image" 
                            onError={(e) => { 
                                console.error("Image failed to load:", thumbnail_url);
                                e.target.onerror = null; 
                                e.target.style.display = 'none';
                            }} 
                        />
                    ) : (
                        <div className="card-image-placeholder">No Image Preview</div>
                    )}
                    <h3 className="card-title">{title}</h3>
                </div>
                <div className="card-back">
                    <h3 className="card-title">{title}</h3>
                    <p className="card-meta">
                        <strong>**Date Taken:**</strong> {formattedDate}
                    </p>
                    <p className="card-meta">
                        <strong>**Center:**</strong> {center || 'NASA'}
                    </p>
                    <div className="card-details-cta">
                        Tap or Click to View Details
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ImageCard;
