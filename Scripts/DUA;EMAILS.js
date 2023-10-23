//DUA:Emails                                      
if (currentUserID,"francis"){
	showDebug = 1; showMessage= true;
}

if(!isTaskActive("Application Submittal") && capStatus != null && capStatus != "" && (appMatch("Building/*/*/*") )){
	parameters = aa.util.newHashMap();                           
	reportParams = null;
	newReport = null; 
	comment("AltID = "+capIDString);                        
	params = aa.util.newHashtable(); 
	getRecordParams4Notification(params);  

	if(publicUser){
		//Email Staff  
		sendNotification("noreply@accela.com","fyamaura@accela.com","","BLDG_RESUB_DOCS_SUBMITTED",params,null);
		//updateAppStatus("Documents Submitted","Doc Uploaded via ACA");
	}
}