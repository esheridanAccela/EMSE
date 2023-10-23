/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_ACCELA_GLOBALS.js
| Event   : N/A
|
| Usage   : Accela Global Includes.  Required for all master scripts.
|
| Notes   : 
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;		// Set to true to see results in popup window
var showDebug = true;			// Set to true to see debug messages in popup window
logDebug("custom-version");
var disableTokens = false;		// turn off tokenizing of std choices (enables use of "{} and []")
var useAppSpecificGroupName = false;	// Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false;	// Use Group name when populating Task Specific Info Values
var enableVariableBranching = true;	// Allows use of variable names in branching.  Branches are not followed in Doc Only
var maxEntries = 99;			// Maximum number of std choice entries.  Entries must be Left Zero Padded
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var GLOBAL_VERSION = 5;

var cancel = false;

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");
aa.print("ScriptName: " +vScriptName);
aa.print("vEventName: " +vEventName);
var startDate = new Date(aa.util.now());
var startTime = startDate.getTime();
var message =	"";									// Message String
if (typeof debug === 'undefined') {
	var debug = "";										// Debug String, do not re-define if calling multiple
	}
var br = "<BR>";									// Break Tag
var feeSeqList = new Array();						// invoicing fee list
var paymentPeriodList = new Array();				// invoicing pay periods

var currentUserID = aa.env.getValue("CurrentUserID"); // Current User
var systemUserObj = null;  							// Current User Object
var currentUserGroup = null;						// Current User Group
var publicUserID = null;
var publicUser = false;

if (currentUserID.indexOf("PUBLICUSER") == 0){
	publicUserID = currentUserID; 
	currentUserID = "ADMIN"; 
	publicUser = true;
}
if(currentUserID != null && currentUserID != "") {
	systemUserObj = aa.person.getUser(currentUserID).getOutput();  	// Current User Object
}

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");
var servProvCode = aa.getServiceProviderCode();

aa.print("EMSE Script Framework Versions");
aa.print("EVENT TRIGGERED: " + vEventName);
aa.print("SCRIPT EXECUTED: " + vScriptName);
aa.print("INCLUDE VERSION: " + INCLUDE_VERSION);
aa.print("SCRIPT VERSION : " + SCRIPT_VERSION);
aa.print("GLOBAL VERSION : " + GLOBAL_VERSION);
	var params = aa.env.getParamValues();
var keys =  params.keys();
var key = null;
while(keys.hasMoreElements())
{
 key = keys.nextElement();
 eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
 logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}

var capId = null,
	cap = null,
	capIDString = "",
	appTypeResult = null,
	appTypeAlias = "",
	appTypeString = "",
	appTypeArray = new Array(),
	capName = null,
	capStatus = null,
	fileDateObj = null,
	fileDate = null,
	fileDateYYYYMMDD = null,
	parcelArea = 0,
	estValue = 0,
	calcValue = 0,
	houseCount = 0,
	feesInvoicedTotal = 0,
	balanceDue = 0,
	houseCount = 0,
	feesInvoicedTotal = 0,
	capDetail = "",
	AInfo = new Array(),
	partialCap = false,
	feeFactor = "",
	parentCapId = null;


if (typeof(getCapId) != "undefined")
	capId = getCapId();
 aa.print("whatis capId" + capId);
if(capId == null){
	if(aa.env.getValue("CapId") != ""){
		sca = String(aa.env.getValue("CapId")).split("-");
		capId = aa.cap.getCapID(sca[0],sca[1],sca[2]).getOutput();
	}else if(aa.env.getValue("CapID") != ""){
		sca = String(aa.env.getValue("CapID")).split("-");
		capId = aa.cap.getCapID(sca[0],sca[1],sca[2]).getOutput();
	}
	else if(aa.env.getValue("CapModel") != "") {
		var capId = aa.env.getValue("CapModel").getCapID();
	}
	else if(aa.env.getValue("CapIdModel") != "") {
		var capId = aa.env.getValue("CapIdModel");
	}
}

if(capId != null){
	servProvCode = capId.getServiceProviderCode();
	capIDString = capId.getCustomID();
	cap = aa.cap.getCap(capId).getOutput();
	appTypeResult = cap.getCapType();
	appTypeAlias = appTypeResult.getAlias();
	appTypeString = appTypeResult.toString();
	appTypeArray = appTypeString.split("/");
	if(appTypeArray[0].substr(0,1) !="_") 
	{
		var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0],currentUserID).getOutput()
		if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
	}
	capName = cap.getSpecialText();
	capStatus = cap.getCapStatus();
	partialCap = !cap.isCompleteCap();
	fileDateObj = cap.getFileDate();
	fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
	fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(),fileDateObj.getDayOfMonth(),fileDateObj.getYear(),"YYYY-MM-DD");
	var valobj = aa.finance.getContractorSuppliedValuation(capId,null).getOutput();	
	if (valobj.length) {
		estValue = valobj[0].getEstimatedValue();
		calcValue = valobj[0].getCalculatedValue();
		feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
	}
	
	var capDetailObjResult = aa.cap.getCapDetail(capId);		
	if (capDetailObjResult.getSuccess())
	{
		capDetail = capDetailObjResult.getOutput();
		var houseCount = capDetail.getHouseCount();
		var feesInvoicedTotal = capDetail.getTotalFee();
		var balanceDue = capDetail.getBalance();
	}
	loadAppSpecific(AInfo); 						
	loadTaskSpecific(AInfo);						
	loadParcelAttributes(AInfo);					
	loadASITables();

	var parentCapString = "" + aa.env.getValue("ParentCapID");
	if (parentCapString.length > 0) { parentArray = parentCapString.split("-"); parentCapId = aa.cap.getCapID(parentArray[0], parentArray[1], parentArray[2]).getOutput(); }
	if (!parentCapId) { parentCapId = getParent(); }
	if (!parentCapId) { parentCapId = getParentLicenseCapID(capId); }
	
	aa.print("<B>EMSE Script Results for " + capIDString + "</B>");
	aa.print("capId = " + capId.getClass());
	aa.print("cap = " + cap.getClass());
	aa.print("currentUserID = " + currentUserID);
	aa.print("currentUserGroup = " + currentUserGroup);
	aa.print("systemUserObj = " + systemUserObj.getClass());
	aa.print("appTypeString = " + appTypeString);
	aa.print("appTypeAlias = " + appTypeAlias);
	aa.print("capName = " + capName);
	aa.print("capStatus = " + capStatus);
	aa.print("fileDate = " + fileDate);
	aa.print("fileDateYYYYMMDD = " + fileDateYYYYMMDD);
	aa.print("sysDate = " + sysDate.getClass());
	aa.print("parcelArea = " + parcelArea);
	aa.print("estValue = " + estValue);
	aa.print("calcValue = " + calcValue);
	aa.print("feeFactor = " + feeFactor);
	
	logDebug("houseCount = " + houseCount);
	logDebug("feesInvoicedTotal = " + feesInvoicedTotal);
	logDebug("balanceDue = " + balanceDue);
	if (parentCapId) logDebug("parentCapId = " + parentCapId.getCustomID());
}

eval(getScriptText("INCLUDES_CUSTOM_GLOBALS"));