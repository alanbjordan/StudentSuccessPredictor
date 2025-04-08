// src/components/UploadCard/DataPreview.jsx
import React from 'react';

const DataPreview = ({ data }) => {
  if (!data) return <div>No data available.</div>;

  // If the data is an array (as often a preview returns rows),
  // we iterate and show each record in its own box
  if (Array.isArray(data)) {
    return (
      <div>
        {data.map((item, index) => (
          <div key={index} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px', paddingBottom: '5px' }}>
            {Object.entries(item).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // If it's an object, just show its entries
  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '8px' }}>
          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString()}
        </div>
      ))}
    </div>
  );
};

export default DataPreview;
