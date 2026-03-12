/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Spline from '@splinetool/react-spline';
import MedicalScene from './components/MedicalScene';
import AnatomyExplorer from './components/AnatomyExplorer';
import HeroScene from './components/HeroScene';
import AILab from './components/AILab';
import { 
  Stethoscope, 
  HeartPulse, 
  Activity, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-500 rounded-[2rem] px-6 py-3 flex justify-between items-center ${scrolled ? 'glass shadow-2xl shadow-blue-500/10' : 'bg-transparent'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/40">
              +
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-950">
              Studio Medico <span className="text-blue-600">Roma</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['Servizi', 'Chi Siamo', 'Contatti'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all hover:scale-105"
              >
                {item}
              </a>
            ))}
            <a href="#prenota" className="bg-slate-950 text-white px-7 py-3 rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-950/20 hover:shadow-blue-500/40 hover:-translate-y-1">
              Prenota Visita
            </a>
          </div>

          <button className="md:hidden text-slate-900 p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-4 right-4 mt-4 glass rounded-3xl p-6 flex flex-col gap-4 shadow-2xl border border-white/40"
          >
            {['Servizi', 'Chi Siamo', 'Contatti'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                onClick={() => setIsOpen(false)} 
                className="text-slate-900 font-bold text-lg py-2 border-b border-slate-100"
              >
                {item}
              </a>
            ))}
            <a href="#prenota" onClick={() => setIsOpen(false)} className="bg-blue-600 text-white py-4 rounded-2xl font-bold text-center shadow-lg shadow-blue-500/30">
              Prenota Visita
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#f8fafc]">
      {/* 3D Spline Background */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none">
        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm text-blue-700 text-sm font-bold mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              Accettiamo nuovi pazienti
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-extrabold text-slate-950 tracking-tight leading-[0.95] mb-8">
              L'eccellenza <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                della cura.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed font-medium">
              Studio medico all'avanguardia nel cuore di Roma. Uniamo l'esperienza clinica alle tecnologie 3D più avanzate per il tuo benessere.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <a href="#prenota" className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-bold text-lg hover:bg-slate-950 transition-all shadow-2xl shadow-blue-500/30 hover:shadow-slate-950/30 hover:-translate-y-1 flex items-center justify-center gap-3">
                Prenota ora <ChevronRight className="w-5 h-5" />
              </a>
              <a href="#servizi" className="glass px-10 py-5 rounded-3xl font-bold text-lg text-slate-900 hover:bg-white transition-all flex items-center justify-center">
                I nostri servizi
              </a>
            </div>
            
            <div className="mt-16 flex items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Paziente" className="w-12 h-12 rounded-full border-4 border-white shadow-xl" />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {'★★★★★'.split('').map((star, i) => <span key={i} className="text-lg">{star}</span>)}
                </div>
                <span className="text-slate-900 font-bold">2.000+ pazienti soddisfatti</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 rounded-[4rem] blur-3xl -z-10"></div>
            <div className="rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden h-[700px] w-full bg-slate-950 border border-white/10">
              <HeroScene />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 glass p-8 rounded-[2.5rem] shadow-2xl border border-white/40 z-20"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Diagnostica</p>
                  <p className="text-2xl font-display font-bold text-slate-950">Avanzata 3D</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Medicina Generale",
      desc: "Visite complete, diagnosi e prescrizioni per ogni tua esigenza quotidiana.",
      icon: <Stethoscope className="w-8 h-8" />,
      color: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=800",
      span: "md:col-span-2"
    },
    {
      title: "Cardiologia",
      desc: "Check-up cardiologici con strumentazione 3D.",
      icon: <HeartPulse className="w-8 h-8" />,
      color: "bg-rose-600",
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800",
      span: "md:col-span-1"
    },
    {
      title: "Analisi Cliniche",
      desc: "Laboratorio interno per risultati rapidi.",
      icon: <Activity className="w-8 h-8" />,
      color: "bg-emerald-600",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800",
      span: "md:col-span-1"
    },
    {
      title: "Diagnostica 3D",
      desc: "Visualizzazione avanzata per diagnosi precise e spiegazioni chiare.",
      icon: <Sparkles className="w-8 h-8" />,
      color: "bg-indigo-600",
      image: "https://images.unsplash.com/photo-1551076805-e18690c5e561?auto=format&fit=crop&q=80&w=800",
      span: "md:col-span-2"
    }
  ];

  return (
    <section id="servizi" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-slate-950 mb-6 tracking-tight">
              Servizi Medici <br />
              <span className="text-blue-600">di Nuova Generazione</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              Un approccio moderno alla medicina, combinando l'esperienza dei nostri medici con tecnologie diagnostiche 3D all'avanguardia.
            </p>
          </div>
          <a href="#prenota" className="group flex items-center gap-3 text-lg font-bold text-slate-950 hover:text-blue-600 transition-all">
            Vedi tutti i servizi 
            <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ChevronRight className="w-6 h-6" />
            </div>
          </a>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`bento-card group ${service.span} h-[400px] flex flex-col justify-end`}
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
              </div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl ${service.color}`}>
                  {service.icon}
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-950 mb-4">{service.title}</h3>
                <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-md">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="chi-siamo" className="py-32 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e18690c5e561?auto=format&fit=crop&q=80&w=1200" 
                alt="Struttura Medica" 
                className="w-full h-[600px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
            </div>
            
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl"></div>
            
            {/* Experience Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 -right-10 glass p-10 rounded-[2.5rem] shadow-2xl border border-white/40 z-20"
            >
              <div className="text-6xl font-display font-black text-blue-600 mb-2">15+</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Anni di Eccellenza</div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold mb-6"
            >
              La Nostra Storia
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-slate-950 mb-8 tracking-tight leading-[1.1]">
              Innovazione e cura <br />
              <span className="text-blue-600">nel cuore di Roma</span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
              Il nostro studio nasce con la missione di unire l'empatia della medicina tradizionale con la precisione delle nuove tecnologie 3D. Crediamo in un approccio olistico dove il paziente è sempre al centro.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              {[
                { title: "Tecnologia 3D", desc: "Diagnostica avanzata", icon: <Activity /> },
                { title: "Zero Attese", desc: "Puntualità garantita", icon: <Clock /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-7 h-7" })}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-950 text-lg">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <a href="#contatti" className="inline-flex items-center gap-3 text-lg font-bold text-slate-950 hover:text-blue-600 transition-all group">
              Scopri di più sulla nostra visione
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AISection = () => {
  return (
    <section id="ai-lab" className="py-32 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-purple-100 text-purple-700 text-sm font-bold mb-6 shadow-sm">
            <Sparkles className="w-5 h-5" /> AI Medical Lab
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-slate-950 mb-6 tracking-tight">
            Sperimenta <span className="text-purple-600">il Futuro</span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Utilizziamo l'intelligenza artificiale generativa per visualizzare il benessere e creare contenuti medici personalizzati con Nano Banana e Veo.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <AILab />
        </div>
      </div>
    </section>
  );
};

const ThreeDSection = () => {
  return (
    <section className="py-32 bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8">
              Innovazione Diagnostica
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-extrabold mb-8 tracking-tight leading-[0.95]">
              Visualizzazione <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Molecolare 3D</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium max-w-xl">
              La nostra clinica utilizza modelli 3D interattivi per spiegare procedure complesse e strutture anatomiche. Esplora il modello a destra per vedere la precisione della nostra diagnostica.
            </p>
            <div className="space-y-6">
              {[
                'Precisione sub-millimetrica in ogni scansione',
                'Interazione in tempo reale con il paziente',
                'Supporto decisionale clinico potenziato'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                  <span className="text-slate-200 font-bold text-lg">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>
            <MedicalScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contatti" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-slate-950 mb-8 tracking-tight">
              Prenota la <br />
              <span className="text-blue-600">Tua Visita</span>
            </h2>
            <p className="text-xl text-slate-600 mb-12 font-medium leading-relaxed">
              Siamo qui per te. Compila il form per richiedere un appuntamento o contattaci direttamente tramite i nostri canali ufficiali.
            </p>
            
            <div className="space-y-8 mb-16">
              {[
                { icon: <MapPin />, title: "Indirizzo", desc: "Via Cristoforo Colombo 123, 00147 Roma" },
                { icon: <Phone />, title: "Telefono", desc: "+39 06 1234 5678" },
                { icon: <Mail />, title: "Email", desc: "info@studiomedicoroma3d.it" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-7 h-7" })}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-950 text-lg">{item.title}</h4>
                    <p className="text-slate-600 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 3D Map Placeholder with modern styling */}
            <div className="h-80 rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Mappa Roma" 
                className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="glass px-6 py-3 rounded-2xl shadow-2xl font-bold text-blue-600 flex items-center gap-3 border border-white/40"
                >
                  <MapPin className="w-5 h-5" /> Studio Medico Roma
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            id="prenota"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100"
          >
            <h3 className="text-3xl font-display font-bold text-slate-950 mb-10">Richiedi Appuntamento</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Nome</label>
                  <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium" placeholder="Mario" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Cognome</label>
                  <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium" placeholder="Rossi" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                <input type="email" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium" placeholder="mario.rossi@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Telefono</label>
                <input type="tel" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium" placeholder="+39 333 1234567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Servizio</label>
                <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium bg-white appearance-none">
                  <option>Medicina Generale</option>
                  <option>Cardiologia</option>
                  <option>Analisi Cliniche</option>
                  <option>Altro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Data Preferita</label>
                <input type="date" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium" />
              </div>
              <button type="submit" className="w-full bg-slate-950 text-white font-bold py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-2xl shadow-slate-950/20 hover:shadow-blue-500/40 mt-6 flex items-center justify-center gap-3 text-lg">
                <Calendar className="w-6 h-6" /> Invia Richiesta
              </button>
              <p className="text-sm text-slate-500 text-center mt-6 font-medium">
                Verrai ricontattato entro 24h dal nostro staff.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/40">
                +
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                Studio Medico Roma
              </span>
            </div>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed mb-10">
              Innovazione 3D e cura del paziente si incontrano per offrirti la migliore esperienza medica a Roma. Tecnologia al servizio della tua salute.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-current rounded-sm opacity-50"></div>
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-white font-display font-bold text-lg mb-8">Link Rapidi</h4>
            <ul className="space-y-4 font-medium">
              {['Servizi', 'Chi Siamo', 'Contatti', 'Prenota'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-white font-display font-bold text-lg mb-8">Specialità</h4>
            <ul className="space-y-4 font-medium">
              {['Cardiologia', 'Diagnostica 3D', 'Medicina Generale', 'Analisi'].map((spec) => (
                <li key={spec} className="hover:text-blue-400 transition-colors cursor-pointer">{spec}</li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-3">
            <h4 className="text-white font-display font-bold text-lg mb-8">Orari Studio</h4>
            <ul className="space-y-4 font-medium">
              <li className="flex justify-between items-center">
                <span>Lun - Ven</span>
                <span className="text-white">08:00 - 20:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sabato</span>
                <span className="text-white">09:00 - 13:00</span>
              </li>
              <li className="flex justify-between items-center text-slate-600">
                <span>Domenica</span>
                <span>Chiuso</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 text-sm font-medium flex flex-col md:flex-row justify-between items-center gap-6">
          <p>&copy; {new Date().getFullYear()} Studio Medico Roma 3D. Eccellenza in ogni dettaglio.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Termini di Servizio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <ThreeDSection />
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Esploratore Anatomico</h2>
            <p className="text-slate-600 text-lg">
              Naviga attraverso i diversi sistemi del corpo umano con i nostri modelli 3D interattivi.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <AnatomyExplorer />
          </div>
        </div>
      </section>
      <AISection />
      <Contact />
      <Footer />
    </div>
  );
}

