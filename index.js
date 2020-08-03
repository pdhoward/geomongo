require('dotenv').config()

/////////////////////////////////////////////////
///       Handle Venue Geospatial Search      //
//      copyright 2020 Strategic Machines    //
//////////////////////////////////////////////

const {createClient} =      require('./client')
const {createConnection} =  require('./connection')

let conn
// https://docs.mongodb.com/v3.6/geospatial-queries/

let client 
const fetchGeo = async () => {
    conn = await createConnection()
    client = await createClient(conn) 

    console.log(`----FUNCTION FIND VENUES -------`)   
    const response = await client.getVenues()
    console.log(`----Search Result ------`)    
    console.log(`Search found ${response.length} records`)
    console.log(response[0])

    console.log(`-----GENERATE RANDOM GEO POINTS GIVEN CENTER AND RADIUS -----`)
    const points = await client.getRandom()
    console.log(points)

    console.log(`-----Aggregate Count on Market Names -----`)
    const count = await client.stats()
    console.log(count)
    process.exit(0)
}

fetchGeo()
 
     
  

