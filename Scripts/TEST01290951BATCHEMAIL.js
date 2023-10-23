/* 
Batch Script
*/
//
// Header
//

aa.env.setValue("showDebug", "Y");
aa.env.setValue("BatchJobName", "All Caps WFtask AR issue Fix");
aa.env.setValue("sCapGroup", "Licenses");



//
// Body
//
/*------------------------------------------------------------------------------------------------------/
| Program: All Caps WFtask AR issue Fix.js  Trigger: Batch
| 
| Version 1.0 - Base Version. 
| Note: FA 07-09-2014. Application Review/Amendment Review issue fix. NYELS-50508
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
maxSeconds = 4.5 * 60;                      // number of seconds allowed for batch processing, usually < 5*60
message = "";
br = "<br>";
var debug = "";        // Debug String
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
showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID()
batchJobName = "" + aa.env.getValue("BatchJobName");
wfObjArray = null;

batchJobID = 0;
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
}
else
    logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
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
var sCapGroup = aa.env.getValue("sCapGroup");                 // cap Cap Group


var useAppSpecificGroupName = false;
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var timeExpired = false;
var startTime = startDate.getTime();   // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput(); //

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
logDebug("Start of Job");
if (!timeExpired) mainProcess();
logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
function mainProcess() {
    var capFilterType = 0
    var capCount = 0;
    var capIDlst = "";
    //build empty cap list
    var emptyGISArray = new Array();
    var emptyCm = aa.cap.getCapModel().getOutput();
    var emptyCt = emptyCm.getCapType();
    emptyCt.setGroup(sCapGroup);
    emptyCt.setType(null);
    emptyCt.setSubType(null);
    emptyCt.setCategory(null);
    emptyCm.setCapType(emptyCt);
    var vCAPListResult = aa.cap.getCapListByCollection(emptyCm, null, null, null, null, null, emptyGISArray);
    // dates
    var dtBefore = new Date("5/19/2014");
    //var dateBefore = "" + dtBefore.getMonth() + "/" + dtBefore.getDayOfMonth() + "/" + dtBefore.getYear();

    var vCapList = null;
    if (vCAPListResult.getSuccess())
        var apsArray = vCAPListResult.getOutput();
    else
    { logMessage("ERROR", "ERROR: Getting Records, reason is: " + vCAPListResult.getErrorType() + ":" + vCAPListResult.getErrorMessage()); }
    if (vCapList != null) {
        aa.print(vCapList.length);
        for (thisCAP in vCapList) {
            //do something
            aa.print(vCapList[thisCAP]);
        }
    }
    for (thisApp in apsArray)  // for each b1expiration (effectively, each license app)
    {
        var pCapId = null;
        cap = apsArray[thisApp];
        //var capStatus = cap.getCapStatus();
        capId = cap.getCapID();
        capIDString = capId.getCustomID();
        capName = cap.getSpecialText();
        capStatus = cap.getCapStatus();
        var fileDateObj = cap.getFileDate();
        var fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
        var fileDate = new Date(fileDate);

        if (fileDate >= dtBefore) {
            //aa.print("Date here..." + fileDate + "/" + dtBefore);
            continue;
        }


        if (!isTaskActive("Closure") && getwfTaskStatus("Closure") != null && (isTaskActive("Application Review") || isTaskActive("Amendment Review"))) {
            aa.print("************ START *****************");
            aa.print("Cap fileDate is " + fileDate + "/dateBefore:" + dtBefore);
            aa.print("capId:" + capId.getCustomID());
            aa.print("capStatus:" + capStatus);
            aa.print("WF Status:" + getwfTaskStatus("Closure"));

            if (isTaskActive("Application Review")) {
                //set task to close,complete.
                setTask("Application Review", "N", "Y");
            } else if (isTaskActive("Amendment Review")) {
                //set task to close,complete.
                setTask("Amendment Review", "N", "Y");
            }

            //build cap ID list
            capIDlst += " \n" + capId.getCustomID(); 
            capCount++;
        }

    }

    logDebug("********************************");
    logDebug("Total CAPS processed: " + capCount);
    logDebug("All CAPS processed list: " + capIDlst);
}


function isTaskActive(wfstr) {
    var useProcess = false;
    var allComplt = true;
    var processName = "";
    var itemCap = capId;
    if (arguments.length > 4) {
        if (arguments[4] != "") {
            processName = arguments[4]; // subprocess
            useProcess = true;
        }
    }
    var workflowResult = aa.workflow.getTasks(itemCap);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
    { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
    //if (!wfstat) wfstat = "NA";
    for (i in wfObj) {
        var fTask = wfObj[i];
        //        aa.print("fTask.getTaskDescription()" + fTask.getTaskDescription());
        //        aa.print("fTask Status:" + fTask.getDisposition());
        //        aa.print("fTask Active Flag:" + fTask.getActiveFlag());
        if (fTask.getActiveFlag().equals("Y")) {
            return true;
        } else {
            return false;
        }
    }
}