import { useQuery } from '@tanstack/react-query';
import qs from 'qs'
import axios from 'axios'

// Redux
import { useDispatch} from 'react-redux'

import DabaPointDisplay from '../DABA/DabaPointTableDisplay/DabaPointsTableDisplay';




export default function DabaPoints (){
  
  const dispatch = useDispatch() 
  

  let structured_data;
  // const [structuredDataFinal, setStructuredDataFinal]= useState(null)

  const fetchDataFromStrapi = async (queryParams) => {

    const queryString = qs.stringify(queryParams);
    let apiUrl;

   
    // TODO: Have a conditional statement here to change the apiUrl for different league tables

    apiUrl = `https://strapi-dominica-sport.onrender.com/api/daba-premier-league-men-tables?${queryString}`;


  
    const response = await axios.get(apiUrl);
    return response.data;
  }
  
  
  const queryParams = {
  
    populate: {
      daba_team: {
        populate: true
      }

    }   
  }

  const { isLoading, data, error} = useQuery({
    queryKey: ['Points-Daba-query'], 
    queryFn: () => fetchDataFromStrapi(queryParams).then((value) =>{

      // Learn redux
      structured_data = DabaPointDisplay(value.data)

      // dispatch(populate(structured_data))
      return value
    })
  })
}

