// Query 6
// Find the average friend count per user.
// Return a decimal value as the average user friend count of all users in the users collection.

function find_average_friendcount(dbname) {
    db = db.getSiblingDB(dbname);
    let total_users = 0;
    let total_friends = 0;

    db.users.find().forEach(user => {
        total_users += 1;

        //add the length of friends array if it exists
        if (user.friends && Array.isArray(user.friends)) {
            total_friends += user.friends.length;
        } else {
            //else add 0
            total_friends += 0;
        }
    });

    // Compute average 
    if (total_users > 0) {
        average = total_friends / total_users;
    }
    //return 0 if no users
    return average;
}
