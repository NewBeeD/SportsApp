import { Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { logEvent } from 'firebase/analytics';
import { analytics } from './config/firebaseConfig';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Loading fallback component
function PageLoader() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );
}

import "./App.css"
import NavBar from './components/homePage/NavBar'
import Footer from './components/Footer/Footer'

// Lazy load pages to enable code splitting
const HomePage = lazy(() => import("./pages/HomePage"))
const Article = lazy(() => import("./pages/Article"))
const DfaHomepage = lazy(() => import('./pages/DFA/DfaHomepage'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const PlayerProfile = lazy(() => import('./pages/DFA/PlayerProfile'))
const LeagueStanding = lazy(() => import('./pages/Tables/LeagueStanding'))
const PlayerGoals = lazy(() => import('./pages/DFA/PlayerGoals'))
const DivisionOnePlayerGoals = lazy(() => import('./pages/DFA/DivisionOne/DivisionOnePlayerGoals'))
const PlayerAssists = lazy(() => import('./pages/DFA/PlayerAssists'))
const DivisionOnePlayerAssists = lazy(() => import('./pages/DFA/DivisionOne/DivisionOnePlayerAssists'))
const TeamGoals = lazy(() => import('./pages/DFA/TeamGoals'))
const TeamCleanSheets = lazy(() => import('./pages/DFA/TeamCleanSheets'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Profile = lazy(() => import('./pages/Profile'))
const TeamPage = lazy(() => import('./pages/DFA/TeamPage'))
const AllTeamsPage = lazy(() => import('./pages/DFA/AllTeamsPage'))
const StatsPage = lazy(() => import('./pages/DFA/StatsPage'))
const DivisionOneStatsPage = lazy(() => import('./pages/DFA/DivisionOne/DivisionOneStatsPage'))
const FixturesPage = lazy(() => import('./pages/DFA/FixturesPage'))
const AllTeamsFixtures = lazy(() => import('./pages/DFA/AllTeamsFixtures'))
const TournamentBrackets = lazy(() => import('./components/TournamentBrackets/TournamentBrackets'))
const HeadlineArticle = lazy(() => import('./pages/HeadLine/HeadlineArticles'))
const PredictionGameDashboard = lazy(() => import('./GamePrediction/pages/PredictionGameDashboard'))
const AdminMatchManagementPage = lazy(() => import('./GamePrediction/pages/AdminMatchManagementPage'))







function App() {

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
      <NavBar />
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Unified responsive homepage - works on all devices */}
          <Route path="/" element={<DfaHomepage />} />
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
      </Suspense>

      <Footer />
    </div>
  )
}

export default App
