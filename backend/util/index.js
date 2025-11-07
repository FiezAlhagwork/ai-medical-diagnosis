// Helper: sanitize the model output so JSON.parse can succeed
// Returns a parsed object when possible, otherwise returns the cleaned string
const sanitizeResultString = (str) => {
  if (typeof str !== "string") return str;

  // If the model returned a fenced code block like ```json\n{...}\n```
  // extract the first JSON object between the first '{' and the last '}'
  let cleaned = str;
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1).trim();
  } else {
    // Otherwise remove common markdown fences and language tags and trim
    cleaned = cleaned
      .replace(/```[a-zA-Z]*\n?/g, "")
      .replace(/```/g, "")
      .trim();
  }

  // Try to parse cleaned string to JSON; if fails, return the cleaned string
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    return cleaned;
  }
};

module.exports = { sanitizeResultString };
