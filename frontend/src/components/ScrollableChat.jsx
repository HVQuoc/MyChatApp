import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin } from './config/chatLogics'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { ChatState } from '../Context/chatProvider'
import ScrollableFeed from 'react-scrollable-feed'

const ScrollableChat = ({ messages }) => {
    const { chatUser } = ChatState()
    console.log("Passed messages to ScrollableFeed", messages)
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div style={{ display: "flex" }} key={m._id}>
                    {(isSameSender(messages, m, i, chatUser._id) ||
                        isLastMessage(messages, i, chatUser._id)) && (
                            <Tooltip
                                label={m.sender.name}
                                placement="bottom-start"
                                hasArrow
                            >
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.picture}
                                />
                            </Tooltip>
                        )}
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === chatUser._id ? "#BEE3F8" : "B9F5D0"}`,
                            borderRadius: "20px",
                            padding: "5px 10px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, chatUser._id),
                            marginTop: isSameSender(messages, m, i, chatUser._id) ? 2: 6
                        }}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat
