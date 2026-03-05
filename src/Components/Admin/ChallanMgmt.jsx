// src/components/ChallanMgmt.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  pdf, 
  Document, 
  Page, 
  Text, 
  View, 
  Image, 
  StyleSheet,
  Font
} from '@react-pdf/renderer';

// API Configuration
const API_BASE = 'http://localhost:8082/api';
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Register fonts for PDF (optional - for better Unicode support)
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2' });

// PDF Document Component
const ChallanPDF = ({ challan }) => {
  const styles = StyleSheet.create({
    page: { 
      padding: 30, 
      fontSize: 10,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 15,
      borderBottom: '2px solid #1e40af',
    },
    logo: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e40af',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5,
      color: '#1f2937',
    },
    subtitle: {
      fontSize: 9,
      textAlign: 'center',
      color: '#6b7280',
      marginBottom: 15,
    },
    infoGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    infoBox: {
      width: '48%',
      marginBottom: 10,
    },
    infoLabel: {
      fontSize: 8,
      color: '#6b7280',
      marginBottom: 2,
      textTransform: 'uppercase',
    },
    infoValue: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#1f2937',
    },
    table: {
      marginTop: 10,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f3f4f6',
      padding: 8,
      borderBottom: '1px solid #e5e7eb',
      fontWeight: 'bold',
      fontSize: 9,
    },
    tableRow: {
      flexDirection: 'row',
      padding: 8,
      borderBottom: '1px solid #e5e7eb',
      fontSize: 9,
    },
    col1: { width: '15%' },
    col2: { width: '20%' },
    col3: { width: '25%' },
    col4: { width: '15%' },
    col5: { width: '15%' },
    col6: { width: '10%', textAlign: 'right' },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      fontSize: 8,
      color: '#9ca3af',
      borderTop: '1px solid #e5e7eb',
      paddingTop: 10,
    },
    barcodeSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 25,
      paddingTop: 15,
      borderTop: '1px dashed #d1d5db',
    },
    barcodeBox: {
      alignItems: 'center',
    },
    barcodeLabel: {
      fontSize: 7,
      color: '#6b7280',
      marginBottom: 5,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      fontSize: 8,
      fontWeight: 'bold',
    },
    statusActive: { backgroundColor: '#dcfce7', color: '#166534' },
    statusPending: { backgroundColor: '#fef3c7', color: '#92400e' },
    statusInactive: { backgroundColor: '#fee2e2', color: '#991b1b' },
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return styles.statusActive;
      case 'PENDING': return styles.statusPending;
      case 'INACTIVE': return styles.statusInactive;
      default: return { backgroundColor: '#e5e7eb', color: '#374151' };
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>🔧  GageTrack Pro</Text>
            <Text style={{ fontSize: 9, color: '#6b7280' }}>Calibration Management System</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.title}>CHALLAN DOCUMENT</Text>
            <Text style={styles.subtitle}>Official Record of Assigned Gages</Text>
          </View>
        </View>

        {/* Challan Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Challan Number</Text>
            <Text style={styles.infoValue}>{challan.challanNo}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Generated Date</Text>
            <Text style={styles.infoValue}>{formatDate(challan.generatedDate)}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Total Gages</Text>
            <Text style={styles.infoValue}>{challan.gaugesCount}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Total Cost</Text>
            <Text style={styles.infoValue}>{formatCurrency(challan.totalCost)}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={[styles.statusBadge, getStatusStyle(challan.status)]}>
              <Text>{challan.status || 'ACTIVE'}</Text>
            </View>
          </View>
        </View>

        {/* Gages Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Serial #</Text>
            <Text style={styles.col2}>Gage Name</Text>
            <Text style={styles.col3}>Model / Type</Text>
            <Text style={styles.col4}>Location</Text>
            <Text style={styles.col5}>Next Cal.</Text>
            <Text style={styles.col6}>Cost</Text>
          </View>
          
          {challan.gauges?.map((gage, index) => (
            <View key={gage.id || index} style={styles.tableRow}>
              <Text style={styles.col1}>{gage.serialNumber}</Text>
              <Text style={styles.col2}>{gage.gageName}</Text>
              <Text style={styles.col3}>{gage.modelNumber} • {gage.gageType}</Text>
              <Text style={styles.col4}>{gage.location}</Text>
              <Text style={styles.col5}>
                {gage.nextCalibrationDate ? new Date(gage.nextCalibrationDate).toLocaleDateString() : 'N/A'}
              </Text>
              <Text style={styles.col6}>{formatCurrency(gage.cost)}</Text>
            </View>
          ))}
        </View>

        {/* Barcode & QR Section */}
        {challan.gauges?.[0]?.barcodeImage && (
          <View style={styles.barcodeSection}>
            <View style={styles.barcodeBox}>
              <Text style={styles.barcodeLabel}>Barcode</Text>
              <Image 
                source={{ uri: `data:image/png;base64,${challan.gauges[0].barcodeImage}` }}
                style={{ width: 100, height: 40 }}
              />
            </View>
            <View style={styles.barcodeBox}>
              <Text style={styles.barcodeLabel}>QR Code</Text>
              <Image 
                source={{ uri: `data:image/png;base64,${challan.gauges[0].qrCodeImage}` }}
                style={{ width: 60, height: 60 }}
              />
            </View>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {new Date().toLocaleString()} • GageTrack Pro v2.0 • 
          This is a system-generated document. No signature required.
        </Text>
      </Page>
    </Document>
  );
};

// Main Component
function ChallanMgmt() {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [challanDetails, setChallanDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch challans list
  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/challans');
      if (response.data?.status === 'success') {
        setChallans(response.data.data || []);
      } else {
        throw new Error('Invalid response format');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching challans:', err);
      setError('Failed to load challans. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch challan details
  const fetchChallanDetails = async (challanNo) => {
    try {
      setDetailsLoading(true);
      setSelectedChallan(challanNo);
      const response = await api.get(`/challans/${challanNo}`);
      
      if (response.data?.status === 'success') {
        setChallanDetails(response.data.data);
        setMessage({ type: '', text: '' });
      } else {
        throw new Error('Failed to load challan details');
      }
    } catch (err) {
      console.error('Error fetching challan details:', err);
      setMessage({ 
        type: 'error', 
        text: `❌ Failed to load challan: ${err.message}` 
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Generate and download PDF
  const generatePDF = async () => {
    if (!challanDetails) return;
    
    try {
      setPdfGenerating(true);
      
      // Generate PDF blob
      const blob = await pdf(<ChallanPDF challan={challanDetails} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Challan_${challanDetails.challanNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: '✅ PDF downloaded successfully!' });
    } catch (err) {
      console.error('Error generating PDF:', err);
      setMessage({ type: 'error', text: `❌ PDF generation failed: ${err.message}` });
    } finally {
      setPdfGenerating(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(amount);
  };

  // Close details modal
  const closeModal = () => {
    setSelectedChallan(null);
    setChallanDetails(null);
    setMessage({ type: '', text: '' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading challans...</span>
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
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button 
            onClick={fetchChallans}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
            <h2 className="text-2xl font-bold text-gray-900">Challan Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              View and generate PDF documents for gage assignment challans
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={fetchChallans}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
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
            <p className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Challans Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Challan No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gages Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {challans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2 font-medium">No challans found</p>
                      <p className="mt-1">Challans will appear here once generated.</p>
                    </td>
                  </tr>
                ) : (
                  challans.map((challan, index) => (
                    <tr 
                      key={challan.challanNo || index} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => fetchChallanDetails(challan.challanNo)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              {challan.challanNo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {challan.gaugesCount} gage{challan.gaugesCount !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {formatCurrency(challan.totalCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(challan.generatedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchChallanDetails(challan.challanNo);
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{challans.length}</span> challan{challans.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Details Modal */}
        {selectedChallan && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            ></div>

            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white" id="modal-title">
                      Challan Details
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">{selectedChallan}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                  {detailsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Loading challan details...</span>
                    </div>
                  ) : challanDetails ? (
                    <div className="space-y-6">
                      {/* Challan Info Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Generated</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatDate(challanDetails.generatedDate)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Gages</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {challanDetails.gaugesCount}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Cost</p>
                          <p className="mt-1 text-sm font-semibold text-green-600">
                            {formatCurrency(challanDetails.totalCost)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                          <span className={`mt-1 inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                            challanDetails.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800'
                              : challanDetails.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {challanDetails.status || 'ACTIVE'}
                          </span>
                        </div>
                      </div>

                      {/* Gages Table */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Assigned Gages</h4>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serial #</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gage</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Next Calibration</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {challanDetails.gauges?.map((gage, idx) => (
                                <tr key={gage.id || idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{gage.serialNumber}</td>
                                  <td className="px-4 py-3 text-sm text-gray-900">{gage.gageName}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    <div>{gage.gageType}</div>
                                    <div className="text-xs text-gray-400">{gage.modelNumber}</div>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                      {gage.location}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    {gage.nextCalibrationDate ? formatDate(gage.nextCalibrationDate) : 'N/A'}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
                                    {formatCurrency(gage.cost)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Barcode Preview */}
                      {challanDetails.gauges?.[0]?.barcodeImage && (
                        <div className="flex items-center justify-center space-x-8 pt-4 border-t border-gray-200">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-2">Barcode</p>
                            <img 
                              src={`data:image/png;base64,${challanDetails.gauges[0].barcodeImage}`} 
                              alt="Barcode"
                              className="h-12 w-auto mx-auto"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-2">QR Code</p>
                            <img 
                              src={`data:image/png;base64,${challanDetails.gauges[0].qrCodeImage}`} 
                              alt="QR Code"
                              className="h-16 w-16 mx-auto"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Failed to load challan details. Please try again.
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={generatePDF}
                    disabled={pdfGenerating || !challanDetails}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pdfGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          💡 Click on any challan row to view details and generate a PDF document
        </div>

      </div>
    </div>
  );
}

export default ChallanMgmt;