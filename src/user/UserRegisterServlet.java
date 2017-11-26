package user;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class UserRegisterServlet
 */
@WebServlet("/userRegister")
public class UserRegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserRegisterServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html; charset=UTF-8");
		String userID = request.getParameter("userID");
		String userPassword1 = request.getParameter("userPassword1");
		String userPassword2 = request.getParameter("userPassword2");
		String userName = request.getParameter("userName");
		String userEmail = request.getParameter("userEmail");
		
		if (userID == null ||
			userPassword1 == null ||
			userPassword2 == null ||
			userName == null ||
			userEmail == null ||
			userID.equals("") ||
			userPassword1.equals("") ||
			userPassword2.equals("") ||
			userName.equals("") ||
			userEmail.equals("")) {
			request.getSession().setAttribute("messageType", "오류 메세지");
			request.getSession().setAttribute("messageContent", "모든 내용을 기입해주세요.");
			response.sendRedirect("view/register.jsp");
			return ;
		}
		if(!userPassword1.equals(userPassword2)) {
			request.getSession().setAttribute("messageType", "오류 메세지");
			request.getSession().setAttribute("messageContent", "비밀번호가 서로 일치하지 않습니다.");
			response.sendRedirect("view/register.jsp");
			return ;
		}
		
		int result = new UserDAO().register(new UserDTO(userID, userPassword1, userName, userEmail));
		
		if (result == 1) {
			request.getSession().setAttribute("messageType", "요청 성공");
			request.getSession().setAttribute("messageContent", "회원가입에 성공했습니다.");
			response.sendRedirect("view/register.jsp");
			return ;
		} else {
			request.getSession().setAttribute("messageType", "오류 메세지");
			request.getSession().setAttribute("messageContent", "이미 존재하는 회원입니다.");
			response.sendRedirect("view/register.jsp");
			return ;
		}
		
	}

}
