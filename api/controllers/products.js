const Product = require('../models/product');
const mongoose = require('mongoose')

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs
      }
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}

exports.products_create_product = (req, res, next) => {
  // console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  product
    .save().
    then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Product Created Successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err})
    });
}

exports.products_get_single_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({
          message: 'No valid entry found'
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err})
    });
}

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, {$set: updateOps})
    .exec() 
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
}

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
}