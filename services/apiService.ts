import { User, LearningPath, FeedbackType, Language, GameSession, Player, Wallet, Transaction } from '../types';
import { CURRICULUM_MODULES } from '../constants';
// We import the english translations directly to act as a master question bank for consistency
import { englishTranslations } from '../i18n'; 

// Use localStorage to simulate a persistent database
const DB_KEY_USERS = 'alk_users_by_email';
const DB_KEY_GAMES = 'alk_games_by_code';

const SIMULATED_DELAY = 300; // ms
const DAILY_TRANSFER_LIMIT = 200;

// --- Helper Functions ---
const readDb = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const writeDb = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const initializeDefaultWallet = (points: number): Wallet => ({
    balance: points,
    transactions: [],
    dailyTransfer: { date: getTodayDateString(), amount: 0 },
});

// Initialize with some mock data if empty
const initializeDb = () => {
    let users = readDb<Record<string, User>>(DB_KEY_USERS, {});
    if (Object.keys(users).length === 0) {
        const mockUsers: Omit<User, 'wallet'>[] = [
            { id: 'user-amina', googleId: 'gid-amina', email: 'amina@example.com', name: 'Amina', points: 250, level: LearningPath.Advanced, completedModules: ['what-is-ai', 'how-ai-works', 'ai-in-daily-life', 'risks-and-bias', 'ai-and-jobs'], badges: ['first-step', 'ai-graduate', 'point-pioneer'], multiplayerStats: { wins: 0, gamesPlayed: 0 }, lastLoginDate: '', loginStreak: 0, certificateLevel: 'basic', theme: 'default', avatarId: 'avatar-01', unlockedVoices: [], tutorTokens: 2, quizRewinds: 5, unlockedBanners: [], unlockedThemes: ['default'] },
            { id: 'user-kwame', googleId: 'gid-kwame', email: 'kwame@example.com', name: 'Kwame', points: 190, level: LearningPath.Intermediate, completedModules: ['what-is-ai', 'how-ai-works', 'ai-in-daily-life'], badges: ['first-step', 'point-pioneer'], multiplayerStats: { wins: 0, gamesPlayed: 0 }, lastLoginDate: '', loginStreak: 0, certificateLevel: 'basic', theme: 'default', avatarId: 'avatar-01', unlockedVoices: [], tutorTokens: 0, quizRewinds: 1, unlockedBanners: [], unlockedThemes: ['default'] },
            { id: 'user-fatou', googleId: 'gid-fatou', email: 'fatou@example.com', name: 'Fatou', points: 175, level: LearningPath.Intermediate, completedModules: ['what-is-ai', 'how-ai-works'], badges: ['first-step', 'point-pioneer'], multiplayerStats: { wins: 0, gamesPlayed: 0 }, lastLoginDate: '', loginStreak: 0, certificateLevel: 'basic', theme: 'default', avatarId: 'avatar-01', unlockedVoices: [], tutorTokens: 0, quizRewinds: 0, unlockedBanners: [], unlockedThemes: ['default'] },
            { id: 'user-chinedu', googleId: 'gid-chinedu', email: 'chinedu@example.com', name: 'Chinedu', points: 150, level: LearningPath.Beginner, completedModules: ['what-is-ai', 'how-ai-works'], badges: ['first-step', 'point-pioneer'], multiplayerStats: { wins: 0, gamesPlayed: 0 }, lastLoginDate: '', loginStreak: 0, certificateLevel: 'basic', theme: 'default', avatarId: 'avatar-01', unlockedVoices: [], tutorTokens: 0, quizRewinds: 0, unlockedBanners: [], unlockedThemes: ['default'] },
            { id: 'user-zola', googleId: 'gid-zola', email: 'zola@example.com', name: 'Zola', points: 120, level: LearningPath.Beginner, completedModules: ['what-is-ai'], badges: ['first-step', 'point-pioneer'], multiplayerStats: { wins: 0, gamesPlayed: 0 }, lastLoginDate: '', loginStreak: 0, certificateLevel: 'basic', theme: 'default', avatarId: 'avatar-01', unlockedVoices: [], tutorTokens: 0, quizRewinds: 0, unlockedBanners: [], unlockedThemes: ['default'] },
        ];
        const usersDb = mockUsers.reduce((acc, user) => {
            acc[user.email] = { ...user, wallet: initializeDefaultWallet(user.points) };
            return acc;
        }, {} as Record<string, User>);
        writeDb(DB_KEY_USERS, usersDb);
    }
};

initializeDb();

// --- API Service ---
export const apiService = {
  async getUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = readDb<Record<string, User>>(DB_KEY_USERS, {});
        resolve(users[email.toLowerCase()] || null);
      }, SIMULATED_DELAY);
    });
  },

  async handleUserLogin(email: string): Promise<{ user: User, newTransactions: Transaction[] }> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const users = readDb<Record<string, User>>(DB_KEY_USERS, {});
        let user = users[email.toLowerCase()];
        if (!user) return reject(new Error("User not found"));

        let newTransactions: Transaction[] = [];

        // --- Backward compatibility & Initialization for old users ---
        if (!user.wallet) user.wallet = initializeDefaultWallet(user.points);
        if (!user.lastLoginDate) user.lastLoginDate = '';
        if (!user.loginStreak) user.loginStreak = 0;
        if (!user.certificateLevel) user.certificateLevel = 'basic';
        if (!user.theme) user.theme = 'default';
        if (!user.avatarId) user.avatarId = 'avatar-01';
        if (!user.unlockedVoices) user.unlockedVoices = [];
        if (user.tutorTokens === undefined) user.tutorTokens = 0;
        if (user.quizRewinds === undefined) user.quizRewinds = 0;
        if (!user.unlockedBanners) user.unlockedBanners = [];
        if (!user.unlockedThemes) user.unlockedThemes = ['default'];
        // --- End Initialization ---

        const today = getTodayDateString();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        // --- Daily Login Streak Logic ---
        if (user.lastLoginDate !== today) {
          let newStreak = 1;
          if (user.lastLoginDate === yesterday) {
            newStreak = user.loginStreak + 1;
          }
          
          const pointsEarned = 10;
          const streakTransaction: Transaction = {
              id: `txn-${Date.now()}`,
              type: 'earn',
              description: `Daily login streak (${newStreak} day${newStreak > 1 ? 's' : ''})`,
              amount: pointsEarned,
              timestamp: Date.now(),
          };

          user.points += pointsEarned;
          user.wallet.balance = user.points;
          user.wallet.transactions.unshift(streakTransaction);
          user.lastLoginDate = today;
          user.loginStreak = newStreak;
          newTransactions.push(streakTransaction);
        }
        
        // --- Reset daily transfer limit if it's a new day ---
        if (user.wallet.dailyTransfer.date !== today) {
            user.wallet.dailyTransfer = { date: today, amount: 0 };
        }
        
        // Update user in DB with login changes
        users[email.toLowerCase()] = user;
        writeDb(DB_KEY_USERS, users);
        
        resolve({ user, newTransactions });
      }, SIMULATED_DELAY);
    });
  },

  async createUser(details: { name: string, email: string, level: LearningPath, googleId: string }): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = readDb<Record<string, User>>(DB_KEY_USERS, {});
        const lowercasedEmail = details.email.toLowerCase();
        
        if (users[lowercasedEmail]) {
            return reject(new Error("User with this email already exists."));
        }

        const userId = `user-${Date.now()}`;
        const newUser: User = {
          id: userId,
          googleId: details.googleId,
          email: lowercasedEmail,
          name: details.name,
          level: details.level,
          points: 0,
          completedModules: [],
          badges: [],
          multiplayerStats: { wins: 0, gamesPlayed: 0 },
          wallet: initializeDefaultWallet(0),
          lastLoginDate: getTodayDateString(),
          loginStreak: 1,
          certificateLevel: 'basic',
          theme: 'default',
          avatarId: 'avatar-01',
          unlockedVoices: [],
          tutorTokens: 0,
          quizRewinds: 0,
          unlockedBanners: [],
          unlockedThemes: ['default'],
        };
        users[lowercasedEmail] = newUser;
        writeDb(DB_KEY_USERS, users);
        resolve(newUser);
      }, SIMULATED_DELAY);
    });
  },

  async updateUser(email: string, updates: Partial<Omit<User, 'id' | 'email' | 'googleId'>>): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = readDb<Record<string, User>>(DB_KEY_USERS, {});
        const lowercasedEmail = email.toLowerCase();
        let user = users[lowercasedEmail];
        if (user) {
          // Ensure arrays are merged correctly and uniquely
          if (updates.badges) updates.badges = [...new Set([...user.badges, ...updates.badges])];
          if (updates.completedModules) updates.completedModules = [...new Set([...user.completedModules, ...updates.completedModules])];
          if (updates.unlockedVoices) updates.unlockedVoices = [...new Set([...user.unlockedVoices, ...updates.unlockedVoices])];
          if (updates.unlockedBanners) updates.unlockedBanners = [...new Set([...user.unlockedBanners, ...updates.unlockedBanners])];
          if (updates.unlockedThemes) updates.unlockedThemes = [...new Set([...user.unlockedThemes, ...updates.unlockedThemes])];
          
          user = { ...user, ...updates };
          
          if(updates.wallet) {
              user.wallet = { ...user.wallet, ...updates.wallet };
              user.points = user.wallet.balance; // Sync points with wallet balance
          }
          
          users[lowercasedEmail] = user;
          writeDb(DB_KEY_USERS, users);
          resolve(user);
        } else {
          resolve(null);
        }
      }, SIMULATED_DELAY / 2); // Make updates faster
    });
  },

  async sendPoints(senderEmail: string, recipientEmail: string, amount: number, message: string): Promise<{ sender: User, recipient: User }> {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const users = readDb<Record<string, User>>(DB_KEY_USERS, {});
              const sender = users[senderEmail.toLowerCase()];
              const recipient = users[recipientEmail.toLowerCase()];

              if (!sender) return reject(new Error("Sender not found."));
              if (!recipient) return reject(new Error("Recipient not found."));
              if (sender.email === recipient.email) return reject(new Error("You cannot send points to yourself."));
              if (amount <= 0) return reject(new Error("Amount must be positive."));
              if (sender.wallet.balance < amount) return reject(new Error("Insufficient points."));

              const today = getTodayDateString();
              if (sender.wallet.dailyTransfer.date !== today) {
                  sender.wallet.dailyTransfer = { date: today, amount: 0 };
              }
              if (sender.wallet.dailyTransfer.amount + amount > DAILY_TRANSFER_LIMIT) {
                  return reject(new Error(`Daily transfer limit of ${DAILY_TRANSFER_LIMIT} points exceeded.`));
              }

              // Perform transaction
              sender.wallet.balance -= amount;
              sender.points = sender.wallet.balance;
              sender.wallet.dailyTransfer.amount += amount;
              sender.wallet.transactions.unshift({
                  id: `txn-${Date.now()}`,
                  type: 'send',
                  description: `To ${recipient.name}${message ? `: "${message}"` : ''}`,
                  amount,
                  timestamp: Date.now(),
                  to: recipient.name,
              });
              
              recipient.wallet.balance += amount;
              recipient.points = recipient.wallet.balance;
              recipient.wallet.transactions.unshift({
                  id: `txn-${Date.now() + 1}`,
                  type: 'receive',
                  description: `From ${sender.name}${message ? `: "${message}"` : ''}`,
                  amount,
                  timestamp: Date.now(),
                  from: sender.name,
              });

              writeDb(DB_KEY_USERS, users);
              resolve({ sender, recipient });
          }, SIMULATED_DELAY * 2);
      });
  },

  async redeemItem(userEmail: string, itemId: string, cost: number, payload: any): Promise<User> {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const users = readDb<Record<string, User>>(DB_KEY_USERS, {});
              const user = users[userEmail.toLowerCase()];

              if (!user) return reject(new Error("User not found."));
              if (user.wallet.balance < cost) return reject(new Error("Insufficient points."));

              // Apply purchase effect
              if (payload.badgeId) user.badges.push(payload.badgeId);
              if (payload.certificateLevel) user.certificateLevel = payload.certificateLevel;
              
              if (payload.unlockTheme) {
                if (!user.unlockedThemes) user.unlockedThemes = ['default'];
                user.unlockedThemes.push(payload.unlockTheme);
              }
              if (payload.addTutorTokens) {
                  user.tutorTokens = (user.tutorTokens || 0) + payload.addTutorTokens;
              }
              if (payload.addQuizRewinds) {
                  user.quizRewinds = (user.quizRewinds || 0) + payload.addQuizRewinds;
              }
              if (payload.unlockBanner) {
                  if (!user.unlockedBanners) user.unlockedBanners = [];
                  user.unlockedBanners.push(payload.unlockBanner);
              }
              if (payload.unlockVoice) {
                  if (!user.unlockedVoices) user.unlockedVoices = [];
                  user.unlockedVoices.push(payload.unlockVoice);
              }
              
              // Perform transaction
              user.wallet.balance -= cost;
              user.points = user.wallet.balance;
              user.wallet.transactions.unshift({
                  id: `txn-${Date.now()}`,
                  type: 'spend',
                  description: `Purchased item: ${itemId}`,
                  amount: cost,
                  timestamp: Date.now(),
              });
              
              writeDb(DB_KEY_USERS, users);
              resolve(user);
          }, SIMULATED_DELAY);
      });
  },
  
  async getLeaderboard(): Promise<Array<Pick<User, 'name' | 'points'>>> {
     return new Promise((resolve) => {
        setTimeout(() => {
            const users = readDb<Record<string, User>>(DB_KEY_USERS, {});
            const leaderboard = Object.values(users)
                .map(({ name, points }) => ({ name, points }))
                .sort((a, b) => b.points - a.points);
            resolve(leaderboard);
        }, SIMULATED_DELAY);
     });
  },

  async submitFeedback(userEmail: string, type: FeedbackType, message: string): Promise<{ success: boolean }> {
      return new Promise((resolve) => {
          setTimeout(() => {
              console.log("--- Feedback Submitted ---");
              console.log("User:", userEmail);
              console.log("Type:", type);
              console.log("Message:", message);
              console.log("--------------------------");
              resolve({ success: true });
          }, SIMULATED_DELAY * 2);
      });
  },

  // --- Multiplayer API (Remains Unchanged) ---
  async createGameSession(host: User, language: Language): Promise<GameSession> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const games = readDb<Record<string, GameSession>>(DB_KEY_GAMES, {});
        const gameCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        
        const hostPlayer: Player = {
          id: host.id,
          name: host.name,
          score: 0,
          progressIndex: 0,
          language: language,
          streak: 0,
        };

        const newSession: GameSession = {
          code: gameCode,
          hostId: host.id,
          status: 'waiting',
          players: [hostPlayer],
          questions: [], // Questions will be added when the game starts
          createdAt: Date.now(),
          currentQuestionIndex: 0,
        };

        games[gameCode] = newSession;
        writeDb(DB_KEY_GAMES, games);
        resolve(newSession);
      }, SIMULATED_DELAY);
    });
  },

  async joinGameSession(gameCode: string, user: User, language: Language): Promise<GameSession> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const games = readDb<Record<string, GameSession>>(DB_KEY_GAMES, {});
            const session = games[gameCode];

            if (!session) return reject(new Error('Game not found.'));
            if (session.status !== 'waiting') return reject(new Error('Game has already started.'));
            if (session.players.length >= 10) return reject(new Error('Game is full.'));
            if (session.players.some(p => p.id === user.id)) { // Allow re-joining
                return resolve(session);
            }

            const newPlayer: Player = {
                id: user.id,
                name: user.name,
                score: 0,
                progressIndex: 0,
                language: language,
                streak: 0,
            };

            session.players.push(newPlayer);
            writeDb(DB_KEY_GAMES, games);
            resolve(session);
        }, SIMULATED_DELAY);
    });
  },

  async getGameSession(gameCode: string): Promise<GameSession> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            const games = readDb<Record<string, GameSession>>(DB_KEY_GAMES, {});
            const session = games[gameCode];
            if (session) {
                resolve(session);
            } else {
                reject(new Error('Game not found.'));
            }
        }, SIMULATED_DELAY / 3); // Faster polling
    });
  },

  async startGameSession(gameCode: string, hostId: string): Promise<GameSession> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            const games = readDb<Record<string, GameSession>>(DB_KEY_GAMES, {});
            const session = games[gameCode];
            
            if (!session) return reject(new Error('Game not found.'));
            if (session.hostId !== hostId) return reject(new Error('Only the host can start the game.'));
            if (session.status !== 'waiting') return reject(new Error('Game already in progress.'));
            
            // --- Generate Questions ---
            const allQuestions = CURRICULUM_MODULES.flatMap(module => {
                const moduleQuestions = englishTranslations.curriculum[module.id].lessonContent.quiz.questions;
                const multiplayerQuestions = [];
                for (let i = 0; i < moduleQuestions.length; i++) {
                    if (moduleQuestions[i].type === 'multiple-choice') {
                        multiplayerQuestions.push({
                            id: `${module.id}-q${i}`,
                            moduleId: module.id,
                            questionIndexInModule: i,
                        });
                    }
                }
                return multiplayerQuestions;
            });
            
            // Select 5 random questions
            const shuffled = allQuestions.sort(() => 0.5 - Math.random());
            session.questions = shuffled.slice(0, 5);
            session.status = 'in-progress';
            session.currentQuestionIndex = 0;
            session.players.forEach(p => p.progressIndex = 0);
            // ---

            writeDb(DB_KEY_GAMES, games);
            resolve(session);
        }, SIMULATED_DELAY);
      });
  },

  async submitAnswer(gameCode: string, userId: string, questionId: string, answerIndex: number, timeTakenMs: number): Promise<GameSession> {
     return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const games = readDb<Record<string, GameSession>>(DB_KEY_GAMES, {});
            const session = games[gameCode];
            
            if (!session) return reject(new Error('Game not found.'));
            
            const player = session.players.find(p => p.id === userId);
            const question = session.questions[session.currentQuestionIndex];

            if (!player || !question || player.progressIndex > session.currentQuestionIndex) {
                 // Player has already answered this question, probably a duplicate request
                return resolve(session);
            }
            if(question.id !== questionId) {
                return reject(new Error('Question mismatch.'));
            }

            const questionContent = englishTranslations.curriculum[question.moduleId].lessonContent.quiz.questions[question.questionIndexInModule];
            const isCorrect = questionContent.correctAnswerIndex === answerIndex;

            if (isCorrect) {
                const timeBonus = Math.max(0, 10 - Math.floor(timeTakenMs / 1000)); // Max 10 bonus points
                const streakBonus = player.streak >= 2 ? 5 : 0;
                player.score += 10 + timeBonus + streakBonus;
                player.streak += 1;
            } else {
                player.streak = 0;
            }

            player.progressIndex = session.currentQuestionIndex + 1;

            // Check if all players have answered the current question
            const allPlayersAnswered = session.players.every(p => p.progressIndex > session.currentQuestionIndex);
            
            if (allPlayersAnswered) {
                const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

                if (isLastQuestion) {
                    session.status = 'finished';
                    
                    // Update user profiles
                    const winner = session.players.sort((a,b) => b.score - a.score)[0];
                    for (const p of session.players) {
                        const usersInDb = readDb<Record<string, User>>(DB_KEY_USERS, {});
                        const userFromDb = Object.values(usersInDb).find(u => u.id === p.id);
                        if (userFromDb) {
                            const updates: Partial<Omit<User, 'id' | 'email' | 'googleId'>> = {};

                            // Calculate new stats
                            const newStats = {
                                wins: userFromDb.multiplayerStats.wins + (p.id === winner.id ? 1 : 0),
                                gamesPlayed: userFromDb.multiplayerStats.gamesPlayed + 1,
                            };
                            updates.multiplayerStats = newStats;

                            // Calculate new points
                            updates.points = userFromDb.points + p.score;
                            
                            // Calculate new badges
                            const newBadges = [...userFromDb.badges];
                            if (p.id === winner.id && !newBadges.includes('first-win')) {
                               newBadges.push('first-win');
                            }
                            if (newStats.gamesPlayed >= 10 && !newBadges.includes('multiplayer-maestro')) {
                               newBadges.push('multiplayer-maestro');
                            }
                            if (newBadges.length > userFromDb.badges.length) {
                               updates.badges = newBadges;
                            }

                            // Perform a single, consolidated update for the player
                            await apiService.updateUser(userFromDb.email, updates);
                        }
                    }
                } else {
                     session.currentQuestionIndex += 1;
                }
            }

            writeDb(DB_KEY_GAMES, games);
            resolve(session);

        }, SIMULATED_DELAY / 2);
     });
  }
};