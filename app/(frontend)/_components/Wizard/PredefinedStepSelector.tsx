'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PREDEFINED_STEPS, PredefinedStep } from './predefined';

interface PredefinedStepSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (step: PredefinedStep) => void;
}

export const PredefinedStepSelector: React.FC<PredefinedStepSelectorProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStep, setSelectedStep] = useState<PredefinedStep | null>(null);
  const [filteredSteps, setFilteredSteps] = useState<PredefinedStep[]>(PREDEFINED_STEPS);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3; // Reduced number of items per page to ensure pagination is visible

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedStep(null);
      setSearchTerm('');
      setFilteredSteps(PREDEFINED_STEPS);
    }
  }, [open]);

  // Filter steps based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredSteps(PREDEFINED_STEPS);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = PREDEFINED_STEPS.filter(
      step => 
        step.name.toLowerCase().includes(term) || 
        step.description.toLowerCase().includes(term) ||
        (step.tags && step.tags.some(tag => tag.toLowerCase().includes(term)))
    );
    
    setFilteredSteps(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredSteps.length / ITEMS_PER_PAGE));
  
  // Get current page items
  const currentSteps = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSteps.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSteps, currentPage, ITEMS_PER_PAGE]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle selection and close
  const handleSelect = () => {
    if (selectedStep) {
      onSelect(selectedStep);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select Predefined Step</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search predefined steps..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Steps list */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-2">
            {filteredSteps.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No predefined steps found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {currentSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedStep?.id === step.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedStep(step)}
                  >
                    <div className="flex items-start gap-3">
                      {step.previewImageUrl ? (
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                          <div className="relative w-full h-full">
                            {/* Fallback image if the preview is not available */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            {/* Actual image - will display if available */}
                            <div className="absolute inset-0">
                              <Image
                                src={step.previewImageUrl}
                                alt={`Preview of ${step.name}`}
                                className="w-full h-full object-cover"
                                width={64}
                                height={64}
                                onError={() => {
                                  // Error handled by Next.js Image component
                                  console.error(`Failed to load preview image for ${step.name}`);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{step.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{step.description}</p>
                        {step.tags && step.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {step.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 pt-2 border-t border-gray-200">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                        aria-label="Previous page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first page, last page, current page, and pages around current page
                          return page === 1 || 
                                 page === totalPages || 
                                 Math.abs(page - currentPage) <= 1;
                        })
                        .map((page, index, array) => {
                          // Add ellipsis if there are gaps in the sequence
                          const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                          
                          return (
                            <React.Fragment key={page}>
                              {showEllipsisBefore && <span className="px-1 text-gray-500">...</span>}
                              <button
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        })}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                        aria-label="Next page"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Preview panel */}
          <div className="w-1/2 overflow-y-auto flex flex-col">
            {selectedStep ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-lg">{selectedStep.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedStep.description}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="h-[400px] overflow-y-auto">
                      {React.createElement(selectedStep.component)}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 text-gray-400">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <p>Select a predefined step to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSelect}
            disabled={!selectedStep}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredefinedStepSelector;
