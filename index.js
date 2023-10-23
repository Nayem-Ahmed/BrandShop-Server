const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.M_DBUSER}:${process.env.M_DBPASS}@cluster0.8wqrrau.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
      client.connect();
      console.log("DB Connected Successfully✅");

  } catch (error) {
      console.log(error.name, error.message);
  }
}
dbConnect();


const productcollection = client.db('productDB').collection('product');
const addcartCollection = client.db('productDB').collection('cart');
const usercollection = client.db('userDB').collection('user')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/products', async (req, res) => {
  const newproducts = req.body;
  const result = await productcollection.insertOne(newproducts)
  res.send(result)
})
app.post('/users', async (req, res) => {
  const newpusers = req.body;
  const result = await usercollection.insertOne(newpusers)
  res.send(result)
})

app.post('/cart', async (req, res) => {
  const newpusers = req.body;
  const result = await addcartCollection.insertOne(newpusers)
  res.send(result)
})
app.get('/cart', async (req, res) => {
  const coursor = addcartCollection.find()
  const result = await coursor.toArray()
  res.send(result)

});
// ----------
app.get('/cart/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await addcartCollection.findOne(query)
  res.send(result)

})
app.delete('/cart/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await addcartCollection.deleteOne(query)
  res.send(result)

})
// app.get('/users', async (req, res) => {
//   const cursor = usercollection.find()
//   const finddata= await cursor.toArray()
//   res.send(finddata);
//   console.log(id)
// });


app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const result = productcollection.find({ brand: id });
  const finddata = await result.toArray()
  res.send(finddata);
});


app.get('/details', async (req, res) => {
  const result = productcollection.find();
  const finddata = await result.toArray()
  res.send(finddata)
})
app.get('/details/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await productcollection.findOne(query)
  res.send(result)

})
app.get('/update', async (req, res) => {
  const result = productcollection.find();
  const finddata = await result.toArray()
  res.send(finddata)
})
app.get('/update/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await productcollection.findOne(query)
  res.send(result)

})

app.put('/update/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const Option = { upsert: true }
  const updateProduct = req.body
  const Product = {
    $set: {
      name: updateProduct.name,
      brand: updateProduct.brand,
      select: updateProduct.select,
      photo: updateProduct.photo,
      description: updateProduct.description,
      rating: updateProduct.rating,
    }
  }
  const result = await productcollection.updateOne(filter, Product, Option)
  res.send(result)

})








app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})