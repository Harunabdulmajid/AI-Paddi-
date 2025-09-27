import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useTranslations } from '../i18n';
import { Trophy, Award } from 'lucide-react';
import { User } from '../types';

// Mock data for now, representing other learners in the community
const mockLeaderboardData: Omit<User, 'level' | 'completedModules'>[] = [
  { name: 'Amina', points: 250 },
  { name: 'Kwame', points: 190 },
  { name: 'Fatou', points: 175 },
  { name: 'Chinedu', points: 150 },
  { name: 'Zola', points: 120 },
  { name: 'Lethabo', points: 95 },
  { name: 'Moussa', points: 70 },
];

const getRankColor = (rank: number) => {
    switch(rank) {
        case 1: return 'text-amber-400'; // Gold
        case 2: return 'text-neutral-400'; // Silver
        case 3: return 'text-amber-600'; // Bronze
        default: return 'text-neutral-500';
    }
}

export const Leaderboard: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Leaderboard must be used within an AppProvider");
    const { user } = context;
    const t = useTranslations();

    const leaderboard = useMemo(() => {
        // Combine mock data with the current user
        const combinedData = [...mockLeaderboardData, { name: user.name, points: user.points }];
        // Remove duplicates - keeping the one with higher score if names are same (current user might be in mock)
        const uniqueData = Array.from(new Map(combinedData.map(item => [item.name, item])).values());
        // Sort by points in descending order
        return uniqueData.sort((a, b) => b.points - a.points);
    }, [user.name, user.points]);
    
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-4xl font-extrabold text-neutral-800 mb-2">{t.leaderboard.title}</h2>
            <p className="text-neutral-500 mb-8 text-lg">{t.leaderboard.description}</p>
            
            <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
                <div className="space-y-3">
                    {leaderboard.map((player, index) => {
                        const rank = index + 1;
                        const isCurrentUser = player.name === user.name && player.points === user.points;
                        
                        return (
                            <div key={`${player.name}-${rank}`} className={`flex items-center p-4 rounded-xl transition-all ${isCurrentUser ? 'bg-primary/10 ring-2 ring-primary' : 'bg-neutral-50'}`}>
                                <div className="flex items-center justify-center w-16">
                                    {rank <= 3 ? (
                                        <Trophy size={32} className={getRankColor(rank)} strokeWidth={2.5}/>
                                    ) : (
                                        <span className="text-xl font-bold text-neutral-500 w-8 text-center">{rank}</span>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className={`text-lg font-bold ${isCurrentUser ? 'text-primary' : 'text-neutral-800'}`}>
                                        {player.name} {isCurrentUser && `(${t.leaderboard.you})`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-lg font-bold text-accent">
                                    <Award size={20} />
                                    <span>{player.points}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};