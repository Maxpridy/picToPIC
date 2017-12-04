package file;

public class FileDTO {
	
	String userID;
	String fileName;
	String fileRealName;
	
	public FileDTO(String userID, String fileName, String fileRealName) {
		super();
		this.userID = userID;
		this.fileName = fileName;
		this.fileRealName = fileRealName;
	}
	
	public String getUserID() {
		return userID;
	}
	public void setUserID(String userID) {
		this.userID = userID;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getFileRealName() {
		return fileRealName;
	}
	public void setFileRealName(String fileRealName) {
		this.fileRealName = fileRealName;
	}

}
