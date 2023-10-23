showDebug=3;
logDebug("anytimes");

var feeQty=0.235;
addFee("PW_030","FIRE_SPRINKLER","FINAL", feeQty,"N");

var startDate = new Date();

logDebug("script executed: "+ startDate);
var FROM = "noreply@accela.com";
		var TO = "esheridan@accela.com";
		var SUBJECT = "asa:Fire/Protection System/Sprinkler/Application CAPID:" + capId + "startDate:" + startDate;
		var BODY_TEXT = "Parent CapId: " + parentCapId + " " + debug;
		aa.sendMail(FROM, TO, "", SUBJECT , BODY_TEXT);

