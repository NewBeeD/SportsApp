

// export default function PlayerStatsDisplayStructure(data){

  

//   if(data != null){   
    

//     let structured_data = data.map(item => {
  
//       let stat = {};
  
//       stat['Player_ID'] = item.attributes['dfa_player'].data.id
//       stat['First_Name'] = item.attributes['dfa_player'].data.attributes['First_Name']
     
//       stat['Last_Name'] = item.attributes['dfa_player'].data.attributes['Last_Name']
  
//       stat['Season'] = item.attributes['Season']

//       stat['Assists'] = item.attributes['Assists']
      
//       stat['Goals'] = Number(item.attributes['Goals'])
          
//       stat['Clean_Sheets'] = item.attributes['Clean_Sheets']
  
//       stat['Foot'] = item.attributes['dfa_player'].data.attributes['Foot']
  
//       // stat['url'] = item.attributes['Profile_Pic'].data.attributes['formats']['medium']['url']

//       stat['url'] = item.attributes['dfa_player'].data.attributes['Profile_Pic'].data.attributes['formats']['medium']['url']
  
//       stat['league'] = item.attributes['dfa_player'].data.attributes['all_league'].data.attributes['name']
      
//       stat['team'] =  item.attributes['dfa_player'].data.attributes['dfa_team'].data.attributes['Name']
  
//       return stat
//     })
  
//     return structured_data
//   }

//   return [] 
// }





export default function PlayerStatsDisplayStructure(data) {
  if (!data) return [];
  
  const structured_data = new Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const attributes = item.attributes;
    const player = attributes.dfa_player?.data;
    const playerAttrs = player?.attributes;
    const profilePic = playerAttrs?.Profile_Pic?.data?.attributes?.formats?.medium;
    const league = playerAttrs?.all_league?.data?.attributes;
    const team = playerAttrs?.dfa_team?.data?.attributes;
    
    structured_data[i] = {
      Player_ID: player?.id,
      First_Name: playerAttrs?.First_Name,
      Last_Name: playerAttrs?.Last_Name,
      Season: attributes.Season,
      Assists: attributes.Assists,
      Goals: Number(attributes.Goals) || 0,
      Clean_Sheets: attributes.Clean_Sheets,
      Foot: playerAttrs?.Foot,
      url: profilePic?.url || null,
      league: league?.name || null,
      team: team?.Name || null
    };
  }
  
  return structured_data;
}