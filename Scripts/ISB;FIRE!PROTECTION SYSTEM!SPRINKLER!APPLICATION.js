var startDate = new Date();

aa.print("script executed: "+ startDate);
logDebug("script executed: "+ startDate);
var FROM = "noreply@accela.com";
		var TO = "esheridan@accela.com";
		var SUBJECT = "isb CAPID:" + capId + "startDate:" + startDate;
		var BODY_TEXT = "Parent CapId: " + parentCapId + " " + debug;
		aa.sendMail(FROM, TO, "", SUBJECT , BODY_TEXT);