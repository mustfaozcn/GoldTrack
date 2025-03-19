import { GoogleGenerativeAI } from '@google/generative-ai';

// API anahtarını .env dosyasından alıyoruz
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const PROMPT_TEMPLATE = `
You are a gold calculator assistant. Parse the following Turkish text and extract gold items.
Return ONLY a JSON array of objects with 'type', 'quantity', and optional 'grams' properties.

Available gold types:
- GRA: Gram Altın
- TAM: Tam Altın
- YAR: Yarım Altın
- CEY: Çeyrek Altın
- CUM: Cumhuriyet Altını
- ATA: Ata Altın
- ODA: 14 Ayar Altın (requires grams)
- OSA: 18 Ayar Altın (requires grams)
- YIA: 22 Ayar Bilezik (requires grams)
- IKI: İki Buçuk Altın
- BES: Beşli Altın
- GRE: Gremse Altın
- RES: Reşat Altın
- HAM: Hamit Altın

For jewelry items (ODA, OSA, YIA), include the 'grams' property to specify weight per piece.

Example inputs and outputs:
"2 tam altın ve 1 çeyrek"
[{"type":"TAM","quantity":2},{"type":"CEY","quantity":1}]

"3 tane 22 ayar 5 gramlık bilezik"
[{"type":"YIA","quantity":3,"grams":5}]

"2 tane 14 ayar 2 gramlık yüzük"
[{"type":"ODA","quantity":2,"grams":2}]

Input text: `;

export async function parseWithGemini(input: string): Promise<Array<{ type: string; quantity: number; grams?: number }>> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    const result = await model.generateContent(PROMPT_TEMPLATE + input);
    
    const text = result.response.candidates[0].content.parts[0].text;
    const jsonText = text.replace(/```json\n|\n```/g, '');
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (error) {
    console.error('Gemini API error:', error);
    return [];
  }
}