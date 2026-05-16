import React, { useState, useEffect } from 'react';
import api from '../config/axios';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await api.get('/health');
      setStatus('✅ Connected to backend');
      setBackendData(response.data);
    } catch (error) {
      setStatus('❌ Failed to connect to backend');
      console.error('Connection error:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Backend Connection Status</h3>
      <p className={`${status.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
        {status}
      </p>
      {backendData && (
        <pre className="text-xs text-gray-400 mt-2">
          {JSON.stringify(backendData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ConnectionTest;