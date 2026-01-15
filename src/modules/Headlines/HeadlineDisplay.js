






// This function identifies the entries in the array/oject that will be used for display in the cards on the Homepage
export default function HeadLineDisplay(data){
  

  let required_data_fields = {}
  

  required_data_fields['id'] = data.id
  required_data_fields['title'] = data.attributes['Title'],
  required_data_fields['author'] = data.attributes['Author']
  required_data_fields['RichText'] = data.attributes['HeadlineContent'] ?? 'none'
  required_data_fields['type'] = data.attributes['Type']
  // required_data_fields['league'] = leagueNameChange(data.attributes['all_league'].data.attributes['name'])

  // required_data_fields['league_name'] = SpecificleagueName(data.attributes['all_league'].data.attributes['name'])

  // required_data_fields['url'] = data.attributes['Article_Img'].data[0].attributes['formats']['small']['url']

    // required_data_fields['url'] = getAllImages(data.attributes['Article_Img'].data)


  required_data_fields['date'] = formatDate(data.attributes['publishedAt'])

  return required_data_fields
}


  // return final_data


function leagueNameChange(leagueName){

    switch(leagueName){

      case 'DFA_Division_One':     
      case 'DFA_Women':
      case 'DFA_Premier_League_Men':
        return 'DFA';
      
      case 'DABA_Division_One':
      case 'DABA_Premier_League_One':
      case 'DABA_Women':
        return 'DABA';

      case 'DAVA_MEN':
      case 'DAVA_WOMEN':
          return 'DAVA';
      
      case 'DNA_Men':
      case 'DNA_Women':
        return 'DNA';

      case 'International':
        return 'International';

      case 'Opinion':
        return 'Opinion';
      
      default:
        return leagueName;

    }

}


function SpecificleagueName(league){

  switch(league){

    case 'DFA_Division_One':
      return 'DFA Division One';

    case 'DFA_Women':
      return 'DFA Women';

    case 'DFA_Premier_League_Men':
      return 'DFA Premier League Men';
    
    case 'DABA_Division_One':
      return 'DABA Division One';

    case 'DABA_Premier_League':
      return 'DABA Premier League';

    case 'DABA_Women':
      return 'DABA Women';

    case 'DAVA_Men':
      return 'DAVA Men';

    case 'DAVA_Women':
        return 'DAVA Women';
    
    case 'DNA_Men':
      return 'DNA Men';
        
    default:
      return '';

  }


}

function daysElapsed(datePublished){

  const parsingDate = Date.parse(datePublished)

  let todayDate = new Date();

  const oneDay = 24 * 60 * 60 * 1000;

  let age = Math.floor((todayDate - parsingDate) / oneDay)


  if(age > 1){
    
    return `${age} days ago`
  }
  else if ( age > 0.0001){
    const hours = age * 24;
    return `${hours} hours ago`
  }
  else{

    const minutes = age * 24 * 60;
    return `${minutes} minutes ago`
  }
 
}


function formatDate(date) {
  
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };


  const parsingDate = Date.parse((date))

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(parsingDate);

  // Add the ordinal suffix for the day (1st, 2nd, 3rd, etc.)
  const dayWithSuffix = formattedDate.replace(
    /(\d{1,2})(st|nd|rd|th)/,
    (_, day, suffix) => {
      const dayNumber = parseInt(day);
      if (dayNumber >= 11 && dayNumber <= 13) {
        return day + 'th';
      }
      switch (dayNumber % 10) {
        case 1:
          return day + 'st';
        case 2:
          return day + 'nd';
        case 3:
          return day + 'rd';
        default:
          return day + 'th';
      }
    }
  );

  return dayWithSuffix;
}

function getAllImages(data){

  let data_length = data.length;

  if(data_length == 1){
    return [data[0].attributes['url']]
  }
  else {

    let all_imgs = data.map(item => {

      return item.attributes['url']
    })

    return all_imgs
  }

}
