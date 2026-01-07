import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, RedditShareButton, RedditIcon } from "react-share"

import { Box, Stack } from "@mui/material"

const SharePage = ({ title }) => {

  const page_url = window.location.href


  return (
    <Stack direction='horizontal' marginTop={1}>

    <Box marginRight={{xs: 1, sm:2}} >
      <FacebookShareButton url={page_url} title={title}>
        <FacebookIcon size={50} />
      </FacebookShareButton>
    </Box>


    <Box  marginRight={{xs: 1, sm:2}}>
      <TwitterShareButton url={page_url} title={title}>
        <TwitterIcon size={50}/>
      </TwitterShareButton>
    </Box>

    <Box  marginRight={{xs: 1, sm:2}}>
      <WhatsappShareButton url={page_url} title={title}>
        <WhatsappIcon size={50}/>
      </WhatsappShareButton>
    </Box>

  </Stack>
  )
}

export default SharePage