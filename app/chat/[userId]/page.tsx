"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { BackendUser, backendToUserProfile } from '@/types/user';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isRead?: boolean;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUserId = params.userId as string;

  useEffect(() => {
    if (user && otherUserId) {
      loadOtherUser();
    }
  }, [user, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadOtherUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/user/connections', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Connections data:", data);
        
        if (data.data && Array.isArray(data.data)) {
          const foundUser = data.data.find((user: BackendUser) => user._id === otherUserId);
          
          if (foundUser) {
            console.log("Found user:", foundUser);
            setOtherUser(foundUser);
            // Initialize with sample messages
            setMessages([
              {
                id: '1',
                text: `Hi ${getDisplayName(foundUser)}! 👋 How are you doing today?`,
                sender: user?._id || '',
                timestamp: new Date(Date.now() - 300000),
                isRead: true
              },
              {
                id: '2',
                text: 'Hey! Nice to meet you! 😊 I\'m doing great, thanks for asking!',
                sender: otherUserId,
                timestamp: new Date(Date.now() - 240000),
                isRead: true
              },
              {
                id: '3',
                text: 'That\'s awesome! What do you like to do for fun?',
                sender: user?._id || '',
                timestamp: new Date(Date.now() - 180000),
                isRead: true
              },
              {
                id: '4',
                text: 'I love traveling and trying new foods! 🍕✈️ What about you?',
                sender: otherUserId,
                timestamp: new Date(Date.now() - 120000),
                isRead: true
              }
            ]);
          } else {
            console.error('User not found in connections');
          }
        } else {
          console.error('No connections data found');
        }
      } else {
        console.error('Failed to load connections');
      }
      } catch (error) {
      console.error('Error loading other user:', error);
      } finally {
        setLoading(false);
      }
  };

  const getDisplayName = (user: BackendUser) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.emailId?.split('@')[0] || 'Unknown User';
  };

  const getUsername = (user: BackendUser) => {
    if (user.emailId && typeof user.emailId === 'string') {
      return user.emailId.split('@')[0];
    }
    return user.firstName?.toLowerCase() || 'user';
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: user?._id || '',
        timestamp: new Date(),
        isRead: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate reply
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: getRandomReply(),
          sender: otherUserId,
          timestamp: new Date(),
          isRead: false
        };
        setMessages(prev => [...prev, reply]);
      }, 2000 + Math.random() * 3000);
    }
  };

  const getRandomReply = () => {
    const replies = [
      "That's interesting! Tell me more 😊",
      "I totally agree with you! 👍",
      "That sounds amazing! What else do you like?",
      "Haha, that's funny! 😄",
      "I'd love to hear more about that!",
      "That's so cool! We have a lot in common!",
      "Thanks for sharing that with me! 💕",
      "I'm really enjoying our conversation!",
      "That's awesome! We should definitely meet sometime!",
      "You seem like such an interesting person! 😊"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
        </div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">Loading conversation...</p>
        </motion.div>
      </div>
    );
  }

  if (!user || !otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Chat not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">This user might not be your match or the connection was removed.</p>
          <Link 
            href="/chat" 
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
          >
            Back to Messages
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pt-20">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/chat" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-200 dark:ring-pink-800">
                <Image
                  src={otherUser.photoUrl || "/default-avatar.png"}
                  alt={getDisplayName(otherUser)}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getDisplayName(otherUser)}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{getUsername(otherUser)} • Online
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.sender === user?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                  message.sender === user?._id
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  message.sender === user?._id ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <span>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.sender === user?._id && (
                    <span className="ml-2">
                      {message.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          💡 This is a demo chat with simulated responses. For real-time messaging, configure Stream Chat API keys.
        </p>
      </div>
    </div>
  );
}
