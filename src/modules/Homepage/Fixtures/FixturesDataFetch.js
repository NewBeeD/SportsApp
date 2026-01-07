import { useQuery } from '@tanstack/react-query';
import qs from 'qs'
import axios from 'axios'

import { useState } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { populate } from '../../../features/Fixtures/FixturesSlice'

import fixturesSetup from '../Fixtures/FixturesDisplay'




export default function GetFixtures(){

  const dispatch = useDispatch()


  const fetchDataFromStrapi = async (queryParams) => {
    const queryString = qs.stringify(queryParams);
    const apiUrl = `https://strapi-dominica-sport.onrender.com/api/fixtures?${queryString}`;   
  
    const response = await axios.get(apiUrl);
    return response.data;
  }
  
  
  // const queryParams = {
  
  //   populate: {
  //     venue: {
  //       populate: true
  //     },

  //     all_league: {
  //       populate: true
  //     },

  //     dfa_team_home: {
  //       populate: true
  //     },

  //     dfa_team_away: {
  //       populate: true
  //     }

  //   }   
  // }


    // Corrected query parameters
  
const queryParams = {
    populate: {
      venue: true,
      all_league: true,
      dfa_team_home: true,  // Just request the relation
      dfa_team_away: true   // Just request the relation
    }
  };

  const { isLoading, data, error} = useQuery({
    queryKey: ['Fixture-Query'], 
    queryFn: () => fetchDataFromStrapi(queryParams).then((value) =>{

      let fixtures_dat_structured = fixturesSetup(value)    

      dispatch(populate(fixtures_dat_structured))
      return value
    })
  })
  

}

