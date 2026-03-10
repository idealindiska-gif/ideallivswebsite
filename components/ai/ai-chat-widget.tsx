'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, MessageCircle, Minimize2, Maximize2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getGreeting } from '@/lib/knowledge-base';
import { FeedbackForm } from '@/components/ai/feedback-form';
import Image from 'next/image';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Ideal LIVS logo URL
const LOGO_URL = 'https://crm.ideallivs.com/wp-content/uploads/2025/05/ideal-favicon.png';

// ─── Floating Launcher Button ─────────────────────────────────────────────────
// Renders a persistent bubble bottom-right on every page
export function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewMsg, setHasNewMsg] = useState(false);

    // Show a notification dot after 8 seconds if user hasn't opened
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setHasNewMsg(true);
        }, 8000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
        setHasNewMsg(false);
    };

    return (
        <>
            {/* Floating Launcher Bubble — always visible */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        key="launcher"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={handleOpen}
                        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
                        aria-label="Open Ideal Assistant chat"
                    >
                        <Bot className="h-6 w-6" />
                        {/* Notification dot */}
                        {hasNewMsg && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <ChatWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: getGreeting(),
            timestamp: new Date(),
        },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen, isMinimized]);

    // Build conversation history for the API (all messages so far)
    const buildHistory = useCallback((msgs: Message[]): Array<{ role: 'user' | 'assistant'; content: string }> => {
        return msgs
            .filter(m => m.id !== '1') // Skip the static greeting
            .map(m => ({ role: m.role, content: m.content }));
    }, []);

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isTyping) return;

        const userText = chatInput.trim();
        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newUserMessage]);
        setChatInput('');
        setIsTyping(true);
        setError(null);

        try {
            // Build history including the new user message
            const history = [...buildHistory(messages), { role: 'user' as const, content: userText }];

            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history }),
            });

            const data = await res.json();

            const aiText = data.answer || "Sorry, I couldn't get a response. Please try again or contact us on WhatsApp.";

            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiText,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, newAiMessage]);

        } catch (err) {
            console.error('Chat error:', err);
            setError('Connection failed. Please try again.');
        } finally {
            setIsTyping(false);
        }
    };

    const saveChatLogs = async () => {
        const userMessages = messages.filter(m => m.role === 'user');
        if (userMessages.length === 0) return;

        try {
            await fetch('/api/chat-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    messages: messages.map(m => ({
                        role: m.role,
                        content: m.content,
                        timestamp: m.timestamp.toISOString()
                    })),
                    metadata: {
                        page: window.location.pathname,
                        messageCount: messages.length,
                    }
                }),
            });
        } catch (error) {
            console.error('Failed to save chat logs:', error);
        }
    };

    useEffect(() => {
        if (!isOpen && messages.length > 1) {
            saveChatLogs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "overflow-hidden rounded-xl border border-border bg-background shadow-xl flex flex-col",
                    isMinimized ? "h-14 w-72" : "h-[500px] w-[340px]"
                )}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-3 py-2.5 bg-primary shrink-0">
                    <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden bg-white border-2 border-white/50">
                        <Image
                            src={LOGO_URL}
                            alt="Ideal LIVS"
                            fill
                            className="object-contain p-0.5"
                        />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="font-semibold text-sm text-primary-foreground truncate mb-0">Ideal Assistant</h3>
                        {!isMinimized && (
                            <p className="text-[11px] text-primary-foreground/80 leading-none flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                Powered by AI · Always here to help
                            </p>
                        )}
                    </div>
                    <div className="flex items-center shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary-foreground/10 text-primary-foreground"
                            onClick={() => setIsMinimized(!isMinimized)}
                            aria-label={isMinimized ? 'Expand chat' : 'Minimise chat'}
                        >
                            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary-foreground/10 text-primary-foreground"
                            onClick={onClose}
                            aria-label="Close chat"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                {!isMinimized && (
                    <>
                        {showFeedback ? (
                            <div className="flex-1 overflow-y-auto p-3 bg-muted/30">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-sm text-foreground">Send Feedback</h4>
                                    <Button variant="ghost" size="sm" onClick={() => setShowFeedback(false)} className="text-xs text-primary hover:bg-primary/10 h-7 px-2">
                                        Back
                                    </Button>
                                </div>
                                <FeedbackForm
                                    onClose={() => setShowFeedback(false)}
                                    onSuccess={() => setTimeout(() => setShowFeedback(false), 2000)}
                                />
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/20">
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index === messages.length - 1 ? 0 : 0 }}
                                            className={cn(
                                                "flex w-max max-w-[88%] flex-col gap-0.5 rounded-xl px-3 py-2 text-sm",
                                                msg.role === 'assistant'
                                                    ? "self-start rounded-tl-sm bg-background text-foreground border border-border shadow-sm"
                                                    : "self-end rounded-tr-sm bg-primary text-primary-foreground shadow-sm"
                                            )}
                                        >
                                            <div
                                                className="leading-relaxed text-[13px]"
                                                dangerouslySetInnerHTML={{
                                                    __html: msg.content
                                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                                                        .replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" target="_blank" rel="noopener" class="underline underline-offset-2 hover:opacity-80 transition-opacity ${msg.role === 'assistant' ? 'text-primary' : 'text-white'}">$1</a>`)
                                                        .replace(/\n/g, '<br />')
                                                }}
                                            />
                                            <span className={cn("text-[9px]", msg.role === 'assistant' ? 'text-muted-foreground' : 'text-white/70')}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </motion.div>
                                    ))}

                                    {/* Typing indicator */}
                                    {isTyping && (
                                        <div className="self-start rounded-xl rounded-tl-sm bg-background px-3 py-2.5 border border-border shadow-sm">
                                            <div className="flex gap-1 items-center">
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <p className="text-xs text-red-500 text-center px-2">{error}</p>
                                    )}

                                    <div ref={scrollRef} />
                                </div>

                                {/* Quick Suggestions */}
                                {messages.length === 1 && (
                                    <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                                        {['Delivery info', 'Halal meat', 'Basmati rice', 'Track order'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => {
                                                    setChatInput(s);
                                                    setTimeout(() => handleSendMessage(), 50);
                                                }}
                                                className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input */}
                                <div className="p-2.5 bg-background border-t border-border shrink-0">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }}
                                        className="flex gap-2"
                                    >
                                        <Input
                                            ref={inputRef}
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            placeholder="Ask about products, delivery..."
                                            className="flex-1 h-9 rounded-full bg-muted border-transparent text-sm focus:border-primary/50 focus:bg-background transition-all"
                                            disabled={isTyping}
                                            maxLength={500}
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            className="h-9 w-9 shrink-0 rounded-full bg-primary hover:bg-primary/90 shadow-sm"
                                            disabled={!chatInput.trim() || isTyping}
                                            aria-label="Send message"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                    <div className="mt-1.5 flex justify-center">
                                        <button
                                            onClick={() => setShowFeedback(true)}
                                            className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                                        >
                                            <MessageCircle className="h-3 w-3" />
                                            Give Feedback
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}

// ─── Hook for manual open/close control from header button ────────────────────
export function useAIChat() {
    const [isOpen, setIsOpen] = useState(false);

    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);
    const toggleChat = () => setIsOpen(prev => !prev);

    return {
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        ChatWidget: () => <ChatWidget isOpen={isOpen} onClose={closeChat} />,
    };
}
