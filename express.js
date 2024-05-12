const express = require('express')
const cors = require("cors")
const app = express()
const port = 3000
const path = require('path')

const matchFreelancerApi = require('./router/matchFreelancer.js')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use('/matchFreelancer', matchFreelancerApi)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
  })
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

