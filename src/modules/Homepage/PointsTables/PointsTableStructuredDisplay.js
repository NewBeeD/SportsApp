



export default function PointsTableStructuredDisplay(data){

  let points_data = data.data

  // Function to organize teams in proper order



  let premierTable = points_data.map(item => {

    let teamPoints = {}

    teamPoints['Team_Abbrev'] = TeamNameChange(item.attributes['dfa_team'].data.attributes['Name'])
    teamPoints['Team'] = item.attributes['dfa_team'].data.attributes['Name']
    // teamPoints['Team'] = item.attributes['dfa_team'].data.attributes['Name']
    teamPoints['Played'] = item.attributes['Played']
    teamPoints['Group'] = item.attributes['Group']??'None';
    teamPoints['Won'] = item.attributes['Won']
    teamPoints['Drawn'] = item.attributes['Drawn']
    teamPoints['Lost'] = item.attributes['Lost']
    teamPoints['GF'] = item.attributes['GF']
    teamPoints['GA'] = item.attributes['GA']
    teamPoints['GD'] = findGoalDifference(item)
    teamPoints['Points'] = findPoints(item)
    teamPoints['ID'] = item.attributes['dfa_team'].data.id

    return teamPoints    
  })


  premierTable = sortTablePoints(premierTable)

  
  
  return premierTable
}

function findGoalDifference(team){

  let GF = Number(team.attributes['GF']);
  let GA = Number(team.attributes['GA']);
  let GD = GF - GA;
  return GD
}

function findPoints(team){

  let gamesWon = Number(team.attributes['Won']);
  let gamesDrawn = Number(team.attributes['Drawn']);
  let totalPoints = 3 * gamesWon + gamesDrawn;

  return totalPoints;
}

function sortTablePoints(data){

  let sortedData = data.sort(SortPoints)
  return sortedData;
}



function SortPoints(a, b) {

  if (a.Points !== b.Points) {
    return b.Points - a.Points; // Sort by points descending
} else {
    // If points are equal, sort by goal difference
    return b.GD - a.GD;
}
   
}

function TeamNameChange(team_data_point){

  switch(team_data_point){

    case 'Blue Waters Bath Estate FC':
      return 'Bathestate FC';

    case 'Bombers FC':
      return 'Bombers FC';
    
    case 'CCCUL Dublanc FC':
      return 'Dublanc FC';

    case 'Connect 767 East Central FC':
      return 'East Central FC';
    
    case 'Mahaut Soca Strikers FC':
      return 'Mahaut FC';

    case 'Petro Caribe Point Michel FC':
      return 'PointMichel FC';
    
    case 'Promex Harlem FC':
      return 'Harlem FC';

    case 'Sagicor South East FC':
      return 'South East FC';
    
    case 'Tranquility Beach Middleham United FC':
      return 'Middleham FC';

    case 'Valvoline We United FC':
    return 'We United FC';
    
    default:
      return team_data_point;

  }
}

