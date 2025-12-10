import React from 'react';
import { AppState, Action, ActionType } from '../types';
import { SlideRenderer } from './SlideRenderer';
import { LayoutGrid, Download, Play, RefreshCw, ChevronLeft, ChevronRight, MonitorPlay } from 'lucide-react';
import { exportPresentation } from '../services/pptxService';

interface EditorProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const Editor: React.FC<EditorProps> = ({ state, dispatch }) => {
  const { presentation, currentSlideIndex } = state;
  const slides = presentation?.slides || [];
  const currentSlide = slides[currentSlideIndex];

  const handleUpdateSlide = (id: string, field: string, value: any) => {
    dispatch({ type: ActionType.UPDATE_SLIDE, payload: { id, field: field as any, value } });
  };

  const handleExport = () => {
    if (presentation) {
      exportPresentation(presentation);
    }
  };

  const handleHTMLPreview = () => {
     // Create a basic data blob for the user to "simulate" a web player data download
     const data = JSON.stringify(presentation, null, 2);
     const blob = new Blob([data], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'kiminote-web-data.json';
     a.click();
     alert("Web Player Data exported! Use a JSON viewer or custom player to load this.");
  };

  return (
    <div className="flex h-screen bg-dark-950 text-white overflow-hidden">
      
      {/* Sidebar - Thumbnails */}
      <div className="w-72 bg-dark-900 border-r border-white/5 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="font-bold text-banana-500 tracking-wider flex items-center gap-2">
            <div className="w-3 h-3 bg-banana-500 rounded-full animate-pulse" />
            KIMINOTE
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              onClick={() => dispatch({ type: ActionType.SET_CURRENT_SLIDE, payload: idx })}
              className={`relative aspect-video rounded-lg border-2 cursor-pointer transition-all group overflow-hidden ${
                currentSlideIndex === idx 
                  ? 'border-banana-500 shadow-[0_0_15px_rgba(255,215,0,0.2)]' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="absolute top-2 left-2 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-[10px] text-gray-400 font-mono z-10">
                {idx + 1}
              </div>
              <div className="w-full h-full bg-dark-800 p-2 transform scale-[0.25] origin-top-left w-[400%] h-[400%] pointer-events-none select-none">
                 {/* Mini Render (Simplified) */}
                 <div className="text-6xl font-bold text-banana-500 mb-4">{slide.title}</div>
                 <div className="text-4xl text-gray-400">{slide.layout}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 text-xs text-gray-500 text-center">
          {presentation?.topic}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-white/5 bg-dark-900/50 backdrop-blur-sm flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
             <span className="text-gray-400 text-sm font-mono">
               {currentSlideIndex + 1} / {slides.length}
             </span>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={handleHTMLPreview}
               className="p-2 text-gray-400 hover:text-white transition-colors"
               title="Export JSON"
             >
               <MonitorPlay size={18} />
             </button>
             <button 
               onClick={handleExport}
               className="flex items-center gap-2 px-5 py-2 bg-banana-500 hover:bg-banana-400 text-black font-bold rounded-full text-sm transition-transform active:scale-95"
             >
               <Download size={16} />
               <span>Export PPTX</span>
             </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-12 overflow-hidden relative">
          
          <div className="w-full max-w-[1280px] aspect-video relative shadow-2xl ring-1 ring-white/10 rounded-xl bg-dark-900">
             {currentSlide && (
               <SlideRenderer 
                 slide={currentSlide} 
                 isActive={true} 
                 onUpdate={handleUpdateSlide} 
               />
             )}
          </div>

          {/* Nav Controls */}
          <div className="absolute bottom-6 flex gap-2 bg-dark-900/80 backdrop-blur border border-white/10 p-1 rounded-full">
            <button 
              onClick={() => dispatch({ type: ActionType.SET_CURRENT_SLIDE, payload: Math.max(0, currentSlideIndex - 1) })}
              className="p-2 hover:bg-white/10 rounded-full text-gray-300 disabled:opacity-30"
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => dispatch({ type: ActionType.SET_CURRENT_SLIDE, payload: Math.min(slides.length - 1, currentSlideIndex + 1) })}
              className="p-2 hover:bg-white/10 rounded-full text-gray-300 disabled:opacity-30"
              disabled={currentSlideIndex === slides.length - 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
