import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Matter from 'matter-js';
import { GAME_CONFIG, RARITY_TABLE, PHYSICS_CONFIG } from '../constants';
import { PhysicsRef } from '../types';

interface PhysicsCanvasProps {
  onBallDispensed: (color: string) => void;
}

const PhysicsCanvas = forwardRef<PhysicsRef, PhysicsCanvasProps>(({ onBallDispensed }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  // Track the gate body to move it later
  const gateRef = useRef<Matter.Body | null>(null);
  // Track balls to apply forces
  const ballsRef = useRef<Matter.Body[]>([]);
  // Prevent double dispensing
  const isDispensingRef = useRef(false);

  useImperativeHandle(ref, () => ({
    agitate: () => {
      if (!engineRef.current) return;
      
      ballsRef.current.forEach(ball => {
        // Apply random force vector
        // We want upward and chaotic movement to shuffle them
        const forceMagnitude = 0.04 * ball.mass;
        Matter.Body.applyForce(ball, ball.position, {
          x: (Math.random() - 0.5) * forceMagnitude,
          y: -Math.random() * forceMagnitude * 1.8 // Stronger upward bias
        });
      });
    },
    dispense: () => {
      if (!gateRef.current || !engineRef.current || isDispensingRef.current) return;
      if (ballsRef.current.length === 0) return;
      
      isDispensingRef.current = true;

      // 1. Open the gate by moving it far away (invisible mechanic)
      Matter.Body.setPosition(gateRef.current, { 
        x: -1000, // Move off screen
        y: gateRef.current.position.y 
      });

      // 2. Agitate slightly and push balls towards the center to help them fall
      ballsRef.current.forEach(ball => {
         const forceToCenter = (PHYSICS_CONFIG.width / 2 - ball.position.x) * 0.0002;
         Matter.Body.applyForce(ball, ball.position, {
            x: (Math.random() - 0.5) * 0.005 + forceToCenter,
            y: -0.01
         });
      });

      // 3. Failsafe: If no ball has dropped after 1 second, force one to drop.
      setTimeout(() => {
        if (isDispensingRef.current && ballsRef.current.length > 0) {
           const candidate = ballsRef.current.reduce((prev, current) => {
             return (current.position.y > prev.position.y) ? current : prev;
           });

           if (candidate) {
             Matter.Body.setPosition(candidate, { 
               x: PHYSICS_CONFIG.width / 2, 
               y: PHYSICS_CONFIG.height - 100 
             });
             Matter.Body.setVelocity(candidate, { x: 0, y: 0 });
             Matter.Body.setAngularVelocity(candidate, 0);
             Matter.Body.applyForce(candidate, candidate.position, { x: 0, y: 0.05 });
           }
        }
      }, 1000);

      // 4. Close it after a delay
      setTimeout(() => {
        if (gateRef.current) {
          Matter.Body.setPosition(gateRef.current, { 
            x: PHYSICS_CONFIG.width / 2, 
            y: PHYSICS_CONFIG.height - 50 
          });
        }
        if (isDispensingRef.current) {
           isDispensingRef.current = false;
        }
      }, 2000); 
    },
    reset: () => {
      // Logic to reset balls if needed
    }
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    // Module aliases
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Events = Matter.Events,
          Common = Matter.Common;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: PHYSICS_CONFIG.width,
        height: PHYSICS_CONFIG.height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // --- Build the World ---

    const w = PHYSICS_CONFIG.width;
    const h = PHYSICS_CONFIG.height;
    
    const wallRender = { fillStyle: 'rgba(255,255,255,0.1)' };
    const rampRender = { fillStyle: '#e2f0cb' }; 
    
    const ground = Bodies.rectangle(w / 2, h + 100, w, 100, { isStatic: true });
    const leftWall = Bodies.rectangle(0, h / 2, 20, h, { isStatic: true, render: wallRender });
    const rightWall = Bodies.rectangle(w, h / 2, 20, h, { isStatic: true, render: wallRender });
    const topWall = Bodies.rectangle(w / 2, -50, w, 100, { isStatic: true });

    const leftRamp = Bodies.rectangle(60, h - 100, 220, 20, { 
      isStatic: true, 
      angle: Math.PI * 0.2, 
      render: rampRender
    });
    
    const rightRamp = Bodies.rectangle(w - 60, h - 100, 220, 20, { 
      isStatic: true, 
      angle: -Math.PI * 0.2,
      render: rampRender
    });

    const leftNeck = Bodies.rectangle(w/2 - 45, h - 40, 10, 60, { isStatic: true, render: { visible: false } });
    const rightNeck = Bodies.rectangle(w/2 + 45, h - 40, 10, 60, { isStatic: true, render: { visible: false } });

    const gate = Bodies.rectangle(w / 2, h - 50, 70, 10, { 
      isStatic: true,
      render: { visible: false } 
    });
    gateRef.current = gate;

    const capsules: Matter.Body[] = [];
    
    for (let i = 0; i < GAME_CONFIG.totalBalls; i++) {
      const radius = PHYSICS_CONFIG.ballRadius;
      const x = Common.random(50, w - 50);
      const y = Common.random(50, h / 2);
      
      const rand = Math.random();
      let cumulativeProbability = 0;
      let selectedRarity = RARITY_TABLE[0] as typeof RARITY_TABLE[number];

      for (const tier of RARITY_TABLE) {
        cumulativeProbability += tier.probability;
        if (rand <= cumulativeProbability) {
          selectedRarity = tier;
          break;
        }
      }
      
      const color = Common.choose(selectedRarity.capsuleColors);
      
      const ball = Bodies.circle(x, y, radius, {
        restitution: PHYSICS_CONFIG.ballRestitution,
        friction: PHYSICS_CONFIG.ballFriction,
        frictionAir: 0.01,
        label: color,
        render: {
          fillStyle: color,
          strokeStyle: 'rgba(0,0,0,0.1)',
          lineWidth: 2,
        }
      });
      capsules.push(ball);
    }
    ballsRef.current = capsules;

    Composite.add(engine.world, [
      ground, leftWall, rightWall, topWall, 
      leftRamp, rightRamp, leftNeck, rightNeck,
      gate, 
      ...capsules
    ]);

    Events.on(engine, 'afterUpdate', () => {
      const dispensedYThreshold = h - 20; 
      const fallenBalls = ballsRef.current.filter(b => b.position.y > dispensedYThreshold);
      
      if (fallenBalls.length > 0) {
        const winner = fallenBalls[0];
        const winningColor = winner.label || '#000';

        Composite.remove(engine.world, winner);
        ballsRef.current = ballsRef.current.filter(b => b.id !== winner.id);

        if (gateRef.current) {
             Matter.Body.setPosition(gateRef.current, { 
                x: PHYSICS_CONFIG.width / 2, 
                y: PHYSICS_CONFIG.height - 50 
             });
             isDispensingRef.current = false;
        }

        onBallDispensed(winningColor);
      }
    });

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) {
        render.canvas.remove();
      }
      engineRef.current = null;
    };
  }, [onBallDispensed]);

  return (
    <div 
      ref={containerRef} 
      // Adjusted dimensions to fit strictly within the 360px machine container (minus padding)
      // 360 - 32 (padding) = 328 max width.
      className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] relative rounded-full overflow-hidden bg-white/30 backdrop-blur-sm shadow-inner border-4 border-white/40"
    >
      {/* Decorative Shine */}
      <div className="absolute top-8 left-8 w-32 h-16 bg-gradient-to-br from-white/60 to-transparent rounded-full transform -rotate-12 pointer-events-none blur-[4px]" />
    </div>
  );
});

PhysicsCanvas.displayName = 'PhysicsCanvas';
export default PhysicsCanvas;