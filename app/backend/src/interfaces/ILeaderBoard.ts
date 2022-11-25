export interface ILeaderBoardHome {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

export interface ILeaderBoardHomeAway {
  id: number,
  teamName: string,
  teamHome: ILeaderBoardHome[],
}

export interface ILeaderBoardAway {
  id: number,
  teamName: string,
  teamAway: ILeaderBoardHome[],
}

export interface ILeaderBoard {
  name:string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string,
}

export interface ILeader {
  id: number,
  teamName: string,
  teamAway: ILeaderBoardHome[],
  teamHome: ILeaderBoardHome[],
  name:string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string,
}
