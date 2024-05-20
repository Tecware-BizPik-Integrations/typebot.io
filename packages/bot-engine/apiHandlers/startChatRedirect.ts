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
  const res: any = await startChat(props)

  const urlToNotify = process.env.CREATE_CHAT_NOTIFY_URL

  if (!urlToNotify) {
    return res;
  }

  const { corsOrigin } = res;

  const fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': corsOrigin,
    },
    body: JSON.stringify(res),
  };

  await fetch(urlToNotify, fetchData)

  return res;
}
