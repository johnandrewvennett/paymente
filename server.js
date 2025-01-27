require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY); // Add your Secret Key Here
// const stripe = require('stripe')('sk_test_51QkE43C1UqQhFhw4GwzGkztdXtUt4kwHfmvNecNVtoiOxZc0BQMWHxYqcrnAEDk7c9CT56tOZBRW8V6Tc6Owv7U000drZOHsgu');

const app = express();

// This will make our form data much more useful
app.use(bodyParser.urlencoded({ extended: true }));

// This will set express to render our views folder, then to render the files as normal html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));

// Future Code Goes Here

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log('Server is running...'));



app.post("/charge", (req, res) => {
    try {
        stripe.customers
            .create({
                    name: req.body.name,
                    email: req.body.email,
                    source: req.body.stripeToken
                })
            .then(customer =>
                stripe.charges.create({
                    amount: req.body.amount * 100,
                    currency: "usd",
                    customer: customer.id
                })
            )
            .then(() => res.render("completed.html"))
            .catch(err => console.log(err));
        } catch (err) {res.send(err);}
    }
);

app.listen(process.env.PORT,() => {
    console.log(`Server is listening at http://localhost:${process.env.PORT}`);
    
});