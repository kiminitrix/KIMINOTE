// Declaration for external library loaded via CDN
declare const pdfjsLib: any;

export const parseFile = async (file: File): Promise<string> => {
  const fileType = file.type;

  try {
    if (fileType === 'application/pdf') {
      return await parsePDF(file);
    } else if (fileType === 'text/plain' || fileType === 'text/csv' || fileType === 'application/json') {
      return await parseText(file);
    } else {
      // For DOCX/PPTX in a pure browser environment without heavy WASM bundles, 
      // we might treat them as binary text or ask user for PDF/Text. 
      // For this demo, we fall back to reading as text and hoping for the best, 
      // or erroring out if strictly binary.
      // Ideally we would use 'mammoth' for docx, but let's stick to reliable PDF/Text for this demo scope.
      if (file.name.endsWith('.docx') || file.name.endsWith('.pptx')) {
          throw new Error("For best results in this demo version, please convert DOCX/PPTX to PDF or Text.");
      }
      return await parseText(file);
    }
  } catch (error: any) {
    console.error("File parsing error:", error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

const parseText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || '');
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const parsePDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += ` ${pageText}`;
  }

  return fullText;
};
