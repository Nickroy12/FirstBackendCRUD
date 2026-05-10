const express = require('express');
const dotenv = require('dotenv')
const app = express();

const cors = require('cors');
dotenv.config()
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri= process.env.MONGODB_URI;
app.use(cors());
app.use(express.json());
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
app.get('/', (req, res) => {
    res.send('hello Express');
});
// mongodb+srv://cruduser:8xBMXH3MO98zibxp@cluster0.4fqkvtd.mongodb.net/?appName=Cluster0
const run = async () =>{
    try{
         const database = client.db("crudeDb");
         const userCollection = database.collection("users")
         app.get('/users', async(req , res)=>{
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            res.send(result)
         })
         app.get('/users/:id', async(req , res)=>{
            
            const id = req.params.id;
  
            const query = {
                _id : new ObjectId(id)
            }
            const user = await userCollection.findOne(query)
            console.log(id);
            res.send(user)
         })
         app.post('/users' , async(req,res)=>{
            const newUser = req.body;
            console.log(newUser , "New user");
            const result = await userCollection.insertOne(newUser)
            res.send(result)
         })
         app.patch('/users/:id', async(req , res)=>{
            const id = req.params.id;
            const filter = {
                _id : new ObjectId(id)
            }
            const modifiedUser = req.body

            const updateUsers = {
                $set:{
                    name: modifiedUser.name,
                    email: modifiedUser.email,
                    role:modifiedUser.role,
                } 
            }
            const result = await userCollection.updateOne(filter , updateUsers)

            res.send(result)

         })
         app.delete('/users/:id', async(req , res)=>{
            
            const id = req.params.id;
  
            const query = {
                _id : new ObjectId(id)
            }
            const user = await userCollection.deleteOne(query)
            console.log(id);
            res.send(user)
         })
       await client.connect();
       await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }finally{
        // await  client.close()

    }
}

run().catch(console.dir)
app.listen(port, () => {
    console.log(`Server has running at ${port}`);
});
