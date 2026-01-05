const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAkf5IK-KkkTHFePhWbN_gKuzBFuBtHR9g",
});

async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return { message: `Error generating content ${error}`, error: true };
  }
}

module.exports = { main };
