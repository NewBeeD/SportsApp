import { useParams } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"

import qs from 'qs'
import axios from "axios"

import { queryParams_articles } from "../modules/DFA/QueryParams"
import SingleStructuredDisplay from "../modules/Homepage/TrendingSection/SingleArticleDisplayStructure"

import ImageSlideshow from "../components/Article/ImageSlideshow"
import Comments from "../components/Article/Comments"
import { BlocksRenderer } from '@strapi/blocks-react-renderer';



import SharePage from "../components/ShareButtons/SharePage"

// Redux

import {  Box, Typography, Skeleton, Divider } from '@mui/material'

import ParagraphsDisplay from "../components/Article/ParagraphsDisplay";

import theme from "../css/theme"



const Article = () => {

  // GetArticles()
  const { id } = useParams()

  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const renderedRichText = useMemo(() => {
    if (articles?.RichText && articles.RichText !== 'none') {
      return (
        
        <BlocksRenderer
          content={articles.RichText}
          blocks={{
            image: ({ image }) => (
              <Box width={{ xs: '100%', sm: 800, md: 1000 }}>
                <img
                  src={image.url}
                  alt="Article Image"
                  style={{ objectFit: 'cover', objectPosition: '50% 50%' }}
                  loading="lazy"
                  height='100%' 
                  width='100%'
                />
              </Box>
            ),
            heading: ({ children, level }) => (
              <Typography variant={`h${level}`} gutterBottom>
                {children}
              </Typography>
            ),
            paragraph: ({ children }) => <Typography>{children}</Typography>,
          }}
        />
      );
    }
    return null;
  }, [articles]);
  

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        // Set loading to true when starting the fetch
        setLoading(true);

        const queryString = qs.stringify(queryParams_articles);

        // Your API endpoint URL
        const apiUrl = `https://strapi-dominica-sport.onrender.com/api/articles/${id}?${queryString}`;
  

        // Make the fetch request
        const response = await axios.get(apiUrl);

        // Check if the request was successful (status code 2xx)
        if (response.status !== 200) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the JSON data
        const result = await response.data.data;

        let final_data = SingleStructuredDisplay(result)         
                    
        // Set the data state
        setArticles(final_data);
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
    if (id) fetchData();

  }, [id]);


    return (

      <Box width={{xs: '100%', sm: 800, md: 1000}} margin='auto'>
  
          
        <Box margin='auto' width= {{ xs: '90%'}}>
  
          {articles? 
            (
  
              <Box>
  
                {articles.RichText && articles.RichText === 'none'? <Box marginTop={4} paddingTop={4}>
                  <Typography style={{ color: `var(--color-color1, ${theme.colors.color1})`}} variant="h4" sx={{ textAlign: 'left'}}>{articles.title}</Typography>
                </Box>: ''}               
                
  
                {articles.RichText && articles.RichText === 'none'? <Box marginY={2} >
                  <img loading='lazy' width='100%' src={articles.url[0]}/>
                </Box>:<Box paddingTop={4} />}
  
                <Box 
                style={{ color: `var(--color-color3, ${theme.colors.color3})`}} 
                marginTop={1} 
                sx={{ fontSize: {xs: '20px'}, 
                fontWeight: 'bolder'}}
                letterSpacing={2}>
                  {articles.type}
                </Box>
  
                <Box 
                style={{ color: `var(--color-color3, ${theme.colors.color3})`}} 
                marginTop={0.5} 
                sx={{ fontSize: {xs: '12px'}}}
                >
                  {articles.author}
                </Box>
                
                <Box style={{ color: `var(--color-color1, ${theme.colors.color1})`}} marginTop={0.5} sx={{ fontSize: {xs: '12px'}}}>{articles.date}</Box>
  
  
                <Divider sx={{ marginTop: 1}} />
  
                {articles.RichText && articles.RichText === 'none'? <Box marginTop={3.5} sx={{ textAlign: 'left'}}>
                  <ParagraphsDisplay paragraphs={articles.body_content} />
                </Box>: ''}
  
  
                {/* Rich Text Area - Beginning */}
  
                {articles.RichText != 'none' ? <Box 
                display='flex' 
                flexDirection='column'
                alignItems='center'
                >
  
                  <BlocksRenderer content={articles.RichText}  blocks={{
                    image: ({image}) => {
  
                      return(
  
                        <Box width={{xs: '100%', sm: 800, md: 1000}} >
                          
                          <img 
                            src={image.url} 
                            alt='Article Image' 
                            height='100%' 
                            width='100%' 
                            style={{ objectFit: 'cover', objectPosition: "50% 50%"}}
                            loading='lazy'
                          />
  
                        </Box>
                      )
                      
                    },
                    heading: ({children, level}) =>{
  
                      switch(level){
  
                        case 1:
                          return <Typography width={{xs: '100%', sm: 800, md: 1000}} variant='h2' textAlign='center' paddingTop={2} paddingBottom={2}>{children}</Typography>
  
                        case 2:
                          return <Typography width={{xs: '100%', sm: 800, md: 1000}} variant='h2' textAlign='center' paddingTop={2} paddingBottom={2}>{children}</Typography>
  
                        case 3:
                          return <Typography width={{xs: '100%', sm: 800, md: 1000}} variant='h2' textAlign='center' paddingTop={2} paddingBottom={2} >{children}</Typography>
  
                        case 4:
                          return <Typography width={{xs: '100%', sm: 800, md: 1000}} variant='h4' textAlign='left' paddingTop={2} paddingBottom={2} lineHeight={{ xs: 1, sm: 'inherit'}}>{children}</Typography>
  
                        case 5:
                          return <Typography width={{xs: '100%', sm: 800, md: 1000}} variant='h5' textAlign='center' paddingTop={2} paddingBottom={2}>{children}</Typography>
  
                        case 6:
                          return <Typography width={{xs: '100%', sm: 800, md: 1000}} variant='h6' textAlign='center' paddingTop={2} paddingBottom={2}>{children}</Typography>
                      }
                    }, 
                    paragraph: ({ children }) => {
                      return(
                        <Typography width={{xs: '100%', sm: 800, md: 1000}} align='left' >
                          {children}
                        </Typography>
                      )
                    },
                    code: ({ children }) => {

                      return(
                        <Box marginBottom={3} width={{xs: '100%', sm: 800, md: 1000}} fontSize={13} paddingLeft={0.5}>
                          {children}
                        </Box>
                      )
                    }
                  }}/>

                  {/* {renderedRichText} */}

                </Box>: ''}
  
  
                {/* Rich Text Area - Ending */}
  
                {/* <Box marginTop={4} /> */}
  
                {/* Share Buttons Here */}
  
  
  
  
  
  
                <Divider orientation='horizontal' sx={{ marginY: 3}} />
  
                {/* <Divider orientation='vertical' sx={{ marginY: 3}} /> */}

                {articles.RichText && articles.RichText === 'none' && articles.url.length > 2 ? <ImageSlideshow images={articles.url} />: ''}

                <Divider orientation='horizontal' sx={{ marginY: 3}} />
              
  
                <Box marginTop={4}>
  
                  <Typography variant="h5" style={{ textDecoration: 'underline'}}>Share</Typography>
                </Box>

                <SharePage title={articles.title} />
  
                {/* <Box>
                  {articles.url.length > 1? articles.url.map((articles, idx) => {
  
                    return(
                        <img key={idx} width='100%' src={articles} onClick={() => openModal(idx)} style={{ cursor: 'pointer'}}/>
                    )
  
                  }): ''}
                </Box> */}
                
              </Box>
            ): <Skeleton width='100%' height='500px' variant="rectangular" sx={{ marginTop: 4}} />}
  
            <Comments articleId={id} />
  
        </Box>
  
      </Box>
    )




  



}

export default Article