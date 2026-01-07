import { useQuery } from '@tanstack/react-query';




// Redux
import { useDispatch } from 'react-redux'

// Query Params
import { queryParams_div1_table, queryParams_fixtures, queryParams_prem_table, queryParams_prem_teams, queryParams_div1_teams, queryParams_women_table, queryParams_women_teams, queryParams_prem_players, queryParams_prem_players_stats } from './QueryParams';

// fetch Data
import { fetchData_div1_table, fetchData_div1_teams, fetchData_fixtures, fetchData_prem_tables, fetchData_prem_teams, fetchData_women_tables, fetchData_women_teams, fetchData_players, fetchData_players_stats } from './DataFetchQueries';

// Redux Actions
import { setDivOneTableData } from '../../features/Div_One_Table/DivOneTableSlice'
// import { setDivOneTeamData } from '../../features/Div_One_Team/DivOneTeamSlice'
// import { setPremTeamData } from '../../features/Prem_Team/PremTeamSlice'
import { setWomenTableData } from '../../features/Women_Table/WomenTableSlice'
// import { setWomenTeamData } from '../../features/Women_Team/WomenTeamSlice'
import { setDfaPlayersData } from '../../features/DFA_Players/DfaPlayersSlice'
import { setDfaPlayersStatsData } from '../../features/DfaPlayerStats/DfaPlayerStatsSlice';

// Structuring data
import PlayerDataStructure from '../../modules/DFA/DfaPlayersDisplayStructure'
import PlayerStatsDisplayStructure from './PlayerStats/PlayerStatsDisplayStructure';


export default function GetDFA(){

  const dispatch = useDispatch()


  // const div_one_teams = useQuery({
  //   queryKey: ['Div-One-Teams'], 
  //   queryFn: () => fetchData_div1_teams(queryParams_div1_teams).then((value) => {

  //     // let fixtures_dat_structured = fixturesSetup(value)
      

  //     // dispatch(populate(fixtures_dat_structured))
  //     dispatch(setDivOneTeamData(value))
  //     return value
  //   })
  // })

  // const womens_team = useQuery({
  //   queryKey: ['Women-Teams'], 
  //   queryFn: () => fetchData_women_teams(queryParams_women_teams).then((value)=>{

  //     dispatch(setWomenTeamData(value))
  //     return value
  //   })
  // })

  // const prem_team = useQuery({
  //   queryKey: ['Prem-Teams'], 
  //   queryFn: () => fetchData_prem_teams(queryParams_prem_teams).then((value) => {

  //     dispatch(setPremTeamData(value))
  //     return value
  //   })
  // })


  
  // const div_one_table = useQuery({
  //   queryKey: ['Div-One-Table'], 
  //   queryFn: () => fetchData_div1_table(queryParams_div1_table).then((value) => {

  //     dispatch(setDivOneTableData(value))
  //     return value
  //   })
  // })

  

  const women_table = useQuery({
    queryKey: ['Women-Table'], 
    queryFn: () => fetchData_women_tables(queryParams_women_table).then((value) =>{


      dispatch(setWomenTableData(value))
      return value
    })
  })

  const dfa_player = useQuery({
    queryKey: ['Dfa-Player'], 
    queryFn: () => fetchData_players(queryParams_prem_players).then((value) =>{

      let finalData = PlayerDataStructure(value.data);

      dispatch(setDfaPlayersData(finalData))
      return value
    })
  })

  const dfa_player_stats = useQuery({
    queryKey: ['Dfa-Player-Stats'], 
    queryFn: () => fetchData_players_stats(queryParams_prem_players_stats).then((value) =>{      

      let finalData = PlayerStatsDisplayStructure(value.data);
      

      dispatch(setDfaPlayersStatsData(finalData))
      return value
    })
  })

                
}

