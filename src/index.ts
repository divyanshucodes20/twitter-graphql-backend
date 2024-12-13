import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init(){
const app=express();
const PORT=Number(process.env.PORT)||8000;

app.use(express.json())

const gqlServer=new ApolloServer({
    typeDefs:`
    type Query{
    hello:String
    say(name:String):String
    }
    `,
    resolvers:{
        Query:{
            hello:()=>`Hey there graphql server here`,
            say:(_,{name}:{name:string})=>`Hey ${name} Welcome Here`
        }
    }
})

await gqlServer.start()

app.get("/",(req,res)=>{
    res.json({
        message:"Server is up and running"
    })
})

app.use("/graphql", expressMiddleware(gqlServer) as unknown as express.RequestHandler)


app.listen(PORT,()=>console.log(`Server is running on PORT ${PORT}`));
}
init();