import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchNasaImages } from '../api/NasaApi';

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('space'); 
    const [inputSearchTerm, setInputSearchTerm] = useState('space');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const loadImages = useCallback(async (query, pageNum = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchNasaImages(query, pageNum);
            setImages(data.images);
            setTotalPages(data.total_pages);
            setPage(pageNum);
            setSearchTerm(query);
            setIsInitialLoad(false);
        } catch (err) {
            console.error("Image loading failed:", err);
            setError('Failed to fetch images from NASA. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadImages(searchTerm, 1);
    }, [loadImages]);

    const handleSearchInput = (newQuery) => {
        if (newQuery !== inputSearchTerm) {
            setInputSearchTerm(newQuery); 
            setPage(1);
            loadImages(newQuery, 1);
        }
    };
    
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
            setPage(newPage);
            loadImages(searchTerm, newPage); 
            window.scrollTo(0, 0); 
        }
    };

    const contextValue = {
        images,
        loading,
        error,
        inputSearchTerm,
        currentQuery: searchTerm,
        page,
        totalPages,
        isInitialLoad,
        handleSearchInput, 
        handlePageChange,
    };

    return (
        <ImageContext.Provider value={contextValue}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImageContext = () => useContext(ImageContext);
