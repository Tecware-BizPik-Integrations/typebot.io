import { publicProcedure } from '@/helpers/server/trpc'
import {
  startChatInputSchema,
  startChatResponseSchema,
} from '@typebot.io/schemas/features/chat/schema'
import { startChatRedirect as startChatFn } from '@typebot.io/bot-engine/apiHandlers/startChatRedirect'

export const startChat = publicProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/v1/typebots/{publicId}/startChat',
      summary: 'Start chat',
    },
  })
  .input(startChatInputSchema)
  .output(startChatResponseSchema)
  .mutation(async ({ input, ctx: { origin, res } }) => {
    const { corsOrigin, ...response } = await startChatFn({
      ...input,
      origin,
    })
    if (corsOrigin) res.setHeader('Access-Control-Allow-Origin', corsOrigin)
    return response
  })
