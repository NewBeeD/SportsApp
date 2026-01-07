import { useQuery } from '@tanstack/react-query';




// Redux
import { useDispatch } from 'react-redux'

// Query Params
import { queryParams_daba_players, queryParams_daba_players_stats   } from '../DFA/QueryParams';

// fetch Data
import { fetchData_daba_players } from '../DFA/DataFetchQueries';

// Redux Actions
import { setDABAPremTeamData } from '../../features/DABAFeatures/DABATeamSlice';
import { setDabaPlayersData } from '../../features/DABAFeatures/DabaPlayersSlice';

import DabaPlayerDisplay from './DabaPlayersDisplay/DabaPlayerDisplay';


export default function GetDABA(){

  const dispatch = useDispatch()

  const daba_player = useQuery({
    queryKey: ['Daba-Player'], 
    queryFn: () => fetchData_daba_players(queryParams_daba_players).then((value) =>{

      let finalData = DabaPlayerDisplay(value.data);

      dispatch(setDabaPlayersData(finalData))
      // dispatch(setDabaPlayersData(value))
      return value
    })
  })

  // const daba_player_stats = useQuery({
  //   queryKey: ['Daba-Player-Stats'], 
  //   queryFn: () => fetchData_players_stats(queryParams_daba_players_stats).then((value) =>{

  //     let finalData = PlayerStatsDisplayStructure(value.data);

  //     dispatch(setDfaPlayersStatsData(finalData))
  //     return value
  //   })
  // })

                
}

