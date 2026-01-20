const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.get('/quote', auth, async (req, res) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a romantic poet. Generate a short, beautiful, and deeply moving romantic quote or a couple of lines of poetry for a girl. Keep it under 30 words. IMPORTANT: Do not use the phrase 'my love' or 'mylove'. Do not use hashtags or emojis. Just the text."
                },
                {
                    role: "user",
                    content: "Generate a romantic word for her."
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
            max_tokens: 100,
        });

        let quote = chatCompletion.choices[0].message.content.trim().replace(/^"|"$/g, '');
        // Manual filter to ensure "my love" is removed just in case
        quote = quote.replace(/my\s*love/gi, 'heart');
        res.send({ quote });
    } catch (err) {
        console.error('Groq Error:', err);
        res.status(500).send({ message: 'Failed to generate romantic word' });
    }
});

module.exports = router;
