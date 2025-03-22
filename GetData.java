import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.TreeSet;
import java.util.Vector;

import org.json.JSONObject;
import org.json.JSONArray;

public class GetData {

    static String prefix = "project3.";

    // You must use the following variable as the JDBC connection
    Connection oracleConnection = null;

    // You must refer to the following variables for the corresponding 
    // tables in your database
    String userTableName = null;
    String friendsTableName = null;
    String cityTableName = null;
    String currentCityTableName = null;
    String hometownCityTableName = null;

    // DO NOT modify this constructor
    public GetData(String u, Connection c) {
        super();
        String dataType = u;
        oracleConnection = c;
        userTableName = prefix + dataType + "_USERS";
        friendsTableName = prefix + dataType + "_FRIENDS";
        cityTableName = prefix + dataType + "_CITIES";
        currentCityTableName = prefix + dataType + "_USER_CURRENT_CITIES";
        hometownCityTableName = prefix + dataType + "_USER_HOMETOWN_CITIES";
    }

    // TODO: Implement this function
    @SuppressWarnings("unchecked")
    public JSONArray toJSON() throws SQLException {

        // This is the data structure to store all users' information
        JSONArray users_info = new JSONArray();
        
        try (Statement stmt = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)) {
            // Your implementation goes here....
            ResultSet results = stmt.executeQuery("SELECT U.user_id, U.first_name, U.last_name, U.gender, U.year_of_birth, U.month_of_birth, U.day_of_birth, C.city_name, C.state_name, C.country_name, H.city_name, H.state_name, H.country_name FROM " + userTableName
            + " U JOIN " + currentCityTableName + " CC ON CC.user_id=U.user_id JOIN " + cityTableName + " C ON C.city_id=CC.current_city_id"
            + " JOIN " + hometownCityTableName + " HC ON HC.user_id=U.user_id JOIN " + cityTableName + " H ON H.city_id = HC.hometown_city_id");

            while (results.next()) {
                JSONObject object = new JSONObject();
                int user_id = results.getInt(1);
                object.put("user_id", user_id);
                object.put("first_name", results.getString(2));
                object.put("last_name", results.getString(3));
                object.put("YOB", results.getInt(5));
                object.put("MOB", results.getInt(6));
                object.put("DOB", results.getInt(7));
                object.put("gender", results.getString(4));
                JSONObject current = new JSONObject();
                current.put("city", results.getString(8));
                current.put("state", results.getString(9));
                current.put("country", results.getString(10));
                JSONObject hometown = new JSONObject();
                hometown.put("city", results.getString(11));
                hometown.put("state", results.getString(12));
                hometown.put("country", results.getString(13));
                object.put("current", current);
                object.put("hometown", hometown);
                // get friends
                Statement statement = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                ResultSet set = statement.executeQuery("SELECT * FROM " + friendsTableName +
                        " WHERE user1_id = " + user_id + " AND user1_id<user2_id");
                JSONArray friends = new JSONArray();
                while (set.next()) {
                    friends.put(set.getInt(2));
                }
                set.close();
                statement.close();
                object.put("friends", friends);
                users_info.put(object);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users_info;
    }

    // This outputs to a file "output.json"
    // DO NOT MODIFY this function
    public void writeJSON(JSONArray users_info) {
        try {
            FileWriter file = new FileWriter(System.getProperty("user.dir") + "/output.json");
            file.write(users_info.toString());
            file.flush();
            file.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
