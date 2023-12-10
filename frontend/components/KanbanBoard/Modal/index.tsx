'use client';

import { useCallback, useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import { AnimatePresence, motion } from 'framer-motion';

// Types
import ModalProps from './modal.type';
import { classNames } from '@/services/utils';

export default function Modal({
  children,
  showModal,
  setShowModal,
  containerClasses,
}: ModalProps) {
  const desktopModalRef = useRef(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    },
    [setShowModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <AnimatePresence>
      {showModal && (
        <>
          <FocusTrap focusTrapOptions={{ initialFocus: false }}>
            <motion.div
              ref={desktopModalRef}
              key='desktop-modal'
              className='fixed inset-0 z-40 hidden min-h-screen items-center justify-center md:flex'
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onMouseDown={(e) => {
                if (desktopModalRef.current === e.target) {
                  setShowModal(false);
                }
              }}
            >
              <div
                className={classNames(
                  `overflow relative w-full max-w-lg transform rounded-xl border border-primary border-opacity-10 bg-surface p-6 text-left shadow-2xl transition-all`,
                  containerClasses
                )}
              >
                {children}
              </div>
            </motion.div>
          </FocusTrap>
          <motion.div
            key='desktop-backdrop'
            className='bg-primary-surface/20 fixed inset-0 z-9 backdrop-blur'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
