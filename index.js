const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb uri
const uri = process.env.MONGODB_URI;

// mongodb client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// home route
app.get('/', (req, res) => {
  res.send('Hello Express');
});

const run = async () => {
  try {

    // database + collection
    const database = client.db('crudeDb');
    const userCollection = database.collection('users');

    // =========================
    // GET ALL USERS (ONLY ID + NAME)
    // =========================
    app.get('/users', async (req, res) => {

      const cursor = userCollection.find(
        {},
        {
          projection: {
            name: 1
          }
        }
      );

      const result = await cursor.toArray();

      res.send(result);
    });

    // =========================
    // GET SINGLE USER (FULL DETAILS)
    // =========================
    app.get('/users/:id', async (req, res) => {

      const id = req.params.id;

      const query = {
        _id: new ObjectId(id)
      };

      const user = await userCollection.findOne(query);

      res.send(user);
    });

    // =========================
    // CREATE USER
    // =========================
    app.post('/users', async (req, res) => {

      const newUser = req.body;

      console.log(newUser, 'NEW USER');

      const result = await userCollection.insertOne(newUser);

      res.send(result);
    });

    // =========================
    // UPDATE USER
    // =========================
    app.patch('/users/:id', async (req, res) => {

      const id = req.params.id;

      const filter = {
        _id: new ObjectId(id)
      };

      const modifiedUser = req.body;

      const updateDoc = {
        $set: {
          name: modifiedUser.name,
          email: modifiedUser.email,
          role: modifiedUser.role
        }
      };

      const result = await userCollection.updateOne(filter, updateDoc);

      res.send(result);
    });

    // =========================
    // DELETE USER
    // =========================
    app.delete('/users/:id', async (req, res) => {

      const id = req.params.id;

      const query = {
        _id: new ObjectId(id)
      };

      const result = await userCollection.deleteOne(query);

      res.send(result);
    });

    // connect mongodb
    await client.connect();

    // ping mongodb
    await client.db('admin').command({ ping: 1 });

    console.log('✅ Connected to MongoDB');

  } finally {

    // keep server running
    // await client.close()

  }
};

run().catch(console.dir);

// server run
app.listen(port, () => {
  console.log(`🚀 Server running at port ${port}`);
});