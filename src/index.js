import dotenv from "dotenv"
import app from "./app.js"
import connect_db from "./db/Database.js"
dotenv.config({
  path: "./.env"
})

const port = process.env.PORT



connect_db()
  .then(
    app.listen(port, () => {
      console.log(`Example app Listening on port https://locathost:${port}`)
    })
  )
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

