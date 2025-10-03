export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `HTML for: ${prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.1
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || `<div class="alert alert-info">${prompt}</div>`;

    res.status(200).json({ content });
  } catch (error) {
    console.error('Generation failed:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
}