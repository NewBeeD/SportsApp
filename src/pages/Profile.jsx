import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,  createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'


import Box from '@mui/material/Box';

import Button from '@mui/material/Button';


import { useNavigate } from 'react-router';

import { auth } from '../config/firebaseConfig';

const Profile = () => {

  const navigate = useNavigate()


  const signOutUser = () => {


    signOut(auth).then(() => {
      navigate('/')
    }).catch((err) => console.log(err))
  }
  
  
  return (
    <>

    <Box textAlign='center'>

      <Button onClick={signOutUser}>
        LogOut
      </Button>

    </Box>
    </>
  )
}

export default Profile