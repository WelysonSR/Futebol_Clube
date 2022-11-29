import { ILeaderBoard, ILeaderBoardAway, ILeaderBoardHome } from '../interfaces/ILeaderBoard';

const leader = (match: ILeaderBoardHome[]) => {
  const goalsFavor = match.reduce((acc: number, mat: ILeaderBoardHome) =>
    acc + mat.awayTeamGoals, 0);

  const goalsOwn = match.reduce((acc: number, mat: ILeaderBoardHome) =>
    acc + mat.homeTeamGoals, 0);

  const goalsBalance = goalsFavor - goalsOwn;

  return { goalsFavor, goalsOwn, goalsBalance };
};

const calculateMatch = (matches: ILeaderBoardHome[]) => {
  let totalVictories = 0;
  let totalLosses = 0;
  let totalDraws = 0;
  let totalPoints = 0;
  matches.forEach((match: ILeaderBoardHome) => {
    if (match.awayTeamGoals > match.homeTeamGoals) {
      totalVictories += 1; totalPoints += 3;
    }
    if (match.homeTeamGoals === match.awayTeamGoals) {
      totalDraws += 1; totalPoints += 1;
    }
    if (match.homeTeamGoals > match.awayTeamGoals) {
      totalLosses += 1;
    }
  });
  return { totalVictories, totalLosses, totalDraws, totalPoints };
};

const totalEfficiency = (P:number, J: number) => {
  const efficiency = (P / (J * 3)) * 100;
  return efficiency;
};

const boardAway = (home: ILeaderBoardAway[]) => {
  const newHome = home.map((t) => {
    const name = t.teamName;
    const { totalVictories, totalLosses, totalDraws, totalPoints } = calculateMatch(t.teamAway);

    const totalGames = t.teamAway.length;
    const goalsBalance = leader(t.teamAway);
    const efficiency = totalEfficiency(totalPoints, totalGames);
    return {
      name,
      totalPoints,
      totalGames,
      totalVictories,
      totalDraws,
      totalLosses,
      ...goalsBalance,
      efficiency: efficiency.toFixed(2),
    };
  });
  return newHome;
};

const sortLeaderboardAway = (leaderboard: ILeaderBoard[]) => {
  const sortedLeaderboard = leaderboard.sort((a: ILeaderBoard, b: ILeaderBoard) => {
    if (a.totalPoints < b.totalPoints) return 1;
    if (a.totalPoints > b.totalPoints) return -1;
    if (a.totalVictories < b.totalVictories) return 1;
    if (a.totalVictories > b.totalVictories) return -1;
    if (a.goalsBalance < b.goalsBalance) return 1;
    if (a.goalsBalance > b.goalsBalance) return -1;
    if (a.goalsFavor < b.goalsFavor) return 1;
    if (a.goalsFavor > b.goalsFavor) return -1;
    if (a.goalsOwn < b.goalsOwn) return 1;
    if (a.goalsOwn > b.goalsOwn) return -1;
    return 0;
  });
  return sortedLeaderboard;
};

export { boardAway, sortLeaderboardAway };
