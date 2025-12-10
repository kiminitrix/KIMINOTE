export enum SlideLayout {
  Title = 'title',
  BulletPoints = 'bullet-points',
  BigNumber = 'big-number',
  SplitImage = 'split-image',
  SectionHeader = 'section-header',
  VisualFocus = 'visual-focus'
}

export interface SlideContent {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  points?: string[];
  visualDescription: string;
  speakerNotes: string;
  imageUrl?: string; // Generated or placeholder URL
  isImageGenerating?: boolean;
}

export interface PresentationData {
  topic: string;
  theme: string;
  slides: SlideContent[];
}

export interface AppState {
  step: 'upload' | 'processing' | 'editor';
  file: File | null;
  presentation: PresentationData | null;
  currentSlideIndex: number;
  isGenerating: boolean;
  error: string | null;
  processingStatus: string;
}

export enum ActionType {
  SET_FILE = 'SET_FILE',
  START_PROCESSING = 'START_PROCESSING',
  SET_PRESENTATION = 'SET_PRESENTATION',
  SET_ERROR = 'SET_ERROR',
  SET_CURRENT_SLIDE = 'SET_CURRENT_SLIDE',
  UPDATE_SLIDE = 'UPDATE_SLIDE',
  RESET = 'RESET'
}

export type Action =
  | { type: ActionType.SET_FILE; payload: File }
  | { type: ActionType.START_PROCESSING; payload: string }
  | { type: ActionType.SET_PRESENTATION; payload: PresentationData }
  | { type: ActionType.SET_ERROR; payload: string }
  | { type: ActionType.SET_CURRENT_SLIDE; payload: number }
  | { type: ActionType.UPDATE_SLIDE; payload: { id: string; field: keyof SlideContent; value: any } }
  | { type: ActionType.RESET };