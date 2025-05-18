// src/components/HomePage.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import gsap from 'gsap';

function HomePage() {
  const navigate = useNavigate();
  const pageContainerRef = useRef(null);
  const isNavigating = useRef(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device on mount
  useEffect(() => {
    const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(touchDevice);
  }, []);

  // GSAP Enter Animation for this page
  useEffect(() => {
    if (pageContainerRef.current) {
      gsap.fromTo(pageContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, []);

  const { RiveComponent, rive } = useRive({
    src: '/rive_assets/capsle_corp_button.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  const handleNavigation = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    
    if (pageContainerRef.current) {
      gsap.to(pageContainerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => navigate('/game'),
      });
    } else {
      navigate('/game');
    }
  };

  const handleRiveButtonClick = () => {
    if (isNavigating.current) return;
    
    // Try to trigger the Rive animation
    if (rive) {
      try {
        const inputs = rive.stateMachineInputs('State Machine 1');
        const trigger = inputs.find(i => i.name === 'Press Clic');
        if (trigger) {
          trigger.fire();
        }
      } catch (error) {
        console.error("Error triggering Rive animation:", error);
      }
    }
    
    // For touch devices, navigate immediately
    // For non-touch devices, wait for animation
    const delay = isTouchDevice ? 50 : 300;
    setTimeout(handleNavigation, delay);
  };

  return (
    <div
      ref={pageContainerRef}
      style={{ opacity: 0, background: 'linear-gradient(to bottom, #EFE3CB, #EDECEA)' }}
      className="min-h-screen flex flex-col items-center justify-center font-satoshi text-center p-4"
    >
      <h1 className="text-4xl sm:text-5xl font-black text-black mb-12">
        Capsle Corp
      </h1>
      
      {/* Rive button with conditional overlay for touch devices */}
      <div className="relative w-[280px] h-[70px] sm:w-[320px] sm:h-[80px]">
        <RiveComponent className="w-full h-full" />
        
        {/* Only render the transparent overlay for touch devices */}
        {isTouchDevice && (
          <div 
            className="absolute inset-0 cursor-pointer z-10"
            onClick={handleNavigation}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleNavigation()}
            aria-label="Start Game Button"
          />
        )}
        
        {/* For non-touch devices, use the regular click handler */}
        {!isTouchDevice && (
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={handleRiveButtonClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleRiveButtonClick()}
            aria-label="Start Game Button"
          />
        )}
      </div>
      
      <p className="text-gray-600 mt-8 text-sm">
        Haz clic en el botón para comenzar a adivinar.
      </p>
    </div>
  );
}

export default HomePage;
