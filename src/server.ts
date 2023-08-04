import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { z } from 'zod'

const app = fastify()
const prisma = new PrismaClient()

app.get('/users', async (_, reply) => {
  const users = await prisma.user.findMany()
  return reply.status(200).send({ users })
})

app.post('/users', async (request, reply) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  })

  const { name, email } = createUserSchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
    },
  })

  return reply.status(201).send()
})

const port = process.env.PORT ? +process.env.PORT : 3333

app.listen({
  port,
  host: '0.0.0.0'
}).then(() => {
  console.log(`HTTP server running on port ${port}`)
})
