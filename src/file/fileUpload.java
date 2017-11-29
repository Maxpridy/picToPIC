package file;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

/**
 * Servlet implementation class fileUpload
 */
@WebServlet("/fileUpload")
public class fileUpload extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public fileUpload() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		ServletConfig servletConfig = getServletConfig(); 
		ServletContext application = servletConfig.getServletContext();
		HttpSession session = request.getSession();
		
		PrintWriter out = response.getWriter();
		
		if(session.getAttribute("userID") != null){
			String userID = (String)session.getAttribute("userID");
			
			String directory = application.getRealPath("/upload/");
			int maxSize = 1024 * 1024 * 100;
			String encoding = "UTF-8";
			
			MultipartRequest multipartRequest = new MultipartRequest(request, directory, maxSize, encoding, new DefaultFileRenamePolicy());
			
			String fileName = multipartRequest.getOriginalFileName("file");
			String fileRealName = multipartRequest.getFilesystemName("file");
			
			new fileDAO().upload(new fileDTO(userID, fileName, fileRealName));
		
		}
		else {
			out.write("로그인 상태가 아닙니다.");
			// 3초후 리다이렉션 ㄱㄱ
		}
	}

}
