

// export default function SinglePlayerDisplay(data){

//   let player = {};


//   player['id'] = data.id
//   player['FirstName'] = data.attributes['First_Name']
//   player['Last_Name'] = data.attributes['Last_Name']
//   player['BirthDate'] = data.attributes['Birth_Date']
//   player['Age'] = data.attributes['Age']
//   player['Gender'] = data.attributes['Gender']
//   player['Position'] = data.attributes['Position']
//   player['Appearances'] = data.attributes['Appearances']
//   player['Goals'] = data.attributes['Goals']
//   player['Assists'] = data.attributes['Assists']
//   player['YellowCards'] = data.attributes['Yellow_Cards']
//   player['RedCards'] = data.attributes['Red_Cards']
//   player['Foot'] = data.attributes['Foot']
//   player['Current_Team'] = data.attributes['dfa_team'].data.attributes['Name'] ?? 'Null'
//   player['League'] = leagueNameChange(data.attributes['all_league'].data)
//   player['url'] = data.attributes['Profile_Pic'].data.attributes.formats['small']['url']
  
//   return player
// }


// function leagueNameChange(leagueName){

//   if(leagueName == null){return 'Dsport'}

//   switch(leagueName.attributes['name']){

//       case 'DFA_Division_One':     
//       case 'DFA_Women':
//       case 'DFA_Premier_League_Men':
//       case 'President Cup':
//         return 'DFA';
      
//       case 'DABA_Division_One':
//       case 'DABA_Premier_League_One':
//       case 'DABA_Women':
//         return 'DABA';

//       case 'DAVA_MEN':
//       case 'DAVA_WOMEN':
//           return 'DAVA';
      
//       case 'DNA_Men':
//       case 'DNA_Women':
//         return 'DNA';

//       case null:
//         return 'DSport';
      
//       default:
//         return '';

//     }
// }





const LEAGUE_MAPPING = {
  'DFA_Division_One': 'DFA',
  'DFA_Women': 'DFA',
  'DFA_Premier_League_Men': 'DFA',
  'President Cup': 'DFA',
  'DABA_Division_One': 'DABA',
  'DABA_Premier_League_One': 'DABA',
  'DABA_Women': 'DABA',
  'DAVA_MEN': 'DAVA',
  'DAVA_WOMEN': 'DAVA',
  'DNA_Men': 'DNA',
  'DNA_Women': 'DNA'
};

export default function SinglePlayerDisplay(data) {
  const attr = data.attributes;
  const dfaTeam = attr.dfa_team?.data?.attributes;
  const leagueData = attr.all_league?.data;
  
  // One-pass construction with cached lookups
  return {
    id: data.id,
    FirstName: attr.First_Name,
    Last_Name: attr.Last_Name,
    BirthDate: attr.Birth_Date,
    Age: attr.Age,
    Gender: attr.Gender,
    Position: attr.Position,
    Appearances: attr.Appearances ?? 0,
    Goals: attr.Goals ?? 0,
    Assists: attr.Assists ?? 0,
    YellowCards: attr.Yellow_Cards ?? 0,
    RedCards: attr.Red_Cards ?? 0,
    Foot: attr.Foot,
    Kit: attr.Kit_Number ?? null,
    Current_Team: dfaTeam?.Name ?? 'Null',
    League: !leagueData ? 'Dsport' : 
            (LEAGUE_MAPPING[leagueData.attributes?.name] || ''),
    url: attr.Profile_Pic?.data?.attributes?.formats?.small?.url ?? null
  };
}