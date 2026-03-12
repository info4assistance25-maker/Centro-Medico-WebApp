import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';

const DNASphere = ({ position, color, emissive, label }: { position: [number, number, number], color: string, emissive: string, label: string }) => {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = hovered || selected ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setSelected(!selected)}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial 
        color={selected ? '#fbbf24' : (hovered ? '#60a5fa' : color)} 
        emissive={selected ? '#f59e0b' : (hovered ? '#3b82f6' : emissive)} 
        emissiveIntensity={hovered || selected ? 2 : 0.5} 
      />
      {(hovered || selected) && (
        <Html distanceFactor={10}>
          <div className="bg-slate-800/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] whitespace-nowrap border border-slate-700 shadow-xl pointer-events-none">
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
};

const DNABar = ({ position, rotation, length }: { position: [number, number, number], rotation: [number, number, number], length: number }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh 
      position={position} 
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[length, 0.05, 0.05]} />
      <meshStandardMaterial 
        color={hovered ? '#94a3b8' : '#e2e8f0'} 
        transparent 
        opacity={hovered ? 0.8 : 0.4} 
      />
    </mesh>
  );
};

const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const elements = [];
  const numSpheres = 24;
  const radius = 2;
  const heightStep = 0.4;

  for (let i = 0; i < numSpheres; i++) {
    const angle = (i / numSpheres) * Math.PI * 4;
    const y = (i - numSpheres / 2) * heightStep;
    
    // Strand 1
    elements.push(
      <DNASphere 
        key={`s1-${i}`} 
        position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]} 
        color="#3b82f6" 
        emissive="#1d4ed8"
        label={`Base Azotata A-${i}`}
      />
    );

    // Strand 2
    elements.push(
      <DNASphere 
        key={`s2-${i}`} 
        position={[Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius]} 
        color="#06b6d4" 
        emissive="#0891b2"
        label={`Base Azotata T-${i}`}
      />
    );

    // Connecting bars
    if (i % 2 === 0) {
      elements.push(
        <DNABar 
          key={`bar-${i}`} 
          position={[0, y, 0]} 
          rotation={[0, 0, angle + Math.PI / 2]}
          length={radius * 2}
        />
      );
    }
  }

  return <group ref={groupRef}>{elements}</group>;
};

const MedicalScene = () => {
  const [showHint, setShowHint] = useState(true);

  return (
    <div className="w-full h-[600px] bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl relative group border border-slate-800">
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-white font-bold text-2xl tracking-tight">Esploratore Genomico 3D</h3>
          <p className="text-blue-400/80 text-sm font-medium uppercase tracking-widest mt-1">Modello Interattivo Avanzato</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white text-xs font-medium flex items-center gap-3 shadow-2xl pointer-events-none"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Trascina per ruotare • Scorri per zoomare • Clicca sulle basi
            <button 
              onClick={(e) => { e.stopPropagation(); setShowHint(false); }}
              className="ml-2 hover:text-blue-400 pointer-events-auto"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 5, 20]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} castShadow />
        
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <DNAHelix />
        </Float>

        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          autoRotate={false}
          minDistance={5}
          maxDistance={15}
          makeDefault
        />
        
        <gridHelper args={[30, 30, 0x1e293b, 0x0f172a]} position={[0, -6, 0]} />
      </Canvas>

      <div className="absolute top-8 right-8 z-10 flex flex-col gap-2">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-xs font-bold text-slate-300">Citosina (C)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
            <span className="text-xs font-bold text-slate-300">Guanina (G)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalScene;
