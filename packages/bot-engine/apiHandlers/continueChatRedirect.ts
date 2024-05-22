import { continueChat } from "./continueChat"
import { ChatTopicsTypes } from "./sns/chatTopicsTypes"
import { deliveryChatMessage } from "./sns/deliveryChatMessage"

type Props = {
  origin: string | undefined
  message?: string
  sessionId: string
  shouldRedirect?: boolean
}

export const continueChatRedirect = async (props: Props) => {
  const res = await continueChat(props)

  if (!props.shouldRedirect) {
    return res;
  }

  const urlToNotify = process.env.CONTINUE_CHAT_NOTIFY_URL

  if (!urlToNotify) {
    return res;
  }

  await deliveryChatMessage(ChatTopicsTypes.CONTINUE_CHAT, res)

  return res;
}
