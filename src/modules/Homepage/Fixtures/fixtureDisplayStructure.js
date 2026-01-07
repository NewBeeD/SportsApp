
// let draft_league = []

// let league = []
// let fixture_date_arr = []


// export default function displayFixture(fixtures_data){

//   // This for loop identifies the different leagues
//   for (var item of fixtures_data){
    
//     if(!league.includes(item.League)){
//       league.push(item.League)
//     }
//   }

//   // This loop seprated the fixtures by leagues
//   for (var league_item of league){

//     let new_league = fixtures_data.filter(item => item.League == league_item)
//     draft_league.push(new_league)
//   }

//   // 
//   for (var date_item of draft_league){

//     let league_dates = []

//     for (var league_date_item of date_item){

//       if(!league_dates.includes(league_date_item.Date)){

//           league_dates.push(league_date_item.Date)
//         }   
//     }

//     let game_fixture_arr = date_setup(fixtures_data, league_dates)
//     fixture_date_arr.push(game_fixture_arr)   
//   }


// }

// function date_setup(data_entry, date){

//   let game_date = []

//   for (var date_date of date){

//     let new_game_date = data_entry.filter(item => item.Date == date_date)

//     game_date.push(new_game_date)
//   }

//   return game_date


// }





export default function displayFixture(fixtures_data) {
  if (!fixtures_data || !fixtures_data.length) {
    return [];
  }

  // Use Map to group by league and then by date - O(n) complexity
  const leagueMap = new Map();
  
  // First pass: group fixtures by league and date
  for (let i = 0; i < fixtures_data.length; i++) {
    const fixture = fixtures_data[i];
    const league = fixture.League;
    const date = fixture.Date;
    
    if (!leagueMap.has(league)) {
      leagueMap.set(league, new Map());
    }
    
    const dateMap = leagueMap.get(league);
    if (!dateMap.has(date)) {
      dateMap.set(date, []);
    }
    
    dateMap.get(date).push(fixture);
  }
  
  // Convert to desired structure
  const result = [];
  
  for (const [league, dateMap] of leagueMap) {
    const leagueFixtures = [];
    
    // Sort dates if needed (optional)
    const dates = Array.from(dateMap.keys());
    // dates.sort(); // Uncomment if you want sorted dates
    
    for (const date of dates) {
      leagueFixtures.push(dateMap.get(date));
    }
    
    result.push(leagueFixtures);
  }
  
  return result;
}