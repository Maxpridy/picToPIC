<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>pic To PIC</title>
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
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
	        <div class="col-md-8">
	        	<br>	     
			        <label class="btn-bs-file btn btn-info" style="
					    display: block;
					    margin: 0 auto;">
		                CHOOSE AN IMAGE	                
		                <input type="file" id="file" onclick="emptyIndexPage()" />	                	 
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
    				<br>
					<p>
						pic To PIC은?
						CNN을 이용한 방법으로 화질손상 없는 이미지 업스케일링을 제공합니다.
						<br>
						작은 이미지를 크게 바꿔보세요!
					</p>
						
					<p>
						1. CHOOSE AN IMAGE를 클릭하여 이미지를 등록합니다.
						<br>
						<br>
						2. 등록된 이미지가 변환되는것을 기다립니다.
						<br>
						<br>
						3. 변환이 완료된 이미지를 클릭하시면 다운로드가 가능합니다.
						<br>
						<br>
						4. 회원가입후 로그인하시면 이미지를 서버에 저장하여 편리하게 사용이 가능합니다.
					</p>
						
						※ 주의 : 이미지의 크기에 따라 변환에 아주 많은 시간이 소요될수있습니다.
					</p>
    				
  				</div>
    		</div>
	    </div>
	</div>
	
	<script>
		$('#file').click(function() {
			$('#image2x').empty();
		    $('#result').empty();
			var bar = document.getElementById("myProgressbar").ldBar;
			bar.set(0);
		});
	</script>

	<script src="lib/rgb2yuv.js"></script>
    <script src="lib/loadjson.js"></script>
    <script src="lib/script.js"></script>


</body>
</html>
