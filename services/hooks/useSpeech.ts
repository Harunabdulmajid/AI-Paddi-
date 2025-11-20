import { useState, useRef, useCallback, useEffect } from 'react';
import { Language } from '../../types';

const languageMap: Record<Language, string> = {
    [Language.English]: 'en-US',
    [Language.Hausa]: 'ha-NG',
    [Language.Yoruba]: 'yo-NG',
    [Language.Igbo]: 'ig-NG',
    [Language.Pidgin]: 'en-NG',
    [Language.Swahili]: 'sw-KE',
    [Language.Amharic]: 'am-ET',
    [Language.Zulu]: 'zu-ZA',
    [Language.Shona]: 'sn-ZW',
    [Language.Somali]: 'so-SO',
};

// --- Speech Recognition Singleton ---
let recognition: any = null;
try {
  // @ts-ignore
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
      recognition = new SpeechRecognition();
  }
} catch (e) {
  console.error("SpeechRecognition is not supported or failed to initialize.", e);
}

export const useSpeech = () => {
    const [isListening, setIsListening] = useState(false);
    const synthRef = useRef(window.speechSynthesis);
    const isListeningRef = useRef(false);

    // Use a ref to store state that shouldn't trigger re-renders but needs to be
    // accessed by event handlers without stale closures.
    const listeningStateRef = useRef({
      isContinuous: false,
      callback: (transcript: string) => {},
    });
    
    // --- Effect to set up and tear down event listeners ---
    useEffect(() => {
        if (!recognition) return;

        const handleStart = () => {
            isListeningRef.current = true;
            setIsListening(true);
        };
        
        const handleResult = (event: any) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            if (listeningStateRef.current.callback) {
                listeningStateRef.current.callback(transcript);
            }
        };

        const handleError = (event: any) => {
            const error = event.error;
            // Ignore network errors as we want to retry, but stop on others
            if (error !== 'network' && error !== 'no-speech' && error !== 'aborted') {
                console.error('Speech recognition error:', error);
                listeningStateRef.current.isContinuous = false;
            }
            // If it's just no-speech, we stay in continuous mode if set
            // Status update happens in onend
        };
        
        const handleEnd = () => {
            isListeningRef.current = false;
            setIsListening(false);
            
            // Restart logic for continuous listening
            if (listeningStateRef.current.isContinuous) {
                setTimeout(() => {
                    if (listeningStateRef.current.isContinuous && !isListeningRef.current) {
                        try {
                            recognition.start();
                        } catch(err) {
                            // Ignore errors if already started
                        }
                    }
                }, 500); 
            }
        };

        recognition.onstart = handleStart;
        recognition.onresult = handleResult;
        recognition.onerror = handleError;
        recognition.onend = handleEnd;
        
        return () => {
            listeningStateRef.current.isContinuous = false;
            if (recognition) {
                recognition.abort();
            }
            isListeningRef.current = false;
        };
    }, []);

    const speak = useCallback((text: string, lang: Language) => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageMap[lang] || 'en-US';
        synthRef.current.speak(utterance);
    }, []);

    const startListening = useCallback((callback: (transcript: string) => void, lang: Language) => {
        if (!recognition) return;
        
        // Update ref before checking isListening to ensure callbacks are fresh
        listeningStateRef.current = {
            isContinuous: false,
            callback: callback,
        };
        
        if (isListeningRef.current) {
            recognition.stop(); // Stop current session to apply new settings/callback
            return;
        }
        
        recognition.lang = languageMap[lang] || 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        try {
            recognition.start();
        } catch (e) {
            console.error("Error starting speech recognition:", e);
        }
    }, []);

    const startContinuousListening = useCallback((callback: (transcript: string) => void, lang: Language) => {
        if (!recognition) return;

        // Update ref before checking isListening to ensure
        // callbacks are fresh and isContinuous is true after re-renders.
        listeningStateRef.current = {
            isContinuous: true,
            callback: callback,
        };

        const targetLang = languageMap[lang] || 'en-US';
        const langChanged = recognition.lang !== targetLang;
        
        if (langChanged) {
            recognition.lang = targetLang;
        }
        
        recognition.continuous = true;
        recognition.interimResults = false;

        if (isListeningRef.current) {
            // If language changed, stop current session so it restarts with new language via onend
            if (langChanged) {
                recognition.stop();
            }
            // Already listening. The ref update above ensures the new callback is used.
            return;
        }
        
        try {
            recognition.start();
        } catch (e) {
            console.error("Error starting continuous speech recognition:", e);
        }
    }, []);

    const stopListening = useCallback(() => {
        listeningStateRef.current.isContinuous = false;
        if (recognition && isListeningRef.current) {
            recognition.stop();
        } else {
            isListeningRef.current = false;
            setIsListening(false);
        }
    }, []);

    return { isListening, speak, startListening, startContinuousListening, stopListening };
};