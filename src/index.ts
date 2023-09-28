import app from './app'
import { logger } from './utils/logger'

const PORT = process.env.PORT || 5050

const startServer = async () => {
  return app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
  })
}

startServer()
