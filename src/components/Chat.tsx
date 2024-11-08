// src/components/Chat.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';

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
      placeholder="Ask the Phoenix..."
      className="w-full resize-none overflow-hidden bg-zinc-700 text-zinc-100 placeholder-zinc-400 border-zinc-600 focus:border-amber-500 focus:ring-amber-500 rounded-md p-2 min-h-[40px] max-h-[120px]"
      rows={1}
    />
  );
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content:
        "Salutations, je suis l'IA signature de Magritte. Posez-moi une question et je vous répondrai.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [assistantMessageContent, setAssistantMessageContent] = useState('');
  const [currentAssistantMessageId, setCurrentAssistantMessageId] = useState<string | null>(null);
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

      const apiUrl = 'http://localhost:8000/generate'; // Replace with your API URL

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${apiKey}`, // Uncomment if using an API key
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
        let assistantContent = ''; // Local variable to accumulate response

        while (!done) {
          const { value, done: doneReading } = await reader!.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            assistantContent += chunk;
            setAssistantMessageContent((prev) => prev + chunk);
          }
        }

        // After streaming is done, add the assistant's message to messages
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
              'Apologies, but it seems the cosmic energies are disturbed. Please try again later.',
          },
        ]);
      } finally {
        setIsStreaming(false);
        scrollToBottom(true);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-zinc-100">
      <header className="p-4 bg-zinc-800/50 backdrop-blur-sm border-b border-zinc-700 flex-none">
        <h1 className="text-2xl md:text-3xl font-serif text-center text-amber-300">
          IA SIGNATURE de Magritte
        </h1>
      </header>

      <div className="flex-grow relative">
        <div className="absolute inset-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
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
                        <ReactMarkdown>{message.content}</ReactMarkdown>
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
