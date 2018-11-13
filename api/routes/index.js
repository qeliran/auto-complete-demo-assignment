const express = require('express'),
      router = express.Router(),
      jwt = require('express-jwt');

const auth = jwt({
  secret: process.env.DEMO_JWT_SECRET,
  userProperty: 'payload'
});

const ctrlProfile = require('../controllers/profile');
const ctrlAuth = require('../controllers/authentication');
const ctrlAnimal = require('../controllers/animal');

//user
router.get('/profile', auth, ctrlProfile.GetUser);

//animals
router.get('/animals', /*auth,*/ ctrlAnimal.GetAnimals);
router.post('/newanimal', /*auth,*/ ctrlAnimal.InsertUpdateAnimal);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
