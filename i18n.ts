import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import { Language, LearningPath, LessonContent, FeedbackType } from './types';
import { BADGES } from './constants';

// --- Utility for deep merging translations --- //
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;

function isObject(item: any): item is { [key: string]: any } {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Fix: Restructured the logic to resolve TypeScript errors with deep recursive types.
// The use of `any` is a pragmatic approach to handle limitations in TypeScript's
// type inference for generic, dynamically keyed objects.
function mergeDeep<T extends object>(target: T, source: DeepPartial<T>): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    // Iterate over source keys
    Object.keys(source).forEach(key => {
      const sourceValue = (source as any)[key];
      const targetValue = (target as any)[key];
      
      // If both the target and source values for a key are objects, merge them recursively.
      if (isObject(sourceValue) && isObject(targetValue)) {
        // The isObject guard ensures we're passing an object to the recursive call,
        // satisfying the generic constraint of mergeDeep.
        (output as any)[key] = mergeDeep(targetValue, sourceValue);
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
    ctaButton: string;
    signInButton: string;
    pathAssignedTitle: string;
    pathAssignedDescription: string;
  };
  dashboard: {
    greeting: (name: string) => string;
    subGreeting: string;
    progressTitle: string;
    progressDescription: (completed: number, total: number) => string;
    continueLearningButton: string;
    allModulesCompleted: string;
    multiplayerTitle: string;
    multiplayerDescription: string;
    gameTitle: string;
    gameDescription: string;
    profileTitle: string;
    profileDescription: string;
    leaderboardTitle: string;
    leaderboardDescription: string;
    learningPathTitle: string;
  };
  multiplayer: {
    title: string;
    description: string;
    createGame: string;
    creating: string;
    joinGame: string;
    joining: string;
    gameCodePlaceholder: string;
    lobbyTitle: string;
    shareCode: string;
    copied: string;
    players: string;
    waitingForHost: string;
    startGame: string;
    starting: string;
    question: (current: number, total: number) => string;
    scoreboard: string;
    finalResults: string;
    winner: string;
    rematch: string;
    exit: string;
    errorNotFound: string;
    errorAlreadyStarted: string;
    errorFull: string;
    errorGeneric: string;
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
    difficulty: string;
    easy: string;
    hard: string;
  };
  profile: {
    title: string;
    description: string;
    learnerLevel: (level: LearningPath) => string;
    points: string;
    progressTitle: string;
    progressDescription: (completed: number, total: number) => string;
    badgesTitle: string;
    noBadges: string;
    certificatesTitle: string;
    moreCertificates: string;
    certificateTitleSingle: string;
    certificateFor: string;
    certificateCourseName: string;
    certificateCompletedOn: (date: string) => string;
    certificateId: string;
    downloadButton: string;
    shareButton: string;
    feedbackButton: string;
    multiplayerStatsTitle: string;
    wins: string;
    gamesPlayed: string;
  };
  lesson: {
    startQuizButton: string;
    completeLessonButton: string;
    returnToDashboardButton: string;
    quizTitle: string;
    quizCorrect: string;
    quizIncorrect: string;
    nextQuestionButton: string;
    completionModalTitle: string;
    completionModalPoints: (points: number) => string;
    badgeUnlocked: string;
  };
  leaderboard: {
    title: string;
    description: string;
    rank: string;
    player: string;
    points: string;
    you: string;
  };
  header: {
    profile: string;
    logout: string;
  };
  common: {
    backToDashboard: string;
    footer: (year: number) => string;
    pointsAbbr: string;
    save: string;
    cancel: string;
    submit: string;
    close: string;
  };
  feedback: {
    title: string;
    description: string;
    typeLabel: string;
    types: {
      [key in FeedbackType]: string;
    };
    messageLabel: string;
    messagePlaceholder: string;
    submitting: string;
    successTitle: string;
    successDescription: string;
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
  tooltips: {
    [key: string]: string;
  };
  badges: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
};

// Base English translations - the single source of truth for the structure
export const englishTranslations: Translation = {
  onboarding: {
    ctaButton: "Start Learning!",
    signInButton: "Get Started",
    pathAssignedTitle: "Congratulations!",
    pathAssignedDescription: "You're on your way! We've assigned you the perfect learning path to get started.",
  },
  dashboard: {
    greeting: (name) => `Hello, ${name}!`,
    subGreeting: "Ready to continue your AI adventure?",
    progressTitle: "Your Progress",
    progressDescription: (completed, total) => `You've completed ${completed} of ${total} modules.`,
    continueLearningButton: "Continue Learning",
    allModulesCompleted: "All Modules Completed!",
    multiplayerTitle: "Multi-player",
    multiplayerDescription: "Challenge friends or others in a real-time quiz.",
    gameTitle: "AI vs. Human",
    gameDescription: "Can you tell who wrote it? Test your skills!",
    profileTitle: "Profile & Certificates",
    profileDescription: "View your progress and earned certificates.",
    leaderboardTitle: "Community Leaderboard",
    leaderboardDescription: "See how you rank against other learners.",
    learningPathTitle: "Your Learning Path",
  },
  multiplayer: {
    title: "Multi-player Challenge",
    description: "Test your AI knowledge against others in a fun, real-time quiz.",
    createGame: "Create Game",
    creating: "Creating...",
    joinGame: "Join Game",
    joining: "Joining...",
    gameCodePlaceholder: "Enter Game Code",
    lobbyTitle: "Game Lobby",
    shareCode: "Share this code with your friends:",
    copied: "Copied!",
    players: "Players",
    waitingForHost: "Waiting for host to start...",
    startGame: "Start Game",
    starting: "Starting...",
    question: (current, total) => `Question ${current} of ${total}`,
    scoreboard: "Scoreboard",
    finalResults: "Final Results",
    winner: "Winner!",
    rematch: "Rematch",
    exit: "Exit",
    errorNotFound: "Game not found. Please check the code.",
    errorAlreadyStarted: "This game has already started.",
    errorFull: "This game is full.",
    errorGeneric: "An error occurred. Please try again.",
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
    difficulty: "Difficulty",
    easy: "Easy",
    hard: "Hard",
  },
  profile: {
    title: "Your Profile & Progress",
    description: "Keep up the great work on your AI literacy journey!",
    learnerLevel: (level) => `${level} Learner`,
    points: "Points",
    progressTitle: "Learning Progress",
    progressDescription: (completed, total) => `${completed} of ${total} modules completed`,
    badgesTitle: "My Badges",
    noBadges: "Complete modules and earn points to unlock badges!",
    certificatesTitle: "Your Certificates",
    moreCertificates: "Complete all modules in your learning path to earn a certificate.",
    certificateTitleSingle: "Certificate of Completion",
    certificateFor: "Awarded to",
    certificateCourseName: "AI Literacy Fundamentals",
    certificateCompletedOn: (date) => `Completed on ${date}`,
    certificateId: "Certificate ID",
    downloadButton: "Download",
    shareButton: "Share",
    feedbackButton: "Send Feedback",
    multiplayerStatsTitle: "Multi-player Stats",
    wins: "Wins",
    gamesPlayed: "Games Played",
  },
  lesson: {
      startQuizButton: "Start Quiz to Test Your Knowledge",
      completeLessonButton: "Complete Lesson",
      returnToDashboardButton: "Return to Dashboard",
      quizTitle: "Knowledge Check",
      quizCorrect: "That's correct!",
      quizIncorrect: "Not quite. The correct answer is:",
      nextQuestionButton: "Next Question",
      completionModalTitle: "Lesson Complete!",
      completionModalPoints: (points) => `You've earned ${points} points!`,
      badgeUnlocked: "Badge Unlocked!",
  },
  leaderboard: {
    title: "Community Leaderboard",
    description: "See how your learning progress compares to others in the community!",
    rank: "Rank",
    player: "Player",
    points: "Points",
    you: "You",
  },
  header: {
    profile: "Profile",
    logout: "Logout",
  },
  common: {
    backToDashboard: "Back to Dashboard",
    footer: (year) => `AI Kasahorow © ${year} - Democratizing AI Literacy`,
    pointsAbbr: "pts",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    close: "Close",
  },
  feedback: {
    title: "Share Your Feedback",
    description: "We value your input! Let us know how we can improve.",
    typeLabel: "Feedback Type",
    types: {
        [FeedbackType.Bug]: "Bug Report",
        [FeedbackType.Suggestion]: "Suggestion",
        [FeedbackType.General]: "General Feedback",
    },
    messageLabel: "Your Message",
    messagePlaceholder: "Please describe the issue or your idea...",
    submitting: "Submitting...",
    successTitle: "Thank You!",
    successDescription: "Your feedback has been received. We appreciate you helping us make AI Kasahorow better.",
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
  tooltips: {
    'artificial intelligence': 'The ability of a computer or machine to perform tasks that normally require human intelligence, like learning and problem-solving.',
    'ai': 'Short for Artificial Intelligence. A field of computer science focused on creating smart machines.',
    'algorithm': 'A set of rules or instructions, like a recipe, that a computer follows to complete a task.',
    'machine learning': 'A type of AI that allows computers to learn from data without being explicitly programmed. It finds patterns to make predictions.',
    'data': 'Information, such as facts, numbers, or pictures, that can be collected and analyzed by a computer.',
    'ai bias': 'When an AI system produces unfair or prejudiced results because it was trained on incomplete or flawed data.',
    'ai trainers': 'People who prepare and label data to teach AI systems how to perform specific tasks correctly.',
    'ai ethicists': 'Specialists who study the moral and social impact of AI to ensure it is used responsibly and fairly.',
    'prompt engineers': 'People who specialize in crafting effective questions and instructions (prompts) to get the best results from an AI model.',
  },
  badges: {
    'first-step': {
        name: 'First Step',
        description: 'Completed your first lesson module.',
    },
    'ai-graduate': {
        name: 'AI Graduate',
        description: 'Completed the entire AI Literacy curriculum.',
    },
    'point-pioneer': {
        name: 'Point Pioneer',
        description: 'Earned your first 100 points.',
    },
    'top-contender': {
        name: 'Top Contender',
        description: 'Reached the Top 3 on the leaderboard.',
    },
    'first-win': {
        name: 'First Win',
        description: 'Won your first multiplayer match.',
    },
    'multiplayer-maestro': {
        name: 'Multiplayer Maestro',
        description: 'Played 10 multiplayer matches.',
    },
  }
};

const swahiliPartial: DeepPartial<Translation> = {
  onboarding: {
    ctaButton: "Anza Kujifunza!",
    signInButton: "Anza Sasa",
  },
  dashboard: {
    greeting: (name) => `Habari, ${name}!`,
    subGreeting: "Uko tayari kuendelea na safari yako ya AI?",
    multiplayerTitle: "Wachezaji Wengi",
    multiplayerDescription: "Shindana na marafiki katika jaribio la wakati halisi.",
    gameTitle: "AI dhidi ya Binadamu",
    gameDescription: "Je, unaweza kutambua ni nani aliyeandika? Jaribu ujuzi wako!",
    profileTitle: "Wasifu na Vyeti",
    profileDescription: "Tazama maendeleo yako na vyeti ulivyopata.",
    leaderboardTitle: "Ubao wa Wanaoongoza",
    leaderboardDescription: "Tazama jinsi unavyopambana na wanafunzi wengine.",
    learningPathTitle: "Njia Yako ya Kujifunza",
  },
  multiplayer: {
    title: "Changamoto ya Wachezaji Wengi",
    description: "Pima maarifa yako ya AI dhidi ya wengine katika jaribio la kufurahisha la wakati halisi.",
    createGame: "Anzisha Mchezo",
    joinGame: "Jiunge na Mchezo",
    gameCodePlaceholder: "Weka Nambari ya Mchezo",
    lobbyTitle: "Ukumbi wa Mchezo",
    shareCode: "Shiriki nambari hii na marafiki zako:",
    copied: "Imenakiliwa!",
    players: "Wachezaji",
    waitingForHost: "Inasubiri mwenyeji aanze...",
    startGame: "Anza Mchezo",
  },
  game: {
    title: "AI dhidi ya Binadamu",
    description: "Je, unaweza kutofautisha methali iliyoandikوا na AI?",
    correct: "Sahihi! 🎉 (alama +10)",
    incorrect: "Sio sahihi kabisa!",
    writtenBy: (author) => `Methali hii iliandikwa na ${author}.`,
    aiAuthor: "AI",
    humanAuthor: "Binadamu",
    humanButton: "Binadamu",
    aiButton: "AI",
    playAgainButton: "Cheza Tena",
    difficulty: "Ugumu",
    easy: "Rahisi",
    hard: "Ngumu",
  },
  profile: {
    title: "Wasifu na Maendeleo Yako",
    description: "Endelea na kazi nzuri katika safari yako ya elimu ya AI!",
    learnerLevel: (level) => `Mwanafunzi wa ${level}`,
    points: "Alama",
    progressTitle: "Maendeleo ya Kujifunza",
    progressDescription: (completed, total) => `moduli ${completed} kati ya ${total} zimekamilika`,
    badgesTitle: "Beji Zangu",
    noBadges: "Kamilisha moduli na upate alama ili kufungua beji!",
    certificatesTitle: "Vyeti Vyako",
    moreCertificates: "Kamilisha moduli zote katika njia yako ya kujifunza ili kupata cheti.",
    certificateTitleSingle: "Cheti cha Kukamilisha",
    certificateFor: "Kimetolewa kwa",
    certificateCourseName: "Misingi ya Elimu ya AI",
    certificateCompletedOn: (date) => `Imekamilika tarehe ${date}`,
    certificateId: "Nambari ya Cheti",
    downloadButton: "Pakua",
    shareButton: "Shiriki",
    feedbackButton: "Tuma Maoni",
    multiplayerStatsTitle: "Takwimu za Wachezaji Wengi",
    wins: "Ushindi",
    gamesPlayed: "Michezo Iliyochezwa",
  },
  lesson: {
      startQuizButton: "Anza Jaribio la Kupima Ujuzi Wako",
      completeLessonButton: "Kamilisha Somo",
      quizTitle: "Pima Ujuzi",
      quizCorrect: "Sahihi kabisa!",
      quizIncorrect: "Sio sahihi. Jibu sahihi ni:",
      nextQuestionButton: "Swali Linalofuata",
  },
  leaderboard: {
    title: "Ubao wa Wanaoongoza",
    description: "Tazama jinsi maendeleo yako ya kujifunza yanavyolinganishwa na wengine katika jamii!",
    rank: "Nafasi",
    player: "Mchezaji",
    points: "Alama",
    you: "Wewe",
  },
  header: {
    profile: "Wasifu",
    logout: "Toka",
  },
  common: {
    backToDashboard: "Rudi kwenye Dashibodi",
    footer: (year) => `AI Kasahorow © ${year} - Kueneza Elimu ya AI kwa Wote`,
    pointsAbbr: "alama",
    save: "Hifadhi",
    cancel: "Ghairi",
    submit: "Tuma",
    close: "Funga",
  },
  feedback: {
    title: "Shiriki Maoni Yako",
    description: "Tunathamini mchango wako! Tujulishe jinsi tunavyoweza kuboresha.",
    typeLabel: "Aina ya Maoni",
    types: {
        [FeedbackType.Bug]: "Ripoti ya Hitilafu",
        [FeedbackType.Suggestion]: "Pendekezo",
        [FeedbackType.General]: "Maoni ya Jumla",
    },
    messageLabel: "Ujumbe Wako",
    messagePlaceholder: "Tafadhali eleza tatizo au wazo lako...",
    submitting: "Inatuma...",
    successTitle: "Asante!",
    successDescription: "Maoni yako yamepokelewa. Tunashukuru kwa kutusaidia kuifanya AI Kasahorow kuwa bora zaidi.",
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
  tooltips: {},
  badges: {}
};

const hausaPartial: DeepPartial<Translation> = {
  onboarding: {
    ctaButton: "Fara Karatu!",
    signInButton: "Fara Yanzu",
  },
  dashboard: {
    greeting: (name) => `Sannu, ${name}!`,
    subGreeting: "A shirye kake ka ci gaba da kasadar ka ta AI?",
    multiplayerTitle: "Wasa da yawa",
    multiplayerDescription: "Kalubalanci abokai a cikin jarrabawar lokaci-gaske.",
    gameTitle: "AI vs. Mutum",
    gameDescription: "Za ka iya gane wanda ya rubuta? Gwada kwarewarka!",
    profileTitle: "Bayanan Sirri & Takaddun Shaida",
    profileDescription: "Duba ci gabanka da takaddun shaidar da ka samu.",
    leaderboardTitle: "Jerin Gwarzaye",
    leaderboardDescription: "Duba yadda ka ke tsere da sauran masu koyo.",
    learningPathTitle: "Hanyar Karatunka",
  },
  multiplayer: {
    title: "Kalubalen Wasa da yawa",
    createGame: "Kirkiri Wasa",
    joinGame: "Shiga Wasa",
    gameCodePlaceholder: "Shigar da Lambar Wasa",
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
    difficulty: "Wahala",
    easy: "Sauki",
    hard: "Wahala",
  },
  profile: {
    title: "Bayanan Sirri & Ci Gabanka",
    description: "Ci gaba da kokarin da kake yi a tafiyarka ta ilimin AI!",
    learnerLevel: (level) => `Mai Koyo na ${level}`,
    points: "Maki",
    progressTitle: "Ci Gaban Karatu",
    progressDescription: (completed, total) => `An kammala darasi ${completed} daga cikin ${total}`,
    badgesTitle: "Bajoji Na",
    noBadges: "Kammala darussa kuma sami maki don buɗe bajoji!",
    certificatesTitle: "Takaddun Shaidarka",
    moreCertificates: "Kammala dukkan darussa a hanyar karatunka don samun takardar shaida.",
    certificateTitleSingle: "Takardar Shaida ta Kammalawa",
    certificateFor: "An ba da ga",
    certificateCourseName: "Tushen Ilimin AI",
    certificateCompletedOn: (date) => `An kammala a ranar ${date}`,
    certificateId: "Lambar Takardar Shaida",
    downloadButton: "Sauke",
    shareButton: "Raba",
    feedbackButton: "Aika Ra'ayi",
    multiplayerStatsTitle: "Kididdigar Wasa da yawa",
    wins: "Nasarori",
    gamesPlayed: "Wasannin da aka buga",
  },
  lesson: {
      startQuizButton: "Fara Jarrabawa Don Gwada Iliminka",
      completeLessonButton: "Kammala Darasi",
      quizTitle: "Gwajin Ilimi",
      quizCorrect: "Dai-dai kwarai!",
      quizIncorrect: "Ba haka ba. Amsar daidai ita ce:",
      nextQuestionButton: "Tambaya Ta Gaba",
  },
  leaderboard: {
    title: "Jerin Gwarzaye",
    description: "Duba yadda ci gaban karatunka yake idan aka kwatanta da sauran mutane a cikin al'umma!",
    rank: "Matsayi",
    player: "Dan Wasa",
    points: "Maki",
    you: "Kai",
  },
  header: {
    profile: "Bayanan Sirri",
    logout: "Fita",
  },
  common: {
    backToDashboard: "Koma zuwa Dashboard",
    footer: (year) => `AI Kasahorow © ${year} - Bazuwar Ilimin AI ga Kowa`,
    pointsAbbr: "maki",
    save: "Ajiye",
    cancel: "Soke",
    submit: "Aika",
    close: "Rufe",
  },
  feedback: {
    title: "Raba Ra'ayinka",
    description: "Muna daraja ra'ayinka! Bari mu san yadda za mu inganta.",
    typeLabel: "Nau'in Ra'ayi",
    types: {
        [FeedbackType.Bug]: "Rahoton Kwaro",
        [FeedbackType.Suggestion]: "Shawara",
        [FeedbackType.General]: "Ra'ayi na Gabaɗaya",
    },
    messageLabel: "Sakonka",
    messagePlaceholder: "Da fatan za a bayyana matsalar ko ra'ayin ka...",
    submitting: "Ana Aikowa...",
    successTitle: "Mun Gode!",
    successDescription: "An karɓi ra'ayinka. Muna godiya da taimakon ka wajen inganta AI Kasahorow.",
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
  tooltips: {},
  badges: {}
};

const yorubaPartial: DeepPartial<Translation> = {
  dashboard: {
    greeting: (name) => `Pẹlẹ o, ${name}!`,
    subGreeting: "Ṣetan lati tẹsiwaju ìrìn AI rẹ?",
    multiplayerTitle: "Elere-pupọ",
    multiplayerDescription: " koju awọn ọrẹ ni adanwo akoko gidi.",
    profileTitle: "Profaili & Awọn iwe-ẹri",
    leaderboardTitle: "Igbimọ Awọn adari",
    leaderboardDescription: "Wo bi o ṣe n ṣe afiwe si awọn akẹkọọ miiran.",
  },
  game: {
      title: "AI vs. Eniyan",
      description: "Ṣe o le sọ owe ti AI kọ?",
      difficulty: "Ipele",
      easy: "Rọrun",
      hard: "Lile",
  },
  profile: {
      title: "Profaili Rẹ & Ilọsiwaju",
      learnerLevel: (level) => `Akẹ́kọ̀ọ́ ${level}`,
      points: "Awọn ojuami",
      feedbackButton: "Firanṣẹ Idahun",
      multiplayerStatsTitle: "Awọn iṣiro Elere-pupọ",
      wins: "Iṣẹgun",
      gamesPlayed: "Awọn ere ti aṣe",
  },
  leaderboard: {
    title: "Igbimọ Awọn adari",
    description: "Wo bi ilọsiwaju ẹkọ rẹ ṣe n ṣe afiwe si awọn miiran ninu agbegbe!",
    rank: "Ipo",
    player: "Oṣere",
    points: "Awọn ojuami",
    you: "Iwọ",
  },
  common: {
    backToDashboard: "Pada si Dasibodu",
    submit: "Fi ranṣẹ",
    close: "Paade",
  },
  feedback: {
    title: "Pin Idahun Rẹ",
    description: "A mọriri igbewọle rẹ! Jẹ ki a mọ bi a ṣe le ni ilọsiwaju.",
    typeLabel: "Iru Idahun",
    types: {
        [FeedbackType.Bug]: "Ijabọ Kokoro",
        [FeedbackType.Suggestion]: "Imọran",
        [FeedbackType.General]: "Idahun Gbogbogbo",
    },
    messageLabel: "Ifiranṣẹ Rẹ",
    messagePlaceholder: "Jọwọ ṣapejuwe ọran tabi imọran rẹ...",
    submitting: "Nfiranṣẹ...",
    successTitle: "O ṣeun!",
    successDescription: "A ti gba idahun rẹ. A dupẹ lọwọ rẹ fun iranlọwọ lati jẹ ki AI Kasahorow dara si.",
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
  },
  tooltips: {},
  badges: {}
};

const igboPartial: DeepPartial<Translation> = {
  dashboard: {
    greeting: (name) => `Ndewo, ${name}!`,
    subGreeting: "Ị dịla njikere ịga n'ihu na njem AI gị?",
    multiplayerTitle: "Ọtụtụ Onye ọkpụkpọ",
    multiplayerDescription: "maa ndị enyi aka n'ajụjụ ọnụ oge.",
    profileTitle: "Profaịlụ & Asambodo",
    leaderboardTitle: "Bọọdụ Ndị ndu",
    leaderboardDescription: "Hụ ka ị na-atụnyere ndị mmụta ndị ọzọ.",
  },
  game: {
    title: "AI vs. Mmadụ",
    description: "Ị nwere ike ịma ilu nke AI dere?",
    difficulty: "Ọkwa",
    easy: "Mfe",
    hard: "Siri ike",
  },
  profile: {
      title: "Profaịlụ Gị & Ọganihu",
      learnerLevel: (level) => `Onye mmụta ${level}`,
      points: "Akara",
      feedbackButton: "Zipu Nkwupụta",
      multiplayerStatsTitle: "Ọnụọgụgụ Ọtụtụ Onye ọkpụkpọ",
      wins: "Mmeri",
      gamesPlayed: "Egwuregwu Egwuru",
  },
  leaderboard: {
    title: "Bọọdụ Ndị ndu",
    description: "Hụ ka ọganihu mmụta gị si atụnyere ndị ọzọ na obodo!",
    rank: "Ọnọdụ",
    player: "Onye ọkpụkpọ",
    points: "Akara",
    you: "Gị",
  },
  common: {
    backToDashboard: "Laghachi na Dashboard",
    submit: "Dobe",
    close: "Mechie",
  },
  feedback: {
    title: "Kọọ Nkwupụta Gị",
    description: "Anyị ji ntinye gị kpọrọ ihe! Mee ka anyị mara otu anyị nwere ike isi mee nke ọma.",
    typeLabel: "Ụdị Nkwupụta",
    types: {
        [FeedbackType.Bug]: "Akụkọ Ahụhụ",
        [FeedbackType.Suggestion]: "Ntụnye",
        [FeedbackType.General]: "Nkwupụta Ozuruọnụ",
    },
    messageLabel: "Ozi Gị",
    messagePlaceholder: "Biko kọwaa okwu ma ọ bụ echiche gị...",
    submitting: "Na-edobe...",
    successTitle: "Daalụ!",
    successDescription: "Anabatala nkwupụta gị. Anyị nwere ekele maka inyere anyị aka ime ka AI Kasahorow ka mma.",
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
  },
  tooltips: {},
  badges: {}
};

const pidginPartial: DeepPartial<Translation> = {
  dashboard: {
    greeting: (name) => `How far, ${name}!`,
    subGreeting: "You ready to continue your AI adventure?",
    multiplayerTitle: "Multi-player",
    multiplayerDescription: "Challenge friends for real-time quiz.",
    profileTitle: "Profile & Certificates",
    leaderboardTitle: "Leaderboard",
    leaderboardDescription: "See how you dey rank with other learners.",
  },
  game: {
      title: "AI vs. Human",
      description: "You fit tell which proverb na AI write am?",
      difficulty: "Level",
      easy: "Easy",
      hard: "Hard",
  },
  profile: {
      title: "Your Profile & Progress",
      learnerLevel: (level) => `Learner Level: ${level}`,
      feedbackButton: "Send Feedback",
      multiplayerStatsTitle: "Multi-player Stats",
      wins: "Wins",
      gamesPlayed: "Games Played",
  },
  leaderboard: {
    title: "Leaderboard",
    description: "See how your learning progress dey compare to others for the community!",
    rank: "Rank",
    player: "Player",
    points: "Points",
    you: "You",
  },
  common: {
    backToDashboard: "Go Back to Dashboard",
    submit: "Submit",
    close: "Close",
  },
  feedback: {
    title: "Share Your Feedback",
    description: "We value your input! Let us know how we fit improve.",
    typeLabel: "Feedback Type",
    types: {
        [FeedbackType.Bug]: "Bug Report",
        [FeedbackType.Suggestion]: "Suggestion",
        [FeedbackType.General]: "General Feedback",
    },
    messageLabel: "Your Message",
    messagePlaceholder: "Abeg, describe the issue or your idea...",
    submitting: "Submitting...",
    successTitle: "Thank You!",
    successDescription: "We don receive your feedback. We appreciate say you dey help us make AI Kasahorow better.",
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
  },
  tooltips: {},
  badges: {}
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
  },
  tooltips: {},
  badges: {}
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
  },
  tooltips: {},
  badges: {}
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
  },
  tooltips: {},
  badges: {}
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
  },
  tooltips: {},
  badges: {}
};

// This function dynamically populates badge translations from the constants
const populateBadgeTranslations = (trans: Translation) => {
    Object.keys(BADGES).forEach(badgeId => {
        trans.badges[badgeId] = {
            name: BADGES[badgeId].name,
            description: BADGES[badgeId].description,
        };
    });
    return trans;
}


const translations: { [key in Language]: Translation } = {
  [Language.English]: populateBadgeTranslations(englishTranslations),
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
