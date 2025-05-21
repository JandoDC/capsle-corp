// src/components/HomePage.js
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRive, EventType } from '@rive-app/react-canvas';
import gsap from 'gsap';

function HomePage() {
  const navigate = useNavigate();
  const pageContainerRef = useRef(null);

  // GSAP Enter Animation for this page
  useEffect(() => {
    if (pageContainerRef.current) {
      gsap.fromTo(
        pageContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, []);

  const { RiveComponent, rive } = useRive({
    src: '/rive_assets/capsle_corp_button.riv',
    stateMachines: 'State Machine 2',
    autoplay: true,
  });

  // Handle manual button click/touch
  const handleButtonInteraction = () => {
    console.log('Button interaction detected');
    
    // Trigger the Rive animation if possible
    if (rive) {
      try {
        const inputs = rive.stateMachineInputs('State Machine 2');
        const trigger = inputs.find(i => i.name === 'Press Clic');
        if (trigger) {
          trigger.fire();
          console.log('Rive animation triggered manually');
        }
      } catch (error) {
        console.error("Error triggering Rive animation:", error);
      }
    }
    
    // Navigate to game page with transition
    gsap.to(pageContainerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        console.log('Navigating to /game');
        navigate('/game');
      }
    });
  };

  // Set up event listener for Rive events
  useEffect(() => {
    if (rive) {
      // Listen for Rive events
      const handleRiveEvent = (event) => {
        console.log('Rive event received:', event);
        
        // We'll let the click/touch handler handle navigation
        // This is just for monitoring events
      };

      console.log('Setting up Rive event listener');
      rive.on(EventType.RiveEvent, handleRiveEvent);
      
      // Clean up event listener
      return () => {
        console.log('Cleaning up Rive event listener');
        rive.off(EventType.RiveEvent, handleRiveEvent);
      };
    }
  }, [rive]);

  return (
    <div
      ref={pageContainerRef}
      style={{ opacity: 0, background: 'linear-gradient(to bottom, #EFE3CB, #EDECEA)' }}
      className="min-h-screen flex flex-col items-center justify-center font-satoshi text-center p-4"
    >
      <button
        onClick={handleButtonInteraction}
        onTouchStart={handleButtonInteraction}
        className="w-[280px] h-[70px] sm:w-[320px] sm:h-[80px] cursor-pointer bg-transparent border-none p-0 m-0"
        aria-label="Start Game"
      >
        <RiveComponent className="w-full h-full" />
      </button>
    </div>
  );
}

export default HomePage;
