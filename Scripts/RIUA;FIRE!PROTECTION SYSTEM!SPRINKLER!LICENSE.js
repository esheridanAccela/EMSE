var startDate = new Date();

logDebug("script executed: "+ startDate);
var FROM = "noreply@accela.com";
		var TO = "esheridan@accela.com";
		var SUBJECT = "RIUA:Fire/Protection System/Sprinkler/License CAPID:" + capId + "startDate:" + startDate;
		var BODY_TEXT = "Parent CapId: " + parentCapId + " " + debug;
		aa.sendMail(FROM, TO, "", SUBJECT , BODY_TEXT);