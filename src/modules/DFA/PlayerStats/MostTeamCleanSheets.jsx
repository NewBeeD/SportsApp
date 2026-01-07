

export default function TeamCleanSheets(players_data){


  // Calculate total clean for each team
  let teamCleanSheets = players_data.filter(player_league => player_league.league === 'DFA_Premier_League_Men').reduce((cleanSheetByTeam, player) => {
    cleanSheetByTeam[player.team] = (cleanSheetByTeam[player.team] || 0) + player.Clean_Sheets;
    return cleanSheetByTeam;
  }, {});

  // Convert teamCleanSheets to an array of objects with teamName and totalGoals keys
  teamCleanSheets = Object.keys(teamCleanSheets).map(teamName => ({ teamName, totalCleanSheets: teamCleanSheets[teamName] })).sort(Sort);

  return teamCleanSheets
}

function Sort(a, b){

  return b.totalGoals - a.totalGoals
}