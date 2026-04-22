
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
    (_, day) => {
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
