import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';

import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';

import Paper from '@mui/material/Paper';


import { signInWithPopup } from 'firebase/auth'

import { auth, googleProvider } from '../config/firebaseConfig'
import { trackUserLogin } from '../utils/analyticsEvents'

import theme from '../css/theme'
import { useNavigate } from 'react-router'



const Login = () => {
  const navigation = useNavigate()
  


  const signInWithGoogle = async () => {

    try{
      await signInWithPopup(auth, googleProvider).then(() => {
        trackUserLogin('google')
        navigation('/')
      })
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <Box display='flex' justifyContent='center' alignContent='center'  width='100%' height='100vh' sx={{ backgroundColor: `var(--color-color1, ${theme.colors.color1})`}}> 

      <Paper style={{ width: '90%', height: 300, margin: 'auto', textAlign: 'center'}}>

        <Card style={{height: '100%', width: '100%'}}>
          <CardContent>

            <Typography variant="h5" align="center">
            Login
            </Typography>
            
            {/* <form onSubmit={signIn}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </form> */}

            {/* <Box marginTop={2} marginBottom={2}>

              <Typography>
                New user? 
                <Link to='/Signup' style={{ font: 'inherit', color: 'black'}}> SignUp</Link>
              </Typography>
            </Box> */}

            {/* <Divider>OR</Divider> */}

            <Button onClick={signInWithGoogle} variant='contained' sx={{ marginTop: 2 }}>Signin with Google</Button>


          </CardContent>
        </Card>

      </Paper>

    </Box>
  )
}

export default Login