import React from "react";
import { motion } from "framer-motion";

export const RevolvingGlobe: React.FC = () => {
  // Generate dots for the globe surface
  const generateGlobeDots = () => {
    const dots = [];
    const rows = 12;
    const cols = 24;
    
    for (let lat = 0; lat < rows; lat++) {
      for (let lon = 0; lon < cols; lon++) {
        const phi = (lat / (rows - 1)) * Math.PI;
        const theta = (lon / cols) * 2 * Math.PI;
        
        // Convert spherical to Cartesian coordinates
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        
        // Project to 2D
        const scale = 200;
        const projectedX = x * scale;
        const projectedY = y * scale;
        
        // Add some randomness for natural look
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.6 + 0.4;
        
        dots.push({
          x: projectedX,
          y: projectedY,
          size,
          opacity,
          delay: Math.random() * 2
        });
      }
    }
    return dots;
  };

  const globeDots = generateGlobeDots();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Globe Container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative"
          animate={{ rotateY: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {/* Main Globe Circle */}
          <div className="w-[400px] h-[400px] rounded-full relative">
            {/* Globe Base Circle */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 via-blue-600/20 to-blue-700/10 backdrop-blur-sm border border-blue-400/30"></div>
            
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {/* Latitude Lines */}
              <g className="text-blue-400/20">
                <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.3" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.3" />
                <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.3" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.3" />
                
                {/* Longitude Lines */}
                <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.3" />
                <line x1="40" y1="0" x2="40" y2="100" stroke="currentColor" strokeWidth="0.3" />
                <line x1="60" y1="0" x2="60" y2="100" stroke="currentColor" strokeWidth="0.3" />
                <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.3" />
              </g>
            </svg>
            
            {/* Globe Dots */}
            <div className="absolute inset-0">
              {globeDots.map((dot, index) => (
                <motion.div
                  key={index}
                  className="absolute bg-blue-400 rounded-full"
                  style={{
                    left: `calc(50% + ${dot.x}px)`,
                    top: `calc(50% + ${dot.y}px)`,
                    width: `${dot.size}px`,
                    height: `${dot.size}px`,
                    opacity: dot.opacity,
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [dot.opacity * 0.5, dot.opacity, dot.opacity * 0.5]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: dot.delay,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Connection Lines between dots */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {/* Create some connection lines between nearby dots */}
              {globeDots.slice(0, 20).map((dot, index) => {
                const nextDot = globeDots[(index + 1) % globeDots.length];
                if (nextDot) {
                  const distance = Math.sqrt(
                    Math.pow(dot.x - nextDot.x, 2) + Math.pow(dot.y - nextDot.y, 2)
                  );
                  if (distance < 100) {
                    return (
                      <line
                        key={`line-${index}`}
                        x1={`${50 + (dot.x / 4)}`}
                        y1={`${50 + (dot.y / 4)}`}
                        x2={`${50 + (nextDot.x / 4)}`}
                        y2={`${50 + (nextDot.y / 4)}`}
                        stroke="rgba(59,130,246,0.2)"
                        strokeWidth="0.5"
                      />
                    );
                  }
                }
                return null;
              })}
            </svg>
            
            {/* Atmospheric Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/5 via-transparent to-blue-600/5 animate-pulse"></div>
          </div>
          
          {/* Orbiting Elements */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
            style={{ marginLeft: '-6px', marginTop: '-6px' }}
            animate={{
              x: [0, 250, 0, -250, 0],
              y: [0, -250, 0, 250, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-300 rounded-full shadow-lg shadow-blue-300/50"
            style={{ marginLeft: '-4px', marginTop: '-4px' }}
            animate={{
              x: [0, -220, 0, 220, 0],
              y: [0, 220, 0, -220, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
            style={{ marginLeft: '-3px', marginTop: '-3px' }}
            animate={{
              x: [0, 180, 0, -180, 0],
              y: [0, -180, 0, 180, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>
      
      {/* Background Particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>
      
      {/* Text Backdrop for Better Visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50"></div>
      
      {/* Radial Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-radial-gradient opacity-50"></div>
    </div>
  );
};
