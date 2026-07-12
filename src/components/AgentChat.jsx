import React, { useState, useRef, useEffect } from 'react'
import {
  Send,
  Cpu,
  User,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Brain,
} from 'lucide-react'
import { motion } from 'motion/react'

function parseMessageText(text) {
  if (!text) return { thinking: null, cleanText: '' }

  // 1. Check for standard <think>...</think> tags
  const thinkRegex = /<think>([\s\S]*?)<\/think>/i
  const match = text.match(thinkRegex)
  if (match) {
    const thinking = match[1].trim()
    let cleanText = text.replace(thinkRegex, '').trim()

    // Remove extra headers if the model also repeated them
    cleanText = cleanText
      .replace(
        /^(Thinking Process|Thought Process|Thinking:|Thought:|Reasoning:)\s*/i,
        '',
      )
      .trim()
    return { thinking, cleanText }
  }

  // 2. If it has "Thinking Process" or similar but no tags
  const headerRegex =
    /^(Thinking Process|Thought Process|Thinking:|Thought:|Reasoning:)/i
  if (headerRegex.test(text)) {
    // Let's try to split by double-newline
    const parts = text.split(/\n\s*\n/)
    if (parts.length > 1) {
      // Find where conversational response starts. If the last paragraph doesn't look like lists or analysis
      const lastPara = parts[parts.length - 1]
      if (
        !/^[*-]|\d\./.test(lastPara.trim()) &&
        !lastPara.toLowerCase().includes('analyze') &&
        !lastPara.toLowerCase().includes('profile')
      ) {
        const thinking = parts
          .slice(0, -1)
          .join('\n\n')
          .replace(headerRegex, '')
          .trim()
        const cleanText = lastPara.trim()
        return { thinking, cleanText }
      }
    }
  }

  return { thinking: null, cleanText: text }
}

function MessageBubble({ msg, isAgent }) {
  const { thinking, cleanText } = parseMessageText(msg.text)
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false)

  return (
    <div
      className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'} w-full shrink-0`}
    >
      {isAgent && (
        <div className="w-7 h-7 rounded bg-surface-2 border border-border text-accent-gold flex items-center justify-center shrink-0 self-start mt-0.5">
          <Cpu size={12} />
        </div>
      )}

      <div className="max-w-[85%] flex flex-col gap-2 min-w-0">
        {/* Collapsible reasoning block (Claude style) */}
        {isAgent && thinking && (
          <div className="rounded border border-border text-xs overflow-hidden transition-all bg-surface-2 text-text-secondary">
            {/* Header / Toggle button */}
            <button
              type="button"
              onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-[9px] font-mono tracking-widest hover:bg-surface-3 transition-colors uppercase font-bold text-text-muted"
            >
              <span className="flex items-center gap-1.5">
                <Brain
                  size={11}
                  className={
                    isThinkingExpanded ? 'text-accent-gold' : 'text-text-muted'
                  }
                />
                {isThinkingExpanded
                  ? 'HIDE LOGICAL THINKING'
                  : 'SHOW LOGICAL THINKING'}
              </span>
              {isThinkingExpanded ? (
                <ChevronUp size={11} />
              ) : (
                <ChevronDown size={11} />
              )}
            </button>

            {/* Thinking text */}
            {isThinkingExpanded && (
              <div className="px-3 pb-2.5 pt-0.5 font-sans leading-relaxed text-[11px] whitespace-pre-line border-t border-border/45 text-text-muted bg-surface-3/55 border-l-2 border-l-accent-gold">
                {thinking}
              </div>
            )}
          </div>
        )}

        {/* Main message bubble content */}
        {cleanText && (
          <div
            className={`px-4 py-3 rounded text-xs leading-relaxed transition-all ${
              isAgent
                ? 'bg-surface-1 border border-border text-text-primary rounded-tl-none'
                : 'bg-surface-2 border border-border text-text-primary rounded-tr-none'
            }`}
          >
            <p className="whitespace-pre-line leading-relaxed font-mono">
              {cleanText}
            </p>
            <span className="block text-[8px] font-mono mt-2 text-text-muted uppercase tracking-wider text-right">
              {new Date(msg.at || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {isAgent && msg.source && msg.source !== 'fireworks-primary' && (
                <span className="ml-2 px-1 py-0.5 rounded-xs border border-border uppercase font-bold text-[7px] tracking-widest bg-surface-3 text-text-muted">
                  {msg.source === 'fireworks-fallback'
                    ? 'FALLBACK CORE'
                    : 'LOCAL CORE'}
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {!isAgent && (
        <div className="w-7 h-7 rounded bg-surface-3 border border-border text-text-muted flex items-center justify-center shrink-0 self-start mt-0.5">
          <User size={12} />
        </div>
      )}
    </div>
  )
}

export default function AgentChat({
  messages,
  onSendMessage,
  isGenerating,
  userType,
  theme = 'dark',
}) {
  const [input, setInput] = useState('')
  const chatEndRef = useRef(null)

  const suggestions = [
    { text: 'Should I buy this ₦20,000 jacket?', label: 'Buy Jacket?' },
    { text: 'Review my cash fading rate', label: 'Cash Fading Rate' },
    { text: 'Are my bank runs okay this month?', label: 'Bank Runs Check' },
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isGenerating])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return
    onSendMessage(input.trim())
    setInput('')
  }

  const handleSuggestionClick = (text) => {
    if (isGenerating) return
    onSendMessage(text)
  }

  return (
    <div className="flex flex-col h-full rounded-lg bg-surface-1 border border-border shrink-0 shadow-none w-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-surface-2">
        <div className="relative">
          <div className="w-9 h-9 rounded bg-surface-3 border border-border text-accent-gold flex items-center justify-center">
            <MessageSquare size={16} />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-surface-1 bg-accent-gold animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-semibold font-mono tracking-widest text-text-primary uppercase leading-tight">
            FinI Private Concierge
          </h4>
          <span className="text-[9px] font-mono font-bold text-accent-gold tracking-widest uppercase">
            FINI INTEL COMPANION
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 max-h-[420px] min-h-[300px] no-scrollbar w-full">
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <MessageBubble
              key={index}
              msg={msg}
              isAgent={msg.role === 'agent'}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full py-12 px-6 gap-3">
            <MessageSquare className="text-text-muted" size={32} />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold font-mono text-text-primary uppercase tracking-widest">
                Initiate Private Audit Inquiry
              </p>
              <p className="text-[10px] max-w-xs font-mono text-text-muted leading-relaxed uppercase tracking-widest">
                Ask about weekend outflows, decay metrics, or ledger anomalies.
                I operate with offline absolute confidentiality.
              </p>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex gap-3 justify-start w-full shrink-0">
            <div className="w-7 h-7 rounded bg-surface-2 border border-border text-accent-gold flex items-center justify-center shrink-0 self-start mt-0.5">
              <MessageSquare size={12} />
            </div>
            <div className="border border-border px-4 py-3 bg-surface-1 rounded rounded-tl-none flex items-center gap-2">
              <RefreshCw size={11} className="animate-spin text-accent-gold" />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest font-bold">
                Companion auditing patterns...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions shortcuts - Restyled with 4px radius, 1px gold border, transparent fill */}
      <div className="px-4 pb-2.5 pt-2 flex flex-wrap gap-2 border-t border-border bg-surface-3">
        {suggestions.map((sug, i) => (
          <button
            key={i}
            type="button"
            disabled={isGenerating}
            onClick={() => handleSuggestionClick(sug.text)}
            className="text-[9px] px-3 py-1 rounded-[4px] border border-accent-gold bg-transparent text-accent-gold font-mono font-semibold tracking-wider uppercase transition-colors hover:bg-accent-gold/10 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {sug.label}
          </button>
        ))}
      </div>

      {/* Form Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-border flex gap-2 bg-surface-2"
      >
        <input
          type="text"
          placeholder="ASK PRIVATE COMPANION (E.G. CAN I DECANT 50,000 NAIRA?)..."
          value={input}
          disabled={isGenerating}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded border border-border bg-surface-3 py-2 px-3 text-xs font-mono text-text-primary placeholder:text-text-muted focus:border-accent-gold outline-hidden uppercase tracking-wider"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="w-10 h-10 rounded bg-accent-gold hover:bg-accent-gold-dim text-surface-1 flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  )
}
