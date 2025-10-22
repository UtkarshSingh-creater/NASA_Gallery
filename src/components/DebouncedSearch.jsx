import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce'; 
import { useImageContext } from '../context/ImageContext';

const DebouncedSearch = () => {
  const { searchTerm: contextSearchTerm, handleSearchInput } = useImageContext();
  
  const [query, setQuery] = useState(contextSearchTerm);
  const debouncedQuery = useDebounce(query, 500); 

  useEffect(() => {
    if (query !== contextSearchTerm) {
        setQuery(contextSearchTerm);
    }
  }, [contextSearchTerm]);

  useEffect(() => {
    if (debouncedQuery !== contextSearchTerm) {
      handleSearchInput(debouncedQuery); 
    }
  }, [debouncedQuery, contextSearchTerm, handleSearchInput]);

  return (
    <div style={{ marginBottom: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder="Search for missions, planets, or telescopes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default DebouncedSearch;
