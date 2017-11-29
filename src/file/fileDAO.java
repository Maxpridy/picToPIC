package file;


import java.sql.DriverManager;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.PreparedStatement;

public class fileDAO {
	
	private Connection conn;
	
	public fileDAO() {
		try {
			String dbURL = "jdbc:mysql://localhost:3306/pictopic";
			String dbID = "root";
			String dbPassword = "159357";
			Class.forName("com.mysql.jdbc.Driver");
			conn = (Connection) DriverManager.getConnection(dbURL, dbID, dbPassword);
			
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	public int upload(fileDTO file) {
		String query = "INSERT INTO file VALUES (?, ?, ?)";
		try {
			PreparedStatement pstmt = (PreparedStatement) conn.prepareStatement(query);
			pstmt.setString(1, file.getUserID());
			pstmt.setString(2, file.getFileName());
			pstmt.setString(3, file.getFileRealName());
			return pstmt.executeUpdate();
		} catch(Exception e) {
			e.printStackTrace();
		}
		return -1;
	}

}
