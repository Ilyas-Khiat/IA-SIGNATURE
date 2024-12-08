// src/components/whatif.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ExpandingTextarea = ({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder="Proposez une suite ou posez une question..."
      className="w-full resize-none overflow-hidden bg-zinc-700 text-zinc-100 placeholder-zinc-400 border-zinc-600 focus:border-amber-500 focus:ring-amber-500 rounded-md p-2 min-h-[40px] max-h-[120px]"
      rows={1}
    />
  );
};

export default function WhatIf() {
  const location = useLocation();
  const { question, answer } = location.state || {};
  const sphinxQuestion = question || "NOT_PROVIDED"; ;
  const sphinxAnswer = answer || "NOT_PROVIDED";

  const initialAssistantMessage = `✨ **Bienvenue** dans l’espace *“Et si …”* de l’**IA SIGNATURE** associée au récit *“La conversation muette”* 🎭
\n\n
Tu viens de répondre à la question :  
❓ **${sphinxQuestion}**
\n\n
Ta réponse juste était :  
✅ **${sphinxAnswer}**
\n\n
💡 Et si cet instant révélait des chemins insoupçonnés pour le récit ? ✨  
➡️ *Que veux-tu explorer maintenant ?*`;


  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: initialAssistantMessage,
    },
  ]);

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [assistantMessageContent, setAssistantMessageContent] = useState('');
  const [currentAssistantMessageId, setCurrentAssistantMessageId] = useState<string | null>(null);
  const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (smooth = false) => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      ) as HTMLElement;
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector(
          '[data-radix-scroll-area-viewport]'
        ) as HTMLElement;
        if (scrollElement) {
          const { scrollHeight, clientHeight, scrollTop } = scrollElement;
          setShowScrollButton(scrollHeight - clientHeight > scrollTop + 100);
        }
      }
    };

    checkScroll();
    scrollToBottom();

    const scrollElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLElement;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, [messages, assistantMessageContent]);

  const handleSubmit = async () => {
    if (input.trim() && !isStreaming) {
      const userMessage: Message = { id: uuidv4(), role: 'user', content: input };
      setMessages((prev) => [...prev, userMessage]);
      const currentMessages = [...messages, userMessage];
      setInput('');
      scrollToBottom(true);

      setIsStreaming(true);
      setAssistantMessageContent('');
      const assistantMessageId = uuidv4();
      setCurrentAssistantMessageId(assistantMessageId);

      // Change to your backend endpoint
      const apiUrl = 'https://ia-signature-ia-back.hf.space/whatif_chat';

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: input,
            stream: true,
            messages: currentMessages,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let assistantContent = '';

        while (!done) {
          const { value, done: doneReading } = await reader!.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            assistantContent += chunk;
            setAssistantMessageContent((prev) => prev + chunk);
          }
        }

        setMessages((prev) => [
          ...prev,
          { id: assistantMessageId, role: 'assistant', content: assistantContent },
        ]);
        setAssistantMessageContent('');
        setCurrentAssistantMessageId(null);
      } catch (error: any) {
        console.error('Error fetching response:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            role: 'assistant',
            content:
              'Désolé, quelque chose ne va pas. Réessayez plus tard.',
          },
        ]);
      } finally {
        setIsStreaming(false);
        scrollToBottom(true);
      }
    }
  };

  const handleDiscoverAlternatives = async () => {
    setIsLoadingAlternatives(true);

    // Replace with your backend endpoint for what-if alternatives
    const apiUrl = 'https://ia-signature-ia-back.hf.space/whatif';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: sphinxQuestion, answer: sphinxAnswer }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newMessages: Message[] = [{
        id: uuidv4(),
        role: 'assistant',
        content: data, // Treat it as the content directly
      }];

      setMessages((prev) => [...prev, ...newMessages]);
      scrollToBottom(true);
    } catch (error: any) {
      console.error('Error fetching alternatives:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: 'assistant',
          content: "Désolé, je ne peux pas fournir d'autres alternatives pour le moment.",
        },
      ]);
    } finally {
      setIsLoadingAlternatives(false);
    }
  };

  const handleProposeOwnContinuation = () => {
    // Here you might prompt user or just show a message
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        role: 'assistant',
        content:
          "Propose ta propre suite. Qu'imagines-tu comme tournant inattendu dans l'histoire ? Partage-le ci-dessous.",
      },
    ]);
    scrollToBottom(true);
  };

  const handleContinueOriginalStory = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        role: 'assistant',
        content:
          "Très bien, continuons l'histoire telle qu'elle a été imaginée par l'auteur...",
      },
    ]);
    scrollToBottom(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-zinc-100">
      <header className="p-4 bg-zinc-800/50 backdrop-blur-sm border-b border-zinc-700 flex-none">
        <h1 className="text-2xl md:text-3xl font-serif text-center text-amber-300">
          IA SIGNATURE - Et si...
        </h1>
      </header>

      <div className="flex-grow relative">
        <div className="absolute inset-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="w-8 h-8 border-2 border-amber-500 flex-shrink-0">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="Phoenix"
                        />
                        <AvatarFallback>PX</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`prose prose-invert max-w-[70%] rounded-lg p-3 break-words ${
                        message.role === 'user'
                          ? 'bg-amber-600/20 text-amber-100 border border-amber-500/30'
                          : 'bg-zinc-700/50 text-zinc-100 border border-zinc-600/30'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <>
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                          {index === 0 && (
                            <div className="mt-4 flex flex-col space-y-2">
                              <Button
                                onClick={handleDiscoverAlternatives}
                                className="bg-amber-600 hover:bg-amber-700 text-zinc-100 border-amber-500"
                                disabled={isLoadingAlternatives}
                              >
                                {isLoadingAlternatives
                                  ? 'Chargement...'
                                  : "Découvrir d’autres alternatives"}
                              </Button>
                              <Button
                                onClick={handleProposeOwnContinuation}
                                className="bg-amber-600 hover:bg-amber-700 text-zinc-100 border-amber-500"
                              >
                                Proposer ta propre suite
                              </Button>
                              <Button
                                onClick={handleContinueOriginalStory}
                                className="bg-amber-600 hover:bg-amber-700 text-zinc-100 border-amber-500"
                              >
                                Poursuivre l’histoire originale
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="w-8 h-8 border-2 border-zinc-500 flex-shrink-0">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="User"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
                {isStreaming && (
                  <motion.div
                    key={currentAssistantMessageId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start space-x-3 justify-start"
                  >
                    <Avatar className="w-8 h-8 border-2 border-amber-500 flex-shrink-0">
                      <AvatarImage
                        src="/placeholder.svg?height=40&width=40"
                        alt="Phoenix"
                      />
                      <AvatarFallback>PX</AvatarFallback>
                    </Avatar>
                    <div className="prose prose-invert max-w-[70%] rounded-lg p-3 break-words bg-zinc-700/50 text-zinc-100 border border-zinc-600/30">
                      <ReactMarkdown>{assistantMessageContent}</ReactMarkdown>
                      <span className="animate-pulse">▌</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
        {showScrollButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-20 right-4 bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-100 border-zinc-600"
            onClick={() => scrollToBottom(true)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-4 bg-zinc-800/50 backdrop-blur-sm border-t border-zinc-700 flex-none">
        <div className="flex space-x-2 max-w-2xl mx-auto items-end">
          <div className="flex-grow">
            <ExpandingTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
            />
          </div>
          <Button
            onClick={handleSubmit}
            variant="outline"
            size="icon"
            className="bg-amber-600 hover:bg-amber-700 text-zinc-100 border-amber-500 h-10 w-10 flex-shrink-0"
            disabled={isStreaming || !input.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
