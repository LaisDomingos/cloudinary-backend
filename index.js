const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const uploadRoutes = require("./routes/image")

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/upload", uploadRoutes)

app.listen(3001, () => {
  console.log("🚀 Servidor rodando em http://localhost:3001")
})
