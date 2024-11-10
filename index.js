const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
//app.use(cors({ origin: "https://toysafari-b6250.web.app" }));
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.3afop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollection = client.db('toyDB').collection('toy');

    app.get('/addtoys', async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/addtoys', async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    })

    app.get('/addtoys/:id', async (req, res) => {
      const id = req.params.id;
      const toy = await toyCollection.findOne({ _id: new ObjectId(id) });
      res.send(toy);
    })

    app.get('/mytoys/:sellerId', async (req, res) => {
      const sellerId = req.params.sellerId;
      console.log(`Fetching toys for sellerId: ${sellerId}`); // Debugging line
      const myToys = await toyCollection.find({ sellerId }).toArray();
      console.log(myToys); // Check the data here
      res.send(myToys);
    });

    app.get('/update/:id', async (req, res) => {
      const id = req.params.id;
      const result = await toyCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedToy = req.body;
      const updated = {
        $set: {
          pictureUrl: updatedToy.pictureUrl,
          name: updatedToy.name,
          sellerName: updatedToy.sellerName,
          sellerEmail: updatedToy.sellerEmail, 
          subCategory: updatedToy.subCategory,
          price: updatedToy.price,
          rating: updatedToy.rating,
          quantity: updatedToy.quantity,
          description: updatedToy.description
        }
      }

      const result = await toyCollection.updateOne(filter, updated, options);
      res.send(result);
    })

    app.delete('/mytoys/:Id', async (req, res) => {
      const Id = req.params.Id;
      const query = { _id: new ObjectId(Id) }
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('SIMPLE CRUD IS RUNNING');
})

app.listen(port, () => {
  console.log(`Crud running,${port}`)
})



