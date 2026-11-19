'use client'

import { MessageContainer } from '@/components/custom/message/MessageContainer'
import { useGeneralStore } from '@/store/generalStore'
import React, { useEffect } from 'react'

function MessagePage() {
  const {setShowPopup, setIsCollapsed, setSelectedPopUp} = useGeneralStore()
  useEffect(()=>{
    setShowPopup(true);
    setIsCollapsed(true);
    setSelectedPopUp("message")
  },[setIsCollapsed, setSelectedPopUp, setShowPopup])
  return (
        <MessageContainer message="Select a chat to start messaging." />
  )
}

export default MessagePage