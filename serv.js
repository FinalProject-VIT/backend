var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Product } = require('./models/Product');
var { User } = require('./models/user');
var { myCart } = require('./models/myCart');
var { Current } = require('./models/Current');
var { Gocart } = require('./models/Gocart');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// 1 post products add it to inventory ||
app.post('/product', (req, res) => {
  var product = new Product({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    rating: req.body.rating,
    image: req.body.image
  });

  product.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//2 get to grab the inventory ||
app.get('/products', (req, res) => {
  Product.find().then((products) => {
    res.send({ products });
  }, (e) => {
    res.status(400).send(e);
  });
});

// 3 post signup ||
app.post('/signup', (req, res) => {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password

  });

  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// 4 get signin ||
app.post('/signin', (req, res) => {
  User.find({ email: req.body.email, password: req.body.password }).then((result) => {
    Current.remove({}, (done) => {
      var current = new Current({
        name: result[0].name,
        email: result[0].email
      })
      current.save().then((doc) => {
        res.send(doc);
      }, (e) => {
        res.status(400).send(e);
      })
    })
    myCart.remove({}, (done) => {

    })
  })
})

//to get the name and email of the current user ||
app.get('/current', (req, res) => {
  Current.find().then((result) => {
    var resp = {
      name: result[0].name,
      email: result[0].email
    }
    res.send(resp);
  })
})

//add to cart ||
app.post('/addtocart', (req, res) => {
  var id = req.body.id
  Current.find().then((result) => {
    email = result[0].email
    var mycart = new myCart({
      id: id,
      email: email,
      quantity: 1
    });
    mycart.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    })
  })
})

//delete item from cart ||
app.delete('/deletefromcart', (req, res) => {
  var id = req.body.id
  Current.find().then((result) => {
    email = result[result.length - 1].email
    myCart.findOneAndRemove({ id: req.body.id, email: email }, (done) => {
      res.send("deleted")
    })
  })
})


//populate cart
app.post('/cart', (req, res) => {
  var myemail = req.body.email
  let promises = []
  let response = []
  myCart.find({ email: myemail }).then((result) => {
    return Promise.all(
      result.map((item) => {
        console.log(item.id)
        return Product.find({ id: item.id })
      })
    )
  })
    .then((data) => {
      console.log('########', data)
      let modifieddata = []
      data.forEach((item) => {
        const objectData = item[0]
        modifieddata.push(objectData)
      })
      res.send(modifieddata)
    }).catch()
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
