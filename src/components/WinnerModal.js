// src/components/WinnerModal.js
import React, { useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import gsap from 'gsap';

function WinnerModal({ isOpen, onClose, correctCharacter }) {
  const modalRef = React.useRef(null);

  const { RiveComponent, rive } = useRive({
    src: '/rive_assets/winner.riv',
    stateMachines: 'State Machine 1', // Adjust this to match your Rive file's state machine name
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  // Animation for modal entrance
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Set initial state
      gsap.set(modalRef.current, { 
        opacity: 0,
        scale: 0.8
      });
      
      // Animate to visible state
      gsap.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    }
  }, [isOpen]);

  // Handle closing animation
  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl border-4 border-black shadow-xl w-[90%] max-w-md overflow-hidden"
      >
        <div className="p-4 bg-[#EFE3CB] border-b-2 border-black">
          <h2 className="text-2xl font-black text-center">¡Felicidades!</h2>
        </div>
        
        {/* Rive animation container */}
        <div className="w-full h-64 bg-[#EFE3CB]">
          <RiveComponent className="w-full h-full" />
        </div>
        
        {/* Character info */}
        <div className="p-4 bg-[#EFE3CB] text-center">
          <p className="mb-2 font-bold">¡Has adivinado correctamente!</p>
          <p className="text-lg font-black mb-4">
            {correctCharacter?.name_es || 'Personaje del día'}
          </p>
          
          <button
            onClick={handleClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinnerModal;
