import axios from 'axios';

const ARCGIS_API_URL = 'https://services-ap1.arcgis.com/P744lA0wf4LlBZ84/ArcGIS/rest/services/Vicmap_Admin/FeatureServer/14/query';

export interface PostcodeFeature {
    type: 'Feature';
    properties: {
        postcode: string;
        [key: string]: any;
    };
    geometry: {
        type: 'Polygon' | 'MultiPolygon';
        coordinates: any[];
    };
}

export interface PostcodeFeatureCollection {
    type: 'FeatureCollection';
    features: PostcodeFeature[];
}

export const fetchPostcodeBoundaries = async (postcodes: string[]): Promise<PostcodeFeatureCollection> => {
    if (postcodes.length === 0) {
        return { type: 'FeatureCollection', features: [] };
    }

    // Filter out empty strings and duplicates
    const uniquePostcodes = [...new Set(postcodes.filter(p => p.trim() !== ''))];

    if (uniquePostcodes.length === 0) {
        return { type: 'FeatureCollection', features: [] };
    }

    const CHUNK_SIZE = 50;
    const chunks = [];
    for (let i = 0; i < uniquePostcodes.length; i += CHUNK_SIZE) {
        chunks.push(uniquePostcodes.slice(i, i + CHUNK_SIZE));
    }

    try {
        const results = await Promise.all(chunks.map(async (chunk) => {
            // Construct the WHERE clause
            const whereClause = `postcode IN ('${chunk.join("','")}')`;

            const params = new URLSearchParams({
                where: whereClause,
                outFields: 'postcode',
                outSR: '4326', // WGS84 for Leaflet
                f: 'geojson',
            });

            const response = await axios.get(ARCGIS_API_URL, { params });
            return response.data as PostcodeFeatureCollection;
        }));

        // Merge results
        const allFeatures = results.flatMap(result => result.features || []);
        return {
            type: 'FeatureCollection',
            features: allFeatures
        };

    } catch (error) {
        console.error('Error fetching postcode boundaries:', error);
        throw error;
    }
};
