
import React from 'react';
import { Message, Sender } from '../types';
import { BotIcon, PalmLeafIcon } from './icons';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const bubbleClasses = isUser
    ? 'bg-brand-green text-white self-end'
    : 'bg-surface text-text-primary self-start';
  
  const wrapperClasses = isUser ? 'justify-end' : 'justify-start';

  const Avatar = () => (
    isUser ? (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green-light flex items-center justify-center">
        <PalmLeafIcon className="w-5 h-5 text-white" />
      </div>
    ) : (
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <BotIcon className="w-5 h-5 text-brand-green-dark" />
      </div>
    )
  );

  return (
    <div className={`flex items-end gap-2 w-full max-w-xl mx-auto ${wrapperClasses}`}>
      {!isUser && <Avatar />}
      <div
        className={`rounded-lg px-4 py-3 max-w-[80%] break-words ${bubbleClasses}`}
        style={{
          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
        }}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
       {isUser && <Avatar />}
    </div>
  );
};
