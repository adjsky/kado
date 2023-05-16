import Controller from "../game/controller.ts"
import SessionManager from "../game/session-manager.ts"
import { SessionFactory } from "../game/session.ts"
import { env } from "../env.ts"
import { createCtxFromReq } from "@evil-cards/ctx-log"

import type { FastifyPluginCallback } from "fastify"
import type { RedisClientWithLogs } from "@evil-cards/redis/client-with-logs"

const gameRoutes: FastifyPluginCallback<{
  redisClient: RedisClientWithLogs
}> = (fastify, { redisClient }, done) => {
  const sessionFactory = new SessionFactory()
  const sessionManager = new SessionManager(sessionFactory)
  const controller = new Controller(
    sessionManager,
    redisClient,
    {
      serverNumber: env.SERVER_NUMBER
    },
    fastify.log
  )

  fastify.get("/session", { websocket: true }, ({ socket }, req) => {
    const ctx = createCtxFromReq(req)

    controller.handleConnection(ctx, socket)
  })

  done()
}

export default gameRoutes