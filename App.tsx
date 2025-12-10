import React, { useReducer } from 'react';
import { AppState, Action, ActionType } from './types';
import { FileUpload } from './components/FileUpload';
import { Editor } from './components/Editor';
import { parseFile } from './services/fileParser';
import { generateSlides } from './services/geminiService';

const initialState: AppState = {
  step: 'upload',
  file: null,
  presentation: null,
  currentSlideIndex: 0,
  isGenerating: false,
  error: null,
  processingStatus: ''
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case ActionType.SET_FILE:
      return { ...state, file: action.payload, error: null };
    case ActionType.START_PROCESSING:
      return { ...state, step: 'processing', isGenerating: true, processingStatus: action.payload };
    case ActionType.SET_PRESENTATION:
      return { ...state, step: 'editor', isGenerating: false, presentation: action.payload, currentSlideIndex: 0 };
    case ActionType.SET_ERROR:
      return { ...state, error: action.payload, step: 'upload', isGenerating: false };
    case ActionType.SET_CURRENT_SLIDE:
      return { ...state, currentSlideIndex: action.payload };
    case ActionType.UPDATE_SLIDE:
      if (!state.presentation) return state;
      const updatedSlides = state.presentation.slides.map(slide => 
        slide.id === action.payload.id 
          ? { ...slide, [action.payload.field]: action.payload.value }
          : slide
      );
      return { ...state, presentation: { ...state.presentation, slides: updatedSlides } };
    case ActionType.RESET:
      return initialState;
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFileSelect = async (file: File) => {
    dispatch({ type: ActionType.SET_FILE, payload: file });
    dispatch({ type: ActionType.START_PROCESSING, payload: 'Reading document...' });

    try {
      // 1. Parse File
      const textContent = await parseFile(file);
      
      // 2. Generate Content
      dispatch({ type: ActionType.START_PROCESSING, payload: 'Designing slides with Gemini AI...' });
      const presentationData = await generateSlides(textContent);
      
      dispatch({ type: ActionType.SET_PRESENTATION, payload: presentationData });

    } catch (err: any) {
      console.error(err);
      dispatch({ type: ActionType.SET_ERROR, payload: err.message || 'Something went wrong.' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-banana-500 selection:text-black">
      {state.error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-pulse">
          Error: {state.error}
          <button 
             onClick={() => dispatch({ type: ActionType.SET_ERROR, payload: '' })} 
             className="ml-4 font-bold hover:text-black"
          >✕</button>
        </div>
      )}

      {state.step === 'upload' || state.step === 'processing' ? (
        <FileUpload 
          onFileSelect={handleFileSelect} 
          isProcessing={state.isGenerating}
          status={state.processingStatus}
        />
      ) : (
        <Editor state={state} dispatch={dispatch} />
      )}
    </div>
  );
};

export default App;
