showDebug=true;
var rightNow = new Date(); 
logDebug("rightNow: " + rightNow);
inspComment=inspComment+" added comment ecs.";

logDebug("parameters capId: "+ capId +" inspId: " + inspId + " inspResult : " + inspResult + " inspComment: " +inspComment + " currentUserID: " + currentUserID);

//resultInspectionLocal(inspType, inspResult, resultDate2, "this is from the script");
//logDebug("after update capId: "+ capId +" inspId: " + inspId + " inspResult :" + inspResult+ " inspResultDate:" +  inspResultDate+ "  inspComment+:" +  inspComment+ "  currentUserID:" +  currentUserID);
//var sysDateYYYYMMDDTHHMMSS = rightNow.getFullYear() +"-"+ (rightNow.getMonth()+1) +"-"+ rightNow.getDate() + "T" + rightNow.getHours() + ":" + rightNow.getMinutes() + ":" + rightNow.getSeconds();


var sysDateYYYYMMDDTHHMMSS = rightNow.getFullYear() +"-"+ (rightNow.getMonth()+1) +"-"+ rightNow.getDate() + " " + rightNow.getHours() + ":" + rightNow.getMinutes() + ":" + rightNow.getSeconds()+ "PM";
logDebug("sysDateYYYYMMDDTHHMMSS: " + sysDateYYYYMMDDTHHMMSS);
var resultInspUpdate = aa.inspection.resultInspection(capId, inspId, inspResult, sysDateYYYYMMDDTHHMMSS, inspComment, currentUserID);


