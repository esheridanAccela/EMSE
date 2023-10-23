/* 
Batch Script
*/
//
// Header
//   
/*
aa.env.setValue("appGroup", "Fire");
aa.env.setValue("appTypeType", "Protection System");
aa.env.setValue("appSubtype", "Sprinkler");
aa.env.setValue("appCategory", "Application");
aa.env.setValue("expirationStatus", "Active"); 
aa.env.setValue("showDebug", "Y");
aa.env.setValue("sendEmailToContactType", "Applicant", "Representative", "Attorney");
aa.env.setValue("BatchJobName", "");
aa.env.setValue("processAppList", "Aircraft 3 Year,Steamship 3 Year,Trucking,Fleet Tucking,Fleet Company,Broker 3 Year, Negotiator 3 Year");
*/
//
// Body
//
/*------------------------------------------------------------------------------------------------------/
| Program: TR  Permit About to Expire.js  Trigger: Batch
| Client: ID 721
|
| Version 1.0 - Base Version. 07/18/2013 
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
maxSeconds = 4.5 * 60; 	                    // number of seconds allowed for batch processing, usually < 5*60
message = "";
br = "<br>";
var debug = ""; 							// Debug String

/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 2.0

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM"));


function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
var dTodaysDate = month + "/" + day + "/" + year;
logDebug("Today's Date:" + dTodaysDate);

var fromDate = dTodaysDate; // "01/20/2013"; // getParam("fromDate");							// Hardcoded dates.   Use for testing only
var toDate = "";  //"02/26/2014"; // getParam("toDate");								// ""
var dFromDate = aa.date.parseDate(fromDate); 				//
var dToDate = aa.date.parseDate(toDate); 					//
		
var appGroup = aa.env.getValue("appGroup"); 						//   app Group to process {Licenses}
var appTypeType = aa.env.getValue("appTypeType"); 					//   app type to process {Rental License}
var appSubtype = aa.env.getValue("appSubtype"); 					//   app subtype to process {NA}
var appCategory = aa.env.getValue("appCategory"); 					//   app category to process {NA}
var appStatusNotWFstatus=aa.env.getValue("appStatus");
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var timeExpired = false;

if (!fromDate.length) // no "from" date, assume today + number of days to look ahead
    fromDate = dateAdd(null, parseInt(1))

if (!toDate.length) {  // no "to" date, assume today + number of look ahead days + span
    toDate = dateAdd(null, parseInt(1) + parseInt(1));
}

//set the to date
toDate = dateAdd(fromDate, parseInt(1)); //"02/26/2016"; //

logDebug("Date Range -- fromDate: " + fromDate + ", toDate: " + toDate)

var startTime = startDate.getTime(); 		// Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();

if (appGroup == "")
    appGroup = "*";
if (appTypeType == "")
    appTypeType = "*";
if (appSubtype == "")
    appSubtype = "*";
if (appCategory == "")
    appCategory = "*";
var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");

mainProcess();




/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
	
aa.print("batch good !");
aa.print("appGroup=" +appGroup); 						//   app Group to process {Licenses}
aa.print("appTypeType=" +appTypeType); 					//   app type to process {Rental License}
aa.print("appSubtype=" +appSubtype); 					//   app subtype to process {NA}
aa.print("appCategory=" + appCategory); 	
var listByType=aa.cap.getByAppType(appGroup,appTypeType,appSubtype,appCategory);
var resultListByType=listByType.getOutput();
aa.print("wht is listbytype:" + resultListByType.length);
var notComplete=true;
var noActiveTasks=true;		
for(thisRec in resultListByType){
notComplete=true;
noActiveTasks=true;	
		thisRec=resultListByType[thisRec];
		aa.print("this records status: " +thisRec.getCapStatus());
		sca = String(thisRec.getCapID()).split("-");
		tmpID = aa.cap.getCapID(sca[0],sca[1],sca[2]).getOutput();
		aa.print("----start altID: "+ tmpID.getCustomID() + " recordID " + sca);
		aa.print("focus on appStatus: " +appStatusNotWFstatus)
		if(thisRec.getCapStatus()!=appStatusNotWFstatus){
		aa.print("---Start capStatus " +thisRec.getCapID()  + " status= " +thisRec.getCapStatus());

		var workflowResult = aa.workflow.getTasks(tmpID);
		if (workflowResult.getSuccess()){
        wfObj = workflowResult.getOutput();
				for (i in wfObj)
				{
				fTask = wfObj[i];
	//			aa.print("fTask" + i + " = " + fTask);
				if(fTask.getActiveFlag()=="Y" ){noActiveTasks=false;}
				}
		}
		else
        { 	aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); }
			aa.print("----done with altID: "+ tmpID + " recordID " + sca);
		}
		else{
			notComplete=false;
			aa.print("---end capStatus check no issue: " + thisRec.getCapID() + " altID: " + tmpID +" the record status is a form of complete: " + thisRec.getCapStatus());
			}

	if(notComplete && noActiveTasks){
		aa.print("*** this Record NOK: " + tmpID + " is not complete and has no active tasks, the current Application Status is: " +thisRec.getCapStatus());
			}
		else{aa.print("*** this Record OK is either complete or has an active task: "+ thisRec.getCapID());
			}	
		}	
}	