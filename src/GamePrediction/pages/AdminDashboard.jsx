import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseConfig';
import appTheme from '../../css/theme';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedAdmin, setSelectedAdmin] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const idTokenResult = await user.getIdTokenResult();
      const admin = idTokenResult.claims.admin === true;
      setIsAdmin(admin);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="white">Loading...</Typography>
      </Container>
    );
  }

  if (!currentUser || !isAdmin) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">Admin access required.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={800} color="white">
          Admin Center
        </Typography>
        <Paper sx={{ p: 3, backgroundColor: 'rgba(15, 18, 28, 0.9)' }}>
          <Stack spacing={2}>
            <Typography color="rgba(255,255,255,0.7)">
              Choose what you want to manage.
            </Typography>
            <Stack spacing={2}>
              <FormControl size="small" sx={{ minWidth: 240 }}>
                <InputLabel>Admin Area</InputLabel>
                <Select
                  label="Admin Area"
                  value={selectedAdmin}
                  onChange={(event) => setSelectedAdmin(event.target.value)}
                >
                  <MenuItem value="prediction">Prediction Game</MenuItem>
                  <MenuItem value="cup">Cup Admin</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                disabled={!selectedAdmin}
                onClick={() => {
                  if (selectedAdmin === 'prediction') {
                    navigate('/Admin/Matches');
                  }
                  if (selectedAdmin === 'cup') {
                    navigate('/Admin/Cup');
                  }
                }}
                sx={{
                  backgroundColor: appTheme.colors.secondary,
                  '&:hover': { backgroundColor: appTheme.colors.secondaryDark },
                  alignSelf: 'flex-start'
                }}
              >
                Go
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default AdminDashboard;
