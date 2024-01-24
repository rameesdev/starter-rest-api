require("dotenv").config()
const {MongoClient}= require("mongodb")
console.log(process.env.URI)
const client = new MongoClient(process.env.URI)
const ytsearch = require("yt-search");
const express = require("express")
const app = express();
app.get("/api/update/:q",async(req,res)=>{
const q = req.params.q
await ytsearch.search({ query: q, pages: 1 })
.then((data) => {
console.log(data.all[0])

const render = {
  q,
  title: data.all[0].title,
  description: (data.all[0].description)?data.all[0].description:null,
  downloadUrl: `download/file/${data.all[0].videoId}`,
};

client.db("ytomp3").collection("searchCache").updateOne({q},{$set:render},{upsert:true}).then((data)=>{res.send("updated");console.log(JSON.stringify(data)+"updated")})
})
})
app.listen(3000)


