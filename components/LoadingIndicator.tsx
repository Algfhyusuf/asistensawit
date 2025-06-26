
import React from 'react';
import { BotIcon } from './icons';

export const LoadingIndicator: React.FC = () => (
  <div className="flex items-end gap-2 w-full max-w-xl mx-auto justify-start">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
      <BotIcon className="w-5 h-5 text-brand-green-dark" />
    </div>
    <div className="bg-surface text-text-primary self-start rounded-lg px-4 py-3" style={{borderRadius: '20px 20px 20px 4px'}}>
      <div className="flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);
