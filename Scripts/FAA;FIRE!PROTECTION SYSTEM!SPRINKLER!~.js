var startDate = new Date();

logDebug("script executed: "+ startDate);
var FROM = "noreply@accela.com";
		var TO = "esheridan@accela.com";
		var SUBJECT = "faa CAPID test updateFee:" + capId + "startDate:" + startDate;
		var BODY_TEXT = "Parent CapId: " + parentCapId + " " + debug;
		aa.sendMail(FROM, TO, "", SUBJECT , BODY_TEXT);

//updateFee("TESTCAL","FIRE_SPRINKLER","FINAL",1,"N");