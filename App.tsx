
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { Message, Sender } from './types';
import { initChat, sendMessageStream } from './services/geminiService';
import { ChatBubble } from './components/ChatBubble';
import { LoadingIndicator } from './components/LoadingIndicator';
import { PalmLeafIcon, SendIcon } from './components/icons';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: 'Halo! Saya Asisten Sawit AI. Apa yang bisa saya bantu hari ini terkait perkebunan kelapa sawit Anda?',
      sender: Sender.AI,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const chatInstance = initChat();
      setChat(chatInstance);
    } catch (e: unknown) {
      if (e instanceof Error) {
          setError(`Gagal menginisialisasi AI: ${e.message}. Pastikan API Key sudah benar.`);
      } else {
          setError("Terjadi kesalahan yang tidak diketahui saat inisialisasi.");
      }
    }
  }, []);
  
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
    });
  }, [messages, isLoading]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: Sender.User,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const aiMessageId = `ai-${Date.now()}`;
    // Add a placeholder for the AI response
    setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: Sender.AI }]);

    try {
      const stream = await sendMessageStream(chat, input);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunkText } : msg
          )
        );
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.';
      setError(`Gagal mendapatkan respon dari AI: ${errorMessage}`);
      // Remove the empty AI message on error
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, chat]);

  return (
    <div className="flex flex-col h-screen bg-background font-sans">
      <header className="bg-brand-green shadow-md p-4 flex items-center gap-3 text-white sticky top-0 z-10">
        <PalmLeafIcon className="w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold">Asisten Kebun Sawit AI</h1>
          <p className="text-sm opacity-90">Didukung oleh Gemini</p>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
           // Do not render empty AI message placeholder
          (msg.sender === Sender.AI && msg.text === '') ? null : <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <LoadingIndicator />}
        {error && (
            <div className="flex justify-center">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-xl" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        )}
         <div className="h-16" />
      </main>

      <footer className="p-4 bg-background/80 backdrop-blur-sm sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex items-center gap-2 p-2 bg-surface rounded-full shadow-lg border border-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "AI sedang berpikir..." : "Ketik pertanyaan Anda..."}
            className="flex-1 bg-transparent px-4 py-2 text-text-primary focus:outline-none disabled:cursor-not-allowed"
            disabled={isLoading || !chat}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !chat}
            className="bg-brand-green text-white rounded-full p-3 hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-brand-green-light focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Kirim Pesan"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
