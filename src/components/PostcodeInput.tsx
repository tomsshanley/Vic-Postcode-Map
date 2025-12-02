import React, { useState } from 'react';

interface PostcodeInputProps {
    onVisualize: (postcodes: string[]) => void;
    isLoading: boolean;
}

const PostcodeInput: React.FC<PostcodeInputProps> = ({ onVisualize, isLoading }) => {
    const [input, setInput] = useState('');

    const handleVisualize = () => {
        // Split by comma, newline, or space
        const postcodes = input
            .split(/[\n, ]+/)
            .map(p => p.trim())
            .filter(p => /^\d{4}$/.test(p)); // Basic validation for 4 digits

        onVisualize(postcodes);
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-4 h-full">
            <h2 className="text-xl font-bold text-gray-800">Victorian Postcodes</h2>
            <p className="text-sm text-gray-600">Enter postcodes separated by commas, spaces, or newlines.</p>
            <textarea
                className="flex-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="e.g. 3000, 3001, 3121"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button
                onClick={handleVisualize}
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
                {isLoading ? 'Loading...' : 'Visualize'}
            </button>
        </div>
    );
};

export default PostcodeInput;
