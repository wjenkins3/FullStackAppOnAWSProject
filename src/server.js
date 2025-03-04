import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1

  app.get( "/filteredimage", async (req, res) => {
    let { image_url } = req.query;

    if ( !image_url ) {
      return res.status(400).send("Query parameter image_url is expected");
    }

    // Validate query parameter
    try {
      const imageURL = new URL(image_url);
      if (imageURL.protocol !== 'http:' && imageURL.protocol !== 'https:') {
        return res.status(422).send(image_url + " is not a valid URL");
      }
    } catch (err) {
      return res.status(422).send(image_url + " is not a valid URL");
    }

    try {
      // 2. call filterImageFromURL(image_url) to filter the image
      const filteredImagePath = await filterImageFromURL(image_url);

      // 3. send the resulting file in the response
    res.status(200).sendFile(filteredImagePath);

    // 4. delete any files on the server on finish of the response
    res.on("finish", () => deleteLocalFiles([filteredImagePath]));

    return filteredImagePath;
    } catch (err) {
      console.log(err);
      return res.status(500).send("Unable to read/filter image")
    }    
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
