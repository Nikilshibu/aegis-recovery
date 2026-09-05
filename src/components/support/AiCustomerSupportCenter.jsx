import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  Radio,
  Volume2,
  VolumeX,
  RefreshCw,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Terminal,
  Activity
} from 'lucide-react';

export function AiCustomerSupportCenter() {
  const {
    currentUser,
    entityType,
    formatCurrency,
    monetaryThreshold,
    outboundChannel,
    outboundEmail,
    outboundPhone,
    chatMessages,
    isAiTyping,
    sendChatMessage,
    historicalRecords,
    pendingQueue,
    paymentsLedger,
    voiceRecordingActive,
    voiceTranscript,
    isProcessingVocal,
    startVoiceRecording,
    stopVoiceRecording,
    voiceMuted,
    toggleVoiceMute,
    isVoiceSpeaking,
    speakText,
    stopSpeaking,
    selectedRecordId,
    setSelectedRecordId,
    navigateToTab
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [audioMuted, setAudioMuted] = useState(false);
  const [activeVoicePreset, setActiveVoicePreset] = useState(null);
  const messagesEndRef = useRef(null);
  const canvasRef = useRef(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  // Audio Waveform Canvas Animation
  useEffect(() => {
    if (!voiceRecordingActive && !isVoiceSpeaking) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const renderWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // Draw dynamic frequency bars
      const numBars = 32;
      const barWidth = (width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        // Calculate undulating wave height using trigonometric superposition
        const wave = Math.sin(phase + (i * 0.25)) * Math.cos(phase * 0.8 + (i * 0.15));
        const normalized = (wave + 1) / 2; // 0 to 1
        const barHeight = Math.max(6, normalized * (height * 0.75));
        const x = i * (barWidth + 2);
        const y = midY - (barHeight / 2);

        // Color gradient based on index (Emerald to Cyan to Indigo)
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#10b981'); // Emerald
        gradient.addColorStop(0.5, '#06b6d4'); // Cyan
        gradient.addColorStop(1, '#6366f1'); // Indigo

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      phase += 0.08;
      animationFrameId = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [voiceRecordingActive, isVoiceSpeaking]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputQuery.trim()) return;
    sendChatMessage(inputQuery.trim());
    setInputQuery('');
  };

  const handleQuickPrompt = (prompt) => {
    sendChatMessage(prompt);
  };

  const handleVoiceToggle = () => {
    if (voiceRecordingActive) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const activeRecord = selectedRecordId
    ? historicalRecords.find(r => r.id === selectedRecordId)
    : null;

  const quickPrompts = activeRecord ? [
    `Audit ${activeRecord.vendor} discrepancy: "${activeRecord.causeAnalysis.slice(0, 42)}..."`,
    `Calculate statutory SLA breach penalties for ${activeRecord.vendor} (${activeRecord.id})`,
    `Explain how the ${formatCurrency(monetaryThreshold)} Auto-Pilot threshold applies to ${formatCurrency(activeRecord.amountInitial)}`,
    `Draft formal recovery notice for ${activeRecord.vendor} via ${outboundChannel === 'whatsapp' ? 'WhatsApp' : 'Corporate Email'}`
  ] : [
    `Audit Datadog contract tier overcharge of $9,120 vs contracted $5,760`,
    `Calculate total active SLA breach penalties levied on vendor ledger`,
    `Explain how the ${formatCurrency(monetaryThreshold)} Auto-Pilot threshold operates`,
    `Simulate recovery dunning template for ${outboundChannel === 'whatsapp' ? 'WhatsApp' : 'Corporate Email'}`
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Telemetry Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 bg-[#0f172a]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              MODULE 3: AI CUSTOMER SUPPORT
            </span>
            <span className="text-xs text-slate-400 font-mono">• 2-Way RAG Assistant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Customer Support & Billing Arbitration Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            High-fidelity Voice Assistant with real-time acoustic waveform visualizer paired with conversational LLM intelligence trained on enterprise dunning, SLA contracts, and regulatory recovery frameworks.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <div className="px-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Model:</span>
            <span className="text-emerald-400 font-bold">AegisLLM Core v2</span>
          </div>
        </div>
      </div>

      {/* Per-Record System Context Banner */}
      {selectedRecordId && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>System Context Fed:</span>
                <span className="px-2 py-0.5 rounded font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                  {selectedRecordId}
                </span>
                <span className="text-slate-300 font-semibold">
                  {activeRecord?.vendor}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                  Inv #{activeRecord?.metaValues?.invoiceId || 'N/A'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Discrepancy: "{activeRecord?.causeAnalysis || activeRecord?.category}" • Amount: {formatCurrency(activeRecord?.amountInitial || 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => navigateToTab('ledger')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              ← Back to Ledger
            </button>
            <button
              onClick={() => setSelectedRecordId(null)}
              className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
            >
              Clear Focus
            </button>
          </div>
        </div>
      )}

      {/* Split Responsive Workspace (Voice Left, Chat Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN: Voice Assistant Widget                                  */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="glass-panel rounded-3xl border border-slate-800 bg-[#0b101b] p-6 relative overflow-hidden flex flex-col items-center text-center">
            
            {/* Background Ambient Glow */}
            <div className={`absolute -top-20 -left-20 w-48 h-48 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
              voiceRecordingActive ? 'bg-emerald-500/30 opacity-100' : 'bg-indigo-500/10 opacity-40'
            }`} />
            <div className={`absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
              voiceRecordingActive ? 'bg-cyan-500/30 opacity-100' : 'bg-emerald-500/10 opacity-40'
            }`} />

            {/* Widget Status Header */}
            <div className="w-full flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${voiceRecordingActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                  {voiceRecordingActive ? 'Recording Live Audio' : (activeRecord ? `Voice: ${activeRecord.vendor}` : 'Voice Sentinel Ready')}
                </span>
              </div>

              <button
                onClick={toggleVoiceMute}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition text-xs flex items-center gap-1.5"
                title={voiceMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
              >
                {voiceMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span className="text-[10px] font-mono">{voiceMuted ? 'MUTED' : 'VOICE ON'}</span>
              </button>
            </div>

            {/* Central Pulsing Microphone Button */}
            <div className="relative my-4 flex items-center justify-center">
              {/* Concentric Animated Radar Rings when active */}
              {voiceRecordingActive && (
                <>
                  <div className="absolute w-44 h-44 rounded-full border border-emerald-500/20 animate-ping duration-1000" />
                  <div className="absolute w-36 h-36 rounded-full border border-teal-500/30 animate-pulse duration-700" />
                  <div className="absolute w-28 h-28 rounded-full bg-emerald-500/15 animate-ping duration-1500" />
                </>
              )}

              <button
                onClick={handleVoiceToggle}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none ${
                  voiceRecordingActive
                    ? 'bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 text-white ring-4 ring-rose-500/30 scale-105 shadow-glow-amber'
                    : 'bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 text-slate-950 hover:scale-105 ring-4 ring-emerald-500/20 shadow-glow-emerald'
                }`}
              >
                {voiceRecordingActive ? (
                  <MicOff className="w-10 h-10 animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10 font-black" />
                )}
              </button>
            </div>

            {/* Interaction Instruction */}
            <div className="mt-3">
              <h3 className="text-base font-bold text-white">
                {voiceRecordingActive ? 'Listening to Voice Command...' : 'Click to Speak with Assistant'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {voiceRecordingActive
                  ? 'Acoustic waveform processing in real-time. Speak your query.'
                  : 'Ask to reconcile invoices, check dunning statuses, or audit penalties.'}
              </p>
            </div>

            {/* Dynamic Waveform Visualizer Canvas */}
            <div className="w-full mt-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                <span>AUDIO SPECTRUM</span>
                <span className={voiceRecordingActive ? 'text-rose-400 animate-pulse' : isVoiceSpeaking ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}>
                  {voiceRecordingActive ? 'RECORDING • PCM STREAM' : isVoiceSpeaking ? 'AEGISVOICE SPEAKING' : 'STANDBY'}
                </span>
              </div>

              {(voiceRecordingActive || isVoiceSpeaking) ? (
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={50}
                  className="w-full h-12 rounded-lg"
                />
              ) : (
                <div className="w-full h-12 flex items-center justify-center gap-1 opacity-30">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 rounded-full bg-slate-700"
                      style={{ height: `${Math.sin(i * 0.4) * 12 + 16}px` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Rolling Text Transcript Field */}
            <div className="w-full mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  LIVE TRANSCRIPTION
                </span>
                {isProcessingVocal && (
                  <span className="text-emerald-400 font-bold animate-pulse">STREAMING</span>
                )}
              </div>

              <div className="text-xs font-mono text-slate-200 min-h-[48px] flex items-center leading-relaxed">
                {voiceTranscript ? (
                  <span className={isProcessingVocal ? 'text-emerald-300' : 'text-slate-300'}>
                    {voiceTranscript}
                  </span>
                ) : (
                  <span className="text-slate-500 italic">
                    "Processing vocal instruction..." will appear dynamically when you speak.
                  </span>
                )}
              </div>
            </div>

            {/* Quick Vocal Scenario Presets */}
            <div className="w-full mt-4 text-left">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                Quick Voice Command Triggers
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => {
                    startVoiceRecording();
                    setTimeout(() => stopVoiceRecording(), 2500);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-left text-xs text-slate-300 flex items-center justify-between group transition"
                >
                  <span className="truncate">"Audit Snowflake $6,350 compute discrepancy"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition shrink-0 ml-2" />
                </button>
                <button
                  onClick={() => {
                    sendChatMessage('Audit the $450 Late Settlement SLA fee on Datadog');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-left text-xs text-slate-300 flex items-center justify-between group transition"
                >
                  <span className="truncate">"Audit $450 Late Settlement SLA Penalty"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition shrink-0 ml-2" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: LLM Chat Box                                           */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="glass-panel rounded-3xl border border-slate-800 bg-[#0b101b] p-5 sm:p-6 flex flex-col h-[650px] shadow-2xl relative">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/40 text-emerald-400">
                  <Bot className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#0b101b]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">AegisLLM Billing Arbiter</h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Enterprise Security Scoped • Database: Sovereign Ledger
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
                Channel: <span className="text-slate-300 capitalize">{outboundChannel}</span>
              </div>
            </div>

            {/* Auto-scrolling Messages Window */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-in fade-in duration-200 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* AI Avatar */}
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-sm shadow-md'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm shadow-lg'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Metadata tags */}
                    {msg.tags && msg.tags.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {msg.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-emerald-300 border border-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={`mt-1.5 text-[10px] font-mono ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-500'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isAiTyping && (
                <div className="flex gap-3 justify-start animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                    </div>
                    <span className="text-xs text-slate-400 font-mono ml-2">
                      Querying sovereign vector store...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Query Pills */}
            <div className="pt-3 pb-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex gap-2">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(p)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-emerald-300 transition whitespace-nowrap shrink-0"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Chat Input Panel */}
            <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  placeholder="Prompt LLM on billing discrepancies, dunning curves, or penalty clauses..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={!inputQuery.trim() || isAiTyping}
                className={`p-3 rounded-2xl transition flex items-center justify-center shrink-0 ${
                  inputQuery.trim() && !isAiTyping
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-glow-emerald hover:scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 font-bold" />
              </button>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
