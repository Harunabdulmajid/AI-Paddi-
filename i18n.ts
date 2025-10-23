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
    welcome: {
      title: string;
      subtitle: string;
      consumerTitle: string;
      consumerParagraph: string;
      creatorTitle: string;
      creatorParagraph: string;
      ctaButton: string;
    };
    roleSelection: {
      title: string;
      description: string;
      student: string;
      studentDescription: string;
      teacher: string;
      teacherDescription: string;
      parent: string;
      parentDescription: string;
    };
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
    subGreetingParent: string;
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
    glossaryTitle: string;
    glossaryDescription: string;
    podcastGeneratorTitle: string;
    podcastGeneratorDescription: string;
    careerExplorerTitle: string;
    careerExplorerDescription: string;
    learningPathTitle: string;
  };
  teacherDashboard: {
    greeting: (name: string) => string;
    subGreeting: string;
    classManagementTitle: string;
    classManagementDescription: string;
    resourceHubTitle: string;
    resourceHubDescription: string;
    reviewCurriculumTitle: string;
    reviewCurriculumDescription: string;
    myClasses: string;
    noClasses: string;
    createClass: string;
    studentsCount: (count: number) => string;
    viewProgress: string;
    joinCode: string;
  };
  parentDashboard: {
    greeting: (name: string) => string;
    subGreeting: string;
    childProgressTitle: (name: string) => string;
    currentPath: string;
    modulesCompleted: string;
    pointsEarned: string;
    parentsGuideTitle: string;
    parentsGuideDescription: string;
    familySettingsTitle: string;
    familySettingsDescription: string;
    learningFocusTitle: string;
    linkChildTitle: string;
    linkChildDescription: string;
    linkChildInputPlaceholder: string;
    linkChildButton: string;
    linking: string;
    childNotFound: string;
    childAlreadyLinked: string;
  };
  parentGuideModal: {
    title: string;
    description: string;
    tip1Title: string;
    tip1Content: string;
    tip2Title: string;
    tip2Content: string;
    tip3Title: string;
    tip3Content: string;
  };
  createClassModal: {
    title: string;
    description: string;
    classNameLabel: string;
    classNamePlaceholder: string;
    createButton: string;
    creatingButton: string;
  };
  classDetailsModal: {
    title: (className: string) => string;
    studentsTab: string;
    assignmentsTab: string;
    noStudents: string;
    moduleProgress: (completed: number, total: number) => string;
    assignModules: string;
    saveAssignments: string;
    saving: string;
  };
  peerPractice: {
    title: string;
    description: string;
    createSession: string;
    creating: string;
    joinSession: string;
    joining: string;
    sessionCodePlaceholder: string;
    lobbyTitle: string;
    shareCode: string;
    copied: string;
    players: string;
    waitingForHost: string;
    waitingForPlayers: string;
    startPractice: string;
    starting: string;
    question: (current: number, total: number) => string;
    progress: string;
    practiceComplete: string;
    practiceAgain: string;
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
    learningPathTitle: string;
    changePath: string;
    changePathConfirmTitle: string;
    changePathConfirmMessage: string;
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
      peerPractice: string;
      wallet: string;
    },
    startingModule: (moduleName: string) => string;
    openingSettings: string;
    closingSettings: string;
    loggingOut: string;
  };
  glossary: {
    title: string;
    description: string;
    searchPlaceholder: string;
    noResultsTitle: string;
    noResultsDescription: (term: string) => string;
  };
  podcastGenerator: {
    title: string;
    description: string;
    scriptLabel: string;
    scriptPlaceholder: string;
    voiceLabel: string;
    voices: {
        kore: string;
        puck: string;
    };
    generateButton: string;
    generatingButton: string;
    yourCreation: string;
    errorMessage: string;
  };
  careerExplorer: {
    title: string;
    description: string;
    whatTheyDo: string;
    skillsNeeded: string;
    dayInTheLife: string;
    relevantLessons: string;
    startLearning: string;
    careers: {
      [key: string]: {
        title: string;
        description: string;
        what_they_do: string;
        skills: string[];
        day_in_the_life: string;
      }
    }
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
  paths: {
    [key in LearningPath]: {
      name: string;
      description: string;
    }
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
    welcome: {
      title: "From Consumer to Creator",
      subtitle: "Two people can use the same AI tool but have different destinies. One uses AI to do a task. The other uses AI to build a new solution.",
      consumerTitle: "An AI Consumer...",
      consumerParagraph: "...asks an AI to write a poem.",
      creatorTitle: "An AI Creator...",
      creatorParagraph: "...builds a tool with AI that helps thousands write poems.",
      ctaButton: "Let's Start Building",
    },
    roleSelection: {
      title: "How will you be using AI Paddi?",
      description: "This helps us get you started on the right foot.",
      student: "I'm a Student",
      studentDescription: "I want to learn AI skills for my future.",
      teacher: "I'm a Teacher",
      teacherDescription: "I want to bring AI concepts into my classroom.",
      parent: "I'm a Parent",
      parentDescription: "I want to guide my child's learning journey.",
    },
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
    subGreetingParent: "Ready to guide your child's learning journey?",
    progressTitle: "Your Progress",
    progressDescription: (completed, total) => `You've completed ${completed} of ${total} modules.`,
    continueLearningButton: "Continue Learning",
    allModulesCompleted: "All Modules Completed!",
    multiplayerTitle: "Peer-to-Peer Practice",
    multiplayerDescription: "Practice AI concepts with a friend in a collaborative session.",
    gameTitle: "AI vs. Human",
    gameDescription: "Can you tell who wrote it? Test your skills!",
    profileTitle: "Profile & Certificates",
    profileDescription: "View your progress and earned certificates.",
    leaderboardTitle: "Community Leaderboard",
    leaderboardDescription: "See how you rank against other learners.",
    walletTitle: "My Wallet",
    walletDescription: "View, send, and spend your earned points.",
    glossaryTitle: "AI Glossary",
    glossaryDescription: "Look up definitions for key AI terminology.",
    podcastGeneratorTitle: "Podcast Generator",
    podcastGeneratorDescription: "Use AI to create your own short audio show. Go from learner to creator!",
    careerExplorerTitle: "AI Career Explorer",
    careerExplorerDescription: "Discover future job opportunities in the world of AI.",
    learningPathTitle: "Your Learning Path",
  },
  teacherDashboard: {
    greeting: (name: string) => `Welcome, ${name}`,
    subGreeting: "Manage your classes and access teaching resources.",
    classManagementTitle: "Class Management",
    classManagementDescription: "Create classes, view student progress, and share resources.",
    resourceHubTitle: "Resource Hub",
    resourceHubDescription: "Access lesson plans, teaching guides, and project ideas.",
    reviewCurriculumTitle: "Review Curriculum",
    reviewCurriculumDescription: "Explore all lesson modules available to your students.",
    myClasses: "My Classes",
    noClasses: "You haven't created any classes yet. Get started by creating one!",
    createClass: "Create New Class",
    studentsCount: (count: number) => `${count} Students`,
    viewProgress: "View Details",
    joinCode: "Join Code",
  },
  parentDashboard: {
    greeting: (name: string) => `Hello, ${name}`,
    subGreeting: "You're doing a great job guiding your child's AI journey!",
    childProgressTitle: (name: string) => `${name}'s Progress`,
    currentPath: "Current Path",
    modulesCompleted: "Modules Completed",
    pointsEarned: "Points Earned",
    parentsGuideTitle: "Parent's Guide to AI",
    parentsGuideDescription: "Get tips on how to talk to your child about AI.",
    familySettingsTitle: "Family Settings",
    familySettingsDescription: "Manage linked accounts and preferences.",
    learningFocusTitle: "Current Learning Focus",
    linkChildTitle: "Link Your Child's Account",
    linkChildDescription: "To see your child's progress, enter the email address they use for their AI Paddi student account.",
    linkChildInputPlaceholder: "Your child's email address",
    linkChildButton: "Link Account",
    linking: "Linking...",
    childNotFound: "No student account was found with that email. Please check and try again.",
    childAlreadyLinked: "This student account is already linked to another parent.",
  },
  parentGuideModal: {
    title: "A Parent's Guide to AI",
    description: "Here are some simple ways to support your child's learning and start great conversations about AI.",
    tip1Title: "Ask 'What If?'",
    tip1Content: "Instead of asking what AI is, ask what it could do. 'What if an AI could help doctors in our local clinic?' or 'What if we used AI to design a new building for our community?' This sparks creativity.",
    tip2Title: "Be a Co-learner",
    tip2Content: "You don't need to be an expert. Learn alongside your child. Say things like, 'I don't know the answer to that, let's find out together using AI Paddi.' This shows that learning is a lifelong journey.",
    tip3Title: "Connect to Their World",
    tip3Content: "Talk about the AI they already use. Discuss how their favorite mobile game recommends new levels, or how a banking app keeps their savings safe. This makes AI real and relatable, not just a school subject.",
  },
  createClassModal: {
    title: "Create a New Class",
    description: "Give your new class a name to get started.",
    classNameLabel: "Class Name",
    classNamePlaceholder: "e.g., JSS1 Introduction to AI",
    createButton: "Create Class",
    creatingButton: "Creating...",
  },
  classDetailsModal: {
    title: (className: string) => `Details for ${className}`,
    studentsTab: "Students",
    assignmentsTab: "Assignments",
    noStudents: "No students have joined this class yet.",
    moduleProgress: (completed: number, total: number) => `${completed} / ${total} modules completed`,
    assignModules: "Assign Modules to this Class",
    saveAssignments: "Save Assignments",
    saving: "Saving...",
  },
  peerPractice: {
    title: "Peer-to-Peer Practice",
    description: "Practice AI concepts with a friend. No scores, just learning together.",
    createSession: "Create Session",
    creating: "Creating...",
    joinSession: "Join Session",
    joining: "Joining...",
    sessionCodePlaceholder: "Enter Session Code",
    lobbyTitle: "Practice Lobby",
    shareCode: "Share this code with your practice partner:",
    copied: "Copied!",
    players: "Participants",
    waitingForHost: "Waiting for host to start...",
    waitingForPlayers: "Waiting for other participants...",
    startPractice: "Start Practice",
    starting: "Starting...",
    question: (current, total) => `Question ${current} of ${total}`,
    progress: "Progress",
    practiceComplete: "Practice Complete!",
    practiceAgain: "Practice Again",
    exit: "Exit",
    errorNotFound: "Session not found. Please check the code.",
    errorAlreadyStarted: "This session has already started.",
    errorFull: "This session is full.",
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
    multiplayerStatsTitle: "Practice Stats",
    wins: "Wins",
    gamesPlayed: "Sessions Completed",
    viewWallet: "View Wallet Details",
    learningPathTitle: "Your Learning Path",
    changePath: "Change Path",
    changePathConfirmTitle: "Confirm Path Change",
    changePathConfirmMessage: "Changing your learning path will reset your module completion progress. Are you sure you want to continue?",
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
      peerPractice: "Opening peer-to-peer practice.",
      wallet: "Opening your wallet.",
    },
    startingModule: (moduleName) => `Starting module: ${moduleName}.`,
    openingSettings: "Opening settings.",
    closingSettings: "Closing settings.",
    loggingOut: "Logging you out.",
  },
  glossary: {
    title: "AI Glossary",
    description: "A quick reference for all the key AI terms used in the lessons.",
    searchPlaceholder: "Search for a term...",
    noResultsTitle: "No Terms Found",
    noResultsDescription: (term) => `We couldn't find any terms matching "${term}". Try another search.`,
  },
  podcastGenerator: {
    title: "AI Paddi's Podcast Studio",
    description: "Turn your ideas into audio. Become an AI Creator!",
    scriptLabel: "Your Podcast Script",
    scriptPlaceholder: "Write a short script here. You could explain an AI concept, tell a story, or share news from your community!",
    voiceLabel: "Choose a Voice",
    voices: {
        kore: "Deep, Clear Voice (Kore)",
        puck: "Friendly, Upbeat Voice (Puck)",
    },
    generateButton: "Generate Audio",
    generatingButton: "Creating Magic...",
    yourCreation: "Your Creation",
    errorMessage: "Oops! Something went wrong while generating the audio. Please try again.",
  },
  careerExplorer: {
    title: "AI Career Explorer",
    description: "See how your AI skills can create real opportunities in Nigeria and beyond.",
    whatTheyDo: "What They Do",
    skillsNeeded: "Skills Needed",
    dayInTheLife: "A Day in the Life",
    relevantLessons: "Relevant Lessons",
    startLearning: "Start Learning",
    careers: {
      'agritech-specialist': {
        title: "AI in Agriculture Specialist",
        description: "Uses AI to help farmers improve crop yields and manage resources.",
        what_they_do: "They analyze data from drones and sensors to monitor crop health, predict weather patterns, and recommend the best times for planting and harvesting. Their work helps make farming more efficient and sustainable.",
        skills: ["Data Analysis", "Problem-Solving", "Knowledge of Agriculture", "Communication"],
        day_in_the_life: "My day starts not in an office, but checking drone footage from a farm in Kano. The AI flags a section of maize with potential signs of nutrient deficiency. I then work with the local farm extension officer via WhatsApp, sending them the coordinates and a recommendation. It's not about replacing farmers; it's about giving them superpowers with data."
      },
      'fintech-ml-engineer': {
        title: "Fintech ML Engineer",
        description: "Builds smart financial tools, from fraud detection to loan applications.",
        what_they_do: "They create machine learning models that can detect fraudulent transactions in real-time, assess loan risk for small business owners, or create personalized savings plans for users of a banking app.",
        skills: ["Machine Learning", "Programming (Python)", "Statistics", "Financial Knowledge"],
        day_in_the_life: "Today, our AI model flagged a series of unusual transactions trying to drain an account. We stopped it in milliseconds. This afternoon, I'm training a new model to help market traders in Lagos get small loans faster by analyzing their sales history instead of demanding impossible collateral. It's about building trust with technology."
      },
      'ai-content-creator': {
        title: "AI Tutor & Content Creator",
        description: "Uses generative AI to create engaging educational materials and stories.",
        what_they_do: "They use AI tools to generate scripts for educational videos, create illustrations for children's books in local languages, or build simple chatbots that can help students practice new subjects. They are modern storytellers and teachers.",
        skills: ["Creativity", "Prompt Engineering", "Writing & Storytelling", "Teaching Skills"],
        day_in_the_life: "I'm working with a teacher in Port Harcourt to create a simple, illustrated science lesson about the water cycle. I use an AI image generator to create beautiful pictures and a language model to simplify the text. We're making learning materials that look amazing and are easy to understand for any student."
      },
      'ai-ethicist': {
        title: "AI Ethicist",
        description: "Ensures that AI systems are built and used fairly and responsibly.",
        what_they_do: "They work with tech companies to test AI models for bias, ensuring they work equally well for people of all backgrounds. They help create guidelines to protect user data and ensure that the AI's decisions are transparent and fair.",
        skills: ["Critical Thinking", "Ethics", "Communication", "Understanding of AI Bias"],
        day_in_the_life: "A team is building an AI to help doctors diagnose illnesses. My job is to ask the tough questions: Was the AI trained on data from Nigerian hospitals? Does it work as well for women as it does for men? We're running tests to make sure the answer is 'yes' before it ever reaches a real patient. My role is to be the voice for fairness."
      }
    }
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
                  content: "This is the most common type of machine learning. It uses 'labeled' data. Imagine showing a model thousands of pictures, each one with a label: 'cat', 'dog', 'car'. The model learns to connect the patterns in the pictures to the correct labels. In fintech, this is how an app learns to spot fraud; it's shown thousands of transactions labeled 'normal' or 'fraudulent' until it can identify the patterns of bad behaviour."
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
          summary: "AI learns through Machine Learning, which requires three things: Data (experience), a Model (the student), and a Training process (studying). The main learning methods are Supervised (with labeled data, like for fraud detection), Unsupervised (finding hidden patterns), and Reinforcement (learning from rewards and penalties).",
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
          introduction: "You might not realize it, but you interact with AI dozens of times every day. It's the silent partner in many of the tools we use, making them smarter, more personal, and more helpful. Let's look at some local examples.",
          sections: [
              {
                  heading: "AI on Your Phone & In Your City",
                  content: "Your smartphone is an AI powerhouse. Face unlock uses AI to recognize you. But it's also in the city. When a ride-hailing app in Lagos or Abuja finds the fastest route, avoids traffic, and sets a price, that's AI at work, calculating millions of possibilities in seconds. It's making our transport systems smarter."
              },
              {
                  heading: "Transforming Key Nigerian Industries",
                  content: "AI's impact goes far beyond convenience. In agriculture, AI-powered drones monitor crop health in northern Nigeria, helping farmers use water and fertilizer more efficiently for better harvests. In fintech, your banking app uses AI to detect fraud and protect your money. It can even help small business owners get loans by analyzing their business data fairly."
              },
              {
                  heading: "Smarter Learning and Entertainment",
                  content: "When a streaming service suggests a Nollywood movie, it's an AI 'recommendation engine' at work. It analyzes what you've watched to predict what you might enjoy next. In education, AI is creating personalized learning tools that act like a private tutor, helping students learn at their own pace. This makes education more accessible for everyone."
              },
              {
                  heading: "The Rise of Generative AI",
                  content: "One of the most exciting recent developments is 'Generative AI'. This is AI that can *create* new things. You see this in chatbots that can write poems, or in image generators that can create amazing art from a simple text description. Nigerian artists, writers, and programmers are now using these tools to build new, creative projects faster than ever before."
              }
          ],
          summary: "AI is a part of our daily lives, from transport apps in our cities to fintech apps protecting our money. It's transforming major local industries like agriculture and education. The newest frontier is 'Generative AI', which allows us to become creators, building new content and tools.",
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
                  content: "AI bias occurs when an AI system produces unfair results. This isn't because the AI is 'evil'; it's because it learned from biased data. For example, if an AI used for job hiring is trained on historical data where most managers were from a certain background, it might unfairly favour new candidates from that same background, ignoring equally qualified people from other groups. The AI is simply repeating the bias it was taught."
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
          summary: "AI is not neutral; it can inherit human biases from its training data, like in job hiring. Key challenges include the 'black box' problem, where AI decisions are hard to explain, as well as privacy and security risks. The solution lies in building 'Responsible AI' based on principles of Fairness, Accountability, and Transparency.",
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
  paths: {
    [LearningPath.Beginner]: {
        name: 'Beginner',
        description: 'Start with the fundamental concepts of what AI is and where you can find it.',
    },
    [LearningPath.Intermediate]: {
        name: 'Intermediate',
        description: 'Dive deeper into how AI models learn and the ethical challenges they present.',
    },
    [LearningPath.Advanced]: {
        name: 'Advanced',
        description: 'Explore the future of work and the new opportunities AI is creating.',
    },
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
        name: 'Practice Partner',
        description: 'Completed your first practice session with a peer.',
    },
    'multiplayer-maestro': {
        name: 'Practice Pro',
        description: 'Completed 10 peer-to-peer practice sessions.',
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
    multiplayerTitle: "Mazoezi ya Pamoja",
    multiplayerDescription: "Fanya mazoezi ya dhana za AI na rafiki.",
    gameTitle: "AI dhidi ya Binadamu",
    gameDescription: "Je, unaweza kutambua ni nani aliyeandika? Jaribu ujuzi wako!",
    profileTitle: "Wasifu na Vyeti",
    profileDescription: "Tazama maendeleo yako na vyeti ulivyopata.",
    leaderboardTitle: "Ubao wa Wanaoongoza",
    leaderboardDescription: "Tazama jinsi unavyopambana na wanafunzi wengine.",
    glossaryTitle: "Kamusi ya AI",
    glossaryDescription: "Tafuta maana za istilahi muhimu za AI.",
    podcastGeneratorTitle: "Jenereta ya Podcast",
    podcastGeneratorDescription: "Tumia AI kuunda kipindi chako kifupi cha sauti. Toka kuwa mwanafunzi hadi kuwa muundaji!",
    careerExplorerTitle: "Mgunduzi wa Kazi za AI",
    careerExplorerDescription: "Gundua fursa za kazi za baadaye katika ulimwengu wa AI.",
    learningPathTitle: "Njia Yako ya Kujifunza",
  },
  peerPractice: {
    title: "Mazoezi ya Pamoja",
    description: "Fanya mazoezi ya dhana za AI na rafiki. Hakuna alama, ni kujifunza pamoja tu.",
    createSession: "Anzisha Kikao",
    joinSession: "Jiunge na Kikao",
    sessionCodePlaceholder: "Weka Nambari ya Kikao",
    lobbyTitle: "Ukumbi wa Mazoezi",
    shareCode: "Shiriki nambari hii na mwenzako wa mazoezi:",
    copied: "Imenakiliwa!",
    players: "Washiriki",
    waitingForHost: "Inasubiri mwenyeji aanze...",
    waitingForPlayers: "Inasubiri washiriki wengine...",
    startPractice: "Anza Mazoezi",
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
    multiplayerStatsTitle: "Takwimu za Mazoezi",
    wins: "Ushindi",
    gamesPlayed: "Vikao Vilivyokamilika",
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
      peerPractice: "Inafungua mazoezi ya pamoja.",
      wallet: "Inafungua pochi yako.",
    },
    startingModule: (moduleName) => `Inaanza moduli: ${moduleName}.`,
    openingSettings: "Inafungua mipangilio.",
    closingSettings: "Inafunga mipangilio.",
    loggingOut: "Unatoka.",
  },
  glossary: {
    title: "Kamusi ya AI",
    description: "Marejeleo ya haraka kwa istilahi zote muhimu za AI zilizotumika katika masomo.",
    searchPlaceholder: "Tafuta istilahi...",
    noResultsTitle: "Hakuna Istilahi Zilizopatikana",
    noResultsDescription: (term) => `Hatukuweza kupata istilahi zinazolingana na "${term}". Jaribu utafutaji mwingine.`,
  },
  podcastGenerator: {
    title: "Studio ya Podcast ya AI Paddi",
    description: "Geuza mawazo yako kuwa sauti. Kuwa Muumba wa AI!",
    scriptLabel: "Hati Yako ya Podcast",
    scriptPlaceholder: "Andika hati fupi hapa. Unaweza kuelezea dhana ya AI, kusimulia hadithi, au kushiriki habari kutoka kwa jamii yako!",
    voiceLabel: "Chagua Sauti",
    voices: {
        kore: "Sauti ya Kina, Wazi (Kore)",
        puck: "Sauti ya Kirafiki, ya Kuchangamsha (Puck)",
    },
    generateButton: "Tengeneza Sauti",
    generatingButton: "Inatengeneza...",
    yourCreation: "Uumbaji Wako",
    errorMessage: "Oops! Kitu kilienda mrama wakati wa kutengeneza sauti. Tafadhali jaribu tena.",
  },
  careerExplorer: {
    title: "Mgunduzi wa Kazi za AI",
    description: "Angalia jinsi ujuzi wako wa AI unavyoweza kuunda fursa za kweli nchini na kwingineko.",
    whatTheyDo: "Wanachofanya",
    skillsNeeded: "Ujuzi Unaohitajika",
    dayInTheLife: "Siku Moja Maishani",
    relevantLessons: "Masomo Husika",
    startLearning: "Anza Kujifunza",
    careers: {
      'agritech-specialist': {
        title: "Mtaalamu wa AI katika Kilimo",
        description: "Anatumia AI kusaidia wakulima kuboresha mazao na kusimamia rasilimali.",
        what_they_do: "Wanachambua data kutoka kwa droni na sensa kufuatilia afya ya mimea, kutabiri hali ya hewa, na kupendekeza nyakati bora za kupanda na kuvuna. Kazi yao inasaidia kufanya kilimo kiwe na ufanisi zaidi.",
        skills: ["Uchambuzi wa Data", "Utatuzi wa Matatizo", "Ujuzi wa Kilimo", "Mawasiliano"],
        day_in_the_life: "Siku yangu haianzi ofisini, bali kwa kuangalia picha za droni kutoka shambani. AI inaonyesha sehemu ya mahindi yenye dalili za upungufu wa virutubisho. Nashirikiana na afisa ugani kupitia WhatsApp, nikimtumia eneo husika na pendekezo."
      },
      'fintech-ml-engineer': {
        title: "Mhandisi wa ML katika Fintech",
        description: "Anaunda zana za kifedha zenye akili, kutoka kugundua ulaghai hadi maombi ya mikopo.",
        what_they_do: "Wanaunda mifumo ya kujifunza kwa mashine inayoweza kugundua miamala ya ulaghai mara moja, kutathmini hatari ya mikopo kwa wafanyabiashara wadogo, au kuunda mipango ya akiba ya kibinafsi kwa watumiaji wa programu za benki.",
        skills: ["Kujifunza kwa Mashine", "Programu (Python)", "Takwimu", "Ujuzi wa Kifedha"],
        day_in_the_life: "Leo, mfumo wetu wa AI uligundua miamala isiyo ya kawaida ikijaribu kuiba pesa kwenye akaunti. Tuliizuia kwa sekunde chache. Mchana huu, ninafundisha mfumo mpya kusaidia wafanyabiashara wadogo kupata mikopo haraka."
      },
      'ai-content-creator': {
        title: "Muundaji wa Maudhui na Mwalimu wa AI",
        description: "Anatumia AI ya uzalishaji kuunda vifaa vya elimu na hadithi za kuvutia.",
        what_they_do: "Wanatumia zana za AI kuandika miswada ya video za kielimu, kuunda vielelezo vya vitabu vya watoto kwa lugha za kienyeji, au kujenga chatbots rahisi zinazoweza kusaidia wanafunzi kufanya mazoezi ya masomo mapya.",
        skills: ["Ubunifu", "Uhandisi wa Haraka", "Uandishi na Usomaji hadithi", "Ujuzi wa Kufundisha"],
        day_in_the_life: "Ninafanya kazi na mwalimu kuunda somo rahisi la sayansi lenye vielelezo. Ninatumia jenereta ya picha ya AI kuunda picha nzuri na mfumo wa lugha kurahisisha maandishi. Tunatengeneza vifaa vya kujifunzia vinavyovutia."
      },
      'ai-ethicist': {
        title: "Mtaalamu wa Maadili ya AI",
        description: "Anahakikisha kwamba mifumo ya AI inajengwa na kutumika kwa haki na uwajibikaji.",
        what_they_do: "Wanafanya kazi na makampuni ya teknolojia kupima mifumo ya AI kwa upendeleo, wakihakikisha inafanya kazi sawa kwa watu wa asili zote. Wanasaidia kuunda miongozo ya kulinda data ya watumiaji na kuhakikisha maamuzi ya AI ni ya wazi na ya haki.",
        skills: ["Fikra Muhimu", "Maadili", "Mawasiliano", "Uelewa wa Upendeleo wa AI"],
        day_in_the_life: "Timu inajenga AI ya kusaidia madaktari kugundua magonjwa. Kazi yangu ni kuuliza maswali magumu: Je, AI ilifunzwa kwa data kutoka hospitali za hapa? Je, inafanya kazi vizuri kwa wanawake kama inavyofanya kwa wanaume? Jukumu langu ni kuwa sauti ya haki."
      }
    }
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
    multiplayerTitle: "Aiwatar da Kai-da-Kai",
    multiplayerDescription: "Aiwatar da dabarun AI tare da aboki a cikin zaman hadin gwiwa.",
    gameTitle: "AI vs. Mutum",
    gameDescription: "Za ka iya gane wanda ya rubuta? Gwada kwarewarka!",
    profileTitle: "Bayanan Sirri & Takaddun Shaida",
    profileDescription: "Duba ci gabanka da takaddun shaidar da ka samu.",
    leaderboardTitle: "Jerin Gwarzaye",
    leaderboardDescription: "Duba yadda ka ke tsere da sauran masu koyo.",
    glossaryTitle: "Kamun AI",
    glossaryDescription: "Nemo ma'anar manyan kalmomin AI.",
    podcastGeneratorTitle: "Mai Samar da Podcast",
    podcastGeneratorDescription: "Yi amfani da AI don ƙirƙirar gajeren shirin sauti naka. Daga mai koyo zuwa mahalicci!",
    careerExplorerTitle: "Mai Binciken Ayyukan AI",
    careerExplorerDescription: "Gano damar ayyukan gaba a duniyar AI.",
    learningPathTitle: "Hanyar Karatunka",
  },
  peerPractice: {
    title: "Aiwatar da Kai-da-Kai",
    description: "Aiwatar da dabarun AI tare da aboki. Babu maki, kawai koyo tare.",
    createSession: "Kirkiri Zama",
    joinSession: "Shiga Zama",
    sessionCodePlaceholder: "Shigar da Lambar Zama",
    waitingForPlayers: "Ana jiran sauran mahalarta...",
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
    multiplayerStatsTitle: "Kididdigar Aiwatarwa",
    wins: "Nasarori",
    gamesPlayed: "Zaman da aka Kammala",
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
      peerPractice: "Ana bude aiwatar da kai-da-kai.",
      wallet: "Ana bude walat dinka.",
    },
    startingModule: (moduleName) => `Ana fara darasi: ${moduleName}.`,
    openingSettings: "Ana bude saiti.",
    closingSettings: "Ana rufe saiti.",
    loggingOut: "Ana fitar da kai.",
  },
  glossary: {
    title: "Kamun AI",
    description: "Jagora mai sauri ga dukkan manyan kalmomin AI da aka yi amfani da su a cikin darussa.",
    searchPlaceholder: "Nemo kalma...",
    noResultsTitle: "Ba a Samu Kalmomi ba",
    noResultsDescription: (term) => `Ba mu iya samun kalmomin da suka dace da "${term}" ba. Gwada wani bincike.`,
  },
  podcastGenerator: {
    title: "Sitidiyon Podcast na AI Paddi",
    description: "Mayar da ra'ayoyinka zuwa sauti. Zama Mahaliccin AI!",
    scriptLabel: "Rubutun Podcast Naka",
    scriptPlaceholder: "Rubuta gajeren rubutu a nan. Za ka iya bayyana wata dabara ta AI, ba da labari, ko raba labarai daga al'ummarka!",
    voiceLabel: "Zaɓi Murya",
    voices: {
        kore: "Murya Mai Zurfi, a fili (Kore)",
        puck: "Murya ta Abokantaka, Mai Farin Ciki (Puck)",
    },
    generateButton: "Samar da Sauti",
    generatingButton: "Ana Kirkira...",
    yourCreation: "Halittarka",
    errorMessage: "A'a! Wani abu ya faru ba daidai ba yayin samar da sauti. Da fatan za a sake gwadawa.",
  },
  careerExplorer: {
    title: "Mai Binciken Ayyukan AI",
    description: "Duba yadda kwarewar AI dinka zai iya haifar da dama ta gaske a Najeriya da sauran wurare.",
    whatTheyDo: "Abin da Suke Yi",
    skillsNeeded: "Kwarewar da ake Bukata",
    dayInTheLife: "Rana Daya a Rayuwa",
    relevantLessons: "Darussan da suka dace",
    startLearning: "Fara Koyo",
    careers: {
      'agritech-specialist': {
        title: "Kwararre a fannin AI a Noma",
        description: "Yana amfani da AI don taimaka wa manoma su inganta amfanin gona da sarrafa albarkatu.",
        what_they_do: "Suna nazarin bayanai daga jirage marasa matuka da na'urori masu auna sigina don lura da lafiyar amfanin gona, hasashen yanayi, da ba da shawarar lokutan da suka fi dacewa don shuka da girbi. Ayyukansu na taimakawa wajen sa aikin noma ya zama mai inganci da dorewa.",
        skills: ["Nazarin Bayanai", "Magance Matsaloli", "Sanin Noma", "Sadarwa"],
        day_in_the_life: "Ranata ba ta fara a ofis ba, amma da duba hotunan jirgin sama mara matuki daga wata gona a Kano. AI na nuna wani bangare na masara da alamun karancin abinci mai gina jiki. Sai na yi aiki da jami'in fadada aikin gona na yankin ta WhatsApp, na aika masa da wurin da kuma shawarar wani takin zamani."
      },
      'fintech-ml-engineer': {
        title: "Injiniyan ML a fannin Fintech",
        description: "Yana gina kayan aikin kudi masu wayo, daga gano zamba zuwa neman rance.",
        what_they_do: "Suna kirkirar samfuran koyon na'ura da za su iya gano ma'amaloli na zamba a ainihin lokacin, tantance hadarin rance ga masu kananan sana'o'i, ko kirkirar tsare-tsaren tanadi na musamman ga masu amfani da manhajar banki.",
        skills: ["Koyon Na'ura", "Shirye-shirye (Python)", "Kididdiga", "Sanin Kudi"],
        day_in_the_life: "A yau, samfurinmu na AI ya gano wasu ma'amaloli marasa kyau da ke kokarin kwashe kudi daga wani asusu. Mun dakatar da shi cikin dakika kadan. Yau da yamma, ina horar da wani sabon samfuri don taimaka wa 'yan kasuwa a Legas su sami kananan rancuna cikin sauri."
      },
      'ai-content-creator': {
        title: "Mai Kirkirar Abun Ciki na AI & Malami",
        description: "Yana amfani da AI mai kirkira don samar da kayan koyarwa masu jan hankali da labarai.",
        what_they_do: "Suna amfani da kayan aikin AI don samar da rubuce-rubucen bidiyo na ilimantarwa, kirkirar zane-zane na littattafan yara a cikin harsunan gida, ko gina chatbots masu sauki da za su iya taimaka wa dalibai su gwada sabbin darussa.",
        skills: ["Kirkira", "Injiniyancin Umarni", "Rubutu & Ba da Labari", "Kwarewar Koyarwa"],
        day_in_the_life: "Ina aiki tare da wani malami a Fatakwal don kirkirar wani darasi mai sauki na kimiyya mai hoto game da zagayowar ruwa. Ina amfani da na'urar samar da hotuna ta AI don kirkirar kyawawan hotuna da kuma samfurin harshe don saukaka rubutun."
      },
      'ai-ethicist': {
        title: "Kwararre a fannin Da'a na AI",
        description: "Yana tabbatar da cewa an gina kuma an yi amfani da tsarin AI cikin adalci da alhaki.",
        what_they_do: "Suna aiki tare da kamfanonin fasaha don gwada samfuran AI don nuna bambanci, tabbatar da cewa suna aiki daidai ga mutane na kowane jinsi. Suna taimakawa wajen kirkirar ka'idoji don kare bayanan masu amfani da kuma tabbatar da cewa shawarwarin AI a bayyane suke kuma masu adalci.",
        skills: ["Tunani Mai Zurfi", "Da'a", "Sadarwa", "Fahimtar Nuna Bambanci na AI"],
        day_in_the_life: "Wata kungiya na gina AI don taimakawa likitoci su gano cututtuka. Aikina shi ne in yi tambayoyi masu wuya: Shin an horar da AI da bayanai daga asibitocin Najeriya? Shin yana aiki daidai ga mata kamar yadda yake yi ga maza? Aikina shi ne in zama murya ga adalci."
      }
    }
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
    multiplayerTitle: "Ìdánrawò Ẹlẹgbẹ́-sí-Ẹlẹgbẹ́",
    multiplayerDescription: "Ṣe ìdánrawò àwọn èrò AI pẹ̀lú ọ̀rẹ́ kan nínú ìpàdé àjùmọ̀ṣe.",
    profileTitle: "Profaili & Awọn iwe-ẹri",
    leaderboardTitle: "Igbimọ Awọn adari",
    leaderboardDescription: "Wo bi o ṣe n ṣe afiwe si awọn akẹkọọ miiran.",
    glossaryTitle: "Àtúmọ̀-èdè AI",
    glossaryDescription: "Wá ìtumọ̀ fún àwọn ọ̀rọ̀ pàtàkì AI.",
    podcastGeneratorTitle: "Ẹlẹda Adarọ-ese",
    podcastGeneratorDescription: "Lo AI lati ṣẹda eto ohun kukuru tirẹ. Lọ lati akẹkọọ si ẹlẹda!",
    careerExplorerTitle: "Oluṣawari Iṣẹ AI",
    careerExplorerDescription: "Ṣawari awọn anfani iṣẹ iwaju ni agbaye ti AI.",
  },
  peerPractice: {
    title: "Ìdánrawò Ẹlẹgbẹ́-sí-Ẹlẹgbẹ́",
    waitingForPlayers: "Nduro de awọn alabaṣepọ miiran...",
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
      multiplayerStatsTitle: "Àwọn Iṣiro Ìdánrawò",
      wins: "Iṣẹgun",
      gamesPlayed: "Àwọn Ìpàdé Tí A Ti Parí",
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
      peerPractice: "Nsii ìdánrawò ẹlẹgbẹ́-sí-ẹlẹgbẹ́.",
      wallet: "Nsii apamọwọ rẹ.",
    },
    startingModule: (moduleName) => `Bẹrẹ modulu: ${moduleName}.`,
    openingSettings: "Nsii awọn eto.",
    closingSettings: "Titiipa awọn eto.",
    loggingOut: "N jade kuro.",
  },
  glossary: {
    title: "Àtúmọ̀-èdè AI",
    description: "Ìtọ́kasi yára fún gbogbo àwọn ọ̀rọ̀ pàtàkì AI tí a lò nínú àwọn ẹ̀kọ́.",
    searchPlaceholder: "Wá ọ̀rọ̀ kan...",
    noResultsTitle: "Kò Rí Àwọn Ọ̀rọ̀",
    noResultsDescription: (term) => `A kò rí àwọn ọ̀rọ̀ tó bá "${term}" mu. Gbìyànjú ìwákiri mìíràn.`,
  },
  podcastGenerator: {
    title: "Situdio Adarọ-ese AI Paddi",
    description: "Yi awọn imọran rẹ pada si ohun. Di Ẹlẹda AI!",
    scriptLabel: "Iwe-afọwọkọ Adarọ-ese Rẹ",
    scriptPlaceholder: "Kọ iwe-afọwọkọ kukuru kan nibi. O le ṣalaye imọran AI kan, sọ itan kan, tabi pin awọn iroyin lati agbegbe rẹ!",
    voiceLabel: "Yan Ohùn Kan",
    voices: {
        kore: "Ohùn Jinlẹ, kedere (Kore)",
        puck: "Ohùn ọrẹ, Alarinrin (Puck)",
    },
    generateButton: "Ṣẹda Ohun",
    generatingButton: "Nṣẹda...",
    yourCreation: "Ẹda Rẹ",
    errorMessage: "Oops! Nkan kan lọ aṣiṣe lakoko ti o n ṣẹda ohun. Jọwọ gbiyanju lẹẹkansi.",
  },
  careerExplorer: {
    title: "Oluṣawari Iṣẹ AI",
    description: "Wo bi awọn ọgbọn AI rẹ ṣe le ṣẹda awọn anfani gidi ni Nigeria ati ni ikọja.",
    whatTheyDo: "Ohun ti Wọn Ṣe",
    skillsNeeded: "Awọn Ogbon ti a beere",
    dayInTheLife: "Ọjọ Kan Ni Igbesi aye",
    relevantLessons: "Awọn Ẹkọ ti o yẹ",
    startLearning: "Bẹrẹ Ikẹkọ",
    careers: {
      'agritech-specialist': {
        title: "Ọjọgbọn AI ni Ogbin",
        description: "Nlo AI lati ṣe iranlọwọ fun awọn agbẹ lati mu ikore pọ si ati ṣakoso awọn ohun elo.",
        what_they_do: "Wọn ṣe itupalẹ data lati awọn drones ati awọn sensọ lati ṣe abojuto ilera irugbin, sọ asọtẹlẹ oju ojo, ati ṣeduro awọn akoko ti o dara julọ fun gbingbin ati ikore. Iṣẹ wọn ṣe iranlọwọ lati jẹ ki iṣẹ-ogbin munadoko siwaju sii.",
        skills: ["Itupalẹ Data", "Iyanju Iṣoro", "Imọ-ogbin", "Ibaraẹnisọrọ"],
        day_in_the_life: "Ọjọ mi ko bẹrẹ ni ọfiisi, ṣugbọn pẹlu ṣiṣe ayẹwo aworan drone lati oko kan ni Kano. AI ṣe afihan apakan agbado kan pẹlu awọn ami aipe ounjẹ. Mo lẹhinna ṣiṣẹ pẹlu oṣiṣẹ itẹsiwaju oko agbegbe nipasẹ WhatsApp."
      },
      'fintech-ml-engineer': {
        title: "Onimọ-ẹrọ ML ni Fintech",
        description: "Kọ awọn irinṣẹ owo ti o gbọn, lati wiwa jibiti si awọn ohun elo awin.",
        what_they_do: "Wọn ṣẹda awọn awoṣe ẹkọ ẹrọ ti o le rii awọn iṣowo arekereke ni akoko gidi, ṣe ayẹwo eewu awin fun awọn oniwun iṣowo kekere, tabi ṣẹda awọn ero ifowopamọ ti ara ẹni fun awọn olumulo ti ohun elo banki kan.",
        skills: ["Ẹkọ Ẹrọ", "Siseto (Python)", "Iṣiro", "Imọ-owo"],
        day_in_the_life: "Loni, awoṣe AI wa ṣe afihan lẹsẹsẹ awọn iṣowo dani ti n gbiyanju lati fa owo jade kuro ninu akọọlẹ kan. A da duro ni iṣẹju-aaya. Mo n kọ awoṣe tuntun lati ṣe iranlọwọ fun awọn oniṣowo ọja ni Eko lati gba awọn awin kekere ni iyara."
      },
      'ai-content-creator': {
        title: "Oludasile Akoonu & Olukọni AI",
        description: "Nlo AI ipilẹṣẹ lati ṣẹda awọn ohun elo eto-ẹkọ ti o nifẹ ati awọn itan.",
        what_they_do: "Wọn lo awọn irinṣẹ AI lati ṣe agbekalẹ awọn iwe afọwọkọ fun awọn fidio eto-ẹkọ, ṣẹda awọn aworan fun awọn iwe ọmọde ni awọn ede abinibi, tabi kọ awọn chatbots ti o rọrun ti o le ṣe iranlọwọ fun awọn ọmọ ile-iwe lati ṣe adaṣe awọn koko-ọrọ tuntun.",
        skills: ["Ẹda", "Imọ-ẹrọ Kọni", "Kikọ & Itan-itan", "Awọn Ogbon Ikọni"],
        day_in_the_life: "Mo n ṣiṣẹ pẹlu olukọ kan ni Port Harcourt lati ṣẹda ẹkọ imọ-jinlẹ ti o rọrun, ti o ni aworan nipa iyipo omi. Mo lo olupilẹṣẹ aworan AI lati ṣẹda awọn aworan ẹlẹwa ati awoṣe ede lati jẹ ki ọrọ naa rọrun."
      },
      'ai-ethicist': {
        title: "Onimọ-jinlẹ AI",
        description: "Ṣe idaniloju pe awọn eto AI ni a kọ ati lo ni ododo ati ni ojuse.",
        what_they_do: "Wọn ṣiṣẹ pẹlu awọn ile-iṣẹ imọ-ẹrọ lati ṣe idanwo awọn awoṣe AI fun ojuṣaaju, ni idaniloju pe wọn ṣiṣẹ bakanna fun awọn eniyan ti gbogbo ipilẹ. Wọn ṣe iranlọwọ lati ṣẹda awọn itọnisọna lati daabobo data olumulo ati rii daju pe awọn ipinnu AI jẹ gbangba ati ododo.",
        skills: ["Iroye Pataki", "Iwa", "Ibaraẹnisọrọ", "Oye ti Ojuṣaaju AI"],
        day_in_the_life: "Ẹgbẹ kan n kọ AI lati ṣe iranlọwọ fun awọn dokita lati ṣe iwadii awọn aisan. Iṣẹ mi ni lati beere awọn ibeere lile: Njẹ a kọ AI lori data lati awọn ile-iwosan Naijiria? Njẹ o ṣiṣẹ daradara fun awọn obinrin bi o ṣe nṣe fun awọn ọkunrin? Ipa mi ni lati jẹ ohun fun ododo."
      }
    }
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
    multiplayerTitle: "Omume ndị ọgbọ na ndị ọgbọ",
    multiplayerDescription: "Soro enyi gị na-eme echiche AI na nnọkọ imekọ ihe ọnụ.",
    profileTitle: "Profaịlụ & Asambodo",
    leaderboardTitle: "Bọọdụ Ndị ndu",
    leaderboardDescription: "Hụ ka ị na-atụnyere ndị mmụta ndị ọzọ.",
    glossaryTitle: "Nkọwa okwu AI",
    glossaryDescription: "Chọọ nkọwa maka usoro AI dị mkpa.",
    podcastGeneratorTitle: "Onye na-emepụta Pọdkastị",
    podcastGeneratorDescription: "Jiri AI mepụta obere ihe ngosi ọdịyo nke gị. Site na onye mmụta gaa na onye okike!",
    careerExplorerTitle: "Onye nyocha Ọrụ AI",
    careerExplorerDescription: "Chọpụta ohere ọrụ n'ọdịnihu n'ụwa nke AI.",
  },
  peerPractice: {
    title: "Omume ndị ọgbọ na ndị ọgbọ",
    waitingForPlayers: "Na-eche ndị ọzọ so...",
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
      multiplayerStatsTitle: "Ọnụọgụgụ Omume",
      wins: "Mmeri",
      gamesPlayed: "Oge Emechara",
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
      peerPractice: "Na-emeghe omume ndị ọgbọ na ndị ọgbọ.",
      wallet: "Na-emeghe obere akpa gị.",
    },
    startingModule: (moduleName) => `Na-amalite modulu: ${moduleName}.`,
    openingSettings: "Na-emeghe ntọala.",
    closingSettings: "Na-emechi ntọala.",
    loggingOut: "Na-apụ apụ.",
  },
  glossary: {
    title: "Nkọwa okwu AI",
    description: "Ntụaka ngwa ngwa maka usoro AI niile dị mkpa ejiri na nkuzi.",
    searchPlaceholder: "Chọọ maka okwu...",
    noResultsTitle: "Ọ nweghị Okwu achọtara",
    noResultsDescription: (term) => `Anyị enweghị ike ịchọta usoro ọ bụla dabara na "${term}". Nwaa ọchụchọ ọzọ.`,
  },
  podcastGenerator: {
    title: "Situdiyo Pọdkastị nke AI Paddi",
    description: "Tụgharịa echiche gị n'ime ọdịyo. Bụrụ Onye Okike AI!",
    scriptLabel: "Ederede Pọdkastị Gị",
    scriptPlaceholder: "Dee obere ederede ebe a. Ị nwere ike ịkọwa echiche AI, kọọ akụkọ, ma ọ bụ kesaa ozi sitere na obodo gị!",
    voiceLabel: "Họrọ Olu",
    voices: {
        kore: "Olu miri emi, doro anya (Kore)",
        puck: "Olu enyi, nke nwere obi ụtọ (Puck)",
    },
    generateButton: "Mepụta Ọdịyo",
    generatingButton: "Na-emepụta...",
    yourCreation: "Okike Gị",
    errorMessage: "Ewoo! Ihe mehiere mgbe a na-emepụta ọdịyo. Biko nwaa ọzọ.",
  },
  careerExplorer: {
    title: "Onye nyocha Ọrụ AI",
    description: "Hụ ka nka AI gị nwere ike isi kee ohere dị adị na Naịjirịa na gafere.",
    whatTheyDo: "Ihe Ha Na-eme",
    skillsNeeded: "Nkà Dị Mkpa",
    dayInTheLife: "Otu Ụbọchị na Ndụ",
    relevantLessons: "Ihe Ọmụmụ Dị Mkpa",
    startLearning: "Malite Ịmụ Ihe",
    careers: {
      'agritech-specialist': {
        title: "Ọkachamara AI na Ọrụ Ugbo",
        description: "Na-eji AI enyere ndị ọrụ ugbo aka imeziwanye ihe ọkụkụ na ijikwa akụ.",
        what_they_do: "Ha na-enyocha data sitere na drones na sensọ iji nyochaa ahụike ihe ọkụkụ, buo amụma ihu igwe, ma kwado oge kacha mma maka ịkụ na iwe ihe ubi. Ọrụ ha na-enyere aka mee ka ọrụ ugbo rụọ ọrụ nke ọma.",
        skills: ["Nnyocha Data", "Nchọpụta Nsogbu", "Ọmụma Ọrụ Ugbo", "Nkwurịta Okwu"],
        day_in_the_life: "Ụbọchị m anaghị ebido n'ọfịs, kama ọ na-eji enyocha ihe onyonyo drone si n'ugbo dị na Kano. AI na-egosi akụkụ ọka nwere ike ịnwe ụkọ nri. M na-arụkọ ọrụ na onye ọrụ mgbasa ozi ugbo site na WhatsApp."
      },
      'fintech-ml-engineer': {
        title: "Injinia ML na Fintech",
        description: "Na-ewu ngwaọrụ ego nwere ọgụgụ isi, site na nchọpụta aghụghọ ruo na ngwa mgbazinye ego.",
        what_they_do: "Ha na-emepụta ụdị mmụta igwe nwere ike ịchọpụta azụmahịa aghụghọ n'oge, nyochaa ihe egwu mgbazinye ego maka ndị nwe obere azụmaahịa, ma ọ bụ mepụta atụmatụ nchekwa ego ahaziri maka ndị ọrụ ngwa akụ.",
        skills: ["Mmụta Igwe", "Mmemme (Python)", "Ọnụ ọgụgụ", "Ọmụma Ego"],
        day_in_the_life: "Taa, ụdị AI anyị gosipụtara usoro azụmahịa pụrụ iche na-anwa iwepụ ego na akaụntụ. Anyị kwụsịrị ya na nkeji ole na ole. N'ehihie a, ana m azụ ụdị ọhụrụ iji nyere ndị ahịa ahịa na Lagos aka inweta obere ego mgbazinye ngwa ngwa."
      },
      'ai-content-creator': {
        title: "Onye Okike ọdịnaya & Onye nkuzi AI",
        description: "Na-eji AI na-emepụta ihe iji mepụta ihe mmụta na akụkọ na-adọrọ mmasị.",
        what_they_do: "Ha na-eji ngwaọrụ AI emepụta edemede maka vidiyo mmụta, mepụta ihe atụ maka akwụkwọ ụmụaka n'asụsụ obodo, ma ọ bụ wuo chatbots dị mfe nwere ike inyere ụmụ akwụkwọ aka ịme ihe ọmụmụ ọhụrụ.",
        skills: ["Ihe Okike", "Injinia Ngwa ngwa", "Ide & Ịkọ Akụkọ", "Nkà Nkụzi"],
        day_in_the_life: "M na-arụkọ ọrụ na onye nkuzi na Port Harcourt iji mepụta ihe ọmụmụ sayensị dị mfe, nke nwere ihe atụ gbasara usoro mmiri. Ana m eji ihe na-emepụta onyonyo AI emepụta foto mara mma na ụdị asụsụ iji mee ka ederede dị mfe."
      },
      'ai-ethicist': {
        title: "Ọkà mmụta ụkpụrụ omume AI",
        description: "Na-ahụ na a na-ewu ma na-eji usoro AI eme ihe n'ụzọ ziri ezi na nke kwesịrị ekwesị.",
        what_they_do: "Ha na-arụkọ ọrụ na ụlọ ọrụ teknụzụ iji nwalee ụdị AI maka ajọ mbunobi, na-ahụ na ha na-arụ ọrụ nke ọma maka ndị mmadụ n'agbanyeghị agbụrụ. Ha na-enyere aka ịmepụta ụkpụrụ iji chebe data onye ọrụ ma hụ na mkpebi AI doro anya ma zie ezi.",
        skills: ["Echiche Dị Mkpa", "Ụkpụrụ Omume", "Nkwurịta Okwu", "Nghọta nke ajọ mbunobi AI"],
        day_in_the_life: "Otu ìgwè na-ewu AI iji nyere ndị dọkịta aka ịchọpụta ọrịa. Ọrụ m bụ ịjụ ajụjụ siri ike: A zụrụ AI na data sitere n'ụlọ ọgwụ Naịjirịa? Ọ na-arụ ọrụ nke ọma maka ụmụ nwanyị dịka ọ na-arụ maka ụmụ nwoke? Ọrụ m bụ ịbụ olu maka ikpe ziri ezi."
      }
    }
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
    multiplayerTitle: "Peer-to-Peer Practice",
    multiplayerDescription: "Practice AI ideas with your friend for collaborative session.",
    profileTitle: "Profile & Certificates",
    leaderboardTitle: "Leaderboard",
    leaderboardDescription: "See how you dey rank with other learners.",
    glossaryTitle: "AI Glossary",
    glossaryDescription: "Find meaning for key AI words.",
    podcastGeneratorTitle: "Podcast Generator",
    podcastGeneratorDescription: "Use AI make your own short audio show. Go from learner to creator!",
    careerExplorerTitle: "AI Career Explorer",
    careerExplorerDescription: "Discover future job opportunities for the world of AI.",
  },
  peerPractice: {
    title: "Peer-to-Peer Practice",
    waitingForPlayers: "Dey wait for other people...",
  },
  game: {
      title: "AI vs. Human",
      description: "You fit tell which proverb na AI write am?",
      difficulty: "Level",
      easy: "Easy Peasy",
      hard: "Hard",
      pointDescription: "Correct answer for AI vs Human game",
  },
  profile: {
      title: "Your Profile & Progress",
      learnerLevel: (level) => `Learner Level: ${level}`,
      points: "Points",
      feedbackButton: "Send Feedback",
      multiplayerStatsTitle: "Practice Stats",
      wins: "Wins",
      gamesPlayed: "Sessions Completed",
      certificateIssuedBy: (orgName) => `From ${orgName}`,
  },
  lesson: {
      submitAnswer: "Submit",
      yourAnswer: "Your answer...",
      readAloud: "Read Aloud",
      quizCorrect: (points) => `Correct! (+${points} points)`,
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
    backToDashboard: "Back to Dashboard",
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
    successDescription: "We don receive your feedback. We appreciate say you help us make AI Kasahorow better.",
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
    syncing: "Syncing your progress...",
    notAvailable: "This content no dey available offline.",
  },
  voice: {
    listening: "Dey listen...",
    voiceModeActive: "Voice mode dey active",
    navigatingTo: {
      dashboard: "Dey go dashboard.",
      profile: "Dey open your profile.",
      leaderboard: "Dey show leaderboard.",
      game: "Dey start AI versus Human game.",
      peerPractice: "Dey open peer-to-peer practice.",
      wallet: "Dey open your wallet.",
    },
    startingModule: (moduleName) => `Dey start module: ${moduleName}.`,
    openingSettings: "Dey open settings.",
    closingSettings: "Dey close settings.",
    loggingOut: "Dey log you out.",
  },
  glossary: {
    title: "AI Glossary",
    description: "Quick reference for all the key AI terms wey we use for the lessons.",
    searchPlaceholder: "Search for a term...",
    noResultsTitle: "No Terms Found",
    noResultsDescription: (term) => `We no fit find any terms wey match "${term}". Try another search.`,
  },
  podcastGenerator: {
    title: "AI Paddi's Podcast Studio",
    description: "Turn your ideas to audio. Become an AI Creator!",
    scriptLabel: "Your Podcast Script",
    scriptPlaceholder: "Write short script here. You fit explain AI concept, tell story, or share news from your community!",
    voiceLabel: "Choose a Voice",
    voices: {
        kore: "Deep, Clear Voice (Kore)",
        puck: "Friendly, Upbeat Voice (Puck)",
    },
    generateButton: "Generate Audio",
    generatingButton: "Dey create magic...",
    yourCreation: "Your Creation",
    errorMessage: "Oops! Something go wrong while we dey generate the audio. Abeg try again.",
  },
  careerExplorer: {
    title: "AI Career Explorer",
    description: "See how your AI skills fit create real opportunities for Nigeria and beyond.",
    whatTheyDo: "Wetin Dem Dey Do",
    skillsNeeded: "Skills Wey You Need",
    dayInTheLife: "One Day for their Life",
    relevantLessons: "Relevant Lessons",
    startLearning: "Start Learning",
    careers: {
      'agritech-specialist': {
        title: "AI for Agriculture Specialist",
        description: "Dey use AI help farmers improve crop yields and manage resources.",
        what_they_do: "Dem dey analyze data from drones and sensors to check crop health, predict weather, and recommend best time to plant and harvest. Their work dey help make farming more efficient and sustainable.",
        skills: ["Data Analysis", "Problem-Solving", "Knowledge of Agric", "Communication"],
        day_in_the_life: "My day no dey start for office, but to dey check drone footage from one farm for Kano. The AI go flag one section of maize with potential signs of nutrient deficiency. I go then work with the local farm extension officer via WhatsApp, send them the coordinates and recommendation."
      },
      'fintech-ml-engineer': {
        title: "Fintech ML Engineer",
        description: "Dey build smart financial tools, from fraud detection to loan applications.",
        what_they_do: "Dem dey create machine learning models wey fit detect fraudulent transactions sharp-sharp, assess loan risk for small business owners, or create personal savings plans for users of banking app.",
        skills: ["Machine Learning", "Programming (Python)", "Statistics", "Financial Knowledge"],
        day_in_the_life: "Today, our AI model flag a series of unusual transactions wey dey try drain one account. We stop am in milliseconds. This afternoon, I dey train new model to help market traders for Lagos get small loans faster by analyzing their sales history instead of demanding impossible collateral."
      },
      'ai-content-creator': {
        title: "AI Tutor & Content Creator",
        description: "Dey use generative AI create engaging educational materials and stories.",
        what_they_do: "Dem dey use AI tools generate scripts for educational videos, create illustrations for children's books for local languages, or build simple chatbots wey fit help students practice new subjects.",
        skills: ["Creativity", "Prompt Engineering", "Writing & Storytelling", "Teaching Skills"],
        day_in_the_life: "I dey work with one teacher for Port Harcourt to create simple, illustrated science lesson about water cycle. I use AI image generator create beautiful pictures and language model to simplify the text. We dey make learning materials wey look amazing and easy to understand for any student."
      },
      'ai-ethicist': {
        title: "AI Ethicist",
        description: "Dey make sure say AI systems dey built and used fairly and responsibly.",
        what_they_do: "Dem dey work with tech companies to test AI models for bias, making sure say dem work equally well for people of all backgrounds. Dem dey help create guidelines to protect user data and make sure say the AI's decisions dey transparent and fair.",
        skills: ["Critical Thinking", "Ethics", "Communication", "Understanding of AI Bias"],
        day_in_the_life: "One team dey build AI to help doctors diagnose illnesses. My job na to ask the tough questions: Na data from Nigerian hospitals dem use train the AI? E dey work as well for women as e dey for men? My role na to be the voice for fairness."
      }
    }
  },
  levels: {
    [LearningPath.Beginner]: 'Beginner',
    [LearningPath.Intermediate]: 'Intermediate',
    [LearningPath.Advanced]: 'Advanced',
  },
  curriculum: {
    'what-is-ai': { title: 'Wetin be AI?', description: 'Learn the basic definition of AI.', lessonContent: englishTranslations.curriculum['what-is-ai'].lessonContent },
    'how-ai-works': { title: 'How AI dey Work?', description: 'Discover how machines dey learn from data.', lessonContent: englishTranslations.curriculum['how-ai-works'].lessonContent },
    'ai-in-daily-life': { title: 'AI for Daily Life', description: 'See examples of AI around you.', lessonContent: englishTranslations.curriculum['ai-in-daily-life'].lessonContent },
    'risks-and-bias': { title: 'Risks & Bias for AI', description: 'Understand the challenges of AI.', lessonContent: englishTranslations.curriculum['risks-and-bias'].lessonContent },
    'ai-and-jobs': { title: 'AI and The Future of Jobs', description: 'See how AI dey change work.', lessonContent: englishTranslations.curriculum['ai-and-jobs'].lessonContent },
  },
  tooltips: {},
  badges: {}
};

// FIX: Add `translations` object to be exported and used by the app. It merges the partial translations with the English base.
export const translations: Record<Language, Translation> = {
    [Language.English]: englishTranslations,
    [Language.Hausa]: mergeDeep(JSON.parse(JSON.stringify(englishTranslations)), hausaPartial),
    [Language.Yoruba]: mergeDeep(JSON.parse(JSON.stringify(englishTranslations)), yorubaPartial),
    [Language.Igbo]: mergeDeep(JSON.parse(JSON.stringify(englishTranslations)), igboPartial),
    [Language.Pidgin]: mergeDeep(JSON.parse(JSON.stringify(englishTranslations)), pidginPartial),
    [Language.Swahili]: mergeDeep(JSON.parse(JSON.stringify(englishTranslations)), swahiliPartial),
    [Language.Amharic]: englishTranslations,
    [Language.Zulu]: englishTranslations,
    [Language.Shona]: englishTranslations,
    [Language.Somali]: englishTranslations,
};

// FIX: Add and export `useTranslations` hook to provide translations to components based on the current app language.
export const useTranslations = (): Translation => {
  const context = useContext(AppContext);
  const lang = context?.language || Language.English;
  return translations[lang] || englishTranslations;
};