// components/ui/chat-card.tsx
"use client"

import {
  SmilePlus,
  Check,
  CheckCheck,
  MoreHorizontal,
  Send,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

export interface Message {
  id: string
  content: string
  sender: {
    name: string
    avatar: string
    isOnline: boolean
    isCurrentUser?: boolean
  }
  timestamp: string
  status: "sent" | "delivered" | "read"
  reactions?: Array<{
    emoji: string
    count: number
    reacted: boolean
  }>
}

interface ChatCardProps {
  chatName?: string
  membersCount?: number
  onlineCount?: number
  initialMessages?: Message[]
  currentUser?: {
    name: string
    avatar: string
  }
  onSendMessage?: (message: string) => void
  onReaction?: (messageId: string, emoji: string) => void
  onMoreClick?: () => void
  className?: string
  theme?: "light" | "dark"
}

export function ChatCard({
  chatName = "Team Chat",
  membersCount = 3,
  onlineCount = 2,
  initialMessages = [],
  currentUser = {
    name: "You",
    avatar:
      "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-03-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
  },
  onSendMessage,
  onReaction,
  onMoreClick,
  className,
  theme = "dark",
}: ChatCardProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        isOnline: true,
        isCurrentUser: true,
      },
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      status: "sent",
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    onSendMessage?.(inputValue)

    // Имитация получения статуса сообщения
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
        ),
      )
    }, 1000)

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg,
        ),
      )
    }, 2000)
  }

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === messageId) {
          const existingReaction = message.reactions?.find(
            (r) => r.emoji === emoji,
          )
          const newReactions = message.reactions || []

          if (existingReaction) {
            return {
              ...message,
              reactions: newReactions.map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.reacted ? r.count - 1 : r.count + 1,
                      reacted: !r.reacted,
                    }
                  : r,
              ),
            }
          } else {
            return {
              ...message,
              reactions: [...newReactions, { emoji, count: 1, reacted: true }],
            }
          }
        }
        return message
      }),
    )
    onReaction?.(messageId, emoji)
  }

  const isLightTheme = theme === "light"

  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto rounded-2xl overflow-hidden",
        isLightTheme
          ? "bg-white text-zinc-900 border border-zinc-200"
          : "bg-zinc-900 text-zinc-100",
        className,
      )}
    >
      <div className="flex flex-col h-[600px]">
        {/* Header */}
        <div
          className={cn(
            "px-4 py-3 flex items-center justify-between border-b",
            isLightTheme ? "border-zinc-200" : "border-zinc-800",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-lg font-medium text-white">
                {chatName.charAt(0)}
              </div>
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2",
                  isLightTheme ? "ring-white" : "ring-zinc-900",
                )}
              />
            </div>
            <div>
              <h3
                className={cn(
                  "font-medium",
                  isLightTheme ? "text-zinc-900" : "text-zinc-100",
                )}
              >
                {chatName}
              </h3>
              <p
                className={cn(
                  "text-sm",
                  isLightTheme ? "text-zinc-500" : "text-zinc-400",
                )}
              >
                {membersCount} members • {onlineCount} online
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onMoreClick}
            className={cn(
              "p-2 rounded-full",
              isLightTheme
                ? "hover:bg-zinc-100 text-zinc-500"
                : "hover:bg-zinc-800 text-zinc-400",
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <Image
                src={message.sender.avatar}
                alt={message.sender.name}
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "font-medium",
                      isLightTheme ? "text-zinc-900" : "text-zinc-100",
                    )}
                  >
                    {message.sender.name}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      isLightTheme ? "text-zinc-500" : "text-zinc-500",
                    )}
                  >
                    {message.timestamp}
                  </span>
                </div>
                <p
                  className={cn(
                    "break-words",
                    isLightTheme ? "text-zinc-700" : "text-zinc-300",
                  )}
                >
                  {message.content}
                </p>
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {message.reactions.map((reaction) => (
                      <button
                        key={reaction.emoji}
                        onClick={() =>
                          handleReaction(message.id, reaction.emoji)
                        }
                        className={cn(
                          "px-2 py-1 rounded-lg text-sm flex items-center gap-1",
                          reaction.reacted
                            ? isLightTheme
                              ? "bg-violet-100 text-violet-600"
                              : "bg-violet-500/20 text-violet-400"
                            : isLightTheme
                              ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700",
                        )}
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center self-end mb-1">
                {message.status === "read" && (
                  <div className="flex">
                    <CheckCheck className="w-4 h-4 text-blue-500" />
                  </div>
                )}
                {message.status === "delivered" && (
                  <Check
                    className={cn(
                      "w-4 h-4",
                      isLightTheme ? "text-zinc-400" : "text-zinc-500",
                    )}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className={cn("p-4", isLightTheme ? "bg-white" : "bg-zinc-900")}>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Write a message..."
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg border-none",
                  "focus:outline-none focus:ring-1",
                  isLightTheme
                    ? "bg-zinc-100 text-zinc-900 placeholder-zinc-500 focus:ring-zinc-300"
                    : "bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:ring-zinc-600",
                )}
              />
              <button
                type="button"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full",
                  isLightTheme
                    ? "hover:bg-zinc-200 text-zinc-500"
                    : "hover:bg-zinc-700 text-zinc-400",
                )}
              >
                <SmilePlus className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              className={cn(
                "p-2.5 rounded-lg transition-colors",
                isLightTheme
                  ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-600"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-300",
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
