import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Html, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Brain, Bug, ChevronLeft, ChevronRight } from 'lucide-react';

const HeartModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial 
          color="#ef4444" 
          speed={2} 
          distort={0.4} 
          radius={1} 
          emissive="#991b1b"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Arteries */}
      <mesh position={[0.8, 1.2, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 16]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[-0.5, 1.5, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
    </group>
  );
};

const BrainModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        ],
        size: Math.random() * 0.1 + 0.05
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.2} 
          wireframe
        />
      </mesh>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position as [number, number, number]}>
          <sphereGeometry args={[node.size, 8, 8]} />
          <meshStandardMaterial 
            color="#c084fc" 
            emissive="#a855f7" 
            emissiveIntensity={2} 
          />
        </mesh>
      ))}
    </group>
  );
};

const VirusModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const spikes = useMemo(() => {
    const temp = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      temp.push([
        Math.cos(theta) * Math.sin(phi) * 1.8,
        Math.sin(theta) * Math.sin(phi) * 1.8,
        Math.cos(phi) * 1.8
      ]);
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.01;
      groupRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshWobbleMaterial 
          color="#10b981" 
          speed={1} 
          factor={0.2} 
          emissive="#065f46"
          emissiveIntensity={0.5}
        />
      </mesh>
      {spikes.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]} rotation={[
          Math.atan2(pos[1], pos[2]),
          Math.atan2(pos[0], pos[2]),
          0
        ]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.15, 0.8, 8]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#34d399" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const AnatomyExplorer = () => {
  const [currentModel, setCurrentModel] = useState<'heart' | 'brain' | 'virus'>('heart');
  
  const models = [
    { id: 'heart', name: 'Apparato Cardiovascolare', icon: <Heart className="w-5 h-5" />, color: 'text-red-500' },
    { id: 'brain', name: 'Sistema Nervoso Centrale', icon: <Brain className="w-5 h-5" />, color: 'text-purple-500' },
    { id: 'virus', name: 'Analisi Patogeni', icon: <Bug className="w-5 h-5" />, color: 'text-emerald-500' },
  ];

  const currentIndex = models.findIndex(m => m.id === currentModel);

  const nextModel = () => {
    const nextIdx = (currentIndex + 1) % models.length;
    setCurrentModel(models[nextIdx].id as any);
  };

  const prevModel = () => {
    const prevIdx = (currentIndex - 1 + models.length) % models.length;
    setCurrentModel(models[prevIdx].id as any);
  };

  return (
    <div className="w-full h-[600px] bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-slate-800">
      {/* Header Info */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModel}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-white font-bold text-2xl tracking-tight">
              {models[currentIndex].name}
            </h3>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">
              Esplorazione Anatomica 3D
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
        <button 
          onClick={prevModel}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-full">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => setCurrentModel(m.id as any)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentModel === m.id ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
            >
              {m.icon}
            </button>
          ))}
        </div>

        <button 
          onClick={nextModel}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={2} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <AnimatePresence mode="wait">
            {currentModel === 'heart' && <HeartModel key="heart" />}
            {currentModel === 'brain' && <BrainModel key="brain" />}
            {currentModel === 'virus' && <VirusModel key="virus" />}
          </AnimatePresence>
        </Float>

        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          makeDefault
        />
        
        <gridHelper args={[30, 30, 0x1e293b, 0x0f172a]} position={[0, -5, 0]} />
      </Canvas>

      {/* Hint */}
      <div className="absolute top-8 right-8 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-xl">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Stato Sistema</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">Rendering Attivo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnatomyExplorer;
