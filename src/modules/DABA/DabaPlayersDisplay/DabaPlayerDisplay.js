

export default function DabaPlayerDisplay(player_data){


  let final_data = player_data.map(item => {

    let data_point = {};

    data_point['id'] = item.id
    data_point['First_Name'] = item.attributes['First_Name']
    data_point['Last_Name'] = item.attributes['Last_Name']
    data_point['Assists'] = item.attributes['Assists'] ?? 0;
    data_point['Blocks'] = item.attributes['Blocks'] ?? 0;
    data_point['Points'] = item.attributes['Points'] ?? 0;
    data_point['Rebounds'] = item.attributes['Rebounds'] ?? 0;
    data_point['Steals'] = item.attributes['Steals'] ?? 0;
    data_point['Height'] = item.attributes['Height'] ?? 0;
    data_point['Weight'] = item.attributes['Weight'] ?? 0;
    data_point['Personal_Fouls'] = item.attributes['Personal_Fouls'] ?? 0;
    data_point['Birth_Date'] = item.attributes['Birth_Date'] ?? 0;
    data_point['Field_Goal_Percentage'] = item.attributes['Field_Goal_Percentage'] ?? 0;
    data_point['Free_Throw_Percentage'] = item.attributes['Free_Throw_Percentage'] ?? 0;
    data_point['Three_Point_Percentage'] = item.attributes['Three_Point_Percentage'] ?? 0;
    data_point['Gender'] = item.attributes['Gender'] ?? 'Male';
    data_point['Team'] = item.attributes['daba_team'].data.attributes['Name'] 
    data_point['url'] = item.attributes['Profile_Pic'].data.attributes['url']

    return data_point
  })

 return final_data
}