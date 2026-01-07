import { Route, Routes, useLocation } from 'react-router-dom'
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from './config/firebaseConfig';

import HomePage from "./pages/HomePage"
import Article from "./pages/Article"
import "./App.css"
import DFA from './pages/DFA/DFA'
import Footer from './components/Footer/Footer'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'


import PlayerProfile from './pages/DFA/PlayerProfile'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LeagueStanding from './pages/Tables/LeagueStanding'
import PlayerGoals from './pages/DFA/PlayerGoals'
import DivisionOnePlayerGoals from './pages/DFA/DivisionOne/DivisionOnePlayerGoals';
import PlayerAssists from './pages/DFA/PlayerAssists'
import DivisionOnePlayerAssists from './pages/DFA/DivisionOne/DivisionOnePlayerAssists';
import TeamGoals from './pages/DFA/TeamGoals'
import TeamCleanSheets from './pages/DFA/TeamCleanSheets'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import TeamPage from './pages/DFA/TeamPage'
import AllTeamsPage from './pages/DFA/AllTeamsPage'
import StatsPage from './pages/DFA/StatsPage'
import DivisionOneStatsPage from './pages/DFA/DivisionOne/DivisionOneStatsPage';
import FixturesPage from './pages/DFA/FixturesPage'
import DfaPageLargeScreens from './pages/DFA/DfaPageLargeScreens'
import AllTeamsFixtures from './pages/DFA/AllTeamsFixtures';
import TournamentBrackets from './components/TournamentBrackets/TournamentBrackets';
import HeadlineArticle from './pages/HeadLine/HeadlineArticles';


// Prediction Game Imports
import PredictionGameDashboard from '../src/GamePrediction/pages/PredictionGameDashboard';
import AdminMatchManagementPage from '../src/GamePrediction/pages/AdminMatchManagementPage';




function App() {

  const theme = useTheme();
const isAboveSM = useMediaQuery(theme.breakpoints.up('sm'));
  const location = useLocation();

  // Track page views
  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_path: location.pathname,
      page_title: document.title,
    });
  }, [location.pathname]);



  return (
    
    <div className="app-background-color">

      <Routes>

        {/* <Route path='/' element={<HomePage />} /> */}
        <Route path="/" element={isAboveSM ? <DfaPageLargeScreens />: <DFA />} />
        <Route path='/:id' element={<Article />} />
        <Route path='headline/:id' element={<HeadlineArticle />} />

        
           
        {/* <Route path='/DFA/Home' element={<DFA />} /> */}
        {/* <Route path='/DFA/Home' element={<DfaPageLargeScreens />} /> */}


        <Route path='/DFA/Home/Player/:id' element={<PlayerProfile />}/>
        <Route path='/DFA/Table' element={<LeagueStanding />} />
        <Route path='/DFA/Home/PlayerGoals' element={<PlayerGoals />} />
        <Route path='/DFA/Home/DivisionOnePlayerGoals' element={<DivisionOnePlayerGoals />} />
        <Route path='/DFA/Home/PlayerAssists' element={<PlayerAssists />} />
        <Route path='/DFA/Home/DivisionOnePlayerAssists' element={<DivisionOnePlayerAssists />} />
        <Route path='/DFA/Home/TeamGoals' element={<TeamGoals />} />
        <Route path='/DFA/Home/TeamCleanSheets' element={<TeamCleanSheets />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path='/DFA/Home/Team/:id' element={<TeamPage />} />
        <Route path='/DFA/Teams' element={<AllTeamsPage />} />
        <Route path='/DFA/Stats' element={<StatsPage />} />
        <Route path='/DFA/DivisionOneStats' element={<DivisionOneStatsPage />} />
        <Route path='/DFA/Cup' element={<TournamentBrackets />} />


        {/* <Route path='/DFA/Fixtures' element={<FixturesPage />} /> */}
        <Route path='/DFA/Fixtures' element={<AllTeamsFixtures />} />
        {/* <Route path='/Signup' element={<SignUp />} /> */}
        
       

        {/* Prediction Game Routes */}
        <Route path='/PredictionGame' element={<PredictionGameDashboard />} />
        <Route path='/Admin/Matches' element={<AdminMatchManagementPage />} />

        {/* Policy Pages */}
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />

      </Routes>

      <Footer />

      {/* <ReactQueryDevtools initialIsOpen={false} />      */}
    </div>
  )
}

export default App
