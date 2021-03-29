const express = require('express');
const app = express();
const fs = require('fs');



app.get('/', (req, res) => {
     res.sendFile(__dirname + '/index.html');
});
app.get('/video', (req, res) => {
     //Ensure there is a range given for the video
     const range = req.headers.range;
     if(!range){
          res.status(400).send("Requires Range header");
     }
     //get video stats(about 61MB)
     const videoPath = "./bigbuck.mp4";
     const videoSize = fs.statSync(videoPath).size;
     //Parse Range
     //Example : bytes= 32324;
     const CHUNK_SIZE = 10 ** 6; //1MB
     const start = Number(range.replace(/\D/g, " "));
     const end = Math.min(start + CHUNK_SIZE, videoSize -1);

     //create header
     const contentLength = end - start + 1;
     const header = {
          "Content-Range": `bytes ${start} - ${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
     };
     //HTTP status 206 for Partial content
     res.writeHead(206, header);
     //create video read stream for this particular chunk
     const videoStream = fs.createReadStream(videoPath, {start,end});
     //stream the video chunk to the client
     videoStream.pipe(res);
});

const port = 3002;
app.listen(port, () => {
     console.log(`Server listening on port ${port}`);
});