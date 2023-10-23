//test for Los Angels ok to remove

try{
	if("Final Review".equals(wfTask) && "Pending Response".equals(wfStatus)){
		
//		aDateToExp= dateAdd(tmpNewDate, 0)
	var javascriptDate = new Date(aa.util.now());
	logDebug("javascriptDate: " + javascriptDate);
	var javautilDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());
	logDebug("javautilDate: " +javautilDate + "typeOf: " + typeof(javautilDate));
var lastHope = aa.util.parseDate("01/02/2021");
logDebug("lastHope" + lastHope);
//										if(expirationDate) casm.setExpirationDate(aa.util.parseDate(expirationDate));


		licEditExpInfo("About to Expire", lastHope);
		showDebug=true; logDebug("should have set to about to expire");
		createResult = aa.cap.createRenewalRecord(capId);
		if (!createResult.getSuccess() || !createResult.getOutput()) {
			logDebug("Could not create renewal record. " + capId + "  This could be due to EMSE errors on record creation : " + createResult.getErrorMessage());
		} else {
			renewalCapId = createResult.getOutput();
			renewalCap = aa.cap.getCap(renewalCapId).getOutput();
			if (renewalCap.isCompleteCap()) {
				logDebug("Renewal Record already exists : " + renewalCapId.getCustomID());
			} else {
				logDebug("created Renewal Record " + renewalCapId.getCustomID());

				/*********************************************
				//Calculate altYear for renewal extension - modified 11/19/18
				//var altYear = "" + sysDate.getYear().toString().substring(2,4);
				//if((sysDate.getMonth()==3 && sysDate.getDayOfMonth()>20) || sysDate.getMonth()>3){
				//	altYear++;
				//}
				var altYear = "" + sysDate.getYear().toString().substring(2,4);
				if((sysDate.getMonth()==3 && sysDate.getDayOfMonth()>20) || sysDate.getMonth()>3){

					//check for new hauler, they wont have previous year - ghess: added 4/6/2018
					var parentAltId = capId.getCustomID(); //////////////////////////////////////////////////
					var prevPermitAltId = parentAltId + "-REN" + altYear;
					
					var getCapResult = aa.cap.getCapID(prevPermitAltId);
					if (getCapResult.getSuccess()){
						altYear++;
					} else {
						//aa.print("No previous permit");
					}
				}
				**********************************************/

				//Calculate altYear for renewal extension - modified 11/27/19
				var altYear = "" + sysDate.getYear().toString().substring(2,4);
				var currMonth = sysDate.getMonth();
				var currDayOfMonth = sysDate.getDayOfMonth();

				/************************************
				// For Testing purposes
				var altYear = "20";
				var currMonth = "6";
				var currDayOfMonth = "2";
				************************************/

				//logDebug("currMonth = " + currMonth);
				//logDebug("currDayOfMonth = " + currDayOfMonth);
				//logDebug("altYear = " + altYear);
				
				if(currMonth>6){
					altYear++;
				}

				var newAltId = capIDString + "-REN" + altYear + "-tmp";
				logDebug("New Alt Id = " + newAltId);
				if (renewalCapId.getCustomID() != newAltId) {
					var updResult = aa.cap.updateCapAltID(renewalCapId, newAltId);
					if(updResult.getSuccess()){
						logDebug("Alt ID updated to " + newAltId);
					}else{
						logDebug("Error updating AltID: " +updResult.getErrorMessage());
					}
					
				}
				copyAppSpecific(renewalCapId);
				
				logDebug("Attempting to update Access by ACA for:: " + renewalCapId);
				aa.cap.updateAccessByACA(renewalCapId,"Y");
				
				//id-77
				// 3/5/18, ghess: Reporting Frequency no longer used
				//if(AInfo["Franchise Service Provider"]=="CHECKED"){
				//	editAppSpecific("Reporting Frequency", "Monthly", renewalCapId);
				//}else{
				//	editAppSpecific("Reporting Frequency", "Quarterly", renewalCapId);
				//}
			}
		}
	}
}catch(err){
    logDebug("A JavaScript Error occurred:  WTUA:Sanitation/AB939/Application/NA: ID-75: " + err.message);
 logDebug(err.stack);
}

