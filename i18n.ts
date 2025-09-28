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

export type Translation = {
  onboarding: {
    ctaButton: string;
    signInButton: string;
    signUpButton: string;
    pathAssignedTitle: string;
    pathAssignedDescription: string;
    signInTitle: string;
    signUpTitle: string;
    emailPlaceholder: string;
    namePlaceholder: string;
    switchToSignUp: string;
    switchToSignIn: string;
    errorUserNotFound: string;
    errorUserExists: string;
    errorGeneric: string;
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
    walletTitle: string;
    walletDescription: string;
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
    waitingForPlayers: string;
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
    pointDescription: string;
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
    certificateIssuedBy: (orgName: string) => string;
    downloadButton: string;
    shareButton: string;
    feedbackButton: string;
    multiplayerStatsTitle: string;
    wins: string;
    gamesPlayed: string;
    viewWallet: string;
  };
  lesson: {
    startQuizButton: string;
    completeLessonButton: string;
    returnToDashboardButton: string;
    quizTitle: string;
    quizCorrect: (points: number) => string;
    quizIncorrect: string;
    nextQuestionButton: string;
    completionModalTitle: string;
    completionModalPoints: (points: number) => string;
    badgeUnlocked: string;
    quizStreak: (streak: number) => string;
    submitAnswer: string;
    yourAnswer: string;
    readAloud: string;
  };
  leaderboard: {
    title: string;
    description: string;
    rank: string;
    player: string;
    points: string;
    you: string;
  };
  wallet: {
    title: string;
    description: string;
    currentBalance: string;
    history: string;
    send: string;
    marketplace: string;
    sendPoints: string;
    sendTo: string;
    recipientEmail: string;
    amount: string;
    messageOptional: string;
    messagePlaceholder: string;
    sendButton: string;
    sending: string;
    dailyLimit: (amount: number, limit: number) => string;
    insufficientPoints: string;
    userNotFound: string;
    sendSuccess: (amount: number, name: string) => string;
    sendError: string;
    confirmationTitle: string;
    confirmationSend: (amount: number, name: string) => string;
    confirmationSpend: (amount: number, item: string) => string;
    confirm: string;
    noTransactions: string;
  };
  marketplace: {
    title: string;
    description: string;
    categories: {
        Recognition: string;
        Customization: string;
        'Learning Boosters': string;
        'Social Play': string;
        'Future Perks': string;
    };
    redeem: string;
    redeeming: string;
    owned: string;
    comingSoon: string;
    redeemSuccess: (item: string) => string;
    redeemError: string;
  };
  header: {
    profile: string;
    logout: string;
    settings: string;
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
  settings: {
    title: string;
    voiceMode: string;
    voiceModeDescription: string;
  };
  offline: {
    download: string;
    downloaded: string;
    downloading: string;
    offlineIndicator: string;
    onlineIndicator: string;
    syncing: string;
    notAvailable: string;
  };
  voice: {
    listening: string;
    voiceModeActive: string;
    navigatingTo: {
      dashboard: string;
      profile: string;
      leaderboard: string;
      game: string;
      multiplayer: string;
      wallet: string;
    },
    startingModule: (moduleName: string) => string;
    openingSettings: string;
    closingSettings: string;
    loggingOut: string;
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
    signInButton: "Sign In",
    signUpButton: "Create Account",
    pathAssignedTitle: "Congratulations!",
    pathAssignedDescription: "You're on your way! We've assigned you the perfect learning path to get started.",
    signInTitle: "Welcome Back!",
    signUpTitle: "Create Your Account",
    emailPlaceholder: "Your Email",
    namePlaceholder: "Your Name",
    switchToSignUp: "Don't have an account? Sign Up",
    switchToSignIn: "Already have an account? Sign In",
    errorUserNotFound: "No account found with this email. Please sign up.",
    errorUserExists: "An account with this email already exists. Please sign in.",
    errorGeneric: "An unexpected error occurred. Please try again.",
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
    walletTitle: "My Wallet",
    walletDescription: "View, send, and spend your earned points.",
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
    waitingForPlayers: "Waiting for other players...",
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
    pointDescription: "Correct guess in AI vs. Human game",
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
    certificateIssuedBy: (orgName) => `Issued by ${orgName}`,
    downloadButton: "Download",
    shareButton: "Share",
    feedbackButton: "Send Feedback",
    multiplayerStatsTitle: "Multi-player Stats",
    wins: "Wins",
    gamesPlayed: "Games Played",
    viewWallet: "View Wallet Details",
  },
  lesson: {
      startQuizButton: "Start Quiz to Test Your Knowledge",
      completeLessonButton: "Complete Lesson",
      returnToDashboardButton: "Return to Dashboard",
      quizTitle: "Knowledge Check",
      quizCorrect: (points) => `That's correct! (+${points} points)`,
      quizIncorrect: "Not quite. The correct answer is:",
      nextQuestionButton: "Next Question",
      completionModalTitle: "Lesson Complete!",
      completionModalPoints: (points) => `You've earned ${points} points!`,
      badgeUnlocked: "Badge Unlocked!",
      quizStreak: (streak: number) => `🔥 ${streak} in a row!`,
      submitAnswer: "Submit Answer",
      yourAnswer: "Your answer...",
      readAloud: "Read Aloud",
  },
  leaderboard: {
    title: "Community Leaderboard",
    description: "See how your learning progress compares to others in the community!",
    rank: "Rank",
    player: "Player",
    points: "Points",
    you: "You",
  },
  wallet: {
    title: "My Wallet",
    description: "Manage your points, view your transaction history, and redeem rewards.",
    currentBalance: "Current Balance",
    history: "History",
    send: "Send",
    marketplace: "Marketplace",
    sendPoints: "Send Points",
    sendTo: "Send to",
    recipientEmail: "Recipient's Email",
    amount: "Amount",
    messageOptional: "Message (optional)",
    messagePlaceholder: "For your project!",
    sendButton: "Send Points",
    sending: "Sending...",
    dailyLimit: (amount, limit) => `You have sent ${amount} / ${limit} points today.`,
    insufficientPoints: "You don't have enough points to make this transfer.",
    userNotFound: "Could not find a user with that email.",
    sendSuccess: (amount, name) => `Successfully sent ${amount} points to ${name}!`,
    sendError: "An error occurred while sending points.",
    confirmationTitle: "Please Confirm",
    confirmationSend: (amount, name) => `Are you sure you want to send ${amount} points to ${name}?`,
    confirmationSpend: (amount, item) => `Are you sure you want to spend ${amount} points on "${item}"?`,
    confirm: "Confirm",
    noTransactions: "You have no transactions yet. Start learning to earn points!",
  },
  marketplace: {
    title: "Marketplace",
    description: "Use your points to unlock exclusive rewards and customizations.",
    categories: {
        Recognition: "Recognition",
        Customization: "Customization",
        'Learning Boosters': "Learning Boosters",
        'Social Play': "Social Play",
        'Future Perks': "Future Perks",
    },
    redeem: "Redeem",
    redeeming: "Redeeming...",
    owned: "Owned",
    comingSoon: "Coming Soon",
    redeemSuccess: (item) => `Successfully redeemed "${item}"!`,
    redeemError: "An error occurred during purchase.",
  },
  header: {
    profile: "Profile",
    logout: "Logout",
    settings: "Settings",
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
  settings: {
    title: "Settings",
    voiceMode: "Voice-First Mode",
    voiceModeDescription: "Enable voice commands and narration.",
  },
  offline: {
    download: "Download for Offline",
    downloaded: "Available Offline",
    downloading: "Downloading...",
    offlineIndicator: "Offline Mode",
    onlineIndicator: "You're online",
    syncing: "Syncing your progress...",
    notAvailable: "This content is not available offline.",
  },
  voice: {
    listening: "Listening...",
    voiceModeActive: "Voice mode is active",
    navigatingTo: {
      dashboard: "Going to dashboard.",
      profile: "Opening your profile.",
      leaderboard: "Showing the leaderboard.",
      game: "Starting the AI versus Human game.",
      multiplayer: "Opening multi-player.",
      wallet: "Opening your wallet.",
    },
    startingModule: (moduleName) => `Starting module: ${moduleName}.`,
    openingSettings: "Opening settings.",
    closingSettings: "Closing settings.",
    loggingOut: "Logging you out.",
  },
  curriculum: {
    'what-is-ai': { 
      title: 'What is AI?', 
      description: 'Learn the basic definition of AI and what it means for a machine to be "intelligent".',
      lessonContent: {
          title: "Module 1: What is Artificial Intelligence?",
          introduction: "Imagine a teammate who can sort through a mountain of information in seconds, spot patterns invisible to the human eye, and help you make smarter decisions. This isn't science fiction; it's the reality of Artificial Intelligence (AI). Let's dive into what AI truly is, beyond the movie robots.",
          sections: [
              {
                  heading: "More Than Just 'Thinking'",
                  content: "At its heart, AI is about creating computer systems that can perform tasks that usually require human intelligence. This includes learning from experience, solving puzzles, understanding the meaning behind words, and recognizing objects or sounds. The goal is to teach a machine to reason and act, not with a brain, but with powerful algorithms and data."
              },
              {
                  heading: "Narrow AI: The Specialist We Use Today",
                  content: "It's crucial to know that almost all AI in the world today is 'Narrow AI'. This means it's designed to be very good at one specific task. An AI that plays chess can't drive a car. An AI that recommends music can't diagnose a disease. Think of them as highly trained specialists. They are incredibly powerful, but only in their specific field."
              },
              {
                  heading: "General AI: The Dream of a Human-Like Mind",
                  content: "The AI you see in movies—a single system with the flexible, creative, and common-sense intelligence of a human—is called 'Artificial General Intelligence' or AGI. AGI is the long-term dream of some researchers, but it doesn't exist today. Understanding the difference between the specialized 'Narrow AI' we have and the hypothetical 'AGI' is key to understanding the technology's real-world capabilities and limits."
              },
              {
                  heading: "AI, ML, and Data Science: What's the Difference?",
                  content: "You might hear these terms used together. Think of it like this: AI is the overall goal of creating intelligent machines. Machine Learning (ML) is the most common *method* used to achieve AI, by teaching machines to learn from data. Data Science is the broader field of extracting knowledge and insights from data, which often uses ML techniques."
              }
          ],
          summary: "AI is the broad field of creating intelligent machines. The AI we use daily is 'Narrow AI', which excels at specific tasks. This is different from the human-like 'General AI' of science fiction, which does not yet exist. AI is often achieved through Machine Learning, a process of learning from data.",
          quiz: {
            questions: [
              {
                type: 'multiple-choice',
                question: "Which of these is the BEST description of the AI we use today?",
                options: [
                  "A single AI that can do any task a human can.",
                  "Specialized AI that is very good at one specific task.",
                  "Physical robots that can walk and talk.",
                  "The internet."
                ],
                correctAnswerIndex: 1,
                explanation: "Today's AI is 'Narrow AI', meaning it's trained for specific jobs like playing a game or recommending a song, but it can't transfer that knowledge to other tasks."
              },
              {
                type: 'fill-in-the-blank',
                question: "The dream of a human-like AI with common sense and creativity is called Artificial _________ Intelligence.",
                options: [],
                correctAnswerIndex: -1,
                answer: "General",
                explanation: "Artificial General Intelligence (AGI) is the term for a hypothetical AI with the flexible intelligence of a human. This is still in the realm of research and theory."
              },
              {
                type: 'multiple-choice',
                question: "What is the relationship between AI and Machine Learning (ML)?",
                options: [
                  "They are the same thing.",
                  "AI is a type of Machine Learning.",
                  "Machine Learning is the most common way to achieve AI.",
                  "AI is only for robots, and ML is for software."
                ],
                correctAnswerIndex: 2,
                explanation: "AI is the broad concept. Machine Learning is a primary technique within the field of AI that allows systems to learn from data."
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
          introduction: "We know AI can be 'smart', but how does it get that way? It's not magic! AI systems learn through a process called 'Machine Learning'. Think of it like learning to ride a bike: you try, you fall, you adjust, and with enough practice (data) and feedback, you get better and better.",
          sections: [
              {
                  heading: "The Three Ingredients of Learning",
                  content: "Every machine learning process needs three key things: \n1. **Data:** This is the 'experience' for the AI. Just like we need books or lessons, an AI needs data—images, text, numbers—to learn from. The more high-quality data, the better. \n2. **Model:** This is the 'student'. It's a complex mathematical structure (like a neural network) that can be trained. Initially, it knows nothing. \n3. **Training Process:** This is the 'studying'. The model looks at the data, makes a guess (a prediction), checks how wrong it was, and adjusts itself slightly to be more accurate next time. This process is repeated millions of times."
              },
              {
                  heading: "Supervised Learning: Learning with a Teacher",
                  content: "This is the most common type of machine learning. It uses 'labeled' data. Imagine showing a model thousands of pictures, each one with a label: 'cat', 'dog', 'car'. The model learns to connect the patterns in the pictures to the correct labels. This is 'supervised' because the labels act like a teacher, telling the model the right answers during training."
              },
              {
                  heading: "Unsupervised Learning: Finding Patterns on Its Own",
                  content: "What if you don't have labels? In unsupervised learning, the model is given a huge amount of data and its task is to find hidden patterns or structures on its own. For example, it could group customers into different purchasing habit groups, or find topics in a collection of news articles, all without being told what to look for. It's like sorting a pile of different fruits into groups based on their similarities."
              },
              {
                  heading: "Reinforcement Learning: Learning from Trial and Error",
                  content: "This is how AIs learn to play games. The model (called an 'agent') takes actions in an environment (the game). It receives 'rewards' for good actions (like winning a point) and 'penalties' for bad ones. Its goal is to figure out a strategy to maximize its total reward. It learns through trial and error, just like a pet learns a trick by getting a treat for doing it right."
              }
          ],
          summary: "AI learns through Machine Learning, which requires three things: Data (experience), a Model (the student), and a Training process (studying). The main learning methods are Supervised (with labeled data), Unsupervised (finding hidden patterns), and Reinforcement (learning from rewards and penalties).",
          quiz: {
            questions: [
              {
                type: 'multiple-choice',
                question: "You give an AI thousands of medical scans, some labeled 'healthy' and some 'sick', to teach it to identify diseases. What type of learning is this?",
                options: [
                  "Unsupervised Learning",
                  "Reinforcement Learning",
                  "Supervised Learning",
                  "General Learning"
                ],
                correctAnswerIndex: 2,
                explanation: "This is Supervised Learning because the data is 'labeled' with the correct answers ('healthy' or 'sick'), acting as a teacher for the model."
              },
              {
                type: 'fill-in-the-blank',
                question: "The 'student' in the machine learning process, which is a complex mathematical structure, is called a ________.",
                options: [],
                correctAnswerIndex: -1,
                answer: "model",
                explanation: "The model is the part of the AI system that is trained on data to make predictions. A common type of model is a neural network."
              },
              {
                type: 'multiple-choice',
                question: "An AI learning to play chess by getting points for good moves and losing points for bad ones is an example of what?",
                options: [
                    "Supervised Learning",
                    "Reinforcement Learning",
                    "Unsupervised Learning",
                    "Data Mining"
                ],
                correctAnswerIndex: 1,
                explanation: "This is Reinforcement Learning, as the AI learns a strategy by taking actions and receiving feedback in the form of rewards (points)."
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
          introduction: "You might not realize it, but you interact with AI dozens of times every day. It's the silent partner in many of the tools we use, making them smarter, more personal, and more helpful. Let's pull back the curtain and see where AI is working behind the scenes.",
          sections: [
              {
                  heading: "The Brain in Your Pocket",
                  content: "Your smartphone is an AI powerhouse. When you use face unlock, a 'computer vision' model recognizes your unique facial features. When your keyboard suggests the next word, a 'language model' is predicting what you'll type. When you ask a voice assistant a question, it uses 'natural language processing' to understand you and find an answer. These specialized AIs make your device feel intuitive and personal."
              },
              {
                  heading: "Transforming Industries: Health and Farming",
                  content: "AI's impact goes far beyond convenience. In healthcare, AI helps doctors analyze medical scans like X-rays with greater accuracy and can even help researchers discover new medicines by simulating how molecules interact. In agriculture, AI-powered drones monitor crop health from the sky, identifying sick plants or dry soil, which helps farmers use water and fertilizer more efficiently, leading to better harvests."
              },
              {
                  heading: "The Power of Recommendation Engines",
                  content: "When an online store recommends a product or a streaming service suggests a movie, it's an AI 'recommendation engine' at work. It analyzes your past behavior (what you've bought, watched, or liked) and compares it to millions of other users to predict what you might enjoy next. This is a form of unsupervised learning that powers much of the modern internet."
              },
              {
                  heading: "The Rise of Generative AI",
                  content: "One of the most exciting recent developments is 'Generative AI'. This is AI that can *create* new things, not just analyze existing data. You've seen this in advanced chatbots that can write poems, or in image generators that can create amazing art from a simple text description. This creative capability is opening up brand new possibilities in art, design, writing, and programming."
              }
          ],
          summary: "AI is a part of our daily lives, from 'computer vision' in our phones to 'recommendation engines' on shopping sites. It's transforming major industries like health and farming. The newest frontier is 'Generative AI', which can create new text, images, and ideas, changing the way we interact with technology.",
          quiz: {
            questions: [
              {
                type: 'multiple-choice',
                question: "When a streaming service suggests a new show for you to watch based on your viewing history, what is this an example of?",
                options: [
                  "Computer Vision",
                  "A Recommendation Engine",
                  "Generative AI",
                  "A Voice Assistant"
                ],
                correctAnswerIndex: 1,
                explanation: "Recommendation engines are AIs that analyze your past behavior to predict what you might like in the future, personalizing your experience."
              },
              {
                type: 'fill-in-the-blank',
                question: "An AI that can create a new image from a text description is known as ___________ AI.",
                options: [],
                correctAnswerIndex: -1,
                answer: "Generative",
                explanation: "Generative AI is a type of AI focused on creating new, original content, such as text, images, or music."
              },
              {
                type: 'multiple-choice',
                question: "The technology that allows your phone to understand your spoken commands is called:",
                options: [
                    "Natural Language Processing",
                    "Computer Vision",
                    "Recommendation Engine",
                    "Generative AI"
                ],
                correctAnswerIndex: 0,
                explanation: "Natural Language Processing (NLP) is the field of AI that deals with helping computers understand, interpret, and generate human language."
              }
            ]
          }
      }
    },
    'risks-and-bias': { 
      title: 'Risks & Bias in AI', 
      description: 'Understand the challenges of AI, including fairness and safety.',
      lessonContent: {
          title: "Module 4: The Challenges: Bias and Safety",
          introduction: "AI is a powerful tool, but like any tool, it must be used with care and wisdom. It's not perfect, and it reflects the data—and the society—it learns from. Understanding the risks of AI is the first step toward building a future where it is used responsibly and for the benefit of everyone.",
          sections: [
              {
                  heading: "Where Does AI Bias Come From?",
                  content: "AI bias occurs when an AI system produces unfair or prejudiced results. This isn't because the AI is 'evil'; it's because it learned from biased data. For example, if facial recognition software is mostly trained on pictures of one demographic, it may be less accurate for others. If a loan approval AI is trained on historical data from a time when certain groups were unfairly denied loans, it might learn to repeat those same unfair patterns."
              },
              {
                  heading: "The 'Black Box' Problem",
                  content: "Some complex AI models, especially deep learning networks, can be a 'black box'. This means that even the people who created it may not be able to fully explain *why* it made a specific decision. If an AI denies someone a job or a medical diagnosis, not knowing the reason is a serious problem. Researchers are working hard on 'Explainable AI' (XAI) to make these models more transparent and trustworthy."
              },
              {
                  heading: "Privacy and Security Risks",
                  content: "AI systems often require vast amounts of data to learn, which raises privacy concerns. We need strong rules to protect our personal information. Additionally, AI systems can be tricked. Researchers have shown it's possible to make tiny, invisible changes to an image (like a stop sign) that can fool an AI into seeing something completely different. This is called an 'adversarial attack' and highlights the need for secure and robust AI."
              },
              {
                  heading: "Building Responsible AI",
                  content: "To combat these risks, the global tech community is focusing on 'Responsible AI'. This involves several key principles: Fairness (checking for and correcting bias), Accountability (knowing who is responsible if an AI makes a mistake), and Transparency (being open about how an AI works and the data it uses). It requires a team effort from developers, companies, and users like you to demand and build ethical AI."
              }
          ],
          summary: "AI is not neutral; it can inherit human biases from its training data. Key challenges include the 'black box' problem, where AI decisions are hard to explain, as well as privacy and security risks. The solution lies in building 'Responsible AI' based on principles of Fairness, Accountability, and Transparency.",
          quiz: {
            questions: [
              {
                type: 'multiple-choice',
                question: "What is the 'black box' problem in AI?",
                options: [
                  "When an AI system overheats.",
                  "When it's difficult to understand why an AI made a specific decision.",
                  "When an AI is used for secret government projects.",
                  "When an AI runs out of data."
                ],
                correctAnswerIndex: 1,
                explanation: "The 'black box' problem refers to our inability to fully interpret the internal workings and reasoning of some complex AI models."
              },
              {
                type: 'multiple-choice',
                question: "AI bias is most often caused by the AI's own bad intentions.",
                options: [
                  "True",
                  "False"
                ],
                correctAnswerIndex: 1,
                explanation: "False. AI bias is not a result of intention. It's a reflection of biases present in the data it was trained on."
              },
              {
                type: 'fill-in-the-blank',
                question: "The idea of making sure AI is used fairly and ethically is called ___________ AI.",
                options: [],
                correctAnswerIndex: -1,
                answer: "Responsible",
                explanation: "Responsible AI is an approach to developing and using artificial intelligence that puts ethical principles like fairness, accountability, and transparency at the forefront."
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
          introduction: "Every major technology, from the printing press to the internet, has changed the way we work. AI is the next chapter in this story. It's not just about what jobs will disappear; it's about how current jobs will change and what new, exciting roles will be created. Let's explore the future of work.",
          sections: [
              {
                  heading: "Augmentation: Your New AI Teammate",
                  content: "The biggest change from AI won't be replacement, but 'augmentation'—AI working alongside humans to make us better at our jobs. Think of it as a co-pilot. A writer can use AI to brainstorm ideas and check for errors. A programmer can use AI to write routine code and find bugs faster. A doctor can use AI to analyze patient data to suggest possible diagnoses. AI handles the repetitive tasks, freeing up our minds for strategy and creativity."
              },
              {
                  heading: "The New Collar: Jobs of the Future",
                  content: "AI is creating entirely new job categories. 'Prompt Engineers' are experts at writing instructions to get the best results from AI models. 'AI Trainers' help fine-tune AI systems by providing high-quality data and feedback. 'AI Ethicists' are hired to ensure that a company's AI is used responsibly. As technology evolves, so will the opportunities for people who understand it."
              },
              {
                  heading: "Human Skills are More Valuable Than Ever",
                  content: "In a world with AI, our uniquely human skills become our superpowers. AI is good at calculation, but not so good at common sense. It can process data, but it lacks true creativity and emotional intelligence. Skills like critical thinking, complex problem-solving, collaboration with others, and leadership are becoming *more* valuable, not less. The future is about combining the analytical power of machines with the wisdom and creativity of humans."
              },
              {
                  heading: "Embracing Lifelong Learning",
                  content: "The most important skill for the future is the ability to keep learning. Technology will change, and the jobs of tomorrow might not even exist today. By staying curious, being adaptable, and building a strong foundation of AI literacy, you are preparing yourself not just for one job, but for a lifetime of success in a changing world."
              }
          ],
          summary: "AI is changing work by 'augmenting' human abilities, acting as a helpful co-pilot for many tasks. This is creating new jobs like 'Prompt Engineer' and making uniquely human skills—like creativity, critical thinking, and emotional intelligence—more valuable than ever. The key to thriving is to embrace lifelong learning.",
          quiz: {
            questions: [
              {
                type: 'multiple-choice',
                question: "The idea that AI will work alongside people to make them better at their jobs is called:",
                options: [
                  "Replacement",
                  "Automation",
                  "Augmentation",
                  "Elimination"
                ],
                correctAnswerIndex: 2,
                explanation: "Augmentation is about enhancing human capabilities with AI, not replacing them. The AI becomes a tool or a teammate."
              },
              {
                type: 'multiple-choice',
                question: "Which of these skills becomes MORE important in a world with powerful AI?",
                options: [
                  "Memorizing facts",
                  "Performing repetitive calculations",
                  "Emotional intelligence and creativity",
                  "Following simple instructions"
                ],
                correctAnswerIndex: 2,
                explanation: "As AI handles routine data and calculation tasks, skills that AI struggles with—like creativity, critical thinking, and emotional intelligence—become more valuable for humans."
              },
              {
                type: 'fill-in-the-blank',
                question: "A person who specializes in writing instructions to get the best results from an AI is called a ________ Engineer.",
                options: [],
                correctAnswerIndex: -1,
                answer: "Prompt",
                explanation: "Prompt engineering is a new and important skill focused on effectively communicating with AI models to guide them toward the desired output."
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
    'artificial intelligence': 'The ability of a computer to perform tasks that normally require human intelligence, like understanding language, recognizing images, and making decisions.',
    'ai': 'Short for Artificial Intelligence. The field of science focused on creating smart machines that can learn and solve problems.',
    'algorithm': 'A set of step-by-step instructions, like a recipe, that a computer follows to complete a task or solve a problem.',
    'machine learning': 'The main way AI learns. Instead of being given instructions, the machine learns by looking at lots of examples (data) to find patterns, just like we learn from experience.',
    'data': 'The \'books\' or \'experience\' that an AI learns from. It can be text, images, sounds, or numbers that a computer can process.',
    'ai bias': 'Unfairness in an AI\'s results that comes from biased training data. If an AI only sees pictures of one type of fruit, it may not recognize others correctly.',
    'ai trainers': 'The \'teachers\' for an AI. They carefully prepare and label data (the \'lessons\') to help the AI learn accurately and avoid bias.',
    'ai ethicists': 'Like a referee for technology, they help make sure AI is designed and used in a safe, fair, and responsible way for everyone.',
    'prompt engineers': 'An expert at \'talking\' to an AI. They know how to ask questions and give instructions (prompts) in just the right way to get the most helpful and creative answers.',
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
    'bronze-supporter': {
        name: 'Bronze Supporter',
        description: 'Show your support for AI literacy by purchasing this badge.',
    },
    'silver-patron': {
        name: 'Silver Patron',
        description: 'A badge for dedicated patrons of accessible education.',
    },
    'gold-champion': {
        name: 'Gold Champion',
        description: 'The highest honor for champions of our mission.',
    },
  }
};

const swahiliPartial: DeepPartial<Translation> = {
  onboarding: {
    signInButton: "Ingia",
    signUpButton: "Fungua Akaunti",
    emailPlaceholder: "Barua pepe Yako",
    namePlaceholder: "Jina Lako",
    switchToSignUp: "Huna akaunti? Jisajili",
    switchToSignIn: "Tayari una akaunti? Ingia",
    errorUserNotFound: "Hakuna akaunti iliyopatikana na barua pepe hii. Tafadhali jisajili.",
    errorUserExists: "Akaunti yenye barua pepe hii tayari ipo. Tafadhali ingia.",
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
    waitingForPlayers: "Inasubiri wachezaji wengine...",
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
    pointDescription: "Utabiri sahihi katika mchezo wa AI dhidi ya Binadamu",
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
    certificateIssuedBy: (orgName) => `Imetolewa na ${orgName}`,
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
      quizCorrect: (points) => `Sahihi kabisa! (+${points} alama)`,
      quizIncorrect: "Sio sahihi. Jibu sahihi ni:",
      nextQuestionButton: "Swali Linalofuata",
      submitAnswer: "Tuma",
      yourAnswer: "Jibu lako...",
      readAloud: "Soma kwa Sauti",
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
    settings: "Mipangilio",
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
  settings: {
    title: "Mipangilio",
    voiceMode: "Hali ya Sauti",
    voiceModeDescription: "Washa amri za sauti na usimulizi.",
  },
  offline: {
    download: "Pakua kwa Matumizi Nje ya Mtandao",
    downloaded: "Inapatikana Nje ya Mtandao",
    downloading: "Inapakua...",
    offlineIndicator: "Hali ya Nje ya Mtandao",
    onlineIndicator: "Uko Mtandaoni",
    syncing: "Inasawazisha maendeleo yako...",
    notAvailable: "Maudhui haya hayapatikani ukiwa nje ya mtandao.",
  },
  voice: {
    listening: "Inasikiliza...",
    voiceModeActive: "Hali ya sauti inatumika",
    navigatingTo: {
      dashboard: "Inaenda kwenye dashibodi.",
      profile: "Inafungua wasifu wako.",
      leaderboard: "Inaonyesha ubao wa wanaoongoza.",
      game: "Inaanza mchezo wa AI dhidi ya Binadamu.",
      multiplayer: "Inafungua wachezaji wengi.",
      wallet: "Inafungua pochi yako.",
    },
    startingModule: (moduleName) => `Inaanza moduli: ${moduleName}.`,
    openingSettings: "Inafungua mipangilio.",
    closingSettings: "Inafunga mipangilio.",
    loggingOut: "Unatoka.",
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
    signInButton: "Shiga",
    signUpButton: "Bude Asusun",
    emailPlaceholder: "Imel Dinka",
    namePlaceholder: "Sunanka",
    switchToSignUp: "Ba ka da asusu? Bude Asusun",
    switchToSignIn: "Ka na da asusu? Shiga",
    errorUserNotFound: "Ba a sami asusu da wannan imel ba. Da fatan za a bude asusun.",
    errorUserExists: "Akwai asusu da wannan imel. Da fatan za a shiga.",
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
    waitingForPlayers: "Ana jiran sauran 'yan wasa...",
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
    pointDescription: "Hasashen daidai a wasan AI da Mutum",
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
    certificateIssuedBy: (orgName) => `Daga ${orgName}`,
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
      quizCorrect: (points) => `Dai-dai kwarai! (+${points} maki)`,
      quizIncorrect: "Ba haka ba. Amsar daidai ita ce:",
      nextQuestionButton: "Tambaya Ta Gaba",
      submitAnswer: "Aika",
      yourAnswer: "Amsarka...",
      readAloud: "Karanta da Sauti",
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
    settings: "Saiti",
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
  settings: {
    title: "Saiti",
    voiceMode: "Yanayin Murya",
    voiceModeDescription: "Kunna umarni da ba da labari na murya.",
  },
  offline: {
    download: "Sauke don Amfani Ba tare da Intanet ba",
    downloaded: "Akwai Ba tare da Intanet ba",
    downloading: "Ana Saukewa...",
    offlineIndicator: "Yanayin Ba da Intanet",
    onlineIndicator: "Kuna kan layi",
    syncing: "Ana daidaita ci gaban ku...",
    notAvailable: "Wannan abun ciki ba ya samuwa a layi.",
  },
  voice: {
    listening: "Ana sauraro...",
    voiceModeActive: "Yanayin murya yana aiki",
    navigatingTo: {
      dashboard: "Ana zuwa dashboard.",
      profile: "Ana bude bayanan ka.",
      leaderboard: "Ana nuna jerin gwarzaye.",
      game: "Ana fara wasan AI da Mutum.",
      multiplayer: "Ana bude wasa da yawa.",
      wallet: "Ana bude walat dinka.",
    },
    startingModule: (moduleName) => `Ana fara darasi: ${moduleName}.`,
    openingSettings: "Ana bude saiti.",
    closingSettings: "Ana rufe saiti.",
    loggingOut: "Ana fitar da kai.",
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
  onboarding: {
    signInButton: "Wọlé",
    signUpButton: "Forukọsilẹ",
  },
  dashboard: {
    greeting: (name) => `Pẹlẹ o, ${name}!`,
    subGreeting: "Ṣetan lati tẹsiwaju ìrìn AI rẹ?",
    multiplayerTitle: "Elere-pupọ",
    multiplayerDescription: " koju awọn ọrẹ ni adanwo akoko gidi.",
    profileTitle: "Profaili & Awọn iwe-ẹri",
    leaderboardTitle: "Igbimọ Awọn adari",
    leaderboardDescription: "Wo bi o ṣe n ṣe afiwe si awọn akẹkọọ miiran.",
  },
  multiplayer: {
    waitingForPlayers: "Nduro de awọn oṣere miiran...",
  },
  game: {
      title: "AI vs. Eniyan",
      description: "Ṣe o le sọ owe ti AI kọ?",
      difficulty: "Ipele",
      easy: "Rọrun",
      hard: "Lile",
      pointDescription: "Idahun to tọ ninu ere AI vs Eniyan",
  },
  profile: {
      title: "Profaili Rẹ & Ilọsiwaju",
      learnerLevel: (level) => `Akẹ́kọ̀ọ́ ${level}`,
      points: "Awọn ojuami",
      feedbackButton: "Firanṣẹ Idahun",
      multiplayerStatsTitle: "Awọn iṣiro Elere-pupọ",
      wins: "Iṣẹgun",
      gamesPlayed: "Awọn ere ti aṣe",
      certificateIssuedBy: (orgName) => `Láti ọwọ́ ${orgName}`,
  },
  lesson: {
      submitAnswer: "Fi silẹ",
      yourAnswer: "Idahun rẹ...",
      readAloud: "Ka Soke",
      quizCorrect: (points) => `Iyẹn tọ! (+${points} awọn aaye)`,
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
  settings: {
    title: "Ètò",
    voiceMode: "Ipo Ohùn",
    voiceModeDescription: "Muu ṣiṣẹ awọn aṣẹ ohun ati itan.",
  },
  offline: {
    download: "Ṣe igbasilẹ fun Aisinipo",
    downloaded: "Wa ni Aisinipo",
    downloading: "Ngbaa silẹ...",
    offlineIndicator: "Ipo Aisinipo",
    onlineIndicator: "O wa lori ayelujara",
    syncing: "Muu ilọsiwaju rẹ ṣiṣẹpọ...",
    notAvailable: "Akoonu yii ko si ni aisinipo.",
  },
  voice: {
    listening: "Ngbọ...",
    voiceModeActive: "Ipo ohun ti nṣiṣẹ",
    navigatingTo: {
      dashboard: "Lilọ si dasibodu.",
      profile: "Nsii profaili rẹ.",
      leaderboard: "Nfihan igbimọ awọn adari.",
      game: "Bẹrẹ ere AI dipo Eniyan.",
      multiplayer: "Nsii elere-pupọ.",
      wallet: "Nsii apamọwọ rẹ.",
    },
    startingModule: (moduleName) => `Bẹrẹ modulu: ${moduleName}.`,
    openingSettings: "Nsii awọn eto.",
    closingSettings: "Titiipa awọn eto.",
    loggingOut: "N jade kuro.",
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
  onboarding: {
    signInButton: "Banye",
    signUpButton: "Debanye aha",
  },
  dashboard: {
    greeting: (name) => `Ndewo, ${name}!`,
    subGreeting: "Ị dịla njikere ịga n'ihu na njem AI gị?",
    multiplayerTitle: "Ọtụtụ Onye ọkpụkpọ",
    multiplayerDescription: "maa ndị enyi aka n'ajụjụ ọnụ oge.",
    profileTitle: "Profaịlụ & Asambodo",
    leaderboardTitle: "Bọọdụ Ndị ndu",
    leaderboardDescription: "Hụ ka ị na-atụnyere ndị mmụta ndị ọzọ.",
  },
  multiplayer: {
    waitingForPlayers: "Na-eche ndị egwuregwu ndị ọzọ...",
  },
  game: {
    title: "AI vs. Mmadụ",
    description: "Ị nwere ike ịma ilu nke AI dere?",
    difficulty: "Ọkwa",
    easy: "Mfe",
    hard: "Siri ike",
    pointDescription: "Azịza ziri ezi n'egwuregwu AI vs Human",
  },
  profile: {
      title: "Profaịlụ Gị & Ọganihu",
      learnerLevel: (level) => `Onye mmụta ${level}`,
      points: "Akara",
      feedbackButton: "Zipu Nkwupụta",
      multiplayerStatsTitle: "Ọnụọgụgụ Ọtụtụ Onye ọkpụkpọ",
      wins: "Mmeri",
      gamesPlayed: "Egwuregwu Egwuru",
      certificateIssuedBy: (orgName) => `Nke ${orgName} nyere`,
  },
  lesson: {
      submitAnswer: "Dobe",
      yourAnswer: "Azịza gị...",
      readAloud: "Gụọ N'olu Dara Ụda",
      quizCorrect: (points) => `Nke ahụ ziri ezi! (+${points} akara)`,
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
  settings: {
    title: "Ntọala",
    voiceMode: "Ụdị Olu",
    voiceModeDescription: "Kwado iwu olu na nkọwa.",
  },
  offline: {
    download: "Budata maka anọghị n'ịntanetị",
    downloaded: "Dị na-anọghị n'ịntanetị",
    downloading: "Na-ebudata...",
    offlineIndicator: "Ụdị anọghị n'ịntanetị",
    onlineIndicator: "Ị nọ n'ịntanetị",
    syncing: "Na-emekọrịta ọganihu gị...",
    notAvailable: "Ọdịnaya a adịghị na-anọghị n'ịntanetị.",
  },
  voice: {
    listening: "Na-ege ntị...",
    voiceModeActive: "Ụdị olu na-arụ ọrụ",
    navigatingTo: {
      dashboard: "Na-aga na dashboard.",
      profile: "Na-emeghe profaịlụ gị.",
      leaderboard: "Na-egosi bọọdụ ndị ndu.",
      game: "Na-amalite egwuregwu AI megide Mmadụ.",
      multiplayer: "Na-emeghe ọtụtụ onye ọkpụkpọ.",
      wallet: "Na-emeghe obere akpa gị.",
    },
    startingModule: (moduleName) => `Na-amalite modulu: ${moduleName}.`,
    openingSettings: "Na-emeghe ntọala.",
    closingSettings: "Na-emechi ntọala.",
    loggingOut: "Na-apụ apụ.",
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
  onboarding: {
    signInButton: "Sign In",
    signUpButton: "Create Account",
  },
  dashboard: {
    greeting: (name) => `How far, ${name}!`,
    subGreeting: "You ready to continue your AI adventure?",
    multiplayerTitle: "Multi-player",
    multiplayerDescription: "Challenge friends for real-time quiz.",
    profileTitle: "Profile & Certificates",
    leaderboardTitle: "Leaderboard",
    leaderboardDescription: "See how you dey rank with other learners.",
  },
  multiplayer: {
    waitingForPlayers: "Dey wait for other players...",
  },
  game: {
      title: "AI vs. Human",
      description: "You fit tell which proverb na AI write am?",
      difficulty: "Level",
      easy: "Easy",
      hard: "Hard",
      pointDescription: "Correct guess for AI vs Human game",
  },
  profile: {
      title: "Your Profile & Progress",
      learnerLevel: (level) => `Learner Level: ${level}`,
      feedbackButton: "Send Feedback",
      multiplayerStatsTitle: "Multi-player Stats",
      wins: "Wins",
      gamesPlayed: "Games Played",
      certificateIssuedBy: (orgName) => `From ${orgName}`,
  },
  lesson: {
      submitAnswer: "Submit",
      yourAnswer: "Your answer...",
      readAloud: "Read Am Aloud",
      quizCorrect: (points) => `Na correct! (+${points} points)`,
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
  settings: {
    title: "Settings",
    voiceMode: "Voice-First Mode",
    voiceModeDescription: "Enable voice commands and narration.",
  },
  offline: {
    download: "Download for Offline",
    downloaded: "Available Offline",
    downloading: "Downloading...",
    offlineIndicator: "Offline Mode",
    onlineIndicator: "You dey online",
    syncing: "Dey sync your progress...",
    notAvailable: "This content no dey available offline.",
  },
  voice: {
    listening: "Dey listen...",
    voiceModeActive: "Voice mode dey active",
    navigatingTo: {
      dashboard: "I dey go dashboard.",
      profile: "I dey open your profile.",
      leaderboard: "I dey show leaderboard.",
      game: "I dey start AI versus Human game.",
      multiplayer: "I dey open multi-player.",
      wallet: "I dey open your wallet.",
    },
    startingModule: (moduleName) => `I dey start module: ${moduleName}.`,
    openingSettings: "I dey open settings.",
    closingSettings: "I dey close settings.",
    loggingOut: "I dey log you out.",
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
  multiplayer: { waitingForPlayers: "ሌሎች ተጫዋቾችን በመጠበቅ ላይ..." },
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
  multiplayer: { waitingForPlayers: "Kulindwe abanye abadlali..." },
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
  multiplayer: { waitingForPlayers: "Kumirira vamwe vatambi..." },
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
  multiplayer: { waitingForPlayers: "Sugitaanka ciyaartoyda kale..." },
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


export const translations: { [key in Language]: Translation } = {
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