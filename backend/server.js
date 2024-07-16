require('dotenv').config()
const express = require('express')
const userRoutes = require("./routes/user.r")
const connectDB = require('./config/db')
const colors = require('colors')
const {notFound, errorHandler} = require("./middleware/error")

const app = express()
connectDB()
app.use(express.json())

const port = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.send("Welcome to my chat app")
})

app.use("/api/user", userRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, console.log(`App running on port ${port}`.yellow.bold));