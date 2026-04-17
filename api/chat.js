const handler = async (req, res) => {
  // Sadece POST isteklerini kabul et
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "Sen yardımsever ve empatik bir asistansın. Sadece Türkçe konuş. Samimi ama saygılı bir dil kullan." 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      const answer = data.choices[0].message.content;
      res.status(200).json({ answer });
    } else {
      res.status(500).json({ answer: "API'den boş yanıt döndü." });
    }
  } catch (error) {
    res.status(500).json({ answer: "Sunucu hatası: " + error.message });
  }
};

module.exports = handler;
