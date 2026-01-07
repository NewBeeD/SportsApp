

export default function PlayerDisplayStructure(data){

  if(data == null){return []}


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
    player['profile_pic'] = item.attributes['Profile_Pic'].data.attributes['url']

    return player
  })
  
  return final_data
}





// export default function PlayerDisplayStructure(data) {
//   if (!data || !data.length) return [];
  
//   const result = new Array(data.length);
  
//   for (let i = 0, len = data.length; i < len; i++) {
//     const item = data[i];
//     const attributes = item.attributes;
//     const profilePic = attributes.Profile_Pic?.data?.attributes;
    
//     result[i] = {
//       id: item.id,
//       FirstName: attributes.First_Name,
//       Last_Name: attributes.Last_Name,
//       BirthDate: attributes.Birth_Date,
//       Age: attributes.Age,
//       Gender: attributes.Gender,
//       Position: attributes.Position,
//       Appearances: attributes.Appearances,
//       Goals: attributes.Goals,
//       Assists: attributes.Assists,
//       YellowCards: attributes.Yellow_Cards,
//       RedCards: attributes.Red_Cards,
//       Foot: attributes.Foot,
//       profile_pic: profilePic?.url || null
//     };
//   }
  
//   return result;
// }