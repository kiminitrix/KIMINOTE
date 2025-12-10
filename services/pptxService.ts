import PptxGenJS from 'pptxgenjs';
import { PresentationData, SlideLayout } from '../types';

export const exportPresentation = (data: PresentationData) => {
  const pres = new PptxGenJS();

  // Define Layouts
  pres.layout = 'LAYOUT_16x9';

  // Define Master Slide (Banana Pro Theme)
  pres.defineSlideMaster({
    title: 'KIMINOTE_MASTER',
    background: { color: '1A1A1A' },
    objects: [
      { rect: { x: '97%', y: '0%', w: '3%', h: '100%', fill: { color: 'FFD700' } } },
      { rect: { x: 0, y: 0, w: '100%', h: 0.15, fill: { color: 'FFD700' } } }
    ]
  });

  data.slides.forEach((slideContent) => {
    const slide = pres.addSlide({ masterName: 'KIMINOTE_MASTER' });

    // Notes
    if (slideContent.speakerNotes) {
      slide.addNotes(slideContent.speakerNotes);
    }

    // Common Text Options
    const titleOpts: PptxGenJS.TextPropsOptions = { 
      color: 'FFD700', 
      bold: true, 
      fontFace: 'Arial',
      fontSize: 36 
    };
    
    const bodyOpts: PptxGenJS.TextPropsOptions = { 
      color: 'FFFFFF', 
      fontFace: 'Arial', 
      fontSize: 18 
    };

    switch (slideContent.layout) {
      case SlideLayout.Title:
        slide.addText(slideContent.title, { 
          x: 1, y: 2.5, w: '80%', h: 1.5, 
          fontSize: 54, bold: true, color: 'FFD700', align: 'center' 
        });
        if (slideContent.subtitle) {
          slide.addText(slideContent.subtitle, { 
            x: 1.5, y: 4, w: '70%', h: 1, 
            fontSize: 24, color: 'CCCCCC', align: 'center' 
          });
        }
        break;

      case SlideLayout.BulletPoints:
        slide.addText(slideContent.title, { ...titleOpts, x: 0.5, y: 0.5, w: '90%', h: 1 });
        if (slideContent.points && slideContent.points.length > 0) {
          const bullets = slideContent.points.map(pt => ({
            text: pt,
            options: { bullet: true, breakLine: true, indentLevel: 0 }
          }));
          slide.addText(bullets, { ...bodyOpts, x: 0.5, y: 1.8, w: '60%', h: 5, lineSpacing: 32 });
        }
        // Placeholder shape for visual
        slide.addShape(pres.ShapeType.rect, { x: 8, y: 1.8, w: 4, h: 4, fill: { color: '333333' } });
        slide.addText("Visual: " + slideContent.visualDescription, { x: 8.2, y: 2, w: 3.6, h: 3.6, color: '888888', fontSize: 10 });
        break;

      case SlideLayout.BigNumber:
        slide.addText(slideContent.title, { ...titleOpts, x: 0.5, y: 0.5, w: '90%', h: 1, align: 'center' });
        if (slideContent.points && slideContent.points.length > 0) {
           slide.addText(slideContent.points[0], { 
             x: 0, y: 2.5, w: '100%', h: 2, 
             fontSize: 120, bold: true, color: 'FFD700', align: 'center' 
           });
        }
        break;
      
      case SlideLayout.SplitImage:
        slide.addText(slideContent.title, { ...titleOpts, x: 0.5, y: 0.5, w: '45%', h: 1 });
        if (slideContent.points) {
           const bullets = slideContent.points.map(pt => ({ text: pt, options: { bullet: true } }));
           slide.addText(bullets, { ...bodyOpts, x: 0.5, y: 1.8, w: '45%', h: 5 });
        }
        slide.addShape(pres.ShapeType.rect, { x: 7, y: 0, w: 6.33, h: 7.5, fill: { color: '222222' } });
        slide.addText("Visual Focus", { x: 9, y: 3.5, fontSize: 14, color: '555555' });
        break;

      case SlideLayout.VisualFocus:
        // Full background image logic
        if (slideContent.imageUrl && slideContent.imageUrl.startsWith('data:')) {
           slide.addImage({ data: slideContent.imageUrl, x: 0, y: 0, w: '100%', h: '100%' });
        } else {
           slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: '222222' } });
        }
        // Gradient overlay simulation (semi-transparent rect)
        slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '60%', h: '100%', fill: { color: '000000', transparency: 30 } });
        
        slide.addText(slideContent.title, { ...titleOpts, x: 0.5, y: 2, w: '50%', h: 2, fontSize: 48, shadow: { type: 'outer', color: '000000', blur: 10, offset: 2, angle: 45 } });
        if (slideContent.points) {
           const bullets = slideContent.points.map(pt => ({ text: pt, options: { bullet: false } })); // No bullet for this cinematic look
           slide.addText(bullets, { ...bodyOpts, x: 0.5, y: 4, w: '50%', h: 3, fontSize: 24, color: 'EEEEEE' });
        }
        break;
        
      default:
        slide.addText(slideContent.title, titleOpts);
        break;
    }
  });

  pres.writeFile({ fileName: `KIMINOTE_${data.topic.replace(/\s+/g, '_')}.pptx` });
};