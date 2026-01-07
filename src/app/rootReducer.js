// import { combineReducers } from "@reduxjs/toolkit";
// import fixtureReducer from '../features/Fixtures/FixturesSlice'
// import articlesReducer from '../features/TrendingArticles/TrendingArticlesSilce'
// import pointReducer from '../features/PointsTable/PointsSlice'
// import VideoReducer from '../features/Video/VideoSlice'
// import WomenTeamReducer from '../features/Women_Team/WomenTeamSlice'
// import WomenTableReducer from '../features/Women_Table/WomenTableSlice'
// import PremTeamReducer from '../features/Prem_Team/PremTeamSlice'
// import DivOneTeamReducer from '../features/Div_One_Team/DivOneTeamSlice'
// import DivOneTableReducer from '../features/Div_One_Table/DivOneTableSlice'
// import DfaPlayersReducer from '../features/DFA_Players/DfaPlayersSlice'
// import DfaPremPlayerStatsReducer from '../features/DfaPlayerStats/DfaPlayerStatsSlice'
// import DabaPlayersReducer from '../features/DABAFeatures/DabaPlayersSlice'
// import DabaTeamReducer from '../features/DABAFeatures/DABATeamSlice'
// import DabaPointsReducer from "../features/DABAFeatures/DabaPointsSlice";

// const rootReducer = combineReducers({

//   articles: articlesReducer,
//   fixtures: fixtureReducer,
//   points: pointReducer,
//   video: VideoReducer,
//   WomenTeam: WomenTeamReducer,
//   WomenTable: WomenTableReducer,
//   PremTeam: PremTeamReducer,
//   DivOneTeam: DivOneTeamReducer,
//   DivOneTable: DivOneTableReducer,
//   DfaPlayers: DfaPlayersReducer,
//   DfaPlayerStats: DfaPremPlayerStatsReducer,
//   DabaPlayers: DabaPlayersReducer,
//   DabaTeams: DabaTeamReducer,
//   DabaPoints: DabaPointsReducer,

// })

// export default rootReducer;






// src/app/rootReducer.js - UPDATED
import { combineReducers } from "@reduxjs/toolkit";
import fixtureReducer from '../features/Fixtures/FixturesSlice'
import articlesReducer from '../features/TrendingArticles/TrendingArticlesSilce'
import pointReducer from '../features/PointsTable/PointsSlice'
import VideoReducer from '../features/Video/VideoSlice'
import WomenTeamReducer from '../features/Women_Team/WomenTeamSlice'
import WomenTableReducer from '../features/Women_Table/WomenTableSlice'
import PremTeamReducer from '../features/Prem_Team/PremTeamSlice'
import DivOneTeamReducer from '../features/Div_One_Team/DivOneTeamSlice'
import DivOneTableReducer from '../features/Div_One_Table/DivOneTableSlice'
import DfaPlayersReducer from '../features/DFA_Players/DfaPlayersSlice'
import DfaPremPlayerStatsReducer from '../features/DfaPlayerStats/DfaPlayerStatsSlice'
import DabaPlayersReducer from '../features/DABAFeatures/DabaPlayersSlice'
import DabaTeamReducer from '../features/DABAFeatures/DABATeamSlice'
import DabaPointsReducer from "../features/DABAFeatures/DabaPointsSlice"
import predictionReducer from '../features/PredictionGame/PredictionSlice'

const rootReducer = combineReducers({

  articles: articlesReducer,
  fixtures: fixtureReducer,
  points: pointReducer,
  video: VideoReducer,
  WomenTeam: WomenTeamReducer,
  WomenTable: WomenTableReducer,
  PremTeam: PremTeamReducer,
  DivOneTeam: DivOneTeamReducer,
  DivOneTable: DivOneTableReducer,
  DfaPlayers: DfaPlayersReducer,
  DfaPlayerStats: DfaPremPlayerStatsReducer,
  DabaPlayers: DabaPlayersReducer,
  DabaTeams: DabaTeamReducer,
  DabaPoints: DabaPointsReducer,
  prediction: predictionReducer,

})

export default rootReducer;