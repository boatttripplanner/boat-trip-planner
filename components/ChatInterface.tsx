import React, { useState, useRef, useEffect } from 'react';
import { AppChatSession, ChatMessage } from '../types';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  chatSession: AppChatSession;
  onSendMessage: (message: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatSession, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatSession.history]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !chatSession.isLoading) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  const markdownComponents = {
    p: ({node, ...props}: any) => <p className="mb-2 leading-relaxed" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc list-inside pl-4 mb-2 space-y-1" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal list-inside pl-4 mb-2 space-y-1" {...props} />,
    strong: ({node, ...props}: any) => <strong className="font-semibold" {...props} />,
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 p-8 rounded-3xl shadow-2xl mt-8 border border-blue-100/50 backdrop-blur-sm">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6">
        Refinar Recomendación
      </h3>
      <div className="max-h-96 overflow-y-auto mb-6 p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 rounded-2xl space-y-4 border border-slate-200/50 shadow-inner">
        {chatSession.history.map((msg) => (
          <div key={msg.id} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-4 rounded-2xl break-words shadow-lg transition-all duration-300 hover:scale-105
                ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white shadow-blue-500/25'
                  : 'bg-gradient-to-r from-slate-100 via-gray-100 to-slate-200 text-slate-800 border border-slate-200/50'}
              `}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {msg.content}
              </ReactMarkdown>
              <div className={`text-xs mt-2 font-medium ${msg.role === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {chatSession.isLoading && chatSession.history.length > 0 && chatSession.history[chatSession.history.length-1].role === 'user' && (
          <div className="flex justify-start items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-100 via-gray-100 to-slate-200 text-slate-800 border border-slate-200/50">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-3 mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-grow px-6 py-4 rounded-2xl border border-slate-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-slate-800 placeholder:text-slate-400 transition-all duration-200 hover:shadow-xl"
          disabled={chatSession.isLoading}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || chatSession.isLoading}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white font-bold shadow-lg hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 disabled:bg-gradient-to-r disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 hover:shadow-xl hover:scale-105"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;