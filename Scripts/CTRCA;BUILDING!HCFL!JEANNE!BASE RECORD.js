//CTRCA:Building/HCFL/Jeanne/Base Record
try {

	checkForDocCat(capId, "Notice of Commencement");
	logDebug("Check for Doc Cat: " + checkForDocCat(capId, "Notice of Commencement"));
	var jobValueFloat = parseFloat(AInfo['Job Value']);
	if (jobValueFloat >= 2501 && !checkForDocCat(capId, "Notice of Commencement")) {
		logDebug("lets add this condition!");
		addStdCondition("Building Permit", "NOC Required");
	}

} catch (err) {
	var emailAddress = "jchalk@accela.com"; //email to send report
	aa.sendMail("CRC@hillsboroughdebug.org", emailAddress, "", "CRCAERROR", debug);
}

var emailAddress = "jchalk@accela.com"; //email to send report
aa.sendMail("CRC@hillsboroughdebug.org", emailAddress, "", "CRCA", debug);

function checkForDocCat(capId, docCategory) {
	docListResult = aa.document.getCapDocumentList(capId, currentUserID);
	var docCatExist = false;

	if (docListResult.getSuccess()) {
		docListArray = docListResult.getOutput();
		for (var x in docListArray) {
			docCat = docListArray[x].getDocCategory();
			if (docCat == docCategory) {
				docCatExist = true;
			}
		}
	}
	return docCatExist;
}