import React, { ReactNode } from 'react';
interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div
      className='relative z-10'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div
        className='fixed inset-0 bg-slate-800 opacity-75 transition-opacity'
        aria-hidden='true'
      ></div>

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex sm:min-h-full justify-center p-4 text-center items-center sm:p-0'>
          <div className='relative transform overflow-hidden rounded-lg bg-white dark:bg-black text-left shadow-xl transition-all my-8 w-full max-w-lg'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Modal);
