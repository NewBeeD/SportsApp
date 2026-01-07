import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// Only import InputAdornment if actually needed
import InputAdornment from '@mui/material/InputAdornment';

import { useState, useEffect } from 'react'

import axios from 'axios'
import qs from 'qs'

import { queryParams_comments } from '../../modules/DFA/QueryParams'

// Firebase setup
import { auth } from '../../config/firebaseConfig'
import { onAuthStateChanged } from "@firebase/auth"

import CommentsStructure from '../../modules/DFA/Comments/CommentsStructure'
// import AddCommentIcon from '@mui/icons-material/AddComment';
import SendIcon from '@mui/icons-material/Send';

import '../../css/comments.css'
import theme from '../../css/theme'




const Comments = ({ articleId }) => {

  const [userSignedIn, setUserSignedIn] = useState(null)

  const [author, setAuthor] = useState(null)

  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  


  const submitComment = () => {

    let payload = {data: {Author: author, content: newComment, article: Number(articleId), reaction: { thumbsUp: 0, heart: 0, smiley: 0 }}}

      axios.post('https://strapi-dominica-sport.onrender.com/api/comments', payload)
        .then(response => {

          // Update the comments state immediately to include the new comment
          const newComment = response.data;
          setComments((prevComments) => [newComment, ...prevComments]);
          setNewComment('');

          // setComments([...comments, response.data]);
          // setNewComment('');
        })
        .catch(error => console.error('Error submitting comment:', error));
 
    // Submit a new comment with reactions
  };

  useEffect(()=>{

    onAuthStateChanged(auth, (user) =>{

      if(user){

        setUserSignedIn(true)
        setAuthor(user.displayName)
      }
      else{
        setUserSignedIn(false)
      }
    })


  }, [])

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        // Set loading to true when starting the fetch
        setLoading(true);

        const queryString = qs.stringify(queryParams_comments);

        // Your API endpoint URL
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/comments?populate=*`;

        // const apiUrl = `https://strapi-dominica-sport.onrender.com/api/comments/${articleId}?${queryString}`;
  

        // Make the fetch request
        const response = await axios.get(apiUrl);
        
        // Check if the request was successful (status code 2xx)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON data
        const result = await response.data.data;

        let final_data = CommentsStructure(result)

        // Set the data state
        setComments(final_data);
        // setModalIsOpen(true);
      } catch (error) {
        // Set the error state if there's an issue
        setError(error.message);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    if (articleId) {
      fetchData();
    }

  }, [articleId]);



  return (
    <Box>

      <Divider sx={{ marginBottom: {xs: 1.5}}}>
        Comments
      </Divider>

      {comments && comments.length > 0 ? comments.filter(data_point => data_point.Article_id == articleId).map((item, idx) => {

        return(
          <Box key={idx} marginBottom={1}>

            <Card style={{ padding: 0, backgroundColor: `var(--color-color5, ${theme.colors.color5})`}}>

              <CardContent>

                <Typography variant='body2' style={{ fontWeight: 'bold', marginBottom: '2px', color: 'white'}}>{item.author}</Typography>
                <Typography variant='caption' style={{ color: 'white'}}>{item.content}</Typography>

              </CardContent>
            </Card>
          </Box>
        )
      }): <Skeleton variant='rectangle' />}

      

      {/* <Card>

        <CardContent>

            

        </CardContent>

      </Card> */}

      <TextField
            label={userSignedIn? 'Write a comment': 'Sign in to comment'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            multiline
            rows={1}
            InputProps={{
              endAdornment:(
              <InputAdornment position='end'>
                <IconButton edge='start' onClick={submitComment} disabled={!userSignedIn}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>)
            }}
            sx={{ marginBottom: 2}}
            disabled={!userSignedIn}
            />      

    </Box>
  )
}

export default Comments