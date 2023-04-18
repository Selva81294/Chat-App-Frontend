import { Box } from '@mui/material'
import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat'

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState()
  return (
    <Box  display={ {xs: selectedChat ? "flex" : "none", sm: "flex"} } 
    alignItems="center" flexDirection="column" pl={3} pt={1} pr={1} bgcolor="#A0DAA9" width={{xs: "100%", sm: "68%"}}
    borderLeft={{xs: "none", sm: "8px solid #00A170"}} >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox