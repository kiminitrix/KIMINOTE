import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideContent, SlideLayout } from '../types';
import { Edit3 } from 'lucide-react';

interface SlideRendererProps {
  slide: SlideContent;
  isActive: boolean;
  onUpdate: (id: string, field: keyof SlideContent, value: any) => void;
}

const EditableArea = ({ 
  value, 
  onChange, 
  className, 
  multiline = false 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  className?: string;
  multiline?: boolean;
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  if (isEditing) {
    return multiline ? (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        className={`bg-transparent outline-none border border-banana-500 rounded p-1 w-full text-white resize-none ${className}`}
      />
    ) : (
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        className={`bg-transparent outline-none border border-banana-500 rounded p-1 w-full text-white ${className}`}
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`group relative cursor-text hover:bg-white/5 rounded px-1 transition-colors ${className}`}
    >
      {value || <span className="opacity-30 italic">Click to edit</span>}
      <Edit3 className="absolute -right-6 top-0 opacity-0 group-hover:opacity-50 text-banana-400 w-4 h-4" />
    </div>
  );
};

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, isActive, onUpdate }) => {
  if (!isActive) return null;

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 1.05 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide.id}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={containerVariants}
        className="w-full h-full bg-dark-900 relative overflow-hidden flex flex-col shadow-2xl rounded-xl border border-white/10"
      >
        {/* Background Accents (Banana Pro) */}
        <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-banana-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-banana-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="relative z-10 w-full h-full p-12 flex flex-col">
          
          {/* Layout: Title */}
          {slide.layout === SlideLayout.Title && (
            <div className="flex flex-col justify-center items-center h-full text-center space-y-6">
              <span className="text-banana-500 tracking-[0.3em] text-sm uppercase font-bold">Presentation</span>
              <EditableArea
                value={slide.title}
                onChange={(v) => onUpdate(slide.id, 'title', v)}
                className="text-6xl font-extrabold text-white leading-tight max-w-4xl"
              />
              <EditableArea
                value={slide.subtitle || ''}
                onChange={(v) => onUpdate(slide.id, 'subtitle', v)}
                className="text-2xl text-gray-400 font-light max-w-2xl"
              />
            </div>
          )}

          {/* Layout: Bullet Points */}
          {slide.layout === SlideLayout.BulletPoints && (
            <div className="flex h-full gap-8">
              <div className="w-2/3 flex flex-col">
                <div className="border-l-4 border-banana-500 pl-6 mb-8">
                   <EditableArea
                    value={slide.title}
                    onChange={(v) => onUpdate(slide.id, 'title', v)}
                    className="text-4xl font-bold text-white"
                  />
                </div>
                <ul className="space-y-6 mt-4">
                  {slide.points?.map((point, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-start text-xl text-gray-200"
                    >
                      <span className="text-banana-500 mr-4 mt-1">➤</span>
                      <EditableArea
                        value={point}
                        onChange={(v) => {
                          const newPoints = [...(slide.points || [])];
                          newPoints[idx] = v;
                          onUpdate(slide.id, 'points', newPoints);
                        }}
                        className="w-full"
                      />
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="w-1/3 flex items-center justify-center">
                 <div className="relative w-full aspect-square bg-dark-800 rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={slide.imageUrl} alt="Visual" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <p className="text-xs text-center text-gray-500 px-4 bg-black/50 py-2 rounded">{slide.visualDescription}</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Layout: Big Number */}
          {slide.layout === SlideLayout.BigNumber && (
            <div className="flex flex-col items-center justify-center h-full">
               <EditableArea
                value={slide.title}
                onChange={(v) => onUpdate(slide.id, 'title', v)}
                className="text-3xl text-gray-400 font-medium mb-8 text-center"
              />
              <div className="relative">
                <EditableArea
                  value={slide.points?.[0] || '100%'}
                  onChange={(v) => {
                    const newPoints = [v, ...(slide.points?.slice(1) || [])];
                    onUpdate(slide.id, 'points', newPoints);
                  }}
                  className="text-[10rem] leading-none font-black text-banana-500 text-center drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                />
              </div>
              <p className="mt-8 text-xl text-gray-300 max-w-xl text-center">
                 {slide.visualDescription}
              </p>
            </div>
          )}

           {/* Layout: Split Image */}
           {slide.layout === SlideLayout.SplitImage && (
             <div className="flex h-full w-full absolute inset-0">
               <div className="w-1/2 bg-dark-900 p-12 flex flex-col justify-center relative z-10">
                  <div className="w-12 h-2 bg-banana-500 mb-6"/>
                  <EditableArea
                    value={slide.title}
                    onChange={(v) => onUpdate(slide.id, 'title', v)}
                    className="text-5xl font-bold text-white mb-6 leading-tight"
                  />
                  <div className="space-y-4 text-gray-300 text-lg">
                    {slide.points?.map((pt, i) => (
                      <p key={i}>• {pt}</p>
                    ))}
                  </div>
               </div>
               <div className="w-1/2 h-full relative">
                  <img src={slide.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-transparent" />
               </div>
             </div>
           )}

           {/* Layout: Section Header */}
           {slide.layout === SlideLayout.SectionHeader && (
             <div className="flex h-full items-center justify-start pl-20 bg-banana-500 text-dark-900 absolute inset-0">
                <div className="max-w-4xl">
                   <h2 className="text-2xl font-bold uppercase tracking-widest opacity-60 mb-4">Section</h2>
                   <EditableArea
                    value={slide.title}
                    onChange={(v) => onUpdate(slide.id, 'title', v)}
                    className="text-7xl font-black text-dark-900"
                  />
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-black/10 skew-x-12 origin-top-right transform translate-x-12" />
             </div>
           )}

        </div>
        
        {/* Speaker Notes Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="bg-black/80 px-4 py-2 rounded-full text-xs text-gray-400 border border-white/10 flex items-center gap-2">
             <span>📝 Notes:</span>
             <span className="truncate max-w-xs">{slide.speakerNotes}</span>
           </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};
