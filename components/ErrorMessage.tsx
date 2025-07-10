
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-500/90 border-l-4 border-red-700 p-4 rounded-lg shadow text-white flex items-center gap-3">
      <span className="font-bold text-xl">¡Error!</span>
      <span className="text-white text-sm">{message}</span>
    </div>
  );
};