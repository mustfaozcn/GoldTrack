// lib/gemini.ts
export async function parseWithGemini(input: string): Promise<Array<{ type: string; quantity: number; grams?: number }>> {
  try {
    // Artık kendi backend API'mize istek yapıyoruz, doğrudan Gemini'ye değil
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const parsed = await response.json();
    return parsed;
  } catch (error) {
    console.error('Gemini API error:', error);
    return [];
  }
}
