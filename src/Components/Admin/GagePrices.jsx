// src/components/GagePrices.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

function GagePrices() {
  const [gageTypes, setGageTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch gage types on mount
  useEffect(() => {
    fetchGageTypes();
  }, []);

  const fetchGageTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gage-types/all');
      setGageTypes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching gage types:', err);
      setError('Failed to load gage types. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (gage) => {
    setEditingId(gage.id);
    setEditForm({
      name: gage.name,
      gageSubTypeId: gage.gageSubTypeId,
      description: gage.description || '',
      imageUrl: gage.imageUrl || '',
      cost: gage.cost,
    });
    setMessage({ type: '', text: '' });
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setMessage({ type: '', text: '' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'cost' || name === 'gageSubTypeId' 
        ? (value === '' ? '' : Number(value)) 
        : value
    }));
  };

  // Handle save/update
  const handleSave = async (id) => {
    try {
      setSaveLoading(true);
      setMessage({ type: '', text: '' });

      // Validate required fields
      if (!editForm.name?.trim()) {
        throw new Error('Gage type name is required');
      }
      if (!editForm.gageSubTypeId) {
        throw new Error('Gage sub-type ID is required');
      }

      const response = await api.put(`/gage-types/${id}`, editForm);
      
      // Update local state with updated data
      setGageTypes(prev => 
        prev.map(gage => gage.id === id ? response.data : gage)
      );
      
      setMessage({ type: 'success', text: '✅ Gage type updated successfully!' });
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      console.error('Error updating gage type:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update gage type';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    } finally {
      setSaveLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading gage types...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={fetchGageTypes}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gage Types Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and update gage type pricing and details
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={fetchGageTypes}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub-Type
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gageTypes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="mt-2 font-medium">No gage types found</p>
                      <p className="mt-1">Get started by adding new gage types.</p>
                    </td>
                  </tr>
                ) : (
                  gageTypes.map((gage) => (
                    <tr 
                      key={gage.id} 
                      className={`${
                        editingId === gage.id 
                          ? 'bg-yellow-50' 
                          : 'hover:bg-gray-50 transition-colors'
                      }`}
                    >
                      {editingId === gage.id ? (
                        // Edit Mode Row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {gage.id}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={handleInputChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Gage name"
                              required
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              name="gageSubTypeId"
                              value={editForm.gageSubTypeId}
                              onChange={handleInputChange}
                              className="block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              min="1"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <textarea
                              name="description"
                              value={editForm.description}
                              onChange={handleInputChange}
                              rows="2"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                              placeholder="Description (optional)"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">₹</span>
                              </div>
                              <input
                                type="number"
                                name="cost"
                                value={editForm.cost}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className="block w-28 pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="0.00"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleSave(gage.id)}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {saveLoading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                  </>
                                ) : (
                                  '💾 Save'
                                )}
                              </button>
                              <button
                                onClick={handleCancel}
                                disabled={saveLoading}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View Mode Row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            #{gage.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{gage.name}</div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {gage.gageSubTypeName}
                            </span>
                          </td> */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate" title={gage.description}>
                              {gage.description || <span className="text-gray-400 italic">No description</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="font-semibold text-green-600">
                              {formatCurrency(gage.cost)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(gage)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              ✏️ Edit
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{gageTypes.length}</span> gage type{gageTypes.length !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          💡 Click <strong>Edit</strong> to modify gage details. Changes are saved via PUT request to your API.
        </div>

      </div>
    </div>
  );
}

export default GagePrices;