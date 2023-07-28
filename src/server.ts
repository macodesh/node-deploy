import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { z } from 'zod'

// Cria uma instância do Fastify.
const app = fastify()

// Cria uma instância do PrismaClient para interagir com o banco de dados.
const prisma = new PrismaClient()

// Define a rota "/users" para retornar todos os usuários do banco de dados.
app.get('/users', async (_, reply) => {
  // Consulta a tabela "user" através do Prisma e aguarda o resultado.
  const users = await prisma.user.findMany()

  // Retorna os usuários encontrados no formato JSON com status 200 (OK).
  return reply.status(200).send({ users })
})

// Define a rota "/users" para criar um novo usuário no banco de dados.
app.post('/users', async (request, reply) => {
  // Define o esquema de validação para o corpo da requisição que cria um usuário.
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  })

  // Realiza a validação do corpo da requisição com base no esquema definido acima.
  const { name, email } = createUserSchema.parse(request.body)

  // Cria um novo registro na tabela "user" do banco de dados usando os dados validados.
  await prisma.user.create({
    data: {
      name,
      email,
    },
  })

  // Retorna uma resposta vazia com status 201 (Created) para indicar que o usuário foi criado com sucesso.
  return reply.status(201).send()
})

// Obtém a porta para o servidor do ambiente (caso exista) ou usa a porta 3333 como padrão.
// A expressão "+process.env.PORT" retorna um número.
const port = process.env.PORT ? +process.env.PORT : 3333

// Inicia o servidor Fastify na porta especificada e exibe uma mensagem de confirmação.
app.listen({
  port,
  host: '0.0.0.0'
}).then(() => {
  console.log(`HTTP server running on port ${port}`)
})
