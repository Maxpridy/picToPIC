package user;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class UserLoginServlet
 */
@WebServlet("/userLogin")
public class UserLoginController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html; charset=UTF-8");
		String userID = request.getParameter("userID");
		String userPassword = request.getParameter("userPassword");
		
		if(userID == null ||
		   userPassword == null ||
		   userID.equals("") ||
		   userPassword.equals("")) {
			request.getSession().setAttribute("messageType", "오류 메세지");
			request.getSession().setAttribute("messageContent", "로그인 정보가 옳지 않습니다.");
			response.sendRedirect("view/login.jsp");
			return;
		}
		
		int result = new UserDAO().login(new UserDTO(userID, userPassword));
		
		if(result == 1) {
			request.getSession().setAttribute("userID", userID);
			response.sendRedirect("view/index.jsp");
		} else if(result == 2) {
			request.getSession().setAttribute("messageType", "오류 메세지");
			request.getSession().setAttribute("messageContent", "비밀번호가 틀립니다.");
			response.sendRedirect("view/login.jsp");
		} else if(result == 0) {
			request.getSession().setAttribute("messageType", "오류 메세지");
			request.getSession().setAttribute("messageContent", "아이디가 존재하지 않습니다.");
			response.sendRedirect("view/login.jsp");
		} else if(result == -1) {
			request.getSession().setAttribute("messageType", "오류 메세지");
			request.getSession().setAttribute("messageContent", "로그인에 실패하였습니다.");
			response.sendRedirect("view/login.jsp");
		}
	}

}
