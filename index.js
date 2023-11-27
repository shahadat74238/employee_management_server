const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
var cors = require("cors");
var jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose");
const port = process.env.PORT || 3003;

// ----------- Middle Ware ----------
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxghft2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const testimonialsCollection = client
      .db("employee_management")
      .collection("testimonials");

    const usersCollection = client
      .db("employee_management")
      .collection("users");

    // ----------- MiddleWare ----------
    //  verifyToken
    const verifyToken = (req, res, next) => {
      // console.log("inside verify token", req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "Unauthorize Access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorize Access " });
        }
        req.decode = decoded;
        next();
      });
    };

    // --------------- Admin related api --------------------
    app.get("/api/v1/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decode.email) {
        return res.status(403).send({ message: "Unauthorize access" });
      }
      query = { email: email };
      const user = await usersCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    // ------------- HR Related API ------------
    app.get("/api/v1/users/hr/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decode.email) {
        return res.status(403).send({ message: "Unauthorize access" });
      }
      query = { email: email };
      const user = await usersCollection.findOne(query);
      let hr = false;
      if (user) {
        hr = user?.role === "hr";
      }
      res.send({ hr });
    });

    // -------------JWT Token------------------
    app.post("/api/v1/token", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.SECRET_TOKEN, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // ------------ Testimonials Related API -------------------
    app.get("/api/v1/testimonials", async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.send(result);
    });

    //  ---------------- User Related API ------------------
    app.post("/api/v1/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.get("/api/v1/users", verifyToken, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    app.get("/api/v1/user", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
