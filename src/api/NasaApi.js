const BASE_URL = 'https://images-api.nasa.gov';

export const fetchNasaImages = async (query = 'space', page = 1) => {
    const params = new URLSearchParams({
        q: query,
        media_type: 'image',
        page: page,
    });
    const url = `${BASE_URL}/search?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    const items = data.collection.items || [];
    
    const images = items.map(item => {
        const itemData = item.data?.[0];
        const thumbnailUrl = item.links?.find(l => 
            l.rel === 'preview' || l.rel === 'media' || l.rel === 'asset'
        )?.href || item.links?.[0]?.href;

        return {
            nasa_id: itemData?.nasa_id ?? item.href.split('/').pop(),
            title: itemData?.title ?? 'Untitled NASA Image',
            description: itemData?.description ?? 'No description available.',
            date_created: itemData?.date_created,
            thumbnail_url: thumbnailUrl,
            href: item.href, 
        };
    });

    return {
        images,
        total_pages: data.collection.metadata.total_hits 
            ? Math.ceil(data.collection.metadata.total_hits / 100) 
            : 1 
    };
};

export const fetchImageDetail = async (nasaId) => {
    const searchResponse = await fetch(`${BASE_URL}/search?nasa_id=${nasaId}`);
    if (!searchResponse.ok) throw new Error('Failed to fetch details');
    const searchData = await searchResponse.json();
    const item = searchData.collection.items?.[0];

    if (!item) throw new Error('Image not found');

    const itemData = item.data?.[0];

    const mainDetails = {
        nasa_id: itemData?.nasa_id,
        title: itemData?.title,
        description: itemData?.description,
        date_created: itemData?.date_created,
        center: itemData?.center,
        keywords: itemData?.keywords,
        display_url: item.links?.find(l => l.rel === 'preview')?.href,
    };

    let downloadUrl = null;
    try {
        const assetResponse = await fetch(`${BASE_URL}/asset/${nasaId}`);
        if (!assetResponse.ok) throw new Error('Asset fetch failed');
        const assetData = await assetResponse.json();
        
        const assetItems = assetData.collection.items;
        
        const originalLink = assetItems.find(l => 
            l.href.endsWith('orig.jpg') || 
            l.href.includes('large') || 
            l.href.endsWith('.tiff') ||
            l.href.endsWith('.tif')
        )?.href;

        downloadUrl = originalLink || assetItems.find(l => 
            l.href.endsWith('.jpg') || 
            l.href.endsWith('.png')
        )?.href;

    } catch (e) {
        console.warn(`Could not fetch asset details for ${nasaId}:`, e);
    }

    return { 
        ...mainDetails, 
        download_url: downloadUrl
    };
};
