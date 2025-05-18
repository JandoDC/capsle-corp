// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { motion } from 'framer-motion'; // Import motion

// Define animation variants for the page
const pageVariants = {
  initial: { // State when component is initially mounted or about to enter
    opacity: 0,
    y: 20, // Start slightly below
  },
  in: { // State when component is visible
    opacity: 1,
    y: 0,
  },
  out: { // State when component is about to exit
    opacity: 0,
    y: -20, // Exit slightly above
  },
};

// Define transition properties
const pageTransition = {
  type: 'tween', // Smooth transition
  ease: 'anticipate', // Easing function (you can experiment with others like "easeInOut")
  duration: 0.5, // Duration of the transition
};

function HomePage() {
  const navigate = useNavigate();

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
    setTimeout(() => {
      navigate('/game');
    }, 300);
  };

  return (
    // Wrap the page content with motion.div and apply variants/transition
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-[#EDECEA] flex flex-col items-center justify-center font-satoshi text-center p-4"
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
    </motion.div>
  );
}

export default HomePage;
