import { PresentationData } from '../types';

export const generateHTML = (data: PresentationData): string => {
  const jsonString = JSON.stringify(data).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.topic || 'KIMINOTE Presentation'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              banana: { 400: '#FFE135', 500: '#FFD700', 600: '#E6C200' },
              dark: { 800: '#2A2A2A', 900: '#1A1A1A', 950: '#0F0F0F' }
            },
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            animation: { 'blob': 'blob 7s infinite' },
            keyframes: {
              blob: {
                '0%': { transform: 'translate(0px, 0px) scale(1)' },
                '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                '100%': { transform: 'translate(0px, 0px) scale(1)' },
              }
            }
          },
        },
      }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
        "framer-motion": "https://esm.sh/framer-motion@10.16.4"
      }
    }
    </script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      body { background-color: #0F0F0F; color: white; overflow: hidden; margin: 0; }
      #root { height: 100vh; width: 100vw; }
      /* Hide scrollbars */
      ::-webkit-scrollbar { display: none; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel" data-type="module">
        import React, { useState, useEffect } from 'react';
        import ReactDOM from 'react-dom/client';
        import { motion, AnimatePresence } from 'framer-motion';

        const presentation = ${jsonString};

        const SlideRenderer = ({ slide, direction }) => {
            const variants = {
                enter: (direction) => ({
                    x: direction > 0 ? 1000 : -1000,
                    opacity: 0,
                    scale: 0.95
                }),
                center: {
                    zIndex: 1,
                    x: 0,
                    opacity: 1,
                    scale: 1
                },
                exit: (direction) => ({
                    zIndex: 0,
                    x: direction < 0 ? 1000 : -1000,
                    opacity: 0,
                    scale: 0.95
                })
            };

            const content = () => {
                // Layout: Title
                if (slide.layout === 'title') {
                    return (
                        <div className="flex flex-col justify-center items-center h-full text-center space-y-6 p-12">
                            <span className="text-banana-500 tracking-[0.3em] text-sm uppercase font-bold">Presentation</span>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-5xl">{slide.title}</h1>
                            <p className="text-2xl text-gray-400 font-light max-w-3xl">{slide.subtitle}</p>
                        </div>
                    );
                }
                
                // Layout: Bullet Points
                if (slide.layout === 'bullet-points') {
                    return (
                        <div className="flex flex-col md:flex-row h-full gap-8 p-12">
                            <div className="w-full md:w-2/3 flex flex-col justify-center">
                                <div className="border-l-4 border-banana-500 pl-6 mb-8">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white">{slide.title}</h2>
                                </div>
                                <ul className="space-y-6 mt-4">
                                    {slide.points?.map((point, idx) => (
                                        <li key={idx} className="flex items-start text-xl md:text-2xl text-gray-200">
                                            <span className="text-banana-500 mr-4 mt-1">➤</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-full md:w-1/3 flex items-center justify-center">
                                {slide.imageUrl && (
                                  <div className="relative w-full aspect-square bg-dark-800 rounded-2xl overflow-hidden border border-white/10">
                                    <img src={slide.imageUrl} className="w-full h-full object-cover" />
                                  </div>
                                )}
                            </div>
                        </div>
                    );
                }

                // Layout: Big Number
                if (slide.layout === 'big-number') {
                     return (
                        <div className="flex flex-col items-center justify-center h-full p-12">
                            <h2 className="text-3xl text-gray-400 font-medium mb-8 text-center">{slide.title}</h2>
                            <div className="text-[8rem] md:text-[12rem] leading-none font-black text-banana-500 text-center drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                                {slide.points?.[0]}
                            </div>
                            <p className="mt-8 text-xl text-gray-300 max-w-2xl text-center">{slide.visualDescription}</p>
                        </div>
                     );
                }

                // Layout: Split Image
                if (slide.layout === 'split-image') {
                    return (
                        <div className="flex flex-col md:flex-row h-full w-full">
                             <div className="w-full md:w-1/2 bg-dark-900 p-12 flex flex-col justify-center relative z-10">
                                <div className="w-12 h-2 bg-banana-500 mb-6"/>
                                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{slide.title}</h2>
                                <div className="space-y-4 text-gray-300 text-lg md:text-xl">
                                  {slide.points?.map((pt, i) => (
                                    <p key={i}>• {pt}</p>
                                  ))}
                                </div>
                             </div>
                             <div className="w-full md:w-1/2 h-full relative">
                                <img src={slide.imageUrl || 'https://placehold.co/800x800/222/FFF'} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-transparent pointer-events-none" />
                             </div>
                        </div>
                    );
                }

                // Layout: Section Header
                if (slide.layout === 'section-header') {
                    return (
                        <div className="flex h-full items-center justify-start pl-12 md:pl-24 bg-banana-500 text-dark-900 relative overflow-hidden">
                          <div className="max-w-4xl z-10">
                             <h2 className="text-2xl font-bold uppercase tracking-widest opacity-60 mb-4">Section</h2>
                             <h1 className="text-6xl md:text-8xl font-black text-dark-900">{slide.title}</h1>
                          </div>
                          <div className="absolute right-0 top-0 h-full w-1/3 bg-black/10 skew-x-12 origin-top-right transform translate-x-12" />
                       </div>
                    );
                }

                // Layout: Visual Focus
                if (slide.layout === 'visual-focus') {
                    return (
                       <div className="absolute inset-0 w-full h-full bg-black">
                         {slide.imageUrl && <img src={slide.imageUrl} className="w-full h-full object-cover absolute inset-0 opacity-80" />}
                         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                         <div className="relative z-10 h-full w-full flex flex-col justify-center px-16 max-w-4xl">
                            <span className="text-banana-500 font-mono text-sm tracking-[0.2em] uppercase mb-6">Visual Focus</span>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8 drop-shadow-xl">{slide.title}</h1>
                            <div className="space-y-4">
                              {slide.points?.map((pt, idx) => (
                                <p key={idx} className="text-2xl text-gray-100 font-light border-l-4 border-banana-500 pl-4 bg-black/30 backdrop-blur-sm py-2 pr-4 rounded-r-lg w-fit">
                                  {pt}
                                </p>
                              ))}
                            </div>
                         </div>
                       </div>
                    );
                }
                
                return <div className="p-12">Unknown Layout</div>;
            };

            return (
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={slide.id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 w-full h-full bg-dark-900 overflow-hidden shadow-2xl"
                    >
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-banana-500/10 to-transparent pointer-events-none" />
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-banana-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
                        
                        {content()}
                    </motion.div>
                </AnimatePresence>
            );
        };

        const App = () => {
            const [index, setIndex] = useState(0);
            const [direction, setDirection] = useState(0);

            useEffect(() => {
                const handleKeyDown = (e) => {
                    if (e.key === 'ArrowRight' || e.key === 'Space') {
                        if (index < presentation.slides.length - 1) {
                            setDirection(1);
                            setIndex(i => i + 1);
                        }
                    } else if (e.key === 'ArrowLeft') {
                        if (index > 0) {
                            setDirection(-1);
                            setIndex(i => i - 1);
                        }
                    }
                };
                window.addEventListener('keydown', handleKeyDown);
                return () => window.removeEventListener('keydown', handleKeyDown);
            }, [index]);

            const next = () => {
                if (index < presentation.slides.length - 1) {
                    setDirection(1);
                    setIndex(index + 1);
                }
            };

            const prev = () => {
                if (index > 0) {
                    setDirection(-1);
                    setIndex(index - 1);
                }
            };

            return (
                <div className="h-screen w-full flex flex-col bg-dark-950 relative overflow-hidden font-sans">
                     <div className="flex-1 relative w-full h-full">
                         <SlideRenderer slide={presentation.slides[index]} direction={direction} />
                     </div>
                     
                     <div className="absolute bottom-0 w-full p-6 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity z-50 bg-gradient-to-t from-black/80 to-transparent">
                        <button onClick={prev} className="p-3 bg-white/10 rounded-full hover:bg-banana-500 hover:text-black transition-colors disabled:opacity-30" disabled={index === 0}>←</button>
                        <span className="text-white/50 text-xs tracking-widest">{index + 1} / {presentation.slides.length}</span>
                        <button onClick={next} className="p-3 bg-white/10 rounded-full hover:bg-banana-500 hover:text-black transition-colors disabled:opacity-30" disabled={index === presentation.slides.length - 1}>→</button>
                     </div>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`;
};
