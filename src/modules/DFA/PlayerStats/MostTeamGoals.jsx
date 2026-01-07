

export default function TeamGoalsStructure(players_data){

  if(players_data != null && players_data.length > 0){




    // Calculate total goals for each team
    let teamGoals =   players_data.filter(item => item.league === 'DFA_Premier_League_Men').reduce((goalsByTeam, player) => {
      goalsByTeam[player.team] = (goalsByTeam[player.team] || 0) + player.Goals;
      return goalsByTeam;
    }, {});
  
    // Convert teamGoals to an array of objects with teamName and totalGoals keys
    teamGoals = Object.keys(teamGoals).map(teamName => ({ teamName, totalGoals: teamGoals[teamName] })).sort(Sort);
    
  
    return teamGoals
  }


}

function Sort(a, b){

  return b.totalGoals - a.totalGoals
}