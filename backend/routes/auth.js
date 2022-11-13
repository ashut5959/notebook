const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { ResultWithContext } = require("express-validator/src/chain");
const  bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Asutoshisbigdolerboy'



//Poute 1: Create a user using: POST "/api/auth/createUser". Does't require Auth No login Required
router.post(
  "/createUser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if there are erroes , return bad result ans the errors
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false
      return res.status(400).json({success,  error: errors.array() });
    }




    // check wether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password,salt);
      console.log(secPass)

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });


      const data = {
        user:{
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_SECRET);
      
      // res.json(user);
      success = true;
      res.json({success , authToken})
      


    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);


//Route 2: Authenticate a user using POST "/api/auth/login" no login required
router.post(
  "/login",
  [
    body("email","Enter a valid email").isEmail(),
    body('password',"password cannt be blank").exists()
  ],
  async (req, res) => {

    // if there are erroes , return bad result ans the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }


    const {email, password} = req.body;

    try {
      let user = await User.findOne({email});
      let success = false;
      if(!user) {
        success = false;
        return res.status(400).json({success , error:"Please try to login with correct credentails"});

      }

      const passwordCompare  = await bcrypt.compare(password, user.password);
      if(!passwordCompare) {
        success = false;
        return res.status(400).json({success, error:"Plese try to login with correct credentails"});
      }

      const payload = {
        user:{
          id: user.id 
        }
      }
      const authToken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({success , authToken})

    } catch(error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
  }

  } 
)


// ROUTE 3: Get logedin user details  using : POST "/api/auth/getuser"
router.post(
  "/getuser", fetchuser , 
  async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch(error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
)
module.exports = router;
