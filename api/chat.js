export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Pesan kosong"
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: "Kamu adalah Nero AI, teman AI milik Kodi. Jawab dengan bahasa Indonesia yang santai, natural, ramah, dan gaul."
              }
            ]
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gagal menghubungi Gemini"
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Nero belum mendapatkan jawaban.";

    return res.status(200).json({
      reply
    });
  } catch (error) {
    return res.status(500).json({
      error: "Terjadi kesalahan pada server",
      details: error.message
    });
  }
}
