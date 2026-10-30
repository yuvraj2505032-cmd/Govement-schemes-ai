import React, { useState, useEffect, useRef } from 'react';
import { Language, CitizenProfile, Scheme } from '../types/scheme';
import { TRANSLATIONS } from '../data/translations';
import { GOV_SCHEMES } from '../data/schemes';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  ShieldCheck, 
  ExternalLink,
  RotateCcw,
  ArrowRight,
  Radio,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedSchemeIds?: string[];
  isAiGrounded?: boolean;
  officialSources?: Array<{ title: string; url: string }>;
}

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  userProfile: CitizenProfile;
  onOpenSchemeModal: (scheme: Scheme) => void;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  currentLang,
  userProfile,
  onOpenSchemeModal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  // Dedicated Voice & Assistant Language (defaults to current app language or Punjabi/English)
  const [assistantLang, setAssistantLang] = useState<Language>(currentLang || 'pa');
  // Auto-speak responses after AI finishes answering
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState<boolean>(true);
  // Citizen Consent Checkbox state (DPDP Act compliance)
  const [hasConsent, setHasConsent] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = TRANSLATIONS[assistantLang];

  // Sync assistantLang with currentLang when drawer first opens
  useEffect(() => {
    if (isOpen) {
      setAssistantLang(currentLang);
    }
  }, [isOpen, currentLang]);

  // Set welcome message based on selected assistant language
  useEffect(() => {
    if (messages.length === 0) {
      let initialGreeting = '';
      if (assistantLang === 'pa') {
        initialGreeting = `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਮੈਂ ਪੰਜਾਬ ਸਰਕਾਰੀ ਸਕੀਮ ਏ.ਆਈ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਨਾਲ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲ ਕੇ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਮੈਂ ਤੁਹਾਨੂੰ ਯੋਗਤਾ, ਦਸਤਾਵੇਜ਼ ਅਤੇ ਅਪਲਾਈ ਕਰਨ ਦੇ ਅਧਿਕਾਰਤ ਤਰੀਕੇ ਦੱਸਾਂਗਾ।`;
      } else if (assistantLang === 'hi') {
        initialGreeting = `नमस्ते! मैं पंजाब सरकारी योजना एआई सहायक हूँ। आप मुझसे बोलकर या लिखकर किसानों, महिलाओं, छात्रों या पेंशन के बारे में पूछ सकते हैं।`;
      } else {
        initialGreeting = `Hello! I am your Punjab & Central Government Scheme AI Voice Assistant. Speak or type your questions in English or Punjabi to discover verified welfare schemes, eligibility rules, and official application portals.`;
      }

      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedSchemeIds: ['pm-kisan', 'sarbat-sehat-bima', 'post-matric-sc'],
          isAiGrounded: true
        }
      ]);
    }
  }, [assistantLang, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, liveTranscript]);

  // Setup Web Speech API for voice recognition with accurate Punjabi & English support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true; // Show live transcript as citizen speaks

      // Set recognition language: pa-IN for Punjabi, en-IN for Indian English, hi-IN for Hindi
      recognition.lang = assistantLang === 'pa' ? 'pa-IN' : assistantLang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        setLiveTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = final || interim;
        setLiveTranscript(currentText);

        if (final) {
          setInputText(final);
          setIsListening(false);
          setLiveTranscript('');
          handleSend(final);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        setIsListening(false);
        setLiveTranscript('');
        if (event.error !== 'no-speech') {
          setSpeechError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [assistantLang]);

  const toggleListening = (forcedLang?: Language) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(t.speechNotSupported);
      return;
    }

    const targetLang = forcedLang || assistantLang;
    if (forcedLang && forcedLang !== assistantLang) {
      setAssistantLang(forcedLang);
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      setLiveTranscript('');
    } else {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          setSpeakingMessageId(null);
        }
        if (recognitionRef.current) {
          recognitionRef.current.lang = targetLang === 'pa' ? 'pa-IN' : targetLang === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  // Text-To-Speech with Punjabi & English voice fallbacks
  const handleSpeak = (msgId: string, text: string, langToUse?: Language) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting, brackets, URLs
    const cleanText = text
      .replace(/[*#_`\[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const lang = langToUse || assistantLang;

    // Intelligent voice discovery
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'pa') {
      utterance.lang = 'pa-IN';
      // Look for Punjabi voice, fallback to Hindi voice (which correctly articulates North Indian terminology)
      const paVoice = voices.find(v => v.lang.startsWith('pa') || v.name.toLowerCase().includes('punjabi'));
      const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
      if (paVoice) {
        utterance.voice = paVoice;
      } else if (hiVoice) {
        utterance.voice = hiVoice;
      }
      utterance.rate = 0.9;
    } else if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      const hiVoice = voices.find(v => v.lang.startsWith('hi'));
      if (hiVoice) utterance.voice = hiVoice;
      utterance.rate = 0.92;
    } else {
      utterance.lang = 'en-IN';
      // Look for Indian English voice or standard English
      const enInVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));
      if (enInVoice) {
        utterance.voice = enInVoice;
      }
      utterance.rate = 0.95;
    }

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLiveTranscript('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: assistantLang,
          userProfile,
          consentGiven: hasConsent,
          conversationHistory: messages.slice(-4).map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the verified government information regarding your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedSchemeIds: data.recommendedSchemeIds || [],
        officialSources: data.officialSources || [],
        isAiGrounded: true
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If Auto-speak is enabled, automatically read the response aloud
      if (autoSpeakEnabled) {
        setTimeout(() => {
          handleSpeak(assistantMsg.id, assistantMsg.text, assistantLang);
        }, 200);
      }
    } catch (err) {
      console.error('Error contacting chat endpoint:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: assistantLang === 'pa'
          ? `ਮੁਆਫ਼ ਕਰਨਾ, ਸਰਵਰ ਨਾਲ ਸੰਪਰਕ ਵਿੱਚ ਦਿੱਕਤ ਆਈ ਹੈ। ਤੁਸੀਂ ਪੰਜਾਬ ਨਾਗਰਿਕ ਹੈਲਪਲਾਈਨ 1100 'ਤੇ ਕਾਲ ਕਰਕੇ ਜਾਂ ਨੇੜਲੇ ਸੇਵਾ ਕੇਂਦਰ ਜਾ ਕੇ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰ ਸਕਦੇ ਹੋ।`
          : `I encountered an issue contacting the live AI server. Please verify your connection or call the Punjab Citizen Helpline at 1100.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Dedicated Voice Prompts in Punjabi and English
  const punjabiVoicePrompts = [
    'ਮੈਂ ਕਿਸਾਨ ਹਾਂ, ਮੈਨੂੰ ਕਿਹੜੀ ਸਕੀਮ ਮਿਲੇਗੀ?',
    'ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਦੇ ਨਿਯਮ ਅਤੇ ਕਾਗਜ਼ ਦੱਸੋ',
    'ਸਰਬਤ ਸਿਹਤ ਬੀਮਾ 5 ਲੱਖ ਕਾਰਡ ਕਿਵੇਂ ਬਣੇਗਾ?',
    'SC ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਪੋਸਟ ਮੈਟ੍ਰਿਕ ਵਜ਼ੀਫਾ',
    'ਧੀ ਦੇ ਵਿਆਹ ਲਈ 51 ਹਜ਼ਾਰ ਅਸ਼ੀਰਵਾਦ ਸਕੀਮ',
    'ਪੰਜਾਬ ਵਿੱਚ 300 ਯੂਨਿਟ ਮੁਫ਼ਤ ਬਿਜਲੀ ਦੇ ਨਿਯਮ'
  ];

  const englishVoicePrompts = [
    'What schemes are available for farmers with small land in Punjab?',
    'How can I get 5 Lakh cashless medical treatment under Sarbat Sehat?',
    'What are the eligibility conditions and documents for Old Age Pension?',
    'Post-Matric Scholarship application process for SC students',
    'How to apply for Ashirwad Scheme for daughter marriage?',
    'What is the Punjab 300 Units Free Electricity Scheme rule?'
  ];

  const activePrompts = assistantLang === 'pa' ? punjabiVoicePrompts : englishVoicePrompts;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Drawer Top Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-teal-900 text-white p-3.5 sm:p-4 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-400/20 border border-teal-300/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                <span>{assistantLang === 'pa' ? 'ਪੰਜਾਬ ਸਕੀਮ ਏ.ਆਈ ਆਵਾਜ਼ ਸਹਾਇਕ' : 'Punjab Scheme AI Voice Assistant'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </h3>
              <span className="text-[11px] text-teal-200 font-medium flex items-center gap-1">
                <Radio className="w-3 h-3 text-teal-400 animate-pulse" />
                Punjabi (ਪੰਜਾਬੀ) &amp; English Voice Engine
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Voice Assistant Controls: Language switcher and Auto-Speak switch */}
        <div className="flex items-center justify-between pt-2 border-t border-white/15 gap-2 text-xs">
          {/* Language Switcher right inside the Voice Assistant */}
          <div className="flex items-center bg-black/25 p-0.5 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => {
                setAssistantLang('pa');
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                assistantLang === 'pa'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              🇮🇳 ਪੰਜਾਬੀ
            </button>
            <button
              type="button"
              onClick={() => {
                setAssistantLang('en');
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                assistantLang === 'en'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              onClick={() => {
                setAssistantLang('hi');
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                assistantLang === 'hi'
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Auto-Speak Answers Toggle */}
          <button
            type="button"
            onClick={() => {
              setAutoSpeakEnabled(!autoSpeakEnabled);
              if (autoSpeakEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                setSpeakingMessageId(null);
              }
            }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold border transition-all cursor-pointer ${
              autoSpeakEnabled
                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                : 'bg-white/5 text-slate-300 border-white/10'
            }`}
            title="Automatically read aloud replies"
          >
            {autoSpeakEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Auto-Speak: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Auto-Speak: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Voice Active Waveform Visualizer Banner */}
      {isListening && (
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white p-3.5 flex flex-col gap-2 shadow-inner animate-in slide-in-from-top duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
              </span>
              <span className="font-bold text-xs">
                {assistantLang === 'pa'
                  ? '🎙️ ਪੰਜਾਬੀ ਵਿੱਚ ਸੁਣ ਰਿਹਾ ਹੈ... ਬੋਲੋ ਜੀ!'
                  : assistantLang === 'hi'
                  ? '🎙️ हिन्दी में सुन रहा हूँ... बोलिए!'
                  : '🎙️ Listening in English... Speak your question now!'}
              </span>
            </div>

            {/* Audio frequency wave visualizer */}
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-1 bg-white rounded-full h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-white rounded-full h-4 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-white rounded-full h-3 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="w-1 bg-white rounded-full h-5 animate-bounce" style={{ animationDelay: '75ms' }} />
              <span className="w-1 bg-white rounded-full h-2 animate-bounce" style={{ animationDelay: '200ms' }} />
            </div>
          </div>

          {/* Live speech recognition transcription */}
          <div className="bg-black/20 rounded-lg p-2 text-xs font-medium text-teal-50 min-h-[32px] flex items-center justify-between">
            <span>{liveTranscript || (assistantLang === 'pa' ? 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਰਿਕਾਰਡ ਹੋ ਰਹੀ ਹੈ...' : 'Say scheme name, your age, occupation or question...')}</span>
            
            <button
              type="button"
              onClick={() => toggleListening()}
              className="text-[10px] font-bold bg-white text-teal-800 px-2 py-0.5 rounded-sm hover:bg-teal-50 ml-2 shrink-0 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Speech error indicator */}
      {speechError && (
        <div className="bg-amber-100 text-amber-900 text-xs px-3 py-1.5 flex items-center justify-between border-b border-amber-200">
          <span>{speechError}</span>
          <button onClick={() => setSpeechError(null)} className="font-bold ml-2 cursor-pointer">✕</button>
        </div>
      )}

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm bg-slate-50/70">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs whitespace-pre-wrap leading-relaxed ${
                  isUser
                    ? 'bg-blue-700 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 text-[10px] font-bold text-teal-800">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      {assistantLang === 'pa' ? 'ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਜਾਣਕਾਰੀ' : 'Official Grounded Information'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.id, msg.text, assistantLang)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-rose-100 text-rose-700 animate-pulse'
                          : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                      title={isSpeaking ? 'Stop voice playback' : 'Read aloud in current language'}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3 text-rose-600" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>{assistantLang === 'pa' ? 'ਸੁਣੋ' : 'Listen'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="text-xs sm:text-sm leading-relaxed">
                  {msg.text}
                </div>

                {!isUser && msg.officialSources && msg.officialSources.length > 0 && (
                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Official websites
                    </span>
                    <div className="mt-1 flex flex-col gap-1">
                      {msg.officialSources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-700 hover:text-blue-900 underline"
                        >
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[10px] mt-1.5 text-right ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {/* Recommended Scheme Cards embedded inside message */}
              {msg.recommendedSchemeIds && msg.recommendedSchemeIds.length > 0 && (
                <div className="mt-2 space-y-1.5 w-full max-w-[88%]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {assistantLang === 'pa' ? 'ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਸਕੀਮਾਂ:' : 'Recommended Schemes:'}
                  </span>
                  {msg.recommendedSchemeIds.map((schemeId) => {
                    const scheme = GOV_SCHEMES.find(s => s.id === schemeId);
                    if (!scheme) return null;
                    const schemeTitle = assistantLang === 'pa' ? scheme.titlePa : assistantLang === 'hi' ? scheme.titleHi : scheme.titleEn;

                    return (
                      <div
                        key={scheme.id}
                        onClick={() => onOpenSchemeModal(scheme)}
                        className="bg-white p-2.5 rounded-xl border border-blue-200 hover:border-blue-400 cursor-pointer shadow-xs transition-all flex items-center justify-between gap-2 group"
                      >
                        <div>
                          <div className="font-bold text-xs text-blue-900 group-hover:text-blue-700">
                            {schemeTitle}
                          </div>
                          <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
                            {scheme.benefitAmountText}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 w-fit shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping" />
            <span>
              {assistantLang === 'pa'
                ? 'ਪੰਜਾਬ ਸਰਕਾਰ ਦੇ ਗਜ਼ਟ ਅਤੇ ਨਿਯਮਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...'
                : 'Consulting official Punjab & Central Government gazettes...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Voice Queries Carousel in Selected Language */}
      <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Mic className="w-3 h-3 text-teal-600" />
            {assistantLang === 'pa' ? 'ਬੋਲਣ ਲਈ ਸਵਾਲ (ਪੰਜਾਬੀ / English):' : 'Suggested Voice Questions:'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Click or Speak</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {activePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="bg-white text-slate-700 hover:text-blue-700 hover:border-blue-300 border border-slate-200 px-2.5 py-1 rounded-lg whitespace-nowrap text-[11px] font-medium transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Citizen Privacy & Consent Bar (DPDP Act Compliance) */}
      <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasConsent}
            onChange={(e) => setHasConsent(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-[10px] sm:text-[11px]">
            {assistantLang === 'pa' 
              ? 'ਮੈਂ ਆਪਣਾ ਸਵਾਲ/ਪ੍ਰੋਫਾਈਲ AI ਸੇਵਾਵਾਂ ਨੂੰ ਭੇਜਣ ਲਈ ਸਹਿਮਤ ਹਾਂ (ਇਹ ਐਪ ਡਾਟਾ ਸਟੋਰ ਨਹੀਂ ਕਰਦੀ)'
              : assistantLang === 'hi'
              ? 'मैं सवाल/प्रोफ़ाइल AI सेवाओं को भेजने की सहमति देता/देती हूँ (यह ऐप डेटा स्टोर नहीं करता)'
              : 'I consent to send my question/profile to AI services; this app does not store it'}
          </span>
        </label>
        <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>DPDP Act</span>
        </span>
      </div>

      {/* Input Box Footer with Voice Mic Button */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Main Voice Mic Button with Language Pill */}
          <button
            type="button"
            onClick={() => toggleListening()}
            className={`p-2.5 sm:px-3 sm:py-2.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/20'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200 shadow-xs'
            }`}
            title={
              assistantLang === 'pa'
                ? 'ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲਣ ਲਈ ਕਲਿੱਕ ਕਰੋ'
                : 'Click to speak in English or Punjabi'
            }
            aria-label="Voice input"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-white" />
                <span className="hidden sm:inline text-xs font-bold">Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-teal-700 animate-pulse" />
                <span className="hidden sm:inline text-xs font-bold">
                  {assistantLang === 'pa' ? 'ਬੋਲੋ' : 'Speak'}
                </span>
              </>
            )}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              assistantLang === 'pa'
                ? 'ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪੁੱਛੋ (ਜਿਵੇਂ ਕਿ "ਮੈਂ ਕਿਸਾਨ ਹਾਂ, ਮੈਨੂੰ ਕਿਹੜੀ ਸਕੀਮ ਮਿਲੇਗੀ?")...'
                : 'Ask in English or Punjabi (e.g., "Farmer schemes in Ludhiana", "Old age pension rules")...'
            }
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
