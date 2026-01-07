

export default function PlayerDisplayStructure(data){


    

  let final_data = data.map(item => {

    let player = {};

    player['id'] = item.id
    player['FirstName'] = item.attributes['First_Name']
    player['Last_Name'] = item.attributes['Last_Name']
    player['BirthDate'] = item.attributes['Birth_Date']
    player['Age'] = item.attributes['Age']    
    player['Gender'] = item.attributes['Gender']
    player['Position'] = item.attributes['Position']
    player['Appearances'] = item.attributes['Appearances']
    player['Goals'] = item.attributes['Goals']
    player['Assists'] = item.attributes['Assists']
    player['YellowCards'] = item.attributes['Yellow_Cards']
    player['RedCards'] = item.attributes['Red_Cards']
    player['Foot'] = item.attributes['Foot']
    player['Current_Team'] = item.attributes['dfa_team'].data.attributes['Name']
    player['League'] = item.attributes['all_league'].data.attributes['name']
    player['LeagueAssociation'] = leagueNameChange(item.attributes['all_league'].data.attributes['name'])
    player['url'] = item.attributes['Profile_Pic'].data.attributes.formats['small']['url']

    return player
  })
  
  return final_data
}


function leagueNameChange(leagueName){

  switch(leagueName){

    case 'DFA_Division_One':     
    case 'DFA_Women':
    case 'DFA_Premier_League_Men':
      return 'DFA';
    
    case 'DABA_First_Division':
    case 'DABA_Premier_League':
    case 'DABA_Women':
      return 'DABA';

    case 'DAVA_MEN':
    case 'DAVA_WOMEN':
        return 'DAVA'
    
    default:
      return '';

  }
}

