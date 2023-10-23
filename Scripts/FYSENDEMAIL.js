/*******************************************************
| Script Title: Francis Batch Script (Send Email)
| Created by: FY
| Created on: Aug 26, 2020
| Usage: sample Send Email after batch job
| Modified by: ()
*********************************************************/
/* ***************************************************************************************************************************
 IMPORTANT NOTE: IF USING COMMIT() - To test the script, it must be executed by setting the Script Transaction drop down to "Use User Transaction"
****************************************************************************************************************************/
/*------------------------------------------------------------------------------------------------------/
| START: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;

var showDebug = true;
var showMessage = false;
var message = "";
var debug;
var emailText;
//var maxSeconds = 4.5 * 60;
var br = "<br/>";
var startDate = new Date();
var startTime = startDate.getTime(); // Start timer
//Validate workflow parameters
var paramsOK = true;
var useAppSpecificGroupName = false;
var appTypeArray;

// Set time out to 60 minutes
var timeExpired = false;
var timeOutInSeconds = 60 * 60;
/*------------------------------------------------------------------------------------------------------/
| END: USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START: TEST DATA
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("runDate","12/13/2019");
//aa.env.setValue("sampleType", "Partial chem");
/*------------------------------------------------------------------------------------------------------/
| END: TEST DATA
/------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------/
| Start: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
var runDate = aa.env.getValue("runDate");
var sampleType = aa.env.getValue("sampleType");
/*----------------------------------------------------------------------------------------------------/
| End: BATCH PARAMETERS
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = String(aa.env.getValue("BatchJobName"));
currentUserID = "ADMIN";
useProductScript = true;
var useCustomScriptFile = false;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;

var defaultFromEmail = "no_reply_FY@accela.com";
var defaultToEmail = "fyamaura@accela.com";
var capId;

if (SA) {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    // eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_CUSTOM", SA, useCustomScriptFile));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    // eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));
}
//eval(getScriptText("INCLUDES_BATCH"));

// Print debug using aa.print instead of aa.debug
useLogDebug = false;
var debugLevel = 2;

// Set the system user
var result = aa.person.getUser(currentUserID);
if (result.getSuccess() != true) {
    Avo_LogDebug("Failed to get sys user " + currentUserID + ". " + result.getErrorType() + ": " + result.errorMessage, 1);
} else {
    systemUserObj = result.getOutput();
}

// function getScriptText(vScriptName) {
// vScriptName = vScriptName.toUpperCase();
// var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
// var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
// return emseScript.getScriptText() + "";
// }

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

batchJobID = 0;
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    Avo_LogDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID, 1);
}
else {
    Avo_LogDebug("Batch job ID not found " + batchJobResult.getErrorMessage(), 1);
}


function SendErrorEmail(fileName, message) {
    var template = "FRANCIS_JOB_ERROR";
    Avo_LogDebug("Sending job error notification...", 2);
    var params = aa.util.newHashtable();

    Avo_LogDebug("FileName(" + fileName + ")", 2);   //debug
    addParameter(params, "$$FileName$$", fileName);

    Avo_LogDebug("Message(" + message + ")", 2);   //debug
    addParameter(params, "$$ErrorMessage$$", message);

    var result = aa.communication.getNotificationTemplate(template);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get template "' + template + '". ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var templateModel = result.getOutput();
    if (!templateModel) {
        Avo_LogDebug('Failed to get template model', 1);
        return;
    }

    var fromEmail = templateModel.getEmailTemplateModel().getFrom();
    if (fromEmail == null) {
        fromEmail = defaultFromEmail;
    }
    var toEmail = templateModel.getEmailTemplateModel().getTo();
    if (toEmail == null) {
        toEmail = defaultToEmail;
    }
    var result2 = aa.document.sendEmailByTemplateName(fromEmail, toEmail, "", template, params, null);
    if (result2.getSuccess() == true) {
        Avo_LogDebug('Notification "' + template + '" sent to ' + toEmail + ' from ' + fromEmail, 1);
    } else {
        Avo_LogDebug('Failed to send notification "' + template + '" to ' + toEmail + ' from ' + fromEmail, 1);
    }
}

function SendJobFinishedEmail(fileName, total, successful, failed, failedSampleNumbers) {
    var template = "FRANCIS_JOB_FINISHED";
    Avo_LogDebug("Sending job finished notification...", 2);
    var params = aa.util.newHashtable();

    Avo_LogDebug("FileName(" + fileName + ")", 2);   //debug
    addParameter(params, "$$FileName$$", fileName);

    Avo_LogDebug("Total(" + total + ")", 2);   //debug
    addParameter(params, "$$Total$$", total);

    Avo_LogDebug("Successful(" + successful + ")", 2);   //debug
    addParameter(params, "$$Successful$$", successful);

    Avo_LogDebug("Failed(" + failed + ")", 2);   //debug
    addParameter(params, "$$Failed$$", failed);

    Avo_LogDebug("FailedSampleNumbers(" + failedSampleNumbers + ")", 2);   //debug
    addParameter(params, "$$FailedSampleNumbers$$", failedSampleNumbers);

    var result = aa.communication.getNotificationTemplate(template);
    if (result.getSuccess() != true) {
        Avo_LogDebug('Failed to get template "' + template + '". ' + result.errorType + ": " + result.errorMessage, 1);
        return;
    }

    var templateModel = result.getOutput();
    if (!templateModel) {
        Avo_LogDebug('Failed to get template model', 1);
        return;
    }

    var fromEmail = templateModel.getEmailTemplateModel().getFrom();
    if (fromEmail == null) {
        fromEmail = defaultFromEmail;
    }
    var toEmail = templateModel.getEmailTemplateModel().getTo();
    if (toEmail == null) {
        toEmail = defaultToEmail;
    }
    var result2 = aa.document.sendEmailByTemplateName(fromEmail, toEmail, "", template, params, null);
    if (result2.getSuccess() == true) {
        Avo_LogDebug('Notification "' + template + '" sent to ' + toEmail + ' from ' + fromEmail, 1);
    } else {
        Avo_LogDebug('Failed to send notification "' + template + '" to ' + toEmail + ' from ' + fromEmail, 1);
    }
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}