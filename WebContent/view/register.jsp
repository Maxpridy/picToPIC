<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>pic To PIC</title>
	
	<script src="lib/jquery-3.2.1.min.js"></script>
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
	
	<link rel="stylesheet" type="text/css" href="lib/style.css">
	
	<script type="text/javascript">
		function registerCheckFunction(){
			var userID = $('#userID').val();
			$.ajax({
				type: 'POST',
				url: '/picToPIC/userRegisterCheck',
				data: {userID: userID},
				success: function(result){
					if(result == 1){
						$('#checkMessage').html('사용할 수 있는 아이디입니다.');
						$('#checkType').attr('class', 'modal-content panel-success');
					} else{
						$('#checkMessage').html('사용할 수 없는 아이디입니다.');
						$('#checkType').attr('class', 'modal-content panel-warning');
					}
					$('#checkModal').modal("show");
				}
			})
		}
		function passwordCheckFunction(){
			var userPassword1 = $('#userPassword1').val();
			var userPassword2 = $('#userPassword2').val();
			if(userPassword1 != userPassword2){
				$('#passwordCheckMessage').html('비밀번호가 서로 일치하지 않습니다.');
			} else{
				$('#passwordCheckMessage').html('');
			}
		}
	</script>
	
</head>
<body>

	<div class="container show-grid">
	<div class="col-md-12">
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
		    
		    <form action="register.jsp">
	    		<input class="btn btn-outline-info my-2 my-sm-0" style="float: right;" type="submit" value="Sign up" />
			</form>
			<form action="login.jsp">
	    		<input class="btn btn-outline-info my-2 my-sm-0" style="float: right;" type="submit" value="Sign in" />
			</form>
			
		  </div>
		  
		</nav>
	</div>
	</div>

	<div class="container show-grid">

	    <div class="row">
	        <div class="col-md-6" style="margin: auto">
	        	<br>
		        <form method="post" action="/picToPIC/userRegister">
	        		<table class="table table-bordered table-hover" style="text-align: center; border: 1px solid #dddddd">
	        			<thead>
	        				<tr>
	        					<th colspan="3"><h4>회원 가입</h4></th>
	        				</tr>
	        			</thead>
	        			<tbody>
	        				<tr>
	        					<td style="width: 150px;"><h6>아이디</h6></td>
	        					<td><input class="form-control" type="text" id="userID", name="userID", maxLength="20" )></td>
	        					<td style="width: 50px;"><button class="btn btn-primary" onclick="registerCheckFunction();" type="button">중복체크</button></td>
	        				</tr>
	        				<tr>
	        					<td style="width: 150px;"><h6>비밀번호</h6></td>
	        					<td><input class="form-control" type="password" onkeyup="passwordCheckFunction();" id="userPassword1", name="userPassword1", maxLength="20"></td>
	        				</tr>
	        				<tr>
	        					<td style="width: 150px;"><h6>비밀번호 확인</h6></td>
	        					<td><input class="form-control" type="password" onkeyup="passwordCheckFunction();" id="userPassword2", name="userPassword2", maxLength="20"></td>
	        				</tr>
	        				<tr>
	        					<td style="width: 150px;"><h6>닉네임</h6></td>
	        					<td><input class="form-control" type="text" id="userName", name="userName", maxLength="20"></td>
	        				</tr>
	        				<tr>
	        					<td style="width: 150px;"><h6>이메일</h6></td>
	        					<td><input class="form-control" type="email" id="userEmail", name="userEmail", maxLength="20"></td>
	        				</tr>
	        				<tr>
	        					<p></p>
	        				</tr>
	        				<tr>
	        					<td style="text-align: center" colspan=3><h5 style="color: red;" id="passwordCheckMessage"></h5><input class="btn btn-primary pull-right" type="submit" value="회원 가입"></td>
	        				</tr>
	        				
	        			</tbody>
	        		</table>
	        	</form>       
	        </div>
		</div>
	</div>
	
	<%
		String messageType = null;
		if(session.getAttribute("messageType") != null){
			messageType = (String)session.getAttribute("messageType");
		}
		String messageContent = null;
		if(session.getAttribute("messageContent") != null){
			messageContent = (String)session.getAttribute("messageContent");
		}
		if(messageContent != null){
	%>
	<div class="modal fade" id="messageModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="vertical-alignment-helper">
			<div class="modal-dialog vertical-align-center">
				<div class="modal-content <% if(messageType.equals("오류 메세지")) out.println("panel-warning"); else out.println("panel-success"); %>">
					<div class="modal-header panel-heading">
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true">&times;</span>
							<span class="sr-only">Close</span>
						</button>
						<h4 class="modal-title">
							<%= messageType %>
						</h4>
					</div>
					<div class="modal-body">
						<%= messageContent %>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal">회원 가입</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script>
		$('#messageModal').modal("show");
	</script>
	
	<%
		session.removeAttribute("messageType");
		session.removeAttribute("messageContent");
		}
	%>
	
	<div class="modal fade" id="checkModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="vertical-alignment-helper">
			<div class="modal-dialog vertical-align-center">
				<div id="checkType" class="modal-content panel-info">
					<div class="modal-header panel-heading">
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true">&times;</span>
							<span class="sr-only">Close</span>
						</button>
						<h4 class="modal-title">
							확인 메세지
						</h4>
					</div>
					<div class="modal-body" id="checkMessage">
						<%= messageContent %>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" data-dismiss="modal">회원 가입</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	

</body>
</html>
