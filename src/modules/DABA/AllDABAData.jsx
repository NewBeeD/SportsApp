import { useQuery } from '@tanstack/react-query';

// Redux
import { useDispatch } from 'react-redux'

// Query Params
import { queryParams_daba_players } from '../DFA/QueryParams';

// fetch Data
import { fetchData_daba_players } from '../DFA/DataFetchQueries';

// Redux Actions
import { setDabaPlayersData } from '../../features/DABAFeatures/DabaPlayersSlice';

import DabaPlayerDisplay from './DabaPlayersDisplay/DabaPlayerDisplay';


export default function GetDABA(){

  const dispatch = useDispatch()

  useQuery({
    queryKey: ['Daba-Player'], 
    queryFn: () => fetchData_daba_players(queryParams_daba_players).then((value) =>{

      let finalData = DabaPlayerDisplay(value.data);

      dispatch(setDabaPlayersData(finalData))
      // dispatch(setDabaPlayersData(value))
      return value
    })
  })

  return null;
}

