import { NextApiRequest, NextApiResponse } from "next";

// Hugging Face API configuration
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = "facebook/bart-large-mnli";

const CATEGORIES = [
  "intro",
  "contact", 
  "stack",
  "work",
  "english",
  "fun"
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ statusCode: 405, message: "Method not allowed" });
    return;
  }

  const { text } = req.body;

  if (!text) {
    res.status(400).json({ statusCode: 400, message: "Text is missing" });
    return;
  }

  if (!HF_API_KEY) {
    res.status(500).json({ statusCode: 500, message: "Hugging Face API key is missing" });
    return;
  }

  try {
    // Use Hugging Face inference API
    const response = await fetch(
      `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            candidate_labels: CATEGORIES,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error Response:", errorText);
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("HF API Response:", result);
    
    // Extract the classification from the response
    if (Array.isArray(result) && result.length > 0) {
      const classification = result[0];
      
      res.status(200).json({
        message: "success",
        classification: {
          label: classification.label,
          confidence: classification.score,
        },
      });
    } else {
      res.status(500).json({ 
        statusCode: 500, 
        message: "Invalid response from Hugging Face API" 
      });
    }
  } catch (error) {
    console.error("Classification error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      statusCode: 500, 
      message: "Internal server error during classification",
      error: error.message 
    });
  }
}
