showDebug = true;


var startDate = new Date();


logDebug("Script executed time : "+ startDate);

	logDebug("cap: " + cap);
	logDebug("cap class: " + cap.getClass());
	logDebug("capId: " + capId)
	logDebug("capId class: " + capId.getClass());

	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	var cdScriptObj = cdScriptObjResult.getOutput();
	logDebug("getCreateBy" + cdScriptObj.getCreateBy());
	var publicUser=cdScriptObj.getCreateBy();
	var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUser);

	var puOutput= publicUserModelResult.getOutput();

	logDebug("LastName: " +puOutput.getLastName());
	logDebug("FirstName: " +puOutput.getFirstName());
	logDebug("email: " +puOutput.getEmail());
var FROM = "noreply@accela.com";
		var TO = "esheridan@accela.com";
		var SUBJECT = "CTRCA:Fire 3 stars:"+ "startDate:" + startDate;
		var BODY_TEXT = " " + debug;
		aa.sendMail(FROM, TO, "", SUBJECT , BODY_TEXT);