logDebug("***** Starting SEND_EMAIL_TU_ASYNC *****");
// if (typeof debug === 'undefined') {
// 	var debug = "";										// Debug String, do not re-define if calling multiple
// 	}
var debug = "";
var br = "<BR>";
var currentUserID = aa.env.getValue("currentUserID");
if (currentUserID == "publicuser14"){
	showDebug = 3;
	}
try
{
	var capId = aa.env.getValue("capId");
	var capID = "21CAP-00000108";
	var cap = aa.env.getValue("cap");
	var recordID = aa.env.getValue("altID");
	var emailTo = getEmailString(); 
	var recordApplicant = getContactByType("Applicant", capId);
	var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
	var capAlias = cap.getCapModel().getAppTypeAlias();
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	var tParams = aa.util.newHashtable();
	tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", recordID);
    tParams.put("$$Record Type$$", "Temporary Use Permit");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
	var rParams = aa.util.newHashtable();
	//rParams.put("AGENCYID", "AURORACO");
	rParams.put("RecordID", recordID);
	var emailtemplate = "CC PERMIT ISSUANCE";
	var report = generateReportFile("Temp_Use_Permit_script", rParams, aa.getServiceProviderCode());
	sendNotification("jlu@accela.com", emailTo, "", emailtemplate, tParams, [report]);
	email("jlu@accela.com", "jlu@accela.com", "Debug" + recordID, "Debug: " + debug);
}
catch(e)
{
	email("jlu@accela.com", "jlu@accela.com", "Error" + recordID, e.message + " in Line " + e.lineNumber + br + "Stack: " + e.stack + br + "Debug: " + debug);
}
function getEmailString()
{
	var emailString = "";
	var contactArray = getPeople(capId);

	//need to add inspection contact below to this logic 
	for (var c in contactArray)
	{
		if (contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().contactType == "Applicant")
		{
			emailString += contactArray[c].getPeople().getEmail() + ";";

		}
	}
	logDebug(emailString);
	return emailString;
}
logDebug("Starting function getPeople")
 function getPeople(capId)
{
	capPeopleArr = null;
	var s_result = aa.people.getCapContactByCapID(capId);
	if(s_result.getSuccess())
	{
		capPeopleArr = s_result.getOutput();
		if(capPeopleArr != null || capPeopleArr.length > 0)
		{
			for (loopk in capPeopleArr)	
			{
				var capContactScriptModel = capPeopleArr[loopk];
				var capContactModel = capContactScriptModel.getCapContactModel();
				var peopleModel = capContactScriptModel.getPeople();
				var contactAddressrs = aa.address.getContactAddressListByCapContact(capContactModel);
				if (contactAddressrs.getSuccess())
				{
					var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
					peopleModel.setContactAddressList(contactAddressModelArr);    
				}
			}
		}
		else
		{
			aa.print("WARNING: no People on this CAP:" + capId);
			capPeopleArr = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to People: " + s_result.getErrorMessage());
		capPeopleArr = null;	
	}
	return capPeopleArr;
}
function logDebug(str){aa.print(str);}
function logMessage(str){aa.print(str);}
 function getContactByType(conType,capId) {

    var contactArray = getPeople(capId);



    for(thisContact in contactArray) {

        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())

            return contactArray[thisContact].getPeople();

    }



    return false;

}
function email(pToEmail, pFromEmail, pSubject, pText) 
	{
	//Sends email to specified address
	//06SSP-00221
	//
	aa.sendMail(pFromEmail, pToEmail, "", pSubject, pText);
	logDebug("Email sent to "+pToEmail);
	return true;
	}


function generateReportFile(aaReportName,parameters,rModule) 
{
	var reportName = aaReportName;

	report = aa.reportManager.getReportInfoModelByName(reportName);
	report = report.getOutput();


	report.setModule(rModule);
	report.setCapId(capId);
	report.setReportParameters(parameters);
	//Added
	vAltId = capId.getCustomID();
	debug = "ValtID: " + vAltId + br + "Report Name: " + reportName + br + "Going to start generating report";
	report.getEDMSEntityIdModel().setAltId(vAltId);
	var permit = aa.reportManager.hasPermission(reportName,"ADMIN");
	aa.print("---"+permit.getOutput().booleanValue());
	if(permit.getOutput().booleanValue()) 
	{

		var reportResult = aa.reportManager.getReportResult(report);
		aa.print("Env Variables" + aa.env.getParamValues());
	for (i in aa.env) {aa.print("method: " + i);}
		//debug = debug + br + "Report Result User: " + reportResult.getUser();
		debug = debug + br + "Report Result: " + reportResult;

		//if(reportResult) 
		//{
			for(l in reportResult) if(typeof(reportResult[l])!="function"){{aa.print("loop attributes: " + l + " : " +reportResult[l]);}}
	for(l in reportResult) if(typeof(reportResult[l])=="function"){{aa.print("loop methods: " + l);}}
			reportResult = reportResult.getOutput();
			for(l in reportResult) if(typeof(reportResult[l])!="function"){{aa.print("loop attributes: " + l + " : " +reportResult[l]);}}
	for(l in reportResult) if(typeof(reportResult[l])=="function"){{aa.print("loop methods: " + l);}}
			debug = debug + br + "Report Result2: " + reportResult;
			var reportFile = aa.reportManager.storeReportToDisk(reportResult);
			debug = debug + br + "reportFile: " + reportFile;
			logMessage("Report Result: "+ reportResult);
			reportFile = reportFile.getOutput();
			return reportFile
		//}
		 //else 
		// {
		// 	logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
		// 	return false;
		// }
	} else 
	{
		logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
		return false; 
	}
}
 function sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)

{

	var itemCap = capId;

	if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args



	var id1 = itemCap.ID1;

 	var id2 = itemCap.ID2;

 	var id3 = itemCap.ID3;



	var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);





	var result = null;

	result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);

	if(result.getSuccess())

	{

		logDebug("Sent email successfully!");

		return true;

	}

	else

	{

		logDebug("Failed to send mail. - " + result.getErrorType());

		return false;

	}

}
 function convertContactAddressModelArr(contactAddressScriptModelArr)

{

	var contactAddressModelArr = null;

	if(contactAddressScriptModelArr != null && contactAddressScriptModelArr.length > 0)

	{

		contactAddressModelArr = aa.util.newArrayList();

		for(loopk in contactAddressScriptModelArr)

		{

			contactAddressModelArr.add(contactAddressScriptModelArr[loopk].getContactAddressModel());

		}

	}	

	return contactAddressModelArr;

}