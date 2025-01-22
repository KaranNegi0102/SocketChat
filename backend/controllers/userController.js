const UserSchema = require("../model/UserModel");
const registerController = async (req, res) => {
  const {name, email, password} = req.body;
  try{
    if(!name || !email || !password){
      return res.status(400).json({message: "All fields are required"});
    }
    const existingUser = await UserSchema.findOne({email});
    if(existingUser){
      return res.status(400).json({message: "User already exists"});
    }

    const user = await UserSchema.create(
      {
      name,
      email,
      password
    });
    console.log(user);
    return res.status(201).json({message: "User created successfully", user});
  }
  catch(err){
    return res.status(500).json({message: err.message});
  }

};

const loginController = async (req, res) => {
  const {email, password} = req.body;
  if(!email || !password){
    return res.status(400).json({message: "All fields are required"});
  }
  try{
    const user = await UserSchema.findOne({email});
    if(!user){
      return res.status(400).json({message: "User does not exist"});
    }
    console.log("user found ",user)
    return res.status(200).json({message: "User logged in successfully", user});

  }catch(err){
    return res.status(500).json({message: err.message});
  }
}


module.exports = { registerController, loginController };