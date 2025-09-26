import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { CURRICULUM_MODULES } from '../constants';
import { geminiService } from '../services/geminiService';
import { Loader2, Mic, Play, Share2, Sparkles, Wand2, Square } from 'lucide-react';
import { Language } from '../types';
import { useTranslations } from '../i18n';
import { ScriptViewer } from './ScriptViewer';

// Helper to map app language to BCP 47 language codes for Web Speech API
const getLangCode = (lang: Language): string => {
  switch (lang) {
    case Language.Hausa: return 'ha-NG';
    case Language.Yoruba: return 'yo-NG';
    case Language.Igbo: return 'ig-NG';
    // Use 'en-NG' for Nigerian Pidgin to leverage available Nigerian English voices,
    // as specific Pidgin ('pcm-NG') voices are generally not supported.
    case Language.Pidgin: return 'en-NG';
    case Language.Swahili: return 'sw-TZ';
    case Language.Amharic: return 'am-ET';
    case Language.Zulu: return 'zu-ZA';
    case Language.Shona: return 'sn-ZW';
    case Language.Somali: return 'so-SO';
    case Language.English:
    default:
      return 'en-US';
  }
};


export const PodcastGenerator: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("PodcastGenerator must be used within an AppProvider");
  const { language } = context;
  const t = useTranslations();

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [harunaVoice, setHarunaVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [fatimaVoice, setFatimaVoice] = useState<SpeechSynthesisVoice | null>(null);


  const curriculumTopics = CURRICULUM_MODULES.map(module => ({
    id: module.id,
    title: t.curriculum[module.id].title,
  }));

  // Load available TTS voices from the browser
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    // onvoiceschanged is fired when the list of voices is ready
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Also call it directly in case voices are already loaded
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Select male and female voices when language or available voices change
  useEffect(() => {
    if (voices.length > 0) {
      const langCode = getLangCode(language);
      const langVoices = voices.filter(v => v.lang.startsWith(langCode));

      if (langVoices.length === 0) {
          console.warn(`No voices found for language code: ${langCode}`);
          setHarunaVoice(null);
          setFatimaVoice(null);
          return;
      }

      // Separate voices by likely gender based on common name patterns
      const maleVoices = langVoices.filter(v => v.name.toLowerCase().includes('male'));
      const femaleVoices = langVoices.filter(v => v.name.toLowerCase().includes('female'));
      const neutralVoices = langVoices.filter(v => !maleVoices.includes(v) && !femaleVoices.includes(v));

      let hVoice: SpeechSynthesisVoice | null = null;
      let fVoice: SpeechSynthesisVoice | null = null;
      
      // Assign Haruna (male) voice: Prioritize male, then neutral, then any available
      if (maleVoices.length > 0) {
          hVoice = maleVoices[0];
      } else if (neutralVoices.length > 0) {
          hVoice = neutralVoices[0];
      } else {
          hVoice = langVoices[0];
      }
      
      // Assign Fatima (female) voice: Prioritize female, then find a different voice
      if (femaleVoices.length > 0) {
          fVoice = femaleVoices[0];
      } else {
          // Find any voice that is different from Haruna's voice
          const otherVoice = langVoices.find(v => v !== hVoice);
          fVoice = otherVoice || hVoice; // Fallback to Haruna's voice if it's the only one
      }
      
      setHarunaVoice(hVoice);
      setFatimaVoice(fVoice);
    }
  }, [voices, language]);

  // Cleanup effect to stop speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleGenerateScript = async () => {
    if (!selectedTopic) return;
    
    // Stop any current speech before generating a new script
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setIsLoading(true);
    setScript(null);
    const generatedScript = await geminiService.generatePodcastScript(selectedTopic, language);
    setScript(generatedScript);
    setIsLoading(false);
  };

  const handleAiVoice = () => {
    if (!script || !harunaVoice || !fatimaVoice) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    window.speechSynthesis.cancel(); // Make sure queue is clear

    const lines = script.split('\n').filter(line => line.trim() !== '' && !line.trim().startsWith('('));
    const utterances: SpeechSynthesisUtterance[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      let utterance: SpeechSynthesisUtterance | null = null;
      
      if (trimmedLine.toLowerCase().startsWith('haruna:')) {
        const text = trimmedLine.substring('haruna:'.length).trim();
        utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = harunaVoice;
      } else if (trimmedLine.toLowerCase().startsWith('fatima:')) {
        const text = trimmedLine.substring('fatima:'.length).trim();
        utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = fatimaVoice;
      }
      
      if (utterance) {
        utterance.lang = getLangCode(language);
        utterances.push(utterance);
      }
    });

    if (utterances.length > 0) {
        setIsSpeaking(true);

        const speakSequentially = (index: number) => {
            if (index >= utterances.length || !window.speechSynthesis) {
                setIsSpeaking(false);
                return;
            }

            const utterance = utterances[index];
            utterance.onend = () => {
                speakSequentially(index + 1);
            };
            utterance.onerror = (event) => {
                console.error("Speech synthesis error:", event);
                setIsSpeaking(false); 
            };
            window.speechSynthesis.speak(utterance);
        };
        
        speakSequentially(0);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
       <h2 className="text-4xl font-extrabold text-neutral-800 mb-2">{t.podcast.title}</h2>
       <p className="text-neutral-500 mb-8 text-lg">{t.podcast.description}</p>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* Step 1: Configuration */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full font-bold text-lg">1</div>
                    <h3 className="text-2xl font-bold text-neutral-800">{t.podcast.step1}</h3>
                </div>
                <div className="space-y-3">
                    {curriculumTopics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => setSelectedTopic(topic.title)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all text-lg font-medium ${selectedTopic === topic.title ? 'bg-primary/10 border-primary text-primary' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300'}`}
                        >
                            {topic.title}
                        </button>
                    ))}
                </div>
                 <button
                    onClick={handleGenerateScript}
                    disabled={!selectedTopic || isLoading}
                    className="mt-8 w-full flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 rounded-xl text-lg disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-primary-dark transition-transform active:scale-95"
                >
                    {isLoading ? <><Loader2 className="animate-spin" size={24} /> {t.podcast.generatingButton}</> : <><Wand2 size={24} /> {t.podcast.generateButton}</>}
                </button>
            </div>

            {/* Step 2: Result */}
            <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full font-bold text-lg">2</div>
                    <h3 className="text-2xl font-bold text-neutral-800">{t.podcast.step2}</h3>
                </div>
                {isLoading && (
                    <div className="flex-grow flex flex-col items-center justify-center text-neutral-500">
                        <Sparkles className="animate-pulse text-primary" size={64} />
                        <p className="mt-4 text-lg font-semibold">{t.podcast.generatingText}</p>
                        <p className="text-md">{t.podcast.generatingSubtext}</p>
                    </div>
                )}
                {script && (
                    <div className="h-full flex flex-col flex-grow">
                        <div className="flex-grow min-h-72">
                          <ScriptViewer script={script} />
                        </div>
                        <div className="mt-6 pt-6 border-t border-neutral-200">
                             <h4 className="font-bold text-lg mb-3">{t.podcast.nextSteps}</h4>
                             <div className="flex gap-3">
                                <button
                                    onClick={handleAiVoice}
                                    disabled={!script || (!harunaVoice || !fatimaVoice)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:bg-neutral-300 disabled:cursor-not-allowed text-base"
                                    title={!harunaVoice || !fatimaVoice ? t.podcast.noVoiceSupportTooltip : t.podcast.aiVoiceButton}
                                >
                                    {isSpeaking ? (
                                        <>
                                            <Square size={20} /> {t.podcast.stopButton}
                                        </>
                                    ) : (
                                        <>
                                            <Play size={20} /> {t.podcast.aiVoiceButton}
                                        </>
                                    )}
                                </button>
                                 <button 
                                    className="flex-1 flex items-center justify-center gap-2 bg-neutral-700 text-white font-bold py-3 rounded-lg hover:bg-neutral-800 transition text-base disabled:bg-neutral-300 disabled:cursor-not-allowed"
                                    disabled={true}
                                    title={t.podcast.recordTooltip}
                                >
                                    <Mic size={20} /> {t.podcast.recordButton}
                                 </button>
                                <button className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition">
                                    <Share2 size={22} />
                                </button>
                             </div>
                        </div>
                    </div>
                )}
                 {!isLoading && !script && (
                    <div className="flex-grow flex flex-col items-center justify-center text-neutral-400 text-center p-8">
                        <Mic size={64} />
                        <p className="mt-4 text-lg font-semibold">{t.podcast.placeholderTitle}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};