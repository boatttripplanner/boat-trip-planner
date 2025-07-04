'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaUserCircle, FaShip } from 'react-icons/fa';
import { useWizard } from './wizard/WizardContext';

const nauticalBlue = 'bg-gradient-to-r from-blue-800 via-blue-700 to-blue-500';
const accent = 'bg-blue-600';

const initialMessages = [
  { sender: 'ai', text: '¡Hola! ¿En qué puedo ayudarte con tu viaje en barco?' },
];

const FloatingChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const { data } = useWizard();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], context: data }),
      });
      const { reply } = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: reply },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: 'Error al conectar con el asistente. Intenta de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`fixed z-40 bottom-6 right-6 rounded-full shadow-xl p-4 text-white ${accent} hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all backdrop-blur-md bg-opacity-80`}
        onClick={() => setOpen(true)}
        aria-label="Abrir chat"
        style={{ display: open ? 'none' : 'block', fontFamily: 'inherit' }}
      >
        <FaComments size={28} />
      </button>
      {/* Chat Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed z-50 bottom-6 right-6 w-[95vw] max-w-sm h-[70vh] flex flex-col border border-blue-100 shadow-2xl rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              fontFamily: 'Montserrat, Arial, sans-serif',
            }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-t-2xl text-white ${nauticalBlue}`} style={{ fontWeight: 700, letterSpacing: 1 }}>
              <span className="flex items-center gap-2"><FaShip className="text-blue-200" />Asistente Náutico</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar chat" className="hover:text-blue-200">
                <FaTimes size={20} />
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2" style={{ fontFamily: 'inherit' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.03 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="flex items-end mr-2">
                      <FaShip className="text-blue-700 bg-blue-100 rounded-full p-1" size={28} />
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[80%] text-sm shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-200 text-blue-900 rounded-br-none'
                        : 'bg-white/80 text-blue-800 border border-blue-200 rounded-bl-none'
                    }`}
                    style={{ fontWeight: 500, fontFamily: 'inherit' }}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="flex items-end ml-2">
                      <FaUserCircle className="text-blue-400 bg-blue-100 rounded-full" size={28} />
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end mr-2">
                    <FaShip className="text-blue-700 bg-blue-100 rounded-full p-1" size={28} />
                  </div>
                  <div className="px-3 py-2 rounded-2xl max-w-[80%] text-sm shadow-lg bg-white/80 text-blue-400 border border-blue-200 animate-pulse rounded-bl-none" style={{ fontWeight: 500, fontFamily: 'inherit' }}>
                    Pensando...
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <form
              className="flex items-center gap-2 px-4 py-3 border-t border-blue-100 bg-white/70 backdrop-blur-md rounded-b-2xl"
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              style={{ fontFamily: 'inherit' }}
            >
              <input
                className="flex-1 rounded-full border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80"
                type="text"
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus={open}
                disabled={loading}
                style={{ fontFamily: 'inherit', fontWeight: 500 }}
              />
              <button
                type="submit"
                className={`p-2 rounded-full ${accent} text-white hover:bg-blue-700 transition-all shadow-md`}
                aria-label="Enviar"
                disabled={loading || !input.trim()}
                style={{ fontFamily: 'inherit' }}
              >
                <FaPaperPlane size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat; 