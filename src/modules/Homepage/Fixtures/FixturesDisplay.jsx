

// This function identifies the entries in the array/oject that will be used for display in the cards on the Homepage
export default function GroupingFixturesByDate(league_fixtures_data){

 

  let articles_data = league_fixtures_data.data

  let fixtures_orderedByDate = DateOrder(articles_data) 


  let final_data = fixtures_orderedByDate.map(item => {

    let req_data = {}


    req_data['Home'] = item.attributes['dfa_team_home'].data['attributes']['Name']

    req_data['Away'] = item.attributes['dfa_team_away'].data['attributes']['Name']

    req_data['Home_Id'] = item.attributes['dfa_team_home'].data.id

    req_data['Away_Id'] = item.attributes['dfa_team_away'].data.id




    req_data['Date'] = getOnlyDate(item.attributes['Date'])
    req_data['Time'] = getTimeOnly(item.attributes['Date'])
    req_data['Venue'] = item.attributes['venue'].data != null ? item.attributes['venue'].data['attributes']['Name']: 'TBA'

    // req_data['League'] = leagueNameChange(item.attributes['all_league'].data)
    req_data['League'] = item.attributes['all_league'].data.attributes['name']

    req_data['LeagueName'] = leagueNameChange(item.attributes['all_league'].data)
    req_data['League_fullName'] = realLeague(item.attributes['all_league'].data)

    req_data['Complete'] = item.attributes['Complete']
    req_data['Cancelled'] = item.attributes['Cancelled']
    req_data['HomeScore'] = item.attributes['Home_Team_Score']
    req_data['AwayScore'] = item.attributes['Away_Team_Score']
    req_data['Game_Info'] = gameDetails(item.attributes['Game_Details'])
    

    return req_data
  })  


  return final_data
}

function DateOrder(data_points){

  let new_arr = data_points.sort(compareByDate);

  return new_arr
}

function compareByDate(obj1, obj2) {

  const date1 = new Date(obj1.attributes['Date']);
  const date2 = new Date(obj2.attributes['Date']);

  if (date1 < date2) {
    return -1;
  } else if (date1 > date2) {
    return 1;
  } else {
    return 0;
  }
}

function getOnlyDate(fixture_date){

  // let new_Date = Date.parse(fixture_date)
  let new_Date = new Date(fixture_date)

  new_Date = new_Date.toDateString().toString();
  new_Date = new_Date.replace(/\d{4}/, '')

  let date_split = new_Date.split(' ')
  let proper_month = right_month(date_split[1])

  date_split = date_split[0] + ' ' + date_split[2] + ' ' + proper_month
  return date_split
}

function getTimeOnly(fixture_date){
  let new_Time = new Date(fixture_date);

  // Set the timezone to UTC
  // new_Time.setUTCHours(new_Time.getUTCHours() - 4); // Adjust for the 4-hour difference

  // Format the time portion in 12-hour format
  new_Time = new_Time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return new_Time;
}

function right_month(month){

  switch(month){

    case 'Jan':
      return 'January';
    
    case 'Feb':
      return 'February';
    
    case 'Mar':
      return 'March';
    
    case "Apr":
      return 'April';

    case "May":
      return 'May';
    
    case 'Jun':
      return 'June';
    
    case 'Jul':
      return 'July';

    case 'Aug':
      return 'August';

    case 'Sep':
      return 'September';

    case 'Oct':
      return 'October';

    case 'Nov':
      return 'November';

    case 'Dec':
      return 'December';

    default:
      return '';
  }
}


function leagueNameChange(leagueName){


  if(leagueName == null){return 'Dsport'}
 


  switch(leagueName.attributes['name']){

      case 'DFA_Division_One':     
      case 'DFA_Women':
      case 'DFA_Premier_League_Men':
      case 'President Cup':
        return 'DFA';
      
      case 'DABA_First_Division':
      case 'DABA_Premier_League':
      case 'DABA_Women':
        return 'DABA';

      case 'DAVA_MEN':
      case 'DAVA_WOMEN':
          return 'DAVA';
      
      case 'DNA_Men':
      case 'DNA_Women':
        return 'DNA';

      case null:
        return 'DSport';
      
      default:
        return '';

    }
}

function realLeague(leagueName){


  if(leagueName == null){return 'Dsport'}
 


  switch(leagueName.attributes['name']){

      case 'DFA_Division_One':
        return 'Division One' ;

      case 'DFA_Women':
        return 'Womens';

      case 'DFA_Premier_League_Men':
        return 'Premier League';

      case 'President Cup':
        return 'Presidents Cup';
      
      case 'DABA_First_Division':
        return 'Division One';

      case 'DABA_Premier_League':
        return 'Premier League';

      case 'DABA_Women':
        return 'Womens';

      case 'DAVA_MEN':
        return 'Men';

      case 'DAVA_WOMEN':
          return 'Women';
      
      case 'DNA_Men':
        return 'Men';

      case 'DNA_Women':
        return 'Men';

      case null:
        return 'DSport';
      
      default:
        return '';

    }
}

function upcomingFixtures(fixtures){

  let today_date = new Date().toISOString()

  let upcoming_fixtures = fixtures.filter(item => item['attributes']['Date'] > today_date)

  return upcoming_fixtures
}

function gameDetails(game_info){

  if(game_info != null){

    // console.log(game_info['data']);
    let game_data = {};
    game_data['Goal_Scorers_Home'] = game_info['data']['Goals_Home']
    game_data['Goal_Scorers_Away'] = game_info['data']['Goals_Away']
    game_data['Assists_Home'] = game_info['data']['Assists_Home']
    game_data['Assists_Away'] = game_info['data']['Assists_Away']
    game_data['Yellow_Cards'] = game_info['data']['Cards']['Yellow_Cards']
    game_data['Red_Cards'] = game_info['data']['Cards']['Red_Cards']

    return game_data
  }

}


