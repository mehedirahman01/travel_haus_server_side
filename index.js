const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId

// initialization
const app = express()
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())

//connect MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shh9b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('travelHaus')
        const tourPackagesCollection = database.collection('tourPackages')

        // Get Tour Packages API 
        app.get('/packages', async (req, res) => {
            const cursor = tourPackagesCollection.find({})
            const tourPackages = await cursor.toArray()
            res.send(tourPackages)
        })

        // Get Single Package Details
        app.get('/book/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const singlePackage = await tourPackagesCollection.findOne(query)
            res.json(singlePackage)
        })


        // Post API
        app.post('/book', async (req, res) => {
            const booking = req.body
            console.log(booking)
        })
    }

    finally {
        // await client.close()
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Running TravelHaus Server")
})

app.listen(port, () => {
    console.log("Running on port", port)
})