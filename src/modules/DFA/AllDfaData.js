import { useQuery } from '@tanstack/react-query';

// Redux
import { useDispatch } from 'react-redux'

// Query Params
import { queryParams_women_table, queryParams_prem_players, queryParams_prem_players_stats } from './QueryParams';

// fetch Data
import { fetchData_women_tables, fetchData_players, fetchData_players_stats } from './DataFetchQueries';

// Redux Actions
import { setWomenTableData } from '../../features/Women_Table/WomenTableSlice'
import { setDfaPlayersData } from '../../features/DFA_Players/DfaPlayersSlice'
import { setDfaPlayersStatsData } from '../../features/DfaPlayerStats/DfaPlayerStatsSlice';

// Structuring data
import PlayerDataStructure from '../../modules/DFA/DfaPlayersDisplayStructure'
import PlayerStatsDisplayStructure from './PlayerStats/PlayerStatsDisplayStructure';


export default function GetDFA(){

  const dispatch = useDispatch()
  useQuery({
    queryKey: ['Women-Table'], 
    queryFn: () => fetchData_women_tables(queryParams_women_table).then((value) =>{


      dispatch(setWomenTableData(value))
      return value
    })
  })

  useQuery({
    queryKey: ['Dfa-Player'], 
    queryFn: () => fetchData_players(queryParams_prem_players).then((value) =>{

      let finalData = PlayerDataStructure(value.data);

      dispatch(setDfaPlayersData(finalData))
      return value
    })
  })

  useQuery({
    queryKey: ['Dfa-Player-Stats'], 
    queryFn: () => fetchData_players_stats(queryParams_prem_players_stats).then((value) =>{      

      let finalData = PlayerStatsDisplayStructure(value.data);
      

      dispatch(setDfaPlayersStatsData(finalData))
      return value
    })
  })

  return null;
}

