const express = require("express");
const Product = require("../models/products");
const router = new express.Router();

router.post("/products", async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).send({ product });
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    // console.log(products);
    res.send(products);
  } catch (e) {
    res.status(500).send;
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
    });
    if (!product) {
      return res.status(404).send();
    }

    res.send(product);
  } catch (e) {
    res.status(500).send;
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
    });

    if (!product) {
      return res.status(404).send();
    }

    res.send(product);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/products/update/:id", async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "category", "price", "image"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res.status(404).send();
  }

  try {
    const product = await Product.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.send(error);
    res.status(500).send();
  }
});

module.exports = router;
