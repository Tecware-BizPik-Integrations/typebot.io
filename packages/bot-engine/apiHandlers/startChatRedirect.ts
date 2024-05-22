import { ChatTopicsTypes } from "./sns/chatTopicsTypes"
import { deliveryChatMessage } from "./sns/deliveryChatMessage"
import { startChat } from "./startChat"

type Props = {
  origin: string | undefined
  message?: string
  isOnlyRegistering: boolean
  publicId: string
  isStreamEnabled: boolean
  prefilledVariables?: Record<string, unknown>
  resultId?: string
  shouldRedirect?: boolean
}

export const startChatRedirect = async (props: Props) => {
  const res = await startChat(props)

  if (!props.shouldRedirect) {
    return res;
  }

  const urlToNotify = process.env.CREATE_CHAT_NOTIFY_URL

  if (!urlToNotify) {
    return res;
  }

  await deliveryChatMessage(ChatTopicsTypes.NEW_CHAT, res)

  return res;
}
