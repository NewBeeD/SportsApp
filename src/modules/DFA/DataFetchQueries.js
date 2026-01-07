import qs from 'qs'
import axios from 'axios'



// DFA Business
export const fetchData_div1_teams = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-division-one-teams?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}

export const fetchData_prem_teams = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-teams?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}

export const fetchData_women_teams = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-women-teams?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}


export const fetchData_div1_table = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-division-one-men-tables?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}


export const fetchData_women_tables = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-women-tables?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}


export const fetchData_prem_tables = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-premier-league-men-tables?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}

export const fetchData_fixtures = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/fixtures?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}

export const fetchData_players = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/dfa-players?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}

export const fetchData_players_stats = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/player-stats?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}


// DABA Business
export const fetchData_daba_teams = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/daba-teams?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}


export const fetchData_daba_players = async (queryParams) => {
  const queryString = qs.stringify(queryParams);
  const apiUrl = `https://strapi-dominica-sport.onrender.com/api/daba-players?${queryString}`;

  const response = await axios.get(apiUrl);
  return response.data;
}



// DABA Player Stats
// export const fetchData_daba_players_stats = async (queryParams) => {
//   const queryString = qs.stringify(queryParams);
//   const apiUrl = `https://strapi-dominica-sport.onrender.com/api/player-stats?${queryString}`;

//   const response = await axios.get(apiUrl);
//   return response.data;
// }



