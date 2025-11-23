import express from "express"
import router from "./routes/auth.route.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import cookieParser from "cookie-parser"

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use("/api/v1/healthchecker", healthcheckRouter)
app.use("/api/v1/authuser", router)

app.get("/", (req, res) => {
    res.send("Hello Bro")
})


app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

export default app