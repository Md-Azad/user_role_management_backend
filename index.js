const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middlewares

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("server is running");
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cn37c5v.mongodb.net/?retryWrites=true&w=majority`;

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
    const usersCollection = client.db("UserManagement").collection("Users");
    const postCollection = client.db("UserManagement").collection("posts");
    const permitCollection = client.db("UserManagement").collection("permits");

    // users Apis
    app.get("/users",async(req,res)=>{
      const users = await usersCollection.find().toArray();
      res.send(users);
    })
    app.patch("/users/:email",async(req,res)=>{
      const email = req.params.email;
      const roles = req.body;
      const query = {email:email}
      // const user = await usersCollection.findOne(query)
      const updateDoc = {
        $set: {
          role: roles
        },
      };
      const result = await usersCollection.updateOne(query,updateDoc);
      res.send(result);
    })
    app.post("/users", async (req, res) => {
      const user = req.body;
     
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Post apis

    app.get("/dashboard/post",async(req,res)=>{
      
      const posts = await postCollection.find().toArray();
      res.send(posts);
    })

    app.post("/dashboard/newpost", async(req,res)=>{
      const userPost = req.body;
      const result = await postCollection.insertOne(userPost);
      res.send(result);
    })
    


    // permit related Api
    app.get("/permit",async(req,res)=>{
      const result = await permitCollection.find().toArray();
      
      res.send(result);
    })
    app.post("/permit",async(req,res)=>{
      const permits = req.body;
      console.log(permits);
      const result = await permitCollection.insertOne(permits);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port,()=>{
    console.log(`server is running on post: ${port}`)
})