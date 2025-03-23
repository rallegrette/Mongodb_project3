// Query 5
// Find the oldest friend for each user who has a friend. For simplicity,
// use only year of birth to determine age, if there is a tie, use the
// one with smallest user_id. You may find query 2 and query 3 helpful.
// You can create selections if you want. Do not modify users collection.
// Return a javascript object : key is the user_id and the value is the oldest_friend id.
// You should return something like this (order does not matter):
// {user1:userx1, user2:userx2, user3:userx3,...}

function oldest_friend(dbname) {
    db = db.getSiblingDB(dbname);

    let results = {};
    // TODO: implement oldest friends
    //create bidirectional flat_users collection
    db.flat_users.drop(); // make sure it's clean

    //unwind friends and write to flat_users
    db.users.aggregate([
        { $project: { _id: 0, user_id: 1, friends: 1 } },
        { $unwind: "$friends" },
        { $out: "flat_users" }
    ]);

    //flip each pair bc of bidirectional friendship
    const original = db.flat_users.find().toArray();
    original.forEach(doc => {
        db.flat_users.insertOne({
            user_id: doc.friends,
            friends: doc.user_id
        });
    });

    // build a map of user_id to YOB
    const yobMap = {};
    db.users.find().forEach(user => {
        yobMap[user.user_id] = user.YOB;
    });

    //group all friends for each user
    db.flat_users.aggregate([
        { $group: { _id: "$user_id", friends: { $push: "$friends" } } }
    ]).forEach(user => {
        let uid = user._id;
        let friends = user.friends;

        //find oldest friend 
        // earliest YOB, tie-break by smallest user_id
        let oldest = friends[0];
        for (let i = 1; i < friends.length; i++) {
            let current = friends[i];
            if (
                yobMap[current] < yobMap[oldest] ||
                (yobMap[current] === yobMap[oldest] && current < oldest)
            ) {
                oldest = current;
            }
        }

        results[uid] = oldest;
    });


    return results;
}
