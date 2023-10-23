//Time Entries in 15 Min increments

var vDisplayMessage = false;
var vEventName = aa.env.getValue("EventName");
var vTimeAccounting;
logDebug("vEventName = " + vEventName);
if(vEventName == "WorkflowTaskUpdateBefore" 
  || vEventName == "V360InspectionResultSubmitBefore" || vEventName == "InspectionResultSubmitBefore"
  || vEventName == "V360InspectionResultModifyBefore" || vEventName == "InspectionResultModifyBefore"){
	vTimeAccounting = typeof(timeAccountingArray) == "undefined" ? aa.env.getValue("TimeAccountingArray") : timeAccountingArray;
	if(vTimeAccounting != null && vTimeAccounting != ""){
		for(i in vTimeAccounting){
			var vTimeEntry = vTimeAccounting[i];
            //Accela bug: time entry is null from event when modified instead of newly added. Don't break whole event on that error.
            if (vTimeEntry) {
                //Deleted entries still show up in this array - check the operation to skip them
                if (vTimeEntry.getOperation() != "delete") {
                    var vTimeElapsedMinutes = vTimeEntry.getTimeElapsed().getMinutes();
                    logDebug("Found time entry with Elapsed Minutes = " + vTimeElapsedMinutes);
                    if(!matches(vTimeElapsedMinutes,"0","15","30","45")){
                        vDisplayMessage = true;
                        break;
                    }
                }
            }
 		}
	}

}
//added by Mark Fahey 10/23/2018
else if(vEventName == "TimeAccountingAddBefore"){
	//use the in session variables timeElapsedMin
		logDebug("Found time entry with Elapsed Minutes = " + timeElapsedMin);
	if(!matches(timeElapsedMin ,"0","15","30","45")){
		vDisplayMessage = true;
	}
}
else if(vEventName == "TimeAccountingUpdateBefore"){
    var TimeLogModel = aa.env.getValue("TimeLogModel");
	var vTimeElapsedMinutes = TimeLogModel.getTimeElapsed().getMinutes();

	logDebug("Found time entry with Elapsed Minutes = " + vTimeElapsedMinutes);
	if(!matches(vTimeElapsedMinutes,"0","15","30","45")){
		vDisplayMessage = true;
	}
}

if(vDisplayMessage){
	vDisplayMessage = false;
	cancel = true;
	showMessage = true;
	comment("All time entries must be in 15 minute increments");
}