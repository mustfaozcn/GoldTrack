// app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Rotanın her zaman dinamik olarak işlenmesini sağla
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { input } = await request.json();

        // API anahtarını güvenli bir şekilde saklayın
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

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

        // Gemini API'ye istek gönder
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-8b:generateContent",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: PROMPT_TEMPLATE + input }]
                        }
                    ]
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        const data = await response.json();

        // Gemini API yanıtından metni çıkar
        const text = data.candidates[0].content.parts[0].text;

        // JSON formatına çevir
        const jsonText = text.replace(/```json\n|\n```/g, '');

        try {
            const parsed = JSON.parse(jsonText);
            return NextResponse.json(parsed);
        } catch (e) {
            return NextResponse.json({ error: 'Failed to parse JSON response', text }, { status: 500 });
        }

    } catch (error) {
        console.error('Error proxying to Gemini API:', error);
        return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
    }
}
