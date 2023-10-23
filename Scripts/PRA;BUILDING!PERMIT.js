//Written by rprovinc   
//
//

//*****************************************************************************
//Script PRA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		PRA
//Desc:			Sending emails to citizen letting them know that there permit was Approved after payment has been recieved.
//
//Created By: Rprovinc
//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

if (!appMatch("Building/Permit/TempSigns/*") && !appMatch("Building/Permit/TempUse/*") &&
    !appMatch("Building/Permit/DonationBin/*")) {
    autoCloseWorkflow();
    script381_UpdatCustomFieldPermitExpirationDates();
}

//Check balance and update task
if (appMatch("Building/Residential/Addition/BJ20") || appMatch("Building/Permit/TempUse/*") || appMatch("Building/Permit/DonationBin/*")) {
	logDebug("Starting PRA;Building!Permit!~!~.js ");
	logDebug("Current balance: " + balanceDue);

	//Check balance and update task
	if (balanceDue == 0) {
		updateAppStatus("Approved", "Status updated via script PRA;Building!Permit.js");
		closeTask("Application Close", "Approved", "", "");
		closeAllTasks(capId, "Approved");
		//include("5124_CityClerk_Approval");
		
		logDebug("---------------------> PRA;Building!Permit.js ended.");
		//aa.sendMail("jlu@accela.com", "jlu@accela.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
		//Start to generate the Certificate. This will attach to the record when ran.
		logDebug("Starting to kick off event to attach cert to record");
		if ("Building/Residential/Addition/BJ20111".equals(appTypeString)) {
			var altID = capId.getCustomID();
			appType = cap.getCapType().toString();
			var vAsyncScript = "SEND_EMAIL_DB_ASYNC";
			var envParameters = aa.util.newHashMap();
			envParameters.put("altID", altID);
			envParameters.put("capId", capId);
			envParameters.put("cap", cap);
			logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
			aa.runAsyncScript(vAsyncScript, envParameters);
		} else if ("Building/Residential/Addition/BJ20".equals(appTypeString)) {
			var altID = capId.getCustomID();
			appType = cap.getCapType().toString();
			var vAsyncScript = "SEND_EMAIL_TS_ASYNC";
			var envParameters = aa.util.newHashMap();
			envParameters.put("altID", altID);
			envParameters.put("capId", capId);
			envParameters.put("cap", cap);
			logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
			aa.runAsyncScript(vAsyncScript, envParameters);
		} else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
			//include("5149_SEND_EMAIL_TU");
			var altID = capId.getCustomID();
			appType = cap.getCapType().toString();
			var capAlias = cap.getCapModel().getAppTypeAlias();
			var recordID = altID;
			var emailTo = getEmailString();
			var recordApplicant = getContactByType("Applicant", capId);
			var firstName = recordApplicant.getFirstName();
    		var lastName = recordApplicant.getLastName(); 
			var vAsyncScript = "SEND_EMAIL_TU_ASYNC";
			var envParameters = aa.util.newHashMap();
			envParameters.put("altID", altID);
			envParameters.put("capId", capId);
			envParameters.put("cap", cap);
			aa.runAsyncScript(vAsyncScript, envParameters);
			logDebug("Starting to kick off ASYNC event for TU. Params being passed: " + envParameters);
			// var today = new Date();
			// var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
			// var params = aa.util.newHashtable();
			// getACARecordParam4Notification(params, acaUrl);
			// //addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
			// var tParams = aa.util.newHashtable();
			// tParams.put("$$todayDate$$", thisDate);
			// tParams.put("$$altid$$", recordID);
			// tParams.put("$$Record Type$$", "Temporary Use Permit");
			// tParams.put("$$capAlias$$", capAlias);
			// tParams.put("$$FirstName$$", firstName);
			// tParams.put("$$LastName$$", lastName);
			// getRecordParams4Notification(params);
			// getContactParams4Notification(params, "Applicant");
	
			// var reportName;
			// reportName = "Temp_Use_Permit_script";
			// var param4attachDoc = aa.util.newHashMap();
			// //param4attachDoc.put("capID", capId.getCustomID());
			// param4attachDoc.put("RecordID", recordID);
			// logDebug("Starting Permit Notificaiton Email");
			//permitNotificationEmail();
			//email("jlu@accela.com", "jlu@accela.com", "Debug testing", "Debug: ");
		}
	}

	logDebug("End of PRA;CityClerk!Incident!~!~.js ");
}
logDebug("End of PRA;Building!Permit!~!~.js ");

if (appMatch("Building/Permit/Master/*")) {
	logDebug("Starting PRA;Building!Permit!Master!~.js ");
	logDebug("Current balance: " + balanceDue);
	closeTask("Fee Processing", "Complete", "", "");
	//Check balance and update task
	if (balanceDue == 0) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var invoiceNbrObj = getLastInvoice({});
		var invNbr = invoiceNbrObj.getInvNbr();
		var vAsyncScript = "SEND_EMAIL_BLD_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		envParameters.put("INVOICEID", String(invNbr));
		logDebug("Starting to kick off ASYNC event for BLD Permit Master. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		logDebug("---------------------> PRA;Building!Permit.js ended.");
	}
}
//Building/Permit/Plans/*
if (appMatch("Building/Permit/Plans/*")) {
	logDebug("Starting PRA;Building!Permit!Plans!~.js ");
	logDebug("Current balance: " + balanceDue);
	//closeTask("Fee Processing", "Complete", "", "");
	//Check balance and update task
	if (balanceDue == 0) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var invoiceNbrObj = getLastInvoice({});
		var invNbr = invoiceNbrObj.getInvNbr();
		var vAsyncScript = "SEND_EMAIL_BLD_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		envParameters.put("INVOICEID", String(invNbr));
		logDebug("Starting to kick off ASYNC event for BLD Permit Plans. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		include("5142_BLDPWP_Permit_Issuance");
		logDebug("---------------------> PRA;Building!Permit.js ended.");
	}
}
if (appMatch("Building/Permit/New Building/*")) {
	logDebug("Starting PRA;Building!Permit!New Building!~.js ");
	logDebug("Current balance: " + balanceDue);
	//Check balance and update task
	if (balanceDue == 0) {
		var altID = capId.getCustomID();
		var appType = cap.getCapType().toString();
		var capAlias = cap.getCapModel().getAppTypeAlias();
		var invoiceNbrObj = getLastInvoice({});
		var invNbr = invoiceNbrObj.getInvNbr();
		var homeOwnerInfoField = getAppSpecific("Homeowner acting as Contractor");
		var emailTo = getEmailString();
		var recordApplicant = getContactByType("Applicant", capId);
		var firstName = recordApplicant.getFirstName();
		var lastName = recordApplicant.getLastName();
		var vAsyncScript = "SEND_EMAIL_BLD_NEW_CON";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		envParameters.put("homeOwnerInfoField", homeOwnerInfoField);
		envParameters.put("INVOICEID", String(invNbr));
		envParameters.put("emailTo", emailTo);
		envParameters.put("recordApplicant", recordApplicant);
		envParameters.put("firstName", firstName);
		envParameters.put("lastName", lastName);
		envParameters.put("capAlias", capAlias);
		logDebug("Starting to kick off ASYNC event for BLD PERMITS New Building. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		logDebug("---------------------> PRA;Building!Permit.js ended.");
	}
}

function getEmailString() {
	var emailString = "";
	var contactArray = getPeople(capId);

	//need to add inspection contact below to this logic 
	for (var c in contactArray) {
		if (contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().contactType == "Applicant") {
			emailString += contactArray[c].getPeople().getEmail() + ";";

		}
	}
	logDebug(emailString);
	return emailString;
}

function localCloseAllTasks(capId, wfComment) {
	var wfstat = wfComment,
		task,
		dispositionDate,
		stepnumber;

	var tasks = aa.workflow.getTaskItems(capId, null, null, "N", null, "Y").getOutput();

	for (i in tasks) {
		task = tasks[i];
		dispositionDate = aa.date.getCurrentDate();
		stepnumber = task.getStepNumber();

		aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, '', wfComment, systemUserObj, "Y");

		logMessage("Closing Workflow Task: " + task.getTaskDescription() + " with status " + wfstat);
		logDebug("Closing Workflow Task: " + task.getTaskDescription() + " with status " + wfstat);
	}

}

function permitNotificationEmail() {
	var altID = capId.getCustomID();
	appType = cap.getCapType().toString();
	var capAlias = cap.getCapModel().getAppTypeAlias();
	var recordID = altID;
	//var emailTo = getEmailString();
	var emailTo = "jlu@accela.com"
	var recordApplicant = getContactByType("Applicant", capId);
	var firstName = recordApplicant.getFirstName();
	var lastName = recordApplicant.getLastName(); 
	//var vAsyncScript = "SEND_EMAIL_TU_ASYNC";
	// var envParameters = aa.util.newHashMap();
	// envParameters.put("altID", altID);
	// envParameters.put("capId", capId);
	// envParameters.put("cap", cap);
	//aa.runAsyncScript(vAsyncScript, envParameters);
	//logDebug("Starting to kick off ASYNC event for TU. Params being passed: " + envParameters);
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	//var params = aa.util.newHashtable();
	// getACARecordParam4Notification(params, acaUrl);
	//addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
	var tParams = aa.util.newHashtable();
	tParams.put("$$todayDate$$", thisDate);
	tParams.put("$$altid$$", recordID);
	//tParams.put("$$Record Type$$", "Temporary Use Permit");
	tParams.put("$$capAlias$$", capAlias);
	tParams.put("$$FirstName$$", firstName);
	tParams.put("$$LastName$$", lastName);
	// getRecordParams4Notification(params);
	// getContactParams4Notification(params, "Applicant");

	var reportName;
	reportName = "Temp_Use_Permit_script";
	var param4attachDoc = aa.util.newHashMap();
	//param4attachDoc.put("capID", capId.getCustomID());
	param4attachDoc.put("RecordID", recordID);
	logDebug("Starting Permit Notificaiton Email");
	var rFile;

	//rFile = generateReport(capId, reportName, "Licenses", param4attachDoc);
	rFile = generateReport(capId, reportName, "Building", param4attachDoc);
	logDebug("rfile is = " + rFile);
	logDebug("capId:" + capId + " capId.getCustomID():" + capId.getCustomID());

	if (rFile) {
		var rFiles = new Array();
		rFiles.push(rFile);
		logDebug("TParams: " + tParams);
		logDebug("Email To: " + emailTo);
		var emailTemplate = "CC PERMIT ISSUANCE";
		sendNotification("noreply@accela.com", emailTo, "", emailTemplate, tParams, rFiles);
		
	}

}

