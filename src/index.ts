import { expressMiddleware } from '@apollo/server/express4';
import express from "express";
import createApolloGraphqlServer from "./graphql/index.js";
import dotenv from "dotenv";

async function init(){
const app=express();
const PORT=Number(process.env.PORT)||8000;

app.use(express.json())

dotenv.config(
    {
        path:".env"
    }
);



app.get("/",(req,res)=>{
    res.json({
        message:"Server is up and running"
    })
})
const gqlServer=await createApolloGraphqlServer();

app.use("/graphql", expressMiddleware(gqlServer) as unknown as express.RequestHandler)


app.listen(PORT,()=>console.log(`Server is running on PORT ${PORT}`));
}
init();