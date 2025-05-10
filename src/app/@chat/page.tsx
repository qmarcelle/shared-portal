'use client'
import React from 'react'
import { useChatStore } from './stores/chatStore'
import CloudChatWrapper from './components/CloudChatWrapper'
import LegacyChatWrapper from './components/LegacyChatWrapper'

export default function ChatEntry() {
  const mode = useChatStore(s => s.chatMode)
  return mode === 'cloud'
    ? <CloudChatWrapper />
    : <LegacyChatWrapper />
}
