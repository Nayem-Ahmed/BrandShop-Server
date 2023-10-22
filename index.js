const express = require('express');
const cors = require('cors')
require('dotenv').config()
const app =express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.M_DBUSER}:${process.env.M_DBPASS}@cluster0.8wqrrau.mongodb.net/?retryWrites=true&w=majority`;

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
    const productcollection = client.db('productDB').collection('product')
    const usercollection = client.db('userDB').collection('user')
    app.post('/products',async(req,res)=>{
        const newproducts = req.body;
        console.log(newproducts)
        const result = await productcollection.insertOne(newproducts)
        res.send(result)
    })
    app.post('/users',async(req,res)=>{
        const newpusers = req.body;
        console.log(newpusers)
        const result = await usercollection.insertOne(newpusers)
        res.send(result)
    })
    app.get('/users', async (req, res) => {
      const finddata= await result.toArray()
      res.send(finddata);
      console.log(id)
    });


    app.get('/products/:id', async (req, res) => {
      const id = req.params.id; 
      const result = productcollection.find({brand:id});
      const finddata= await result.toArray()
      res.send(finddata);
      console.log(id)
    });

    
    app.get('/details',async(req,res)=>{
      const result = productcollection.find();
      const finddata= await result.toArray()
      res.send(finddata)
    })
    app.get('/details/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await productcollection.findOne(query)
      res.send(result)
      
    })
    app.get('/update',async(req,res)=>{
      const result = productcollection.find();
      const finddata= await result.toArray()
      res.send(finddata)
    })
    app.get('/update/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productcollection.findOne(query)
      res.send(result)
      
    })
    
    app.put('/update/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const  Option = {upsert:true}
      const updateProduct = req.body
      const Product ={
        $set:{
          name:updateProduct.name,
          brand:updateProduct.brand,
          select:updateProduct.select,
          photo:updateProduct.photo,
          description:updateProduct.description,
          rating:updateProduct.rating,
        }
      }
      const result = await productcollection.updateOne(filter,Product,Option)
      res.send(result)

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



app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })