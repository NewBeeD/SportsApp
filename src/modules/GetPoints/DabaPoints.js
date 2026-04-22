import { useQuery } from '@tanstack/react-query';
import qs from 'qs'
import axios from 'axios'

import DabaPointDisplay from '../DABA/DabaPointTableDisplay/DabaPointsTableDisplay';




export default function DabaPoints (){

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

  useQuery({
    queryKey: ['Points-Daba-query'], 
    queryFn: () => fetchDataFromStrapi(queryParams).then((value) =>{

      DabaPointDisplay(value.data)
      return value
    })
  })

  return null;
}

