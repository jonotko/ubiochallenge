import express, { NextFunction, Request, Response } from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import groupRouter from './resources/group/group.router'
import { useDb } from './utils/database'
import HttpException from './utils/exceptions'

export const app = express()

const port = 3000;

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api', groupRouter)

app.use((err: HttpException ,req: Request, res: Response, next: NextFunction) => {
	const message = err.message || 'Something went wrong'
	console.log(err.stack)
	res.status(500).json({message})
})

export const start = async () => {
  try {
    await useDb()
		console.log('Connected to mongo')
    app.listen(port, () => {
      console.log(`REST API on http://localhost:${port}/api`)
    })
  } catch (error) {
    console.error(`Error occured: ${error}`)
  }
}