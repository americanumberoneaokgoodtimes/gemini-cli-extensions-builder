import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Loader2 } from 'lucide-react';
import { AssistantSuggestion } from '../hooks/useProactiveAssistant';

interface AssistantBoxProps {
  suggestion: AssistantSuggestion | null;
  isThinking: boolean;
  onApply: (patch: any) => void;
  onDismiss: () => void;
}

export function AssistantBox({ suggestion, isThinking, onApply, onDismiss }: AssistantBoxProps) {
  return (
    <div className="mt-8 p-4 bg-white/5 border border-[#00FF00]/20 rounded-md relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Bot size={16} className="text-[#00FF00]" />
        <h3 className="text-xs text-[#00FF00] font-mono uppercase tracking-widest">Gemma Assistant</h3>
        {isThinking && <Loader2 size={12} className="animate-spin text-white/50 ml-auto" />}
      </div>

      <div className="min-h-[60px]">
        <AnimatePresence mode="wait">
          {suggestion ? (
            <motion.div
              key="suggestion"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              <p className="text-sm text-white/80 leading-relaxed">
                {suggestion.message}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onApply(suggestion.patch);
                    onDismiss();
                  }}
                  className="px-3 py-1.5 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30 rounded text-xs font-mono transition-colors"
                >
                  Yeah!
                </button>
                <button
                  onClick={onDismiss}
                  className="px-3 py-1.5 hover:bg-white/5 text-white/50 rounded text-xs font-mono transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          ) : (
             <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-white/30 italic"
            >
              Observing your code...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
