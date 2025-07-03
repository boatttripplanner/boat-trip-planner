import React, { useState, useRef, useEffect } from 'react';
import { AppChatSession, ChatMessage } from '../types';
import { Button } from './Button';
import { ChatSendIcon } from './icons/ChatSendIcon';
import { UserAvatarIcon } from './icons/UserAvatarIcon';
import { SparklesIcon } from './icons/SparklesIcon'; // AI icon
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
    <div className="bg-white p-4 rounded-lg shadow-md mt-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Refinar Recomendación</h3>
      <div className="max-h-80 overflow-y-auto mb-4 p-3 bg-slate-50 rounded-md space-y-3">
        {chatSession.history.map((msg) => (
          <div key={msg.id} className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <SparklesIcon className="w-6 h-6 text-teal-500 mr-2 flex-shrink-0 mt-1" aria-hidden="true" />}
            <div
              className={`max-w-[80%] p-3 rounded-xl break-words ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {msg.content}
              </ReactMarkdown>
              <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-teal-200 text-right' : 'text-slate-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
             {msg.role === 'user' && <UserAvatarIcon className="w-6 h-6 text-slate-600 ml-2 flex-shrink-0 mt-1" aria-hidden="true" />}
          </div>
        ))}
        {chatSession.isLoading && chatSession.history.length > 0 && chatSession.history[chatSession.history.length-1].role === 'user' && (
          <div className="flex justify-start items-center">
            <SparklesIcon className="w-6 h-6 text-teal-500 mr-2 flex-shrink-0" aria-hidden="true" />
            <div className="p-3 rounded-xl bg-slate-200 text-slate-800">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Pregunta algo o pide un ajuste..."
          className="flex-grow mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-base text-slate-900 placeholder:text-slate-500"
          aria-label="Escribe tu mensaje para el chat"
          disabled={chatSession.isLoading}
        />
        <Button type="submit" disabled={chatSession.isLoading || !newMessage.trim()} className="p-2.5" aria-label="Enviar mensaje">
          <ChatSendIcon className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;