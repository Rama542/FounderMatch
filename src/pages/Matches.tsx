import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Clock, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getMatches, getMessages, sendMessage } from '@/lib/mockData';
import { MOCK_STARTUP_PROFILES, MOCK_INVESTOR_PROFILES } from '@/constants/data';
import type { Match, Message } from '@/types';
import { cn } from '@/lib/utils';

export default function Matches() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    setMatches(getMatches());
  }, [user, navigate]);

  useEffect(() => {
    if (selectedMatch) {
      setMessages(getMessages(selectedMatch.id));
    }
  }, [selectedMatch]);

  if (!user) return null;

  function getMatchName(match: Match): string {
    if (user!.role === 'founder') {
      const inv = MOCK_INVESTOR_PROFILES.find((i) => i.id === match.investorId);
      return inv?.investorName ?? 'Investor';
    }
    const s = MOCK_STARTUP_PROFILES.find((s) => s.id === match.founderId);
    return (s as any)?.founderName ?? s?.startupName ?? 'Founder';
  }

  function getMatchAvatar(match: Match): string | undefined {
    if (user!.role === 'founder') {
      const inv = MOCK_INVESTOR_PROFILES.find((i) => i.id === match.investorId);
      return inv?.avatar;
    }
    const s = MOCK_STARTUP_PROFILES.find((s) => s.id === match.founderId);
    return (s as any)?.founderAvatar;
  }

  function getMatchSubtitle(match: Match): string {
    if (user!.role === 'founder') {
      const inv = MOCK_INVESTOR_PROFILES.find((i) => i.id === match.investorId);
      return inv?.firmName ?? '';
    }
    const s = MOCK_STARTUP_PROFILES.find((s) => s.id === match.founderId);
    return s?.startupName ?? '';
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selectedMatch) return;
    const msg = sendMessage(selectedMatch.id, user!.id, input.trim());
    setMessages((prev) => [...prev, msg]);
    setInput('');

    // Auto-reply after 1.5s
    setTimeout(() => {
      const replies = [
        "Thanks for reaching out! Tell me more about your traction.",
        "Interesting! What's your current burn rate?",
        "Love the problem you're solving. Are you open to a call this week?",
        "Your AI score is impressive. I'd love to learn more about the team.",
        "Sounds compelling. What's your go-to-market strategy?",
      ];
      const reply = sendMessage(
        selectedMatch.id,
        user!.role === 'founder' ? selectedMatch.investorId : selectedMatch.founderId,
        replies[Math.floor(Math.random() * replies.length)]
      );
      setMessages((prev) => [...prev, reply]);
    }, 1500);
  }

  // Add demo matches if none exist
  const displayMatches = matches.length > 0 ? matches : [
    {
      id: 'demo-match-1',
      founderId: 'startup-1',
      investorId: 'investor-1',
      founderLiked: true,
      investorLiked: true,
      matchedAt: new Date(Date.now() - 86400000).toISOString(),
      unreadCount: 2,
    },
    {
      id: 'demo-match-2',
      founderId: 'startup-3',
      investorId: 'investor-2',
      founderLiked: true,
      investorLiked: true,
      matchedAt: new Date(Date.now() - 172800000).toISOString(),
      unreadCount: 0,
    },
  ] as Match[];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-violet-400" />
            Your Matches
          </h1>
          <p className="text-sm text-slate-500 mt-1">{displayMatches.length} active connections</p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[600px]">
          {/* Match list */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#12121a] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-xs text-slate-500 font-medium">MATCHES</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {displayMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="text-4xl mb-3">💫</div>
                  <p className="text-sm text-slate-500">No matches yet. Keep swiping!</p>
                </div>
              ) : (
                displayMatches.map((match) => {
                  const name = user.role === 'founder'
                    ? (MOCK_INVESTOR_PROFILES.find((i) => i.id === match.investorId)?.investorName ?? 'Investor')
                    : (MOCK_STARTUP_PROFILES.find((s) => s.id === match.founderId) as any)?.founderName ?? 'Founder';
                  const avatar = user.role === 'founder'
                    ? MOCK_INVESTOR_PROFILES.find((i) => i.id === match.investorId)?.avatar
                    : (MOCK_STARTUP_PROFILES.find((s) => s.id === match.founderId) as any)?.founderAvatar;
                  const subtitle = user.role === 'founder'
                    ? MOCK_INVESTOR_PROFILES.find((i) => i.id === match.investorId)?.firmName
                    : MOCK_STARTUP_PROFILES.find((s) => s.id === match.founderId)?.startupName;

                  return (
                    <button
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-all border-b border-white/[0.04] text-left',
                        selectedMatch?.id === match.id && 'bg-violet-500/10'
                      )}
                    >
                      {avatar ? (
                        <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center text-base flex-shrink-0">👤</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white truncate">{name}</span>
                          {(match.unreadCount ?? 0) > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white flex-shrink-0">
                              {match.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate">{subtitle}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#12121a] overflow-hidden flex flex-col">
            {selectedMatch ? (
              <>
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
                  {(() => {
                    const avatar = user.role === 'founder'
                      ? MOCK_INVESTOR_PROFILES.find((i) => i.id === selectedMatch.investorId)?.avatar
                      : (MOCK_STARTUP_PROFILES.find((s) => s.id === selectedMatch.founderId) as any)?.founderAvatar;
                    const name = user.role === 'founder'
                      ? MOCK_INVESTOR_PROFILES.find((i) => i.id === selectedMatch.investorId)?.investorName
                      : (MOCK_STARTUP_PROFILES.find((s) => s.id === selectedMatch.founderId) as any)?.founderName;
                    const sub = user.role === 'founder'
                      ? MOCK_INVESTOR_PROFILES.find((i) => i.id === selectedMatch.investorId)?.firmName
                      : MOCK_STARTUP_PROFILES.find((s) => s.id === selectedMatch.founderId)?.startupName;
                    return (
                      <>
                        {avatar ? (
                          <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-violet-500/20 flex items-center justify-center">👤</div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-white">{name}</div>
                          <div className="text-xs text-slate-500">{sub}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-xs text-slate-500">Online</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-4xl mb-3">💬</div>
                      <p className="text-sm text-slate-500">It's a match! Say hello to start a conversation.</p>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
                      >
                        <div className={cn(
                          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                          isMe
                            ? 'bg-violet-600 text-white rounded-br-md'
                            : 'bg-white/[0.07] text-slate-200 rounded-bl-md'
                        )}>
                          {msg.content}
                          <div className={cn('flex items-center gap-1 mt-1', isMe ? 'justify-end' : 'justify-start')}>
                            <Clock className="h-2.5 w-2.5 text-white/30" />
                            <span className="text-[10px] text-white/30">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="px-5 py-4 border-t border-white/[0.06] flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
                  />
                  <button
                    type="submit"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all hover:scale-105 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="h-12 w-12 text-slate-700 mb-4" />
                <h3 className="text-base font-semibold text-slate-500 mb-1">Select a match</h3>
                <p className="text-sm text-slate-600">Choose a match from the left to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
