import React, { useEffect, useRef } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-webgl2';
import gsap from 'gsap';

function WinnerModal({ isOpen, onClose, correctCharacter }) {
  const modalRef = useRef(null);

  const { rive, RiveComponent } = useRive({
    src: '/rive_assets/winner.riv',
    autoplay: true,
    autoBind: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    stateMachines: 'State Machine 1',
    onLoad: () => {
      if (rive && correctCharacter) {
        try {
          const viewModelInstance = rive.viewModelInstance;
          
          if (viewModelInstance) {
            const characterName = correctCharacter.name_es || correctCharacter.name || 'Personaje';
            viewModelInstance.string('character name').value = characterName;
          }
        } catch (error) {
          console.error('Error setting character name:', error);
        }
      }
    }
  });

  // Update the character name when correctCharacter changes
  useEffect(() => {
    if (rive && correctCharacter && isOpen) {
      try {
        const viewModelInstance = rive.viewModelInstance;
        
        if (viewModelInstance) {
          const characterName = correctCharacter.name_es || correctCharacter.name || 'Personaje';
          viewModelInstance.string('character name').value = characterName;
        }
      } catch (error) {
        console.error('Error updating character name:', error);
      }
    }
  }, [rive, correctCharacter, isOpen]);

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#edecea] bg-opacity-90">
      <div 
        ref={modalRef}
        className="border-black w-full max-w-md overflow-hidden"
      >
        {/* Rive animation container */}
        <div className="w-full h-[700px]">
          <RiveComponent />
        </div>
        
        {/* Character info */}
        <div className="p-4 text-center">
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
