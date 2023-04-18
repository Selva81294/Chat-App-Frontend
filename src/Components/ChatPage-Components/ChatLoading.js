import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack spacing={1}>
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
        <Skeleton variant="rectangular" width={210} height={40} />
    </Stack>
  )
}

export default ChatLoading