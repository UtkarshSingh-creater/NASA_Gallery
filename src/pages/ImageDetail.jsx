import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchImageDetail } from '../api/NasaApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './ImageDetail.css'; 

const ImageDetail = () => {
    const { nasaId } = useParams();
    const [imageDetails, setImageDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const details = await fetchImageDetail(nasaId);
                setImageDetails(details);
            } catch (err) {
                setError('Could not load image details. It may not exist or the network is down.');
            } finally {
                setLoading(false);
            }
        };
        getDetails();
    }, [nasaId]);

    const handleDownload = () => {
        if (imageDetails?.download_url) {
            const link = document.createElement('a');
            link.href = imageDetails.download_url;
            const filename = `${imageDetails.nasa_id}_${imageDetails.title?.replace(/\s/g, '_').substring(0, 30) || 'nasa_image'}.jpg`;
            link.setAttribute('download', filename); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert("Download URL not found.");
        }
    };

    if (loading) return <LoadingSpinner text={`Loading details for ID: ${nasaId}...`} />;
    if (error) return <ErrorMessage message={error} />;
    if (!imageDetails) return <ErrorMessage message="No image data available." />;

    const { title, description, date_created, center, keywords, download_url, display_url } = imageDetails;

    const imageSource = display_url || download_url;
    
    return (
        <div className="detail-container">
            <h1 className="detail-title">{title}</h1>

            <div className="detail-content-wrapper">
                
                <div className="detail-image-wrapper">
                    {imageSource ? (
                    <img 
                        src={imageSource} 
                        alt={title} 
                        className="detail-image" 
                    />
                    ) : (
                        <p>Preview image not available.</p>
                    )}
                    
                    <button 
                        onClick={handleDownload} 
                        className="download-button" 
                        disabled={!download_url}
                    >
                        {download_url ? '⬇️ Download High-Res Image' : 'Download Unavailable'}
                    </button>
                </div>

                <div className="detail-info-box">
                    <h3>Description</h3>
                    {/* CRITICAL FIX: Ensure description is safe */}
                    <p>{description || 'No description available for this image.'}</p>
                    
                    <div className="detail-meta">
                        <h3>Metadata</h3>
                        <p><strong>Date Created:</strong> {new Date(date_created).toLocaleDateString()}</p>
                        <p><strong>Center/Agency:</strong> {center || 'N/A'}</p>
                        <p><strong>Keywords:</strong>
                            <span className="keywords">{keywords?.join(', ') || 'N/A'}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageDetail;