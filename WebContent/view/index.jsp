<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>pic To PIC</title>
	
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
	
	<link rel="stylesheet" type="text/css" href="lib/loading-bar.css"/>
	<script type="text/javascript" src="lib/loading-bar.js"></script>
	
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
              <a class="nav-link" href="picturerepo.jsp">Picture Repository</a>
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
	        <div class="col-md-8">
	        	<br>
		        <label class="btn-bs-file btn btn-info" style="
				    display: block;
				    margin: 0 auto;">
	                CHOOSE AN IMAGE
	                <input type="file" id="file" />
	            </label>
	            
	            <div>
    				<input id="models" value="lib/z-scale2.0x_model.json" style="visibility: hidden;">
    			</div>
	    		<hr />
	    		
	    		<div style="visibility: hidden;">
                    Source: <span id="source"></span>
                </div>
	    		
			    <div>
			        Source 2x<br>
			        <span id="image2x"></span>
			    </div>
			    
			    <div style="visibility: hidden;">Progress: <span id="progress"></span></div>
			    <div style="visibility: hidden;">Computed Time: <span id="time"></span></div>
			    <div style="visibility: hidden;">Finish Estimated: <span id="expected"></span></div>
    			
				<div
				    id="myProgressbar"
  					data-preset="rainbow"
  					class="ldBar label-center"
  					style="width:100%; height:10%; margin:auto;"
  					data-value="0"
				></div>

			    <hr />
			    <div>
			      Result<br>
			      <span id="result"></span>
			    </div>
				        
	        </div>

			<div class="col-md-4">
				<br>
				<div class="jumbotron">
    				<h4>pic To PIC</h4>
					<br><br>
					<p>
					이 서비스는 CNN을 이용해서 사진의 해상도를 올려주는 서비스입니다. ~~
					
					로그인을 하시면 Picture Repository을 이용하실 수 있으며 변환한 사진이 자동으로 저장됩니다. 
					Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					
					주의. 너무 큰 파일은 시간이 매우 오래 걸립니다. 또한 서버에도 부하가 걸리니 너무 큰 파일은 변환이 어렵습니다.
					</p>
    				
  				</div>
    		</div>
	    </div>
	</div>

	<script src="lib/rgb2yuv.js"></script>
    <script src="lib/loadjson.js"></script>
    <script src="lib/script.js"></script>


</body>
</html>
