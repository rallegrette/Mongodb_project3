// Query 1
// Find users who live in city "city".
// Return an array of user_ids. The order does not matter.

function find_user(city, dbname) {
    db = db.getSiblingDB(dbname);

    let results = [];
    // TODO: find all users who live in city
    // db.users.find(...);

    //find users where city = city that the user input
    db.users.find(
        { "hometown.city": city },        //filters documents where the nested field matches the city--query
        { user_id: 1, _id: 0 }               //include user_id, exclude _id
    ).forEach(element => {                  //process each document
        results.push(element.user_id);      //collect user_id into results
    });

    // See test.js for a partial correctness check.

    return results;
}
