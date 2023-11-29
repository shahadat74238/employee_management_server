const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
var cors = require("cors");
var jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("./schema/user.models");
const { Testimonials } = require("./schema/testimonials.model");
const { Works } = require("./schema/workSheet.model");

const port = process.env.PORT || 3003;

// ----------- Middle Ware ----------
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxghft2.mongodb.net/employee_management?retryWrites=true&w=majority`;

async function run() {
  try {
    // connect mongoose.
    await mongoose.connect(uri);

    // ----------- MiddleWare ----------

    //  verifyToken
    const verifyToken = (req, res, next) => {
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
      const user = await User.findOne(query);
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
      const user = await User.findOne(query);
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
      const testimonials = await Testimonials.find();
      res.send(testimonials);
    });

    //  ---------------- User Related API ------------------
    app.post("/api/v1/users", async (req, res) => {
      const user = req.body;
      const userSchema = new User(user);
      await userSchema.save();
      res.send(userSchema);
    });

    app.get("/api/v1/users", verifyToken, async (req, res) => {
      const users = await User.find();
      res.send(users);
    });

    app.get("/api/v1/user", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const singleUser = await User.findOne(query);
      res.send(singleUser);
    });

    // -------------- work sheet related api ------------
    app.post("/api/v1/works", verifyToken, async (req, res) => {
      const work = req.body;
      const workSchema = new Works(work);
      await workSchema.save();
      res.send(workSchema);
    });

    app.get("/api/v1/works", verifyToken, async (req, res) => {
      const works = await Works.find();
      res.send(works);
    });

    app.get("/api/v1/userWorks", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const works = await Works.find(query);
      res.send(works);
    });

    // --------------- Verify User -------------
    app.patch("/api/v1/verify/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = {_id: id}
      const updatedDoc = {
        $set: {
          isPending: true,
        },
      };
      const result = await User.updateOne(query, updatedDoc);
      res.send(result);
    });

    // --------------- Change Employee Role -------------
    app.patch("/api/v1/hr/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = {_id: id}
      const updatedDoc = {
        $set: {
          role: "hr",
        },
      };
      const result = await User.updateOne(query, updatedDoc);
      res.send(result);
    });

    // --------------- Delete User -------------
    app.delete("/api/v1/users/:id",verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = {_id: id}
      const result = await User.deleteOne(query);
      res.send(result);
    });



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
