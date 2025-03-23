// Query 4
// Find user pairs (A,B) that meet the following constraints:
// i) user A is male and user B is female
//  ii) their Year_Of_Birth difference is less than year_diff
// iii) user A and B are not friends
// iv) user A and B are from the same hometown city
// The following is the schema for output pairs:
// [
//      [user_id1, user_id2],
//      [user_id1, user_id3],
//      [user_id4, user_id2],
//      ...
//  ]
// user_id is the fiel d from the users collection. Do not use the _id field in users.
// Return an array of arrays.

function suggest_friends(year_diff, dbname) {
    db = db.getSiblingDB(dbname);

    /*
        1. Query all users
        2. Loop through all pairs (A, B)
        3. Apply all filters manually
    */

    let pairs = [];
    // TODO: implement suggest friends
    // get male users
    const male_users = db.users.find({ gender: "male" }).toArray();

    // get female users
    const female_users = db.users.find({ gender: "female" }).toArray();

    //check all male-female combinations
    for (let i = 0; i < male_users.length; i++) {
        const A = male_users[i];

        if (!A.hometown || !A.hometown.city || !A.YOB || !A.user_id) continue;

        for (let j = 0; j < female_users.length; j++) {
            const B = female_users[j];

            if (!B.hometown || !B.hometown.city || !B.YOB || !B.user_id) continue;

            //same city
            if (A.hometown.city !== B.hometown.city) continue;

            //birth year difference
            if (Math.abs(A.YOB - B.YOB) >= year_diff) continue;

            //not already friends
            if (
                (A.friends && A.friends.includes(B.user_id)) ||
                (B.friends && B.friends.includes(A.user_id))
            ) continue;

            // its valid!
            pairs.push([A.user_id, B.user_id]);
        }
    }



    return pairs;
}
