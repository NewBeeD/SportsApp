

export default function AllTeamsDataStructure(data){

   // Function to organize teams in proper order

   let all_teams = data.map(item => {

    let teamPoints = {}
    
    teamPoints['Team'] = item.attributes['Name']
    teamPoints['League'] = item.attributes['dfa_league'].data.attributes['Name']
    teamPoints['ID'] = item.id
    teamPoints['team_crest'] = item.attributes['Team_Crest'].data != null ? item.attributes['Team_Crest'].data.attributes.url : 'https://res.cloudinary.com/djrkottjd/image/upload/v1707946025/image_processing20210704_7078_8fmz2l_c79bd8998a.png'
    
    return teamPoints
   })

   return all_teams    
}




