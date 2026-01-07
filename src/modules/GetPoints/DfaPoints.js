import { useQuery } from '@tanstack/react-query';
import qs from 'qs'
import axios from 'axios'

import { useState } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { populate } from '../../features/PointsTable/PointsSlice'
import { setDivOneTableData } from '../../features/Div_One_Table/DivOneTableSlice';

import PointsTableStructuredDisplay from '../Homepage/PointsTables/PointsTableStructuredDisplay';


export default function DfaPoints (){
  
  const dispatch = useDispatch() 
  

  let structured_data;
  // const [structuredDataFinal, setStructuredDataFinal]= useState(null)

  const fetchDataFromStrapi = async (queryParams) => {

    const queryString = qs.stringify(queryParams);
    let apiUrl;

   
    // TODO: Have a conditional statement here to change the apiUrl for different league tables

    apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-premier-league-men-tables?${queryString}`;
  
    const response = await axios.get(apiUrl);
    return response.data;
  }

  const fetchDataFromStrapiDivOne = async (queryParams) => {

    const queryString = qs.stringify(queryParams);
    let apiUrl;

   
    // TODO: Have a conditional statement here to change the apiUrl for different league tables

    apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-division-one-men-tables?${queryString}`;
  
    const response = await axios.get(apiUrl);
    return response.data;
  }
  
  
  const queryParams = {
  
    populate: {
      dfa_team: {
        populate: true
      }

    }   
  }

  const { isLoading, data, error} = useQuery({
    queryKey: ['Points-query'], 
    queryFn: () => fetchDataFromStrapi(queryParams).then((value) =>{

      // Learn redux
      structured_data = PointsTableStructuredDisplay(value)

      dispatch(populate(structured_data))
      return value
    })
  })

  const { isLoading: divLoading, data: divData, error: divError} = useQuery({
    queryKey: ['Points-Query-Div1'], 
    queryFn: () => fetchDataFromStrapiDivOne(queryParams).then((value) =>{  
      
      // Learn redux
      structured_data = PointsTableStructuredDisplay(value)

      dispatch(setDivOneTableData(structured_data))
      return value
    })
  })





}

