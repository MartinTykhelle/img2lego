
const express = require('express')
const lego = require('./lego.js')
const bodyParser = require('body-parser')



const port = 3000
const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use('/', express.static('./frontend/dist'))


app.get('/data/legoColors', (req, res) => {
    res.json(lego.legoColors);
})




app.post('/data/legoImage', (req, res) => {

    let parts = req.body.image.split(';');
    let imageData = parts[1].split(',')[1];

    var image = Buffer.from(imageData, 'base64');

    lego.processFile(image, req.body.colors.split(',') ?? "1,26", function (data) {
        req.processedFile = data;
        res.json(data)

    })

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})