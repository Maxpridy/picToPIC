package file;


import java.sql.DriverManager;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.PreparedStatement;

public class FileDAO {
	
	private Connection conn;
	
	public FileDAO() {
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
	
	public int upload(FileDTO file) {
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
	
	public ArrayList<String> getPictureNameForID(String userID) {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String query = "SELECT fileName FROM file WHERE userID=?";
		ArrayList<String> ret = new ArrayList<>();
		
		try {
			pstmt = (PreparedStatement)conn.prepareStatement(query);
			pstmt.setString(1, userID);
			rs = pstmt.executeQuery();
			if(rs != null) {
				while(rs.next()) {
					System.out.println(rs.getString("fileName"));
					ret.add(rs.getString("fileName"));
				}
			}
			
			return ret;
		} catch(Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if(rs != null) rs.close();
				if(pstmt != null) pstmt.close();
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
		return null;
	}

}
