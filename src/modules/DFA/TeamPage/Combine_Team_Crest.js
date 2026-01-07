
export default function Combine_Team_Crest(player, image){

  


    // Create a mapping of team names to team_crest_url

  if(player != null && image != null){

    const teamUrlMapping = {};

    image.forEach(team => {
        teamUrlMapping[team.Name] = team.team_crest_url;
    });

    // Add team_crest_url to teams1 where teamName matches
    const teamsWithUrl = player.map(team => {
        const url = teamUrlMapping[team.teamName];
        return url ? { ...team, team_crest_url: url } : team;
    });

    return teamsWithUrl
  }  

}




// export default function Combine_Team_Crest(player, image) {
//   if (!player || !image) return player || [];
  
//   // Create Map for O(1) lookups (faster than object for frequent lookups)
//   const teamUrlMap = new Map();
  
//   for (let i = 0, len = image.length; i < len; i++) {
//     const team = image[i];
//     if (team && team.Name) {
//       teamUrlMap.set(team.Name, team.team_crest_url);
//     }
//   }
  
//   // Early exit if no valid mappings
//   if (teamUrlMap.size === 0) return player;
  
//   const result = new Array(player.length);
  
//   for (let i = 0, len = player.length; i < len; i++) {
//     const team = player[i];
//     const url = teamUrlMap.get(team?.teamName);
    
//     if (url) {
//       // Create new object only if we have a URL to add
//       result[i] = {
//         ...team,
//         team_crest_url: url
//       };
//     } else {
//       // Reuse original object if no URL
//       result[i] = team;
//     }
//   }
  
//   return result;
// }