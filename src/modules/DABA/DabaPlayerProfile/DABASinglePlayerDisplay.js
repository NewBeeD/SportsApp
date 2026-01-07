

export default function DABASinglePlayerDisplay(player_data){

  
  let player = {};

  player['First_Name'] = player_data.attributes['First_Name']
  player['Last_Name'] = player_data.attributes['Last_Name']
  player['Points'] = player_data.attributes['Points']
  player['Birth_Date'] = player_data.attributes['Birth_Date']
  player['Assists'] = player_data.attributes['Assists']
  player['Rebounds'] = player_data.attributes['Rebounds']
  player['Gender'] = player_data.attributes['Gender']
  player['Steals'] = player_data.attributes['Steals']
  player['Blocks'] = player_data.attributes['Blocks']
  player['Turnovers'] = player_data.attributes['Turnovers']
  player['Personal_Fouls'] = player_data.attributes['Personal_Fouls']
  player['Height'] = player_data.attributes['Height']
  player['Weight'] = player_data.attributes['Weight']
  player['Position'] = player_data.attributes['Weight']
  player['Field_Goal_Percentage'] = player_data.attributes['Field_Goal_Percentage']
  player['Free_Throw_Percentage'] = player_data.attributes['Free_Throw_Percentage']
  player['Three_Point_Percentage'] = player_data.attributes['Three_Point_Percentage']
  player['Team'] = player_data.attributes['daba_team'].data.attributes['Name']
  player['league'] = player_data.attributes['all_league'].data?.attributes['name'] 
  player['img_url'] = player_data.attributes['Profile_Pic'].data.attributes['url']



  return player
}