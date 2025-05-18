// src/components/HomePage.js
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import gsap from 'gsap';

function HomePage() { // Removed setPageRef if App.js doesn't use it
  const navigate = useNavigate();
  const pageContainerRef = useRef(null);

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

  const handleRiveButtonClick = () => {
    if (rive) {
      const inputs = rive.stateMachineInputs('State Machine 1');
      const trigger = inputs.find(i => i.name === 'Press');
      if (trigger) {
        trigger.fire();
      }
    }
    if (pageContainerRef.current) {
      gsap.to(pageContainerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => navigate('/game'),
      });
    } else {
      navigate('/game'); // Fallback if ref isn't ready (shouldn't happen)
    }
  };

  return (
    // Apply the linear gradient background using inline style
    // Removed bg-[#EDECEA] from className
    <div
    ref={pageContainerRef}
      style={{ opacity: 0, background: 'linear-gradient(to bottom, #EFE3CB, #EDECEA)' }} // Add inline style for gradient
      className="min-h-screen flex flex-col items-center justify-center font-satoshi text-center p-4"
    >
      <h1 className="text-4xl sm:text-5xl font-black text-black mb-12">
        Capsle Corp
      </h1>
      <div
        onClick={handleRiveButtonClick}
        className="w-[280px] h-[70px] sm:w-[320px] sm:h-[80px] cursor-pointer"
        aria-label="Start Game Button"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleRiveButtonClick()}
      >
        <RiveComponent className="w-full h-full" />
      </div>
      <p className="text-gray-600 mt-8 text-sm">
        Haz clic en el botón para comenzar a adivinar.
      </p>
    </div>
  );
}

export default HomePage;
