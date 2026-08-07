import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling when a modal or overlay is open.
 * Prevents background scrolling and compensates for scrollbar width to prevent layout jittering.
 */
export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    // Calculate scrollbar width before locking
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalStylePaddingRight = document.body.style.paddingRight;

    // Apply scroll lock & padding compensation
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalStylePaddingRight;
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
        '.fixed.inset-0.z-\\[35\\], .fixed.inset-0.z-35, [class*="z-\\[35\\]"], [class*="z-35"], .fixed.inset-0.z-50, .fixed.inset-0.z-60, .fixed.inset-0.z-10, .fixed.inset-0.z-\\[110\\], .fixed.inset-0.z-\\[10000\\], .fixed.inset-0.z-\\[20000\\], .fixed.inset-0.z-\\[9999\\], .fixed.inset-0.z-\\[99999\\], [role="dialog"]'
      );
      
      const isAnyModalOpen = Array.from(modalElements).some(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && !el.classList.contains('pointer-events-none');
      });

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      if (isAnyModalOpen) {
        if (document.body.style.overflow !== 'hidden') {
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
          }
        }
      } else {
        if (document.body.style.overflow === 'hidden') {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
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
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);
}
