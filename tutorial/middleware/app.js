const express = require('express')
const app = express()
const PORT = 5000

const customMiddleware = (req, res, next) => {
    console.log("middleware executed")
    next()
}

// first middleware is executed and it will be executed for all thr routes
// app.use(customMiddleware)

app.get("/", (req, res) => {
    console.log("home")
    res.send("Hello World")
})

// middleware will be executed for /about route
app.get("/about", customMiddleware, (req, res) => {
    console.log("about")
    res.send("About Page")
})

app.listen(PORT, () => {
    console.log("Server is running on PORT: ", PORT)
})