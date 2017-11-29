<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="java.io.File" %>
<%@ page import="file.fileDAO" %>
<%@ page import="java.util.ArrayList" %>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>pic To PIC</title>
	
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
	
	<link rel="stylesheet" type="text/css" href="lib/style.css">
	
</head>
<body>
	<%
		String userID = null;
		if (session.getAttribute("userID") != null){
			userID = (String)session.getAttribute("userID");
		}
	%>

	<nav class="navbar navbar-expand-lg navbar-light bg-light">
	  <a class="navbar-brand" href="index.jsp">pic To PIC</a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	    <span class="navbar-toggler-icon"></span>
	  </button>

	  <div class="collapse navbar-collapse" id="navbarSupportedContent">
	    <ul class="navbar-nav mr-auto">
	      <li class="nav-item active">
	          <a class="nav-link" href="index.jsp">Home <span class="sr-only">(current)</span></a>
	      </li>
	      
	      <li class="nav-item">
              <a class="nav-link" href="pictureRepo.jsp">Picture Repository</a>
      	  </li>

	    </ul>
	    
	    <%
	    	if(userID == null) {
	    %>
	    
	    <form action="register.jsp">
    		<input class="btn btn-outline-info my-2 my-sm-0" style="float: right;" type="submit" value="Sign up" />
		</form>
		<form action="login.jsp">
    		<input class="btn btn-outline-info my-2 my-sm-0" style="float: right;" type="submit" value="Sign in" />
		</form>
		
		<%
	    	} else {
		%>

		<form action="logout.jsp">
    		<input class="btn btn-outline-info my-2 my-sm-0" style="float: right;" type="submit" value="Sign out" />
		</form>
		
		<%
	    	}
		%>
	    
	  </div>
	  
	</nav>

	<div class="container show-grid">

	    <div class="row">
	        <div class="col-md-8" style="margin: auto">
	        	<br>
		        <div class="jumbotron">
		        	<p>
		        		<%
		        		
		        			if(userID != null){
		        				String directory = application.getRealPath("/upload/");
			        			ArrayList<String> files = new fileDAO().getPictureNameForID(userID);

			        			for(String file : files){
			        				out.write("<a href=\"" + request.getContextPath() + "/fileDownload?file=" + java.net.URLEncoder.encode(file, "UTF-8") + "\">" + file + "</a><br>");
			        			}
		        			} else {
		        				out.write("로그인이 필요한 서비스입니다.");
		        			}
		        			
		        			
		        		%>
		        		
		        	</p>
		        </div>
				        
	        </div>
		</div>
	</div>


</body>
</html>
