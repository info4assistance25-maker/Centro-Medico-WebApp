import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { GoogleGenAI, VideoGenerationReferenceType } from "@google/genai";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Upload, 
  Loader2, 
  Download,
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

const AILab = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'edit'>('image');
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFlashImage = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const parts: any[] = [{ text: prompt }];
      
      if (previewUrl && activeTab === 'edit') {
        const base64Data = previewUrl.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: selectedFile?.type || 'image/png'
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setResultImage(imageUrl);
      } else {
        throw new Error("Nessuna immagine generata.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Errore durante la generazione.");
    } finally {
      setIsGenerating(false);
    }
  };

  const checkApiKey = async () => {
    const aiWindow = window as any;
    if (aiWindow.aistudio && typeof aiWindow.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await aiWindow.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsApiKey(true);
        await aiWindow.aistudio.openSelectKey();
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      const hasKey = await checkApiKey();
      if (!hasKey) {
        setIsGenerating(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: imageSize
          }
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setResultImage(imageUrl);
      } else {
        throw new Error("Nessuna immagine generata nella risposta.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Errore durante la generazione dell'immagine.");
      if (err.message?.includes("Requested entity was not found")) {
        setNeedsApiKey(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVideo = async () => {
    if (!previewUrl) return;
    setIsGenerating(true);
    setError(null);
    setResultVideo(null);

    try {
      const hasKey = await checkApiKey();
      if (!hasKey) {
        setIsGenerating(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = previewUrl.split(',')[1];
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || "Animate this medical visualization",
        image: {
          imageBytes: base64Data,
          mimeType: selectedFile?.type || 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.GEMINI_API_KEY || '',
          },
        });
        const blob = await response.blob();
        setResultVideo(URL.createObjectURL(blob));
      } else {
        throw new Error("Nessun video generato.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Errore durante la generazione del video.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden">
      <div className="flex border-b border-white/20 p-2 gap-2 bg-white/50">
        <button 
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-4 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'image' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          <ImageIcon className="w-4 h-4" /> Pro Image
        </button>
        <button 
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-4 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'edit' ? 'text-emerald-600 bg-white shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          <Sparkles className="w-4 h-4" /> Flash Edit
        </button>
        <button 
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-4 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'video' ? 'text-purple-600 bg-white shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
        >
          <VideoIcon className="w-4 h-4" /> Veo Video
        </button>
      </div>

      <div className="p-10">
        {activeTab === 'image' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrivi l'immagine medica (Pro)</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Esempio: Una vista microscopica 3D di una cellula cardiaca sana, stile fotorealistico..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none h-32 resize-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700">Risoluzione:</span>
              {(['1K', '2K', '4K'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${imageSize === size ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {size}
                </button>
              ))}
            </div>

            <motion.button 
              onClick={generateImage}
              whileTap={{ scale: 0.98 }}
              disabled={isGenerating || !prompt}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? 'Generazione in corso...' : 'Genera con Nano Banana Pro'}
            </motion.button>
          </div>
        ) : activeTab === 'edit' ? (
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg shadow-md" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-400 mb-4" />
                  <p className="text-slate-600 font-medium">Carica un'immagine da modificare (opzionale)</p>
                  <p className="text-xs text-slate-400 mt-2">Usa il prompt per creare o modificare</p>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Prompt per Nano Banana 2 (Flash)</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Esempio: Aggiungi un camice bianco al dottore nell'immagine..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-600 outline-none h-32 resize-none"
              />
            </div>

            <motion.button 
              onClick={generateFlashImage}
              whileTap={{ scale: 0.98 }}
              disabled={isGenerating || !prompt}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? 'Elaborazione in corso...' : 'Genera/Modifica con Nano Banana 2'}
            </motion.button>
          </div>
        ) : (
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg shadow-md" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-400 mb-4" />
                  <p className="text-slate-600 font-medium">Carica una foto medica da animare</p>
                  <p className="text-xs text-slate-400 mt-2">PNG, JPG fino a 10MB</p>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Istruzioni per l'animazione (opzionale)</label>
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Esempio: La cellula inizia a pulsare lentamente..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            <motion.button 
              onClick={generateVideo}
              whileTap={{ scale: 0.98 }}
              disabled={isGenerating || !previewUrl}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <VideoIcon className="w-5 h-5" />}
              {isGenerating ? 'Animazione in corso (può richiedere minuti)...' : 'Genera Video Veo'}
            </motion.button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {(resultImage || resultVideo) && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Risultato Generato
              </h4>
              <button 
                onClick={() => { setResultImage(null); setResultVideo(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-inner bg-slate-50 flex items-center justify-center min-h-[300px]">
              {resultImage && <img src={resultImage} alt="AI Generated" className="max-w-full h-auto" />}
              {resultVideo && <video src={resultVideo} controls autoPlay loop className="max-w-full h-auto" />}
            </div>

            <div className="mt-4 flex justify-end">
              <a 
                href={resultImage || resultVideo || '#'} 
                download={`ai-medical-${activeTab}-${Date.now()}`}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                <Download className="w-4 h-4" /> Scarica Risultato
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AILab;
