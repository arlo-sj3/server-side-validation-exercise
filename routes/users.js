'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/' , (req, res, next) => {
  knex('users')
    .select( 'id', 'firstname', 'lastname', 'username', 'phone', 'email')
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/' , (req, res, next) => {



  let firstName = req.body.users.firstName;
  let lastName = req.body.users.lastName;
  let username = req.body.users.username;
  let email = req.body.users.email;
  let phone = req.body.users.phone;
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;


  if (!firstName || firstName.trim() === '') {
      const err = new Error('First Name must not be blank');
      err.status = 400;
      console.log(err)
      return next(err);
    }

    if (!lastName || lastName.trim() === '') {
        const err = new Error('Last Name must not be blank');
        err.status = 400;
        console.log(err)
        return next(err);
      }

      if (!username || username.trim() === '' || username.length < 6 || !isNaN(+username[0] ||  (username.search(/[.,#!$%&*;:{}=\-_`~()]/) > 0)) ){
          const err = new Error('Username must not be blank and must start with a letter');
          err.status = 400;
          console.log(err)
          return next(err);
        }

        if (!phone || phone.trim() === ''||phone.length !== 10|| isNaN(+phone)){
            const err = new Error('Phone must not be blank');
            err.status = 400;
            console.log(err)
            return next(err);
          }

          function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

if (email) {
  if(validateEmail(email)){
  }
  else{
    const err = new Error('Email invalid');
    err.status = 400;
    console.log(err)

    return next(err);

  }
}




  knex('users')
    .insert({
      firstname: firstName,
      lastname: lastName,
      username: username,
      email: email,
      phone: phone
    })
    .returning(['firstname', 'lastname', 'username','phone','email'])
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
