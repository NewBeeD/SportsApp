
import TeamPlayerDataStructure from '../../../modules/DFA/TeamPage/TeamPlayerStructure'


export default function TeamDataStructure(data){

   // Function to organize teams in proper order


    let teamPoints = {}

    teamPoints['Team_Abbrev'] = TeamNameChange(data.attributes['Name'])
    
    teamPoints['Team'] = data.attributes['Name']


    teamPoints['Head_Coach'] = data.attributes['Head_Coach']
    teamPoints['Community'] = data.attributes['Community']
    teamPoints['Asst_Coach'] = data.attributes['Assistant_Coach'] ?? null
    teamPoints['Gender'] = data.attributes['Gender']
    teamPoints['League'] = data.attributes['dfa_league']?.data.attributes['Name']
    teamPoints['Players'] = TeamPlayerDataStructure(data.attributes['dfa_players'].data)
    teamPoints['ID'] = data.id
    teamPoints['staff_imgs'] = StaffImages(data.attributes['Staff'].data)
    teamPoints['Team_Photo'] = data.attributes['Team_Photo'].data.attributes.formats['medium'].url
    teamPoints['team_crest'] = data.attributes['Team_Crest'].data.attributes.url
    teamPoints['est'] = getYear(data.attributes['Founded'])   


    return teamPoints
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

function StaffImages(staff_values){

  if (staff_values == null) {

    return []    
  }

  let all_imgs = staff_values.map(item => {

    let img_point = {}

    img_point['staff_member_name'] = item.attributes.name
    img_point['staff_member_title'] = item.attributes.caption
    img_point['staff_member_img'] = item.attributes.url

    return img_point
  })

  return all_imgs
}

function getYear(date){

const year = date.split("-")[0];
return year
}



