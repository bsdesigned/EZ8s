export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create compact HTML content using Bootstrap 5 classes for: "${prompt}". 

Constraints:
- Content must fit in a small card (200-300px height)
- Use small Bootstrap components (btn-sm, small text, compact spacing)
- Maximum 3-5 elements total
- Use classes like: p-1, m-1, small, btn-sm, badge, list-group-item-sm
- Keep text concise and minimal
- Return ONLY the HTML code without explanations
- Do not wrap in markdown code blocks or \`\`\`html tags

Example good sizes: small buttons, badges, short lists (2-3 items), mini forms, compact alerts.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7
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