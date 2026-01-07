



// export default function StatsPageStructureData(data){
  

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






export default function StatsPageStructureData(data) {
  if (!data || !data.length) return [];
  
  const result = new Array(data.length);
  
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i];
    const attr = item.attributes;
    
    // Cache deeply nested properties to avoid repeated lookups
    const playerData = attr.dfa_player?.data;
    const playerAttrs = playerData?.attributes;
    const profilePicAttrs = playerAttrs?.Profile_Pic?.data?.attributes?.formats;
    const leagueAttrs = playerAttrs?.all_league?.data?.attributes;
    const teamAttrs = playerAttrs?.dfa_team?.data?.attributes;
    
    result[i] = {
      Player_ID: playerData?.id,
      First_Name: playerAttrs?.First_Name,
      Last_Name: playerAttrs?.Last_Name,
      Season: attr.Season,
      Assists: attr.Assists || 0,
      Goals: Number(attr.Goals) || 0,
      Clean_Sheets: attr.Clean_Sheets || 0,
      Foot: playerAttrs?.Foot,
      url: profilePicAttrs?.medium?.url || profilePicAttrs?.small?.url || null,
      league: leagueAttrs?.name || null,
      team: teamAttrs?.Name || null
    };
  }
  
  return result;
}