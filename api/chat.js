export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    
    // OpenAI'dan gelen cevabı kontrol et ve tam metni gönder
    if (data.choices && data.choices[0]) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      return res.status(500).json({ reply: "OpenAI'dan boş cevap geldi." });
    }

  } catch (error) {
    return res.status(500).json({ reply: "Bağlantı hatası oluştu." });
  }
}
