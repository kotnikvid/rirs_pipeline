import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import dbRoutes from "./src/dbRoutes.js";
import cors from "cors";
import {verifyToken} from '@clerk/express'

const app = express();
const PORT = 3000;

const corsOptions ={
  origin:'http://localhost:5173', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}


app.use(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")
  if (token == null) {
    res.status(403);
    return;
  }

  try {
    const verifiedToken = await verifyToken(token, {
      jwtKey : process.env.JWT_KEY
    })
    req.auth = {
      sessionId: verifiedToken.sid,
      userId: verifiedToken.sub
    }
  } catch (e) {
    console.error(e)
    res.status(403);
  }

    next()
})

app.use(bodyParser.json());
app.use("/db", dbRoutes);
app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
