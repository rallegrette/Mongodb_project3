// Query 3
// Create a collection "cities" to store every user that lives in every city. Each document(city) has following schema:
// {
//   _id: city
//   users:[userids]
// }
// Return nothing.

function cities_table(dbname) {
    db = db.getSiblingDB(dbname);
    
    // TODO: implement cities collection here
    db.users.aggregate([
        //group by city and collect user_ids in an array
        {
            $group: {
                _id: "$current.city",     //grouping by city name
                users: { $push: "$user_id" } //put all user_ids into an array
            }
        },
        {
            $out: "cities"  //output to cities
        }
    ]);


    return;
}
