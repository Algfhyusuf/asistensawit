
import { GoogleGenAI, Chat } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat;

const SYSTEM_INSTRUCTION = `Anda adalah "Asisten Sawit AI", seorang ahli virtual yang berspesialisasi dalam perkebunan kelapa sawit. Misi Anda adalah membantu petani, manajer perkebunan, dan siapa pun yang tertarik dengan kelapa sawit. Berikan jawaban yang akurat, praktis, dan mudah dipahami dalam Bahasa Indonesia. Topik Anda meliputi:
1.  **Budidaya**: Pemilihan bibit, persiapan lahan, penanaman, dan perawatan.
2.  **Hama dan Penyakit**: Identifikasi, pencegahan, dan pengendalian.
3.  **Pemupukan**: Jenis pupuk, dosis, dan jadwal pemupukan.
4.  **Panen dan Pasca-Panen**: Kriteria matang panen, teknik panen, dan penanganan Tandan Buah Segar (TBS).
5.  **Manajemen Perkebunan**: Praktik terbaik, keberlanjutan (RSPO/ISPO), dan efisiensi.
Selalu bersikap ramah, membantu, dan profesional.`;

export function initChat(): Chat {
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      },
    });
  }
  return chat;
}

export async function sendMessageStream(
  chatInstance: Chat,
  message: string
): Promise<AsyncGenerator<GenerateContentResponse>> {
  if (!message.trim()) {
    throw new Error("Cannot send an empty message.");
  }
  
  const result = await chatInstance.sendMessageStream({ message });
  return result;
}
