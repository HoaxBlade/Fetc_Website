import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling when a modal or overlay is open.
 * Prevents background scrolling and compensates for scrollbar width to prevent layout shift.
 */
export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
    };
  }, [isLocked]);
}

/**
 * Automatically locks body scrolling whenever any fixed modal dialog overlay is rendered in DOM.
 */
export function useGlobalModalScrollLock() {
  useEffect(() => {
    const checkModal = () => {
      // Find modal overlay containers in DOM
      const modalElements = document.querySelectorAll(
        '.fixed.inset-0, [role="dialog"]'
      );
      
      const isAnyModalOpen = Array.from(modalElements).some(el => {
        const style = window.getComputedStyle(el);
        const isBackdropOrModal = el.classList.contains('bg-slate-900/40') || 
                                  el.classList.contains('bg-black/50') || 
                                  el.classList.contains('bg-black/40') || 
                                  el.classList.contains('backdrop-blur-sm') ||
                                  el.classList.contains('backdrop-blur-md') ||
                                  el.getAttribute('role') === 'dialog' ||
                                  el.className.includes('z-[');
        return isBackdropOrModal && style.display !== 'none' && style.visibility !== 'hidden' && !el.classList.contains('pointer-events-none');
      });

      if (isAnyModalOpen) {
        if (document.body.style.overflow !== 'hidden') {
          const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          document.body.style.overflow = 'hidden';
          if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
          }
        }
      } else {
        if (document.body.style.overflow === 'hidden') {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }
      }
    };

    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    checkModal();

    return () => {
      observer.disconnect();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);
}


