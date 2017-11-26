package user;

import java.sql.DriverManager;
import java.sql.ResultSet;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.PreparedStatement;

public class UserDAO {
	
	
	private String jdbc_driver = "com.mysql.jdbc.Driver";
	private String jdbc_url = "jdbc:mysql://localhost:3306/pictopic?characterEncoding=utf8";
	private Connection conn;
	
	public UserDAO() {
		try {
			Class.forName(jdbc_driver);
			conn = (Connection) DriverManager.getConnection(jdbc_url, "root", "159357");
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	public int registerCheck(String userID) {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String query = "SELECT * FROM user WHERE userID=?";
		try {
			pstmt = (PreparedStatement) conn.prepareStatement(query);
			pstmt.setString(1, userID);
			rs = pstmt.executeQuery();
			if(rs.next() || userID.equals("")) {
				return 0;
			} else {
				return 1;
			}
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
		return -1;
	}
	
	public int register(UserDTO user) {
		PreparedStatement pstmt = null;
		String query = "INSERT INTO USER VALUES (?, ?, ?, ?)";
		try {
			pstmt = (PreparedStatement) conn.prepareStatement(query);
			pstmt.setString(1, user.getUserID());
			pstmt.setString(2, user.getUserPassword());
			pstmt.setString(3, user.getUserName());
			pstmt.setString(4, user.getUserEmail());
			return pstmt.executeUpdate();

		} catch(Exception e) {
			e.printStackTrace();
			return -1;
		} finally {
			try {
				if(pstmt != null) pstmt.close();
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	public int login(String userID, String userPassword) {
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String query = "SELECT * FROM user WHERE userID=?";
		try {
			pstmt = (PreparedStatement) conn.prepareStatement(query);
			pstmt.setString(1, userID);
			rs = pstmt.executeQuery();
			if(rs.next()) {
				if(rs.getString("userPassword").equals(userPassword)) {
					return 1; // 로그인 성공
				}
				return 2; // 비밀번호 틀림
			} else {
				return 0; // 결과 없음. 존재하지않음.
			}
		} catch(Exception e){
			e.printStackTrace();
		} finally {
			try {
				if(rs != null) rs.close();
				if(pstmt != null) pstmt.close();
			} catch(Exception e) {
				e.printStackTrace();
			}
		}
		return -1;
	}

}
