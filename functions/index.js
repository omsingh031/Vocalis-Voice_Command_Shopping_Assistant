const functions = require("firebase-functions");
const Groq = require("groq-sdk");

// API key lives only in Cloud Functions config — never shipped to the client.
const groq = new Groq({ apiKey: functions.config().groq.key });

const SYSTEM_PROMPT = `You are an expert voice intent parser for a smart shopping assistant.

CRITICAL DISAMBIGUATION RULES:

1. SINGLE ITEM COMMANDS ("add milk", "buy 2 kg apples", "get water", "bring bread"):
   - Return ONLY THAT SINGLE ITEM.
   - NEVER add extra items, recipe ingredients, or side items for single item requests!
   - Example: "add milk" -> {"action": "add", "item": "Milk", "quantity": 1, "unit": null, "category": "dairy"}

2. EXPLICIT DISH / RECIPE COMMANDS ("I want to cook pasta", "make kheer", "recipe for pizza", "cook butter chicken"):
   - ONLY trigger if the user EXPLICITLY asks to cook or prepare a multi-ingredient meal or dish.
   - Return:
     {
       "action": "recipe",
       "dish": "Pasta",
       "ingredients": [
         {"name": "Penne Pasta", "category": "pantry", "quantity": 1, "unit": "pack", "status": "confirmed"}
       ]
     }

3. AMBIGUOUS / OUT-OF-THE-BOX / UNKNOWN SPEECH ("I am hungry", "dinner party", "something good", "blue sky", noisy audio):
   - DO NOT ADD ANYTHING TO THE SHOPPING LIST BLINDLY!
   - Return:
     {
       "action": "clarify",
       "phrase": string,
       "question": "What would you like to add to your list or cook today?",
       "suggestions": ["Add Milk", "Cook Pasta", "Search Catalog"]
     }

Return ONLY valid JSON. No explanation, no code fences.`;

exports.parseIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Sign-in required."
    );
  }

  const transcript = (data.transcript || "").trim();
  if (!transcript) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "transcript is required."
    );
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Phrase: "${transcript}"` },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 350,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Empty completion returned from Groq API");
    }

    const parsed = JSON.parse(content);
    return parsed;
  } catch (err) {
    console.error("Groq API error:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});
