// Query 2
// Unwind friends and create a collection called 'flat_users' where each document has the following schema:
// {
//   user_id:xxx
//   friends:xxx
// }
// Return nothing.

function unwind_friends(dbname) {
    db = db.getSiblingDB(dbname);

    // TODO: unwind friends

    db.users.aggregate([
        {
            $project: {     //keep user_id and friends, exclude _id from the output
                "_id": 0,
                user_id: 1,
                friends: 1
            }
        },
        
        { $unwind: "$friends" }, //create one document per friend

        { $out: "flat_users" } // Save results to new collection
    ]);
    return;
}
