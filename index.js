const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT || 4000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elbg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const ObjectId = require('mongodb').ObjectId;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// console.log(uri);
// img, name, description, button, id, price, rating, ldescription

async function run() {

    try {
        await client.connect();
        // console.log('connected');
        const database = client.db('tourMongo');
        const spotCollection = database.collection('spots');
        const ordersCollection = database.collection('orders');
        app.get('/spots', async (req, res) => {
            const cursor = spotCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const result = await spotCollection.findOne(query);
            res.send(result);
        })
        app.post('/spots', async (req, res) => {
            const doc = req.body;
            const result = await spotCollection.insertOne(doc);
            res.send(result.acknowledged);
        })
        app.delete('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const result = await spotCollection.deleteOne(query);
            // console.log(result);
            res.send(result.acknowledged);
        })
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // app.get('/orders/:uid', async (req, res) => {
        //     const uid = req.params.uid;
        //     const query = {
        //         UID: uid
        //     }
        //     const result = await ordersCollection.findOne(query);

        //     res.send(result?.orders);
        // })
        // app.put('/orders/:uid', async (req, res) => {
        //     //finds whether previous order available
        //     const uid = req.params.uid;
        //     //console.log(uid);
        //     //utility
        //     const query = { UID: uid };
        //     const options = { upsert: true };
        //     //get prev
        //     const check = await ordersCollection.findOne(query);
        //     let prev = [];
        //     if (check) {
        //         prev = check.orders;
        //     }

        //     const newOrder = req.body;
        //     //console.log(newOrder);
        //     //combine
        //     const latest = [...prev, newOrder];
        //     //get ready
        //     const updated = {
        //         $set: {
        //             orders: latest
        //         }
        //     }
        //     const result = await ordersCollection.updateOne(query, updated, options);
        //     //   console.log(latest);
        //     res.send(result.acknowledged);
        // })
        app.put('/orders/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updated = {
                $set: {
                    status: "approved"
                }
            }
            const result = await ordersCollection.updateOne(query, updated, options);
            // console.log(result);
            res.send(result.acknowledged);
        })
        app.post('/orders', async (req, res) => {
            const toSave = req.body;
            console.log(toSave);
            const result = await ordersCollection.insertOne(toSave);
            res.send(result.acknowledged);
        })
        // app.delete('/orders', async (req, res) => {
        //     const result = await ordersCollection.deleteMany({});
        //     // console.log(result);
        //     res.send(result.acknowledged);
        // })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            // console.log(query);

            const result = await ordersCollection.deleteOne(query);
            console.log(result);

            res.send(result.acknowledged);
        })

    }
    finally {

    }

}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('working');
})

app.listen(port, () => {
    console.log(port);
})