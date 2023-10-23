//CTRCA:Sanitation/AB939/Permit/NA
//Updates:
//	05/09/2018, ghess - added record and expiration status updates for parent (Application) record, commenting out rec status for now
//	05/11/2018, ghess - added Try/Catch around expiration updates. 
//	11/19/2018, ghess - moved parentAltId above IF block. 
//	01/28/2019, ghess - now makes 10 attempts to find next REN year extension from the current year, and base the expiration date off that 
//	11/06/2019, ghess - modified date code for testing
//	11/18/2019, ghess - Simplified code based on Shu's review. Deleted old code.
//  03/02/2020, timc  - autoincrement renewal year when updating altid if record already exists 
/*
id-75: Permit Year Record ID Mask 
lwacht
*/
showDebug=true;
try{
	var parentCapId = getParentCapID4Renewal();
	var parentAltId = parentCapId.getCustomID();
	
	//createCapComment("CTRCA:Sanitation/AB939/Permit/NA: parentCapId = " + parentCapId,capId); // ------------ debug ----------------
	//logDebug("parentCapId = " + parentCapId);
	
	if(parentCapId){ //if cloned or renewed
		var result = aa.cap.updateRenewalCapStatus(parentCapId, capId);
		logDebug("CapID:: " + capId);
		var updResultyea = aa.cap.updateAccessByACA(capId, "Y");
		var FROM = "noreply@DeviceAcceleration.com";
		var TO = "esheridan@accela.com";
		var SUBJECT = "CTRCA renewal: CAPID:: " + capId;
		var BODY_TEXT = "Parent CapId:: " + parentCapId + " " + debug;
		aa.sendMail(FROM, TO, "", SUBJECT , BODY_TEXT);
		if(updResultyea.getSuccess()){
			logDebug("Processed Successful");
			
		}else {
			logDebug("Failed Process");
		}

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
		
		//if((currMonth==3 && currDayOfMonth>20) || currMonth>3){
		if(currMonth>6){
			altYear++;
		}

		var newAltId = parentAltId.substring(0,10) + "-REN" + altYear;
		while(aa.cap.getCapID(newAltId).getSuccess()) {
			altYear++;
			newAltId = parentAltId.substring(0,10) + "-REN" + altYear;
		} 
		updResult = aa.cap.updateCapAltID(capId, newAltId);

		if(!updResult.getSuccess()){
			logDebug("Error updating alt id to " + newAltId);
		} else {
			logDebug("Alt ID updated to " + newAltId);
		
			// update expiration dates
			var expDate = "06/30/20" + altYear;
			  //a special try/catch in case the record doesn't have an expiration code
			try{
			   licEditExpInfo("Pending",expDate);
			}catch(err){
			   logDebug("Skipping. Permit does not have an expiration code");
			}

			//update parent statuses
			var currId = capId;
			capId = parentCapId;
			//aa.print("Updating expiration for parent cap: " + capId.getCustomID()) ;
			try{
			   licEditExpInfo("Pending",expDate);
			}catch(err){
			   logDebug("Skipping. Application does not have an expiration code");
			}
			//updateAppStatus("Pending","Updated per script ID-75",capId);
			capId = currId;

			//relate to parent also - ghess 02/23/2018
			// Won't work. See SalesFoce case: 18ACC-278946
			//addParent(parentCapId);
		}
	}
}catch(err){
    logDebug("A JavaScript Error occurred: CTRCA:Sanitation/AB939/Permit/NA: ID-75: " + err.message);
	logDebug(err.stack);
}