showDebug=true;
logDebug("in RSA");
var startDate = new Date();

logDebug("script executed: "+ startDate);
var FROM = "noreply@accela.com";
		var TO = "esheridan@accela.com";
		var SUBJECT = "RSA CAPID:: " + " startDate:" + startDate;
		var BODY_TEXT = "Parent CapId: " +  " " + debug;
		aa.sendMail(FROM, TO, "", SUBJECT , BODY_TEXT);