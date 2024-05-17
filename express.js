const express = require('express')
const cors = require("cors")
const app = express()
const path = require('path')

const https = require("https")
const fs = require("fs")

const port = 3000

const options = {
    key: fs.readFileSync("./cert.key"),
    cert: fs.readFileSync("./cert.crt"),
}

const matchFreelancerApi = require('./router/matchFreelancer.js')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use('/matchFreelancer', matchFreelancerApi)

app.get('/', (req, res) => {
    console.log(1)
    res.send('Hello, HTTPS!');
});

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html")
//   })
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })

https.createServer(options, app).listen(8080, () => {
    console.log(`HTTPS server started on port 8080`)
})

