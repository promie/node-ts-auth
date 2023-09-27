import app from './app'

const PORT = process.env.PORT || 5050

const startServer = async () => {
  return app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`)
  })
}

void startServer()