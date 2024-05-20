import { continueChat } from "./continueChat"

type Props = {
  origin: string | undefined
  message?: string
  sessionId: string
  shouldRedirect?: boolean
}

export const continueChatRedirect = async (props: Props) => {
  const res: any = await continueChat(props)

  if (!props.shouldRedirect) {
    return res;
  }

  const urlToNotify = process.env.CONTINUE_CHAT_NOTIFY_URL

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
