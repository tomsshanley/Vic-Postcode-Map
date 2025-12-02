import { useState } from 'react';
import PostcodeInput from './components/PostcodeInput';
import MapComponent from './components/MapComponent';
import { fetchPostcodeBoundaries, type PostcodeFeatureCollection } from './services/arcgis';

function App() {
  const [geoJsonData, setGeoJsonData] = useState<PostcodeFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVisualize = async (postcodes: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPostcodeBoundaries(postcodes);
      setGeoJsonData(data);
      if (data.features.length === 0) {
        setError('No boundaries found for the provided postcodes.');
      }
    } catch (err) {
      setError('Failed to fetch postcode boundaries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
      <header className="bg-blue-800 text-white p-4 shadow-md z-10">
        <h1 className="text-2xl font-bold">Victorian Postcode Map</h1>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 overflow-y-auto z-10">
          <PostcodeInput onVisualize={handleVisualize} isLoading={isLoading} />
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4 h-full relative z-0">
          <MapComponent data={geoJsonData} />
        </div>
      </main>
    </div>
  );
}

export default App;
