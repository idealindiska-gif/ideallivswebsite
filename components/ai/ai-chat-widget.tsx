'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, MessageCircle, Minimize2, Maximize2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FeedbackForm } from '@/components/ai/feedback-form';

const GREETING = "Hi! I'm the Ideal Assistant. How can I help you today?\n\nI can help with:\n- **Delivery info** (Stockholm, Kalmar, Europe)\n- **Products & brands** (rice, spices, lentils, atta, halal)\n- **Store hours & location**\n- **Order tracking**";
import Image from 'next/image';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const LOGO_URL = 'https://crm.ideallivs.com/wp-content/uploads/2025/05/ideal-favicon.png';

// ─── Floating Launcher Button ─────────────────────────────────────────────────
export function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewMsg, setHasNewMsg] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => {
            setHasNewMsg(true);
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        setHasNewMsg(false);
    };

    if (!mounted) return null;

    return (
        <>
            {/* Floating Launcher Bubble */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    aria-label="Open Ideal Assistant chat"
                    style={{ animation: 'slideUp 0.3s ease-out' }}
                >
                    <Bot className="h-6 w-6" />
                    {hasNewMsg && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                    )}
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && <ChatWidget onClose={() => setIsOpen(false)} />}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: scale(0.8) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(12px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .chat-panel-enter {
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes msgIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .msg-enter {
                    animation: msgIn 0.18s ease-out;
                }
            `}</style>
        </>
    );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatWidget({ onClose }: { onClose: () => void }) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: GREETING,
            timestamp: new Date(),
        },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (!isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isMinimized]);

    const buildHistory = useCallback((msgs: Message[]): Array<{ role: 'user' | 'assistant'; content: string }> => {
        return msgs
            .filter(m => m.id !== '1')
            .map(m => ({ role: m.role, content: m.content }));
    }, []);

    const handleSendMessage = useCallback(async (overrideText?: string) => {
        const userText = (overrideText ?? chatInput).trim();
        if (!userText || isTyping) return;

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
            const history = [...buildHistory(messages), { role: 'user' as const, content: userText }];

            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history }),
            });

            // Always try to parse JSON — even error responses have helpful messages
            const data = await res.json().catch(() => ({ answer: null }));
            const aiText = data.answer || "Sorry, I couldn't get a response. Please contact us on WhatsApp: https://wa.me/46728494801";

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiText,
                timestamp: new Date(),
            }]);

        } catch {
            // Only reaches here if fetch itself fails (network offline, server down)
            setError('Could not connect. Are you online? You can also reach us on WhatsApp: https://wa.me/46728494801');
        } finally {
            setIsTyping(false);
        }
    }, [chatInput, isTyping, messages, buildHistory]);

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
                    metadata: { page: window.location.pathname, messageCount: messages.length }
                }),
            });
        } catch { /* silent */ }
    };

    useEffect(() => {
        return () => {
            if (messages.length > 1) saveChatLogs();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Render links and bold in AI messages
    const renderContent = (content: string, isUser: boolean) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" target="_blank" rel="noopener" style="text-decoration:underline;${isUser ? 'color:white' : ''}">$1</a>`)
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 chat-panel-enter" style={{ width: 340 }}>
            <div
                className={cn(
                    "overflow-hidden rounded-xl border border-border bg-background shadow-xl flex flex-col transition-all duration-200",
                    isMinimized ? "h-14" : "h-[510px]"
                )}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-3 py-2.5 bg-primary shrink-0">
                    <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden bg-white border-2 border-white/50">
                        <Image src={LOGO_URL} alt="Ideal LIVS" fill className="object-contain p-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-primary-foreground truncate leading-tight">Ideal Assistant</h3>
                        {!isMinimized && (
                            <p className="text-[11px] text-primary-foreground/80 leading-tight flex items-center gap-1 mt-0.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                AI-powered · Always here to help
                            </p>
                        )}
                    </div>
                    <div className="flex items-center shrink-0 gap-0.5">
                        <Button
                            variant="ghost" size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary-foreground/10 text-primary-foreground"
                            onClick={() => setIsMinimized(!isMinimized)}
                            aria-label={isMinimized ? 'Expand chat' : 'Minimise chat'}
                        >
                            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost" size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary-foreground/10 text-primary-foreground"
                            onClick={onClose}
                            aria-label="Close chat"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                {!isMinimized && (
                    <>
                        {showFeedback ? (
                            <div className="flex-1 overflow-y-auto p-3 bg-muted/30">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-sm">Send Feedback</h4>
                                    <Button variant="ghost" size="sm" onClick={() => setShowFeedback(false)} className="text-xs text-primary h-7 px-2">Back</Button>
                                </div>
                                <FeedbackForm onClose={() => setShowFeedback(false)} onSuccess={() => setTimeout(() => setShowFeedback(false), 2000)} />
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/20">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "msg-enter flex w-max max-w-[88%] flex-col gap-0.5 rounded-xl px-3 py-2 text-[13px]",
                                                msg.role === 'assistant'
                                                    ? "self-start rounded-tl-sm bg-background text-foreground border border-border shadow-sm"
                                                    : "self-end rounded-tr-sm bg-primary text-primary-foreground shadow-sm"
                                            )}
                                        >
                                            <div
                                                className="leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: renderContent(msg.content, msg.role === 'user') }}
                                            />
                                            <span className={cn("text-[9px]", msg.role === 'assistant' ? 'text-muted-foreground' : 'text-white/70')}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Typing dots */}
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
                                        <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-2 border border-red-200 dark:border-red-900">
                                            {error}
                                        </div>
                                    )}

                                    <div ref={scrollRef} />
                                </div>

                                {/* Quick Suggestions */}
                                {messages.length === 1 && (
                                    <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                                        {['Delivery info', 'Halal meat', 'Basmati rice', 'Track order'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => handleSendMessage(s)}
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
                                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
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
            </div>
        </div>
    );
}

// ─── Hook for header button control ──────────────────────────────────────────
// Used by header.tsx and transparent-header.tsx to open the chat via an icon
export function useAIChat() {
    const [isOpen, setIsOpen] = useState(false);

    return {
        isOpen,
        openChat: () => setIsOpen(true),
        closeChat: () => setIsOpen(false),
        toggleChat: () => setIsOpen(prev => !prev),
        ChatWidget: () => isOpen ? <ChatWidget onClose={() => setIsOpen(false)} /> : null,
    };
}
