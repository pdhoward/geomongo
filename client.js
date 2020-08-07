
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID

const generateRandomPoints = (center, radius, count) => {

  return new Promise((resolve, reject) => {
    let points = [];
    for (var i=0; i<count; i++) {
      points.push(generateRandomPoint(center, radius));
    }
    resolve(points)
  })
  
}
const generateRandomPoint = (center, radius) => {
  let r = radius/111300 // converts radius from meters to degrees
  let y0 = center.lat
  let x0 = center.lng
  let u = Math.random()
  let v = Math.random()
  let w = r * Math.sqrt(u)
  let t = 2 * Math.PI * v
  let x = w * Math.cos(t)
  let y1 = w * Math.sin(t)
  let x1 = x / Math.cos(y0)
  return{'lat': y1+y0, 'lng': x1+x0}
  //newY = y0 + y1
  //newX = x0 + x1
}

exports.createClient = (client) => {  
  let db = {} 
  db.getVenues = (obj) => {
    return new Promise ((resolve, reject) => {      
        client.db().collection('markets').aggregate([
            {
              "$geoNear": {
                  "near": {
                      "type": "Point",
                      "coordinates": [ -84.601614, 34.005286 ]
                  },
                  "distanceField": "calculated",
                  "maxDistance": 10,
                  "spherical": true
                }
              }          
          ],
          function(err, docs){
              if (err){
                  console.log(err)
              }
              else{
                  docs.toArray((error, result) => {
                    if(error) console.log(error)
                    resolve(result)
                  })
              }
          })
      })       
    },
  db.getRandom = (obj) => {
    // execute function, with center (c) radius (r) count (n)
    // Generates n points that is in a r km radius from the given c.
    return new Promise (async (resolve, reject) => {      
      let randomGeoPoints = await generateRandomPoints({'lat':30.267153, 'lng':-97.7430608}, 600, 10);  
      resolve(randomGeoPoints)
    }) 
  },
  db.stats = () => {
    return new Promise ((resolve, reject) => {      
      client.db().collection('markets').aggregate([
        {$group: {_id: "$name", count: { $sum: 1 }}},
        {$sort: {count: -1 }}
      ],
      function(err, docs){
        if (err){
            console.log(err)
        }
        else{
            docs.toArray((error, result) => {
              if(error) console.log(error)
              resolve(result)
            })
       }})
    })
  }
  return db   
}
