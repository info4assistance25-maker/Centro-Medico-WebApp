import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, MeshDistortMaterial, Sphere, MeshWobbleMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const FloatingIcons = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial 
          color="#3b82f6" 
          speed={3} 
          distort={0.3} 
          radius={1} 
          emissive="#1d4ed8"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Orbiting Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 12, 64]} />
        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} />
      </mesh>
      
      <mesh rotation={[Math.PI / 2.5, Math.PI / 4, 0]}>
        <torusGeometry args={[1.8, 0.01, 12, 64]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={1} />
      </mesh>

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i * 0.5) * 2.5, 
            Math.sin(i * 0.8) * 2.5, 
            Math.sin(i * 0.3) * 2.5
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#93c5fd" emissive="#60a5fa" emissiveIntensity={5} />
        </mesh>
      ))}
    </group>
  );
};

const HeroScene = () => {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
        <spotLight position={[0, 5, 10]} angle={0.3} penumbra={1} intensity={2} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <FloatingIcons />
        </Float>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
    </div>
  );
};

export default HeroScene;
