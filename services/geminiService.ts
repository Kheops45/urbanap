import { GoogleGenAI } from "@google/genai";
import { ParkingStats } from "../types";

export const getParkingAnalysis = async (stats: ParkingStats): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Clé API manquante. Impossible de générer l'analyse.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Analyse les données de stationnement suivantes pour une zone urbaine (Orléans) :
      - Total places: ${stats.total}
      - Places disponibles: ${stats.available}
      - Taux d'occupation: ${stats.occupancyRate}%
      
      Agis comme un expert en urbanisme et IA.
      1. Donne une prédiction courte sur la demande dans l'heure à venir.
      2. Suggère une stratégie pour un conducteur cherchant une place maintenant.
      3. Sois concis (max 3 phrases). Réponds en français.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analyse indisponible pour le moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erreur lors de la génération de l'analyse prédictive.";
  }
};