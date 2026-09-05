import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  X,
  Radio,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';

export function GlobalVoiceSentinelModal() {
  const {
    voiceRecordingActive,
    voiceTranscript,
    isProcessingVocal,
    startVoiceRecording,
    stopVoiceRecording,
    voiceMuted,
    toggleVoiceMute,
    isVoiceSpeaking,
    stopSpeaking,
    isGlobalVoiceModalOpen,
    setIsGlobalVoiceModalOpen,
    chatMessages,
    appFlow,
    currentTab
  } = useApp();

  const canvasRef = useRef(null);

  // Per user requirement: Voice Assistant must ONLY be present on AI Customer Support, NOT on the login page
  if (appFlow === 'gateway' || appFlow === 'otp_verification' || appFlow === 'record_selection' || appFlow === 'onboarding') {
    return null;
  }
  if (currentTab !== 'support') {
    return null;
  }



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

      const numBars = 28;
      const barWidth = (width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        const wave = Math.sin(phase + (i * 0.3)) * Math.cos(phase * 0.9 + (i * 0.2));
        const normalized = (wave + 1) / 2;
        const barHeight = Math.max(4, normalized * (height * 0.8));
        const x = i * (barWidth + 2);
        const y = midY - (barHeight / 2);

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(0.5, '#06b6d4');
        gradient.addColorStop(1, '#6366f1');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += 0.12;
      animationFrameId = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [voiceRecordingActive, isVoiceSpeaking]);

  const latestAiMessage = [...chatMessages].reverse().find(m => m.sender === 'ai');

  const voiceShortcuts = [
    { label: 'Audit Snowflake variance', cmd: 'Audit Snowflake compute variance for Q3' },
    { label: 'Check Business Anomalies', cmd: 'Check business anomaly forecasting runway' },
    { label: 'Open Ingestion Workstation', cmd: 'Open ingestion engine' },
    { label: 'Show Payments Terminal', cmd: 'Show payments and billing terminal' }
  ];

  return (
    <>
      {/* 1. Persistent Floating Voice Sentinel Trigger */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsGlobalVoiceModalOpen(true)}
          className="relative group p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 text-slate-950 font-black shadow-glow-emerald hover:scale-105 active:scale-95 transition flex items-center gap-2 border border-emerald-400/40"
          title="Aegis Voice Sentinel Assistant"
        >
          {/* Animated pulse ring if active */}
          {(voiceRecordingActive || isVoiceSpeaking) && (
            <span className="absolute -inset-1 rounded-2xl bg-emerald-400/30 animate-ping pointer-events-none" />
          )}

          <div className="flex items-center gap-2">
            {voiceRecordingActive ? (
              <Radio className="w-5 h-5 text-rose-950 animate-pulse" />
            ) : isVoiceSpeaking ? (
              <Volume2 className="w-5 h-5 text-slate-950 animate-bounce" />
            ) : (
              <Mic className="w-5 h-5 text-slate-950" />
            )}
            <span className="text-xs font-black hidden sm:inline tracking-tight">
              {voiceRecordingActive ? 'Listening...' : isVoiceSpeaking ? 'AegisVoice Speaking' : 'Voice Assistant'}
            </span>
          </div>
        </button>
      </div>

      {/* 2. Interactive Voice Assistant HUD Overlay */}
      {isGlobalVoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0b101b] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
            
            {/* Top Glowing Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Aegis Voice Sentinel HUD</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      LIVE AUDIO ENGINE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time speech recognition & vocal speech synthesis
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoiceMute}
                  className={`p-2 rounded-xl border transition ${
                    voiceMuted
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={voiceMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
                >
                  {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    if (voiceRecordingActive) stopVoiceRecording();
                    stopSpeaking();
                    setIsGlobalVoiceModalOpen(false);
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Central Visualizer & Mic Control */}
            <div className="py-6 text-center space-y-4">
              
              {/* Canvas Waveform */}
              <div className="w-full flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={50}
                  className="rounded-xl bg-slate-950/80 border border-slate-800/80"
                />
              </div>

              {/* Pulsing Mic Button */}
              <div className="flex justify-center">
                <button
                  onClick={voiceRecordingActive ? stopVoiceRecording : startVoiceRecording}
                  className={`relative w-20 h-20 rounded-3xl flex items-center justify-center transition shadow-2xl ${
                    voiceRecordingActive
                      ? 'bg-rose-500 text-white shadow-glow-crimson ring-4 ring-rose-500/30'
                      : isVoiceSpeaking
                      ? 'bg-indigo-500 text-white shadow-glow-cyan ring-4 ring-indigo-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-glow-emerald hover:scale-105'
                  }`}
                >
                  {voiceRecordingActive ? (
                    <MicOff className="w-9 h-9 animate-pulse" />
                  ) : (
                    <Mic className="w-9 h-9" />
                  )}
                </button>
              </div>

              <div>
                <div className="text-xs font-bold text-white">
                  {voiceRecordingActive
                    ? 'Listening... Click button to stop & execute'
                    : isVoiceSpeaking
                    ? 'AegisVoice is speaking response aloud'
                    : 'Click microphone to speak instruction'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto font-mono">
                  {voiceTranscript || 'e.g. "Audit Snowflake", "Check anomalies", "Open payments", "Explain SLA penalties"'}
                </p>
              </div>
            </div>

            {/* Latest AI Voice Reply Snippet */}
            {latestAiMessage && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Latest AI Response:
                  </span>
                  {isVoiceSpeaking && (
                    <span className="text-cyan-400 animate-pulse">
                      🔊 Audio Synthesizing...
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed max-h-24 overflow-y-auto text-[11px]">
                  {latestAiMessage.text}
                </p>
              </div>
            )}

            {/* Quick Command Shortcuts */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                One-Click Vocal Command Presets:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {voiceShortcuts.map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (voiceRecordingActive) stopVoiceRecording();
                      stopSpeaking();
                      startVoiceRecording();
                      setTimeout(() => {
                        stopVoiceRecording();
                      }, 400);
                    }}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left text-[11px] text-slate-300 hover:text-emerald-300 transition flex items-center justify-between"
                  >
                    <span className="truncate">{sc.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
