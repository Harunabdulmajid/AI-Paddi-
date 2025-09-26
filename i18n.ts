import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import { Language, LearningPath, LessonContent } from './types';

// --- Utility for deep merging translations --- //
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;

function isObject(item: any): item is { [key: string]: any } {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Fix: Restructured the logic to resolve a TypeScript error where a property's type was not correctly inferred as 'object' before a recursive call.
function mergeDeep<T extends object>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const k = key as keyof T;
      const sourceValue = source[k];
      const targetValue = target[k];
      
      // If both the target and source values for a key are objects, merge them recursively.
      if (isObject(sourceValue) && isObject(targetValue)) {
        // The `isObject(targetValue)` check acts as a type guard, satisfying the `object` constraint for `mergeDeep`'s first argument.
        (output as any)[key] = mergeDeep(targetValue, sourceValue as any);
      } else {
        // Otherwise, the source value (even if it's an object and target is not) overwrites the target value.
        (output as any)[key] = sourceValue;
      }
    });
  }
  return output;
}
// --- End Utility --- //

type Translation = {
  onboarding: {
    welcome: string;
    prompt: string;
    thinking: string;
    textAreaPlaceholder: string;
    sendButtonLabel: string;
    successTitle: string;
    successMessage: string;
    ctaButton: string;
    triviaQuestion: string;
  };
  dashboard: {
    greeting: (name: string) => string;
    subGreeting: string;
    podcastTitle: string;
    podcastDescription: string;
    gameTitle: string;
    gameDescription: string;
    profileTitle: string;
    profileDescription: string;
    learningPathTitle: string;
  };
  podcast: {
    title: string;
    description: string;
    step1: string;
    generateButton: string;
    generatingButton: string;
    step2: string;
    generatingText: string;
    generatingSubtext: string;
    nextSteps: string;
    aiVoiceButton: string;
    stopButton: string;
    recordButton: string;
    placeholderTitle: string;
    noVoiceSupportTooltip: string;
    recordTooltip: string;
  };
  game: {
    title: string;
    description: string;
    correct: string;
    incorrect: string;
    writtenBy: (author: string) => string;
    aiAuthor: string;
    humanAuthor: string;
    humanButton: string;
    aiButton: string;
    playAgainButton: string;
  };
  profile: {
    title: string;
    description: string;
    learnerLevel: (level: LearningPath) => string;
    points: string;
    progressTitle: string;
    progressDescription: (completed: number, total: number) => string;
    certificatesTitle: string;
    moreCertificates: string;
    certificateTitleSingle: string;
    certificateFor: string;
    certificateCourseName: string;
    certificateCompletedOn: (date: string) => string;
    certificateId: string;
    downloadButton: string;
    shareButton: string;
  };
  lesson: {
    startQuizButton: string;
    completeLessonButton: string;
    quizTitle: string;
    quizCorrect: string;
    quizIncorrect: string;
    nextQuestionButton: string;
  };
  common: {
    backToDashboard: string;
    footer: (year: number) => string;
    pointsAbbr: string;
  };
  curriculum: {
    [key: string]: {
      title: string;
      description: string;
      lessonContent: LessonContent;
    };
  };
  levels: {
    [key: string]: string;
  };
};

// Base English translations - the single source of truth for the structure
const englishTranslations: Translation = {
  onboarding: {
    welcome: "Welcome to AI Kasahorow!",
    prompt: "Let's start with a quick question to personalize your learning journey.",
    thinking: "Thinking...",
    textAreaPlaceholder: "Type your answer here...",
    sendButtonLabel: "Send answer",
    successTitle: "Great! We're creating your personalized learning path.",
    successMessage: "Click the button below to go to your dashboard.",
    ctaButton: "Let's Go!",
    triviaQuestion: "What do you think Artificial Intelligence (AI) is? Explain it in your own words, like you're talking to a friend.",
  },
  dashboard: {
    greeting: (name) => `Hello, ${name}!`,
    subGreeting: "Ready to continue your AI adventure?",
    podcastTitle: "Podcast Generator",
    podcastDescription: "Create and share AI podcasts in your language.",
    gameTitle: "AI vs. Human",
    gameDescription: "Can you tell who wrote it? Test your skills!",
    profileTitle: "Profile & Certificates",
    profileDescription: "View your progress and earned certificates.",
    learningPathTitle: "Your Learning Path",
  },
  podcast: {
      title: "Podcast Generator",
      description: "Become an AI Champion! Create a short podcast to share with your community.",
      step1: "Select a Topic",
      generateButton: "Generate Script",
      generatingButton: "Generating...",
      step2: "Your Podcast",
      generatingText: "Our AI is crafting your script...",
      generatingSubtext: "This might take a moment.",
      nextSteps: "Next Steps",
      aiVoiceButton: "AI Voice",
      stopButton: "Stop",
      recordButton: "Record Yours",
      placeholderTitle: "Your generated podcast script will appear here.",
      noVoiceSupportTooltip: "AI voices not available for this language in your browser",
      recordTooltip: "Recording feature coming soon!",
  },
  game: {
    title: "AI vs. Human",
    description: "Can you tell which proverb was written by AI?",
    correct: "Correct! 🎉 (+10 points)",
    incorrect: "Not quite!",
    writtenBy: (author) => `This proverb was written by ${author}.`,
    aiAuthor: "an AI",
    humanAuthor: "a Human",
    humanButton: "Human",
    aiButton: "AI",
    playAgainButton: "Play Again",
  },
  profile: {
    title: "Your Profile & Progress",
    description: "Keep up the great work on your AI literacy journey!",
    learnerLevel: (level) => `${level} Learner`,
    points: "Points",
    progressTitle: "Learning Progress",
    progressDescription: (completed, total) => `${completed} of ${total} modules completed`,
    certificatesTitle: "Your Certificates",
    moreCertificates: "Complete all modules in your learning path to earn a certificate.",
    certificateTitleSingle: "Certificate of Completion",
    certificateFor: "Awarded to",
    certificateCourseName: "AI Literacy Fundamentals",
    certificateCompletedOn: (date) => `Completed on ${date}`,
    certificateId: "Certificate ID",
    downloadButton: "Download",
    shareButton: "Share",
  },
  lesson: {
      startQuizButton: "Start Quiz to Test Your Knowledge",
      completeLessonButton: "Complete Lesson (+25 Points)",
      quizTitle: "Knowledge Check",
      quizCorrect: "That's correct!",
      quizIncorrect: "Not quite. The correct answer is:",
      nextQuestionButton: "Next Question",
  },
  common: {
    backToDashboard: "Back to Dashboard",
    footer: (year) => `AI Kasahorow © ${year} - Democratizing AI Literacy`,
    pointsAbbr: "pts",
  },
  curriculum: {
    'what-is-ai': { 
      title: 'What is AI?', 
      description: 'Learn the basic definition of AI and what it means for a machine to be "intelligent".',
      lessonContent: {
          title: "Module 1: What is Artificial Intelligence?",
          introduction: "Have you ever wondered how your phone knows your face, or how a navigation app finds the fastest route? The answer is often Artificial Intelligence, or AI. Let's explore what this powerful technology really is.",
          sections: [
              {
                  heading: "Thinking Like Humans",
                  content: "At its core, AI is about creating computer systems that can perform tasks that usually require human intelligence. This includes things like learning from experience, solving problems, understanding language, and recognizing objects and sounds. Think of it like teaching a machine to think, not with a brain, but with computer code."
              },
              {
                  heading: "AI is Not a Robot",
                  content: "When people hear 'AI', they often picture walking, talking robots from movies. While robots can use AI, AI itself is the 'brain' software, not the physical body. It can exist in your phone, your car, or on the internet. It’s the invisible helper working behind the scenes."
              },
              {
                  heading: "The Goal: A Smart Assistant",
                  content: "The goal of most AI today is not to replace humans, but to help us. An AI can sort through massive amounts of information much faster than a person can. For example, a doctor can use AI to help spot diseases in medical scans, or a farmer can use AI to check on the health of their crops. It's a tool to make our jobs and lives easier."
              }
          ],
          summary: "AI is the science of making computers do tasks that normally require human intelligence. It's the 'brain' software that helps us solve problems, not just a physical robot.",
          quiz: {
            questions: [
              {
                question: "Which of these is the BEST description of AI?",
                options: [
                  "A physical robot that can walk and talk.",
                  "Software that can perform tasks requiring human-like intelligence.",
                  "The internet.",
                  "A new type of computer."
                ],
                correctAnswerIndex: 1,
                explanation: "AI is the 'brain' or software, not the physical body of a robot. It's about intelligent behavior."
              },
              {
                question: "Where can you find AI working?",
                options: [
                  "Only in science labs.",
                  "Only in robots.",
                  "In your phone, in hospitals, and on farms.",
                  "Only on the internet."
                ],
                correctAnswerIndex: 2,
                explanation: "AI is all around us, from the face unlock on our phones to tools used by doctors and farmers."
              }
            ]
          }
      }
    },
    'how-ai-works': { 
      title: 'How AI Works', 
      description: 'Discover how machines learn from data, similar to how we learn from experience.',
      lessonContent: {
          title: "Module 2: How Does AI Actually Learn?",
          introduction: "We know AI can be 'smart', but how does it get that way? It's not magic! AI systems learn through a process called 'Machine Learning', which is a bit like how we learn, but with data instead of life experiences.",
          sections: [
              {
                  heading: "Learning from Examples",
                  content: "Imagine you want to teach a child to recognize a cat. You'd show them many pictures of cats. After seeing enough examples, they learn the patterns: pointy ears, whiskers, a tail. Machine Learning works the same way. We feed an AI thousands of pictures labeled 'cat', and it learns to identify the patterns of what makes a cat."
              },
              {
                  heading: "The 'Recipe' is an Algorithm",
                  content: "The set of rules the AI uses to learn is called an algorithm. It's like a recipe. The data (pictures of cats) are the ingredients, and the algorithm is the instructions on how to process those ingredients to get the final dish: a system that can recognize cats."
              },
              {
                  heading: "Getting Better Over Time",
                  content: "The more data an AI sees, the better it gets. If it makes a mistake, it adjusts its internal patterns to be more accurate next time. This is why AI is so powerful—it can constantly improve and adapt as it gets more information, making it a powerful tool for complex problems."
              }
          ],
          summary: "AI learns through a process called Machine Learning. By feeding it lots of example data (like pictures or text), it uses an algorithm (a recipe) to recognize patterns and make decisions, getting smarter over time.",
          quiz: {
            questions: [
              {
                question: "What is 'Machine Learning'?",
                options: [
                  "A robot building another robot.",
                  "A process where AI learns from large amounts of data.",
                  "A computer that never makes mistakes.",
                  "A special type of calculator."
                ],
                correctAnswerIndex: 1,
                explanation: "Machine Learning is the core process where an AI system is trained on data to recognize patterns and make decisions."
              },
              {
                question: "What is an 'algorithm' in the context of AI?",
                options: [
                  "The data the AI uses.",
                  "The physical computer chip.",
                  "A problem the AI cannot solve.",
                  "A set of rules or instructions for the AI, like a recipe."
                ],
                correctAnswerIndex: 3,
                explanation: "An algorithm provides the step-by-step instructions that tell the AI how to learn from the data it's given."
              }
            ]
          }
      }
    },
    'ai-in-daily-life': { 
      title: 'AI in Daily Life', 
      description: 'Explore examples of AI in farming, health, and on your phone.',
      lessonContent: {
          title: "Module 3: AI is All Around Us",
          introduction: "You might not realize it, but you probably use AI every single day. It's integrated into many tools we rely on, making them smarter and more helpful. Let's look at a few examples.",
          sections: [
              {
                  heading: "On Your Phone",
                  content: "Your smartphone is a great example. When you use face unlock, that's AI recognizing you. When your map app predicts traffic, that's AI analyzing data from other cars. Even the suggestions for the next word to type in a message come from an AI that has learned how people communicate."
              },
              {
                  heading: "In Farming and Health",
                  content: "AI is also making a big impact in important fields. In agriculture, drones with AI can fly over a farm and identify which plants are sick, helping farmers save their crops. In healthcare, AI can analyze medical records to help doctors predict which patients are at high risk for certain diseases, allowing for earlier treatment."
              },
              {
                  heading: "For Shopping and Entertainment",
                  content: "When an online store recommends a product you might like, that's AI looking at your past purchases. When a music streaming service creates a personalized playlist for you, that's AI learning your taste in music. It's constantly working to make your experience more personal and convenient."
              }
          ],
          summary: "From unlocking your phone and navigating traffic to helping doctors and farmers, AI is a powerful tool that is already a part of our daily lives, often working quietly in the background to help us.",
          quiz: {
            questions: [
              {
                question: "Which of these is an example of AI in daily life?",
                options: [
                  "Boiling water for tea.",
                  "A map app predicting traffic.",
                  "Writing a letter with a pen.",
                  "Reading a printed book."
                ],
                correctAnswerIndex: 1,
                explanation: "Map apps use AI to analyze real-time data from many users to predict traffic and find the best routes."
              },
            ]
          }
      }
    },
    'risks-and-bias': { 
      title: 'Risks & Bias in AI', 
      description: 'Understand the challenges of AI, including fairness and safety.',
      lessonContent: {
          title: "Module 4: The Challenges: Bias and Safety",
          introduction: "While AI is an incredible tool, it's not perfect. It's important to understand the risks and challenges, especially when it comes to fairness and making sure AI is used responsibly.",
          sections: [
              {
                  heading: "What is AI Bias?",
                  content: "An AI system learns from the data we give it. If that data is biased, the AI will be biased too. For example, if an AI is trained to hire people using data from a company that mostly hired men in the past, it might learn to unfairly favor male candidates. It's like learning from a biased teacher—you pick up their biases."
              },
              {
                  heading: "The Importance of Good Data",
                  content: "This is why having fair and diverse data is so important. A proverb says, 'Garbage in, garbage out.' If we feed the AI incomplete or unfair data, we will get unfair results. We need to be very careful about the 'ingredients' we use to train AI systems."
              },
              {
                  heading: "Using AI Safely and Ethically",
                  content: "We must also think about how AI is used. Who is responsible if an AI makes a mistake? How do we protect people's privacy when AI uses their data? These are important questions that developers, communities, and governments are working on to ensure AI is used for good, helping everyone, not just a few."
              }
          ],
          summary: "AI systems can be biased if the data used to train them is unfair or incomplete. It's our responsibility to use diverse data and create rules to ensure AI is used safely, ethically, and for the benefit of all.",
          quiz: {
            questions: [
              {
                question: "How can an AI become biased?",
                options: [
                  "It gets tired.",
                  "It decides to be unfair on its own.",
                  "It is trained on data that is unfair or incomplete.",
                  "It runs out of electricity."
                ],
                correctAnswerIndex: 2,
                explanation: "AI bias comes from the data it learns from. If the data reflects historical biases (like hiring practices), the AI will learn and repeat those biases."
              }
            ]
          }
      }
    },
    'ai-and-jobs': { 
      title: 'AI and The Future of Jobs', 
      description: 'See how AI is changing work and what new opportunities are emerging.',
      lessonContent: {
          title: "Module 5: How AI is Changing Work",
          introduction: "Every major technology, from the printing press to the internet, has changed the way people work. AI is no different. It's creating new opportunities while also changing existing jobs. Let's see how.",
          sections: [
              {
                  heading: "A Tool to Help, Not Just Replace",
                  content: "AI is very good at repetitive tasks. Think about a factory worker who has to check thousands of items for defects. An AI-powered camera can do that job faster and more accurately, freeing up the human worker to focus on more complex problems, like improving the factory process. AI becomes a co-worker, handling the boring tasks."
              },
              {
                  heading: "New Jobs are Being Created",
                  content: "The rise of AI is also creating brand new jobs that didn't exist before. We now need 'AI Trainers' who prepare data for AI systems, 'AI Ethicists' who make sure AI is used responsibly, and 'Prompt Engineers' who specialize in writing instructions for AI. Learning about AI opens the door to these new career paths."
              },
              {
                  heading: "The Importance of Lifelong Learning",
                  content: "The most important skill in the age of AI is the ability to learn. As technology changes, we will all need to adapt and learn new skills. By understanding how AI works, you are taking the first step towards being ready for the jobs of the future, where humans and AI work together to achieve more than ever before."
              }
          ],
          summary: "AI is changing the job market by automating repetitive tasks and creating new roles. It acts as a powerful tool to assist human workers. The key to success is to embrace lifelong learning and adapt to working alongside this new technology.",
          quiz: {
            questions: [
              {
                question: "How is AI most likely to change jobs?",
                options: [
                  "By replacing all human jobs.",
                  "By creating new jobs and changing existing ones to work with AI.",
                  "By making all jobs harder.",
                  "By having no effect on jobs."
                ],
                correctAnswerIndex: 1,
                explanation: "AI is a tool that will automate certain tasks, leading to the evolution of current jobs and the creation of entirely new roles focused on managing and working with AI."
              }
            ]
          }
      }
    },
  },
  levels: {
    [LearningPath.Beginner]: 'Beginner',
    [LearningPath.Intermediate]: 'Intermediate',
    [LearningPath.Advanced]: 'Advanced',
  },
};

const swahiliPartial: DeepPartial<Translation> = {
  onboarding: {
    welcome: "Karibu AI Kasahorow!",
    prompt: "Tuanze na swali fupi ili kubinafsisha safari yako ya kujifunza.",
    thinking: "Inafikiri...",
    textAreaPlaceholder: "Andika jibu lako hapa...",
    successTitle: "Vizuri sana! Tunatayarisha njia yako ya kujifunza.",
    successMessage: "Bofya kitufe hapa chini ili kwenda kwenye dashibodi yako.",
    ctaButton: "Twende!",
    triviaQuestion: "Unafikiri Akili Mnemba (AI) ni nini? Eleza kwa maneno yako mwenyewe, kama unazungumza na rafiki.",
  },
  dashboard: {
    greeting: (name) => `Habari, ${name}!`,
    subGreeting: "Uko tayari kuendelea na safari yako ya AI?",
    podcastTitle: "Jenereta ya Podcast",
    podcastDescription: "Tengeneza na shiriki podcast za AI kwa lugha yako.",
    gameTitle: "AI dhidi ya Binadamu",
    gameDescription: "Je, unaweza kutambua ni nani aliyeandika? Jaribu ujuzi wako!",
    profileTitle: "Wasifu na Vyeti",
    profileDescription: "Tazama maendeleo yako na vyeti ulivyopata.",
    learningPathTitle: "Njia Yako ya Kujifunza",
  },
  podcast: {
      title: "Jenereta ya Podcast",
      description: "Kuwa Bingwa wa AI! Tengeneza podcast fupi ili kushiriki na jamii yako.",
      step1: "Chagua Mada",
      generateButton: "Tengeneza Hati",
      generatingButton: "Inatengeneza...",
      step2: "Podcast Yako",
      nextSteps: "Hatua Zinazofuata",
      aiVoiceButton: "Sauti ya AI",
      stopButton: "Simamisha",
      recordButton: "Rekodi Yako",
      placeholderTitle: "Hati yako ya podcast itaonekana hapa.",
  },
  game: {
    title: "AI dhidi ya Binadamu",
    description: "Je, unaweza kutofautisha methali iliyoandikwa na AI?",
    correct: "Sahihi! 🎉 (alama +10)",
    incorrect: "Sio sahihi kabisa!",
    writtenBy: (author) => `Methali hii iliandikwa na ${author}.`,
    aiAuthor: "AI",
    humanAuthor: "Binadamu",
    humanButton: "Binadamu",
    aiButton: "AI",
    playAgainButton: "Cheza Tena",
  },
  profile: {
    title: "Wasifu na Maendeleo Yako",
    description: "Endelea na kazi nzuri katika safari yako ya elimu ya AI!",
    learnerLevel: (level) => `Mwanafunzi wa ${level}`,
    points: "Alama",
    progressTitle: "Maendeleo ya Kujifunza",
    progressDescription: (completed, total) => `moduli ${completed} kati ya ${total} zimekamilika`,
    certificatesTitle: "Vyeti Vyako",
    moreCertificates: "Kamilisha moduli zote katika njia yako ya kujifunza ili kupata cheti.",
    certificateTitleSingle: "Cheti cha Kukamilisha",
    certificateFor: "Kimetolewa kwa",
    certificateCourseName: "Misingi ya Elimu ya AI",
    certificateCompletedOn: (date) => `Imekamilika tarehe ${date}`,
    certificateId: "Nambari ya Cheti",
    downloadButton: "Pakua",
    shareButton: "Shiriki",
  },
  lesson: {
      startQuizButton: "Anza Jaribio la Kupima Ujuzi Wako",
      completeLessonButton: "Kamilisha Somo (alama +25)",
      quizTitle: "Pima Ujuzi",
      quizCorrect: "Sahihi kabisa!",
      quizIncorrect: "Sio sahihi. Jibu sahihi ni:",
      nextQuestionButton: "Swali Linalofuata",
  },
  common: {
    backToDashboard: "Rudi kwenye Dashibodi",
    footer: (year) => `AI Kasahorow © ${year} - Kueneza Elimu ya AI kwa Wote`,
    pointsAbbr: "alama",
  },
  curriculum: {
    'what-is-ai': { 
      title: 'AI ni Nini?', 
      description: 'Jifunze maana ya msingi ya AI na maana ya mashine kuwa "akili".',
      lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent,
    },
    'how-ai-works': { 
      title: 'Jinsi AI Inavyofanya Kazi', 
      description: 'Gundua jinsi mashine zinavyojifunza kutoka kwa data, sawa na jinsi tunavyojifunza kutokana na uzoefu.',
      lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent,
    },
    'ai-in-daily-life': { 
      title: 'AI katika Maisha ya Kila Siku', 
      description: 'Chunguza mifano ya AI katika kilimo, afya, na kwenye simu yako.',
      lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent,
    },
    'risks-and-bias': { 
      title: 'Hatari na Upendeleo katika AI', 
      description: 'Elewa changamoto za AI, ikiwa ni pamoja na usawa na usalama.',
      lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent,
    },
    'ai-and-jobs': { 
      title: 'AI na Mustakabali wa Kazi', 
      description: 'Angalia jinsi AI inavyobadilisha kazi na ni fursa gani mpya zinazojitokeza.',
      lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent,
    },
  },
  levels: {
    [LearningPath.Beginner]: 'Anayeanza',
    [LearningPath.Intermediate]: 'Wastani',
    [LearningPath.Advanced]: 'Mtaalamu',
  },
};

const hausaPartial: DeepPartial<Translation> = {
  onboarding: {
    welcome: "Barka da zuwa AI Kasahorow!",
    prompt: "Bari mu fara da 'yar gajeriyar tambaya don tsara maka tafiyar karatunka.",
    thinking: "Tunanin...",
    textAreaPlaceholder: "Rubuta amsarka anan...",
    successTitle: "Madalla! Muna kan kirkirar maka hanyar karatu ta musamman.",
    successMessage: "Danna maballin da ke kasa don zuwa shafinka.",
    ctaButton: "Mu Je!",
    triviaQuestion: "A tunaninka, menene Hazakar Dan-Adam ta Rono (AI)? Yi bayani da kalaman ka, kamar kana magana da aboki.",
  },
  dashboard: {
    greeting: (name) => `Sannu, ${name}!`,
    subGreeting: "A shirye kake ka ci gaba da kasadar ka ta AI?",
    podcastTitle: "Mai Kirkirar Podcast",
    podcastDescription: "Kirkiri kuma raba podcast na AI a yarenka.",
    gameTitle: "AI vs. Mutum",
    gameDescription: "Za ka iya gane wanda ya rubuta? Gwada kwarewarka!",
    profileTitle: "Bayanan Sirri & Takaddun Shaida",
    profileDescription: "Duba ci gabanka da takaddun shaidar da ka samu.",
    learningPathTitle: "Hanyar Karatunka",
  },
  podcast: {
      title: "Mai Kirkirar Podcast",
      description: "Zama Gwarzon AI! Kirkiri gajeren podcast don rabawa da al'ummarka.",
      step1: "Zabi Jigo",
      generateButton: "Kirkiri Rubutun",
      generatingButton: "Ana Kirkirawa...",
      step2: "Podcast Dinka",
      nextSteps: "Matakai Na Gaba",
      aiVoiceButton: "Muryar AI",
      stopButton: "Dakata",
      recordButton: "Nadi Naka",
      placeholderTitle: "Rubutun podcast din da ka kirkira zai bayyana anan.",
  },
  game: {
    title: "AI vs. Mutum",
    description: "Za ka iya gane wanne karin magana ce AI ta rubuta?",
    correct: "Dai-dai! 🎉 (maki +10)",
    incorrect: "Kusan dai!",
    writtenBy: (author) => `Wannan karin maganar ${author} ne ya rubuta ta.`,
    aiAuthor: "AI",
    humanAuthor: "Mutum",
    humanButton: "Mutum",
    aiButton: "AI",
    playAgainButton: "Sake Gwada",
  },
  profile: {
    title: "Bayanan Sirri & Ci Gabanka",
    description: "Ci gaba da kokarin da kake yi a tafiyarka ta ilimin AI!",
    learnerLevel: (level) => `Mai Koyo na ${level}`,
    points: "Maki",
    progressTitle: "Ci Gaban Karatu",
    progressDescription: (completed, total) => `An kammala darasi ${completed} daga cikin ${total}`,
    certificatesTitle: "Takaddun Shaidarka",
    moreCertificates: "Kammala dukkan darussa a hanyar karatunka don samun takardar shaida.",
    certificateTitleSingle: "Takardar Shaida ta Kammalawa",
    certificateFor: "An ba da ga",
    certificateCourseName: "Tushen Ilimin AI",
    certificateCompletedOn: (date) => `An kammala a ranar ${date}`,
    certificateId: "Lambar Takardar Shaida",
    downloadButton: "Sauke",
    shareButton: "Raba",
  },
  lesson: {
      startQuizButton: "Fara Jarrabawa Don Gwada Iliminka",
      completeLessonButton: "Kammala Darasi (maki +25)",
      quizTitle: "Gwajin Ilimi",
      quizCorrect: "Dai-dai kwarai!",
      quizIncorrect: "Ba haka ba. Amsar daidai ita ce:",
      nextQuestionButton: "Tambaya Ta Gaba",
  },
  common: {
    backToDashboard: "Koma zuwa Dashboard",
    footer: (year) => `AI Kasahorow © ${year} - Bazuwar Ilimin AI ga Kowa`,
    pointsAbbr: "maki",
  },
  curriculum: {
      'what-is-ai': { 
          title: 'Menene AI?', 
          description: 'Koyi ainihin ma\'anar AI da abin da ake nufi da na\'ura ta zama "mai basira".',
          lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent,
      },
      'how-ai-works': { 
          title: 'Yadda AI ke Aiki', 
          description: 'Gano yadda na\'urori ke koyo daga bayanai, kamar yadda muke koyo daga kwarewa.',
          lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent,
      },
      'ai-in-daily-life': { 
          title: 'AI a Rayuwar Yau da Kullum', 
          description: 'Binciko misalan AI a aikin gona, lafiya, da kuma wayarka.',
          lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent,
      },
      'risks-and-bias': { 
          title: 'Hatsari & nuna bambanci a AI', 
          description: 'Fahimci kalubalen AI, gami da adalci da tsaro.',
          lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent,
      },
      'ai-and-jobs': { 
          title: 'AI da Makomar Ayyuka', 
          description: 'Duba yadda AI ke canza aiki da kuma irin sabbin damar da ke fitowa.',
          lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent,
      },
  },
  levels: {
    [LearningPath.Beginner]: 'Farawa',
    [LearningPath.Intermediate]: 'Matsakaici',
    [LearningPath.Advanced]: 'Kwararre',
  },
};

const yorubaPartial: DeepPartial<Translation> = {
  onboarding: {
    welcome: "Kaabọ si AI Kasahorow!",
    prompt: "Jẹ ki a bẹrẹ pẹlu ibeere kiakia lati ṣe akanṣe irin-ajo ẹkọ rẹ.",
    successTitle: "O tayọ! A n ṣẹda ipa-ọna ẹkọ ti ara ẹni rẹ.",
    triviaQuestion: "Kini o ro pe Imọye Oríkĕ (AI) jẹ? Ṣe alaye rẹ ni awọn ọrọ tirẹ, bi ẹni pe o n ba ọrẹ sọrọ.",
  },
  dashboard: {
    greeting: (name) => `Pẹlẹ o, ${name}!`,
    subGreeting: "Ṣetan lati tẹsiwaju ìrìn AI rẹ?",
    profileTitle: "Profaili & Awọn iwe-ẹri",
  },
  game: {
      title: "AI vs. Eniyan",
      description: "Ṣe o le sọ owe ti AI kọ?",
  },
  profile: {
      title: "Profaili Rẹ & Ilọsiwaju",
      learnerLevel: (level) => `Akẹ́kọ̀ọ́ ${level}`,
      points: "Awọn ojuami",
  },
  common: {
    backToDashboard: "Pada si Dasibodu",
  },
  levels: {
    [LearningPath.Beginner]: 'Olùbẹ̀rẹ̀',
    [LearningPath.Intermediate]: 'Aarin',
    [LearningPath.Advanced]: 'Onitẹsiwaju',
  },
  curriculum: {
    'what-is-ai': { title: 'Kini AI?', description: 'Kọ ẹkọ nipa itumọ ipilẹ AI.', lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent },
    'how-ai-works': { title: 'Bawo ni AI Ṣiṣẹ?', description: 'Ṣawari bi awọn ẹrọ ṣe nkọ ẹkọ lati data.', lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent },
    'ai-in-daily-life': { title: 'AI ni Igbesi aye Ojoojumọ', description: 'Wo awọn apẹẹrẹ ti AI ni ayika rẹ.', lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent },
    'risks-and-bias': { title: 'Awọn Ewu & Ojusaju ninu AI', description: 'Loye awọn italaya ti AI.', lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent },
    'ai-and-jobs': { title: 'AI ati Ojo iwaju Awọn iṣẹ', description: 'Wo bi AI ṣe n yi iṣẹ pada.', lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent },
  }
};

const igboPartial: DeepPartial<Translation> = {
  onboarding: {
    welcome: "Nnọọ na AI Kasahorow!",
    prompt: "Ka anyị jiri ajụjụ ọsịịsọ malite iji hazie njem mmụta gị.",
    triviaQuestion: "Gịnị ka i chere bụ Artificial Intelligence (AI)? Kọwaa ya n'okwu nke gị, dịka ị na-agwa enyi gị okwu.",
  },
  dashboard: {
    greeting: (name) => `Ndewo, ${name}!`,
    subGreeting: "Ị dịla njikere ịga n'ihu na njem AI gị?",
    profileTitle: "Profaịlụ & Asambodo",
  },
  game: {
    title: "AI vs. Mmadụ",
    description: "Ị nwere ike ịma ilu nke AI dere?",
  },
  profile: {
      title: "Profaịlụ Gị & Ọganihu",
      learnerLevel: (level) => `Onye mmụta ${level}`,
      points: "Akara",
  },
  common: {
    backToDashboard: "Laghachi na Dashboard",
  },
  levels: {
    [LearningPath.Beginner]: 'Onye mbido',
    [LearningPath.Intermediate]: 'Ọkara',
    [LearningPath.Advanced]: 'Ọkachamara',
  },
  curriculum: {
    'what-is-ai': { title: 'Gịnị bụ AI?', description: 'Mụta nkọwa bụ isi nke AI.', lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent },
    'how-ai-works': { title: 'Kedu ka AI si arụ ọrụ?', description: 'Chọpụta ka igwe si amụta site na data.', lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent },
    'ai-in-daily-life': { title: 'AI na ndụ kwa ụbọchị', description: 'Hụ ihe atụ nke AI gburugburu gị.', lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent },
    'risks-and-bias': { title: 'Ihe egwu & ele mmadụ anya n\'ihu na AI', description: 'Ghọta ihe ịma aka nke AI.', lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent },
    'ai-and-jobs': { title: 'AI na Ọdịnihu nke Ọrụ', description: 'Hụ ka AI si agbanwe ọrụ.', lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent },
  }
};

const pidginPartial: DeepPartial<Translation> = {
  onboarding: {
    welcome: "Welcome to AI Kasahorow!",
    prompt: "Make we start with one quick question to arrange your learning journey.",
    triviaQuestion: "Wetin you think say Artificial Intelligence (AI) be? Explain am with your own words, like say you dey talk to your friend.",
  },
  dashboard: {
    greeting: (name) => `How far, ${name}!`,
    subGreeting: "You ready to continue your AI adventure?",
    profileTitle: "Profile & Certificates",
  },
  game: {
      title: "AI vs. Human",
      description: "You fit tell which proverb na AI write am?",
  },
  profile: {
      title: "Your Profile & Progress",
      learnerLevel: (level) => `Learner Level: ${level}`,
  },
  common: {
    backToDashboard: "Go Back to Dashboard",
  },
  levels: {
    [LearningPath.Beginner]: 'Beginner',
    [LearningPath.Intermediate]: 'Intermediate',
    [LearningPath.Advanced]: 'Advanced',
  },
  curriculum: {
    'what-is-ai': { title: 'Wetin be AI?', description: 'Learn the basic meaning of AI.', lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent },
    'how-ai-works': { title: 'How AI Dey Work?', description: 'Discover how machines learn from data.', lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent },
    'ai-in-daily-life': { title: 'AI for Daily Life', description: 'See examples of AI around you.', lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent },
    'risks-and-bias': { title: 'Risks & Bias for AI', description: 'Understand the challenges of AI.', lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent },
    'ai-and-jobs': { title: 'AI and Future of Jobs', description: 'See how AI is changing work.', lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent },
  }
};

const amharicPartial: DeepPartial<Translation> = {
  dashboard: { greeting: (name) => `ሰላም, ${name}!` },
  levels: { [LearningPath.Beginner]: 'ጀማሪ', [LearningPath.Intermediate]: 'መካከለኛ', [LearningPath.Advanced]: 'ከፍተኛ' },
  curriculum: {
    'what-is-ai': { lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent },
    'how-ai-works': { lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent },
    'ai-in-daily-life': { lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent },
    'risks-and-bias': { lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent },
    'ai-and-jobs': { lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent },
  }
};
const zuluPartial: DeepPartial<Translation> = {
  dashboard: { greeting: (name) => `Sawubona, ${name}!` },
  levels: { [LearningPath.Beginner]: 'Osaqalayo', [LearningPath.Intermediate]: 'Ophakathi', [LearningPath.Advanced]: 'Othuthukile' },
   curriculum: {
    'what-is-ai': { lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent },
    'how-ai-works': { lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent },
    'ai-in-daily-life': { lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent },
    'risks-and-bias': { lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent },
    'ai-and-jobs': { lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent },
  }
};
const shonaPartial: DeepPartial<Translation> = {
  dashboard: { greeting: (name) => `Mhoro, ${name}!` },
  levels: { [LearningPath.Beginner]: 'Anotanga', [LearningPath.Intermediate]: 'Yepakati', [LearningPath.Advanced]: 'Yepamusoro' },
   curriculum: {
    'what-is-ai': { lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent },
    'how-ai-works': { lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent },
    'ai-in-daily-life': { lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent },
    'risks-and-bias': { lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent },
    'ai-and-jobs': { lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent },
  }
};
const somaliPartial: DeepPartial<Translation> = {
  dashboard: { greeting: (name) => `Salaam, ${name}!` },
  levels: { [LearningPath.Beginner]: 'Bilow', [LearningPath.Intermediate]: 'Dhexdhexaad', [LearningPath.Advanced]: 'Sare' },
   curriculum: {
    'what-is-ai': { lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent },
    'how-ai-works': { lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent },
    'ai-in-daily-life': { lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent },
    'risks-and-bias': { lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent },
    'ai-and-jobs': { lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent },
  }
};


const translations: { [key in Language]: Translation } = {
  [Language.English]: englishTranslations,
  [Language.Swahili]: mergeDeep({ ...englishTranslations }, swahiliPartial),
  [Language.Hausa]: mergeDeep({ ...englishTranslations }, hausaPartial),
  [Language.Yoruba]: mergeDeep({ ...englishTranslations }, yorubaPartial),
  [Language.Igbo]: mergeDeep({ ...englishTranslations }, igboPartial),
  [Language.Pidgin]: mergeDeep({ ...englishTranslations }, pidginPartial),
  [Language.Amharic]: mergeDeep({ ...englishTranslations }, amharicPartial),
  [Language.Zulu]: mergeDeep({ ...englishTranslations }, zuluPartial),
  [Language.Shona]: mergeDeep({ ...englishTranslations }, shonaPartial),
  [Language.Somali]: mergeDeep({ ...englishTranslations }, somaliPartial),
};

export const useTranslations = (): Translation => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTranslations must be used within an AppProvider');
  }
  const { language } = context;

  return translations[language] || translations[Language.English]!;
};