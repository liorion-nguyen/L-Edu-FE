// Modal utilities để tránh z-index conflicts và event blocking
import React from 'react';

export const MODAL_Z_INDEX = {
  NORMAL: 1000,
  HIGH: 1001,
  CRITICAL: 1002,
};

export const createModalConfig = (zIndex: number = MODAL_Z_INDEX.NORMAL) => ({
  zIndex,
  destroyOnClose: true,
  forceRender: false,
  getContainer: () => document.body,
  closable: true,
  maskClosable: true,
  keyboard: true,
  centered: false,
  maskStyle: { 
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: zIndex - 1 
  },
  style: { 
    top: 20,
    zIndex 
  },
});

export const handleModalClose = (
  setModalVisible: (visible: boolean) => void,
  cleanupStates?: Array<() => void>
) => {
  // Close modal
  setModalVisible(false);
  
  // Run cleanup functions
  if (cleanupStates) {
    cleanupStates.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error('Error in modal cleanup:', error);
      }
    });
  }
  
  // Force DOM cleanup after modal closes
  setTimeout(() => {
    // Remove any lingering modal elements
    const modalElements = document.querySelectorAll('.ant-modal-mask');
    modalElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    // Reset body overflow if needed
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Force a small re-render to ensure UI is responsive
    window.dispatchEvent(new Event('resize'));
  }, 100);
};

export const preventModalBlocking = () => {
  // Ensure no modal is blocking interactions
  const checkAndCleanup = () => {
    const masks = document.querySelectorAll('.ant-modal-mask');
    const modals = document.querySelectorAll('.ant-modal');
    
    // Remove orphaned masks
    masks.forEach(mask => {
      const hasVisibleModal = Array.from(modals).some(modal => {
        const htmlModal = modal as HTMLElement;
        return htmlModal.style.display !== 'none' && 
               modal.getAttribute('aria-hidden') !== 'true';
      });
      
      if (!hasVisibleModal && mask.parentNode) {
        mask.parentNode.removeChild(mask);
      }
    });
    
    // Reset body styles
    if (modals.length === 0 || Array.from(modals).every(modal => {
      const htmlModal = modal as HTMLElement;
      return htmlModal.style.display === 'none' || 
             modal.getAttribute('aria-hidden') === 'true';
    })) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  };
  
  // Check immediately and after a delay
  checkAndCleanup();
  setTimeout(checkAndCleanup, 200);
  setTimeout(checkAndCleanup, 500);
};

// Hook to prevent modal blocking
export const useModalCleanup = () => {
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      preventModalBlocking();
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        preventModalBlocking();
      }
    };
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      preventModalBlocking();
    };
  }, []);
};
