if(aa.env.getValue("EventName") == "v360InspectionResultSubmitBefore") {
    // Make sure "Actual Inspection Date:" is always filled in when resulting an inspection
    var actualInspectionDate = null;
    var gsArray = getGuideSheetObjects(inspId);
    logDebug('IS THIS ACTUALLY PRINTING TO DEBUG IN AMO?')
    for(yy in gsArray){
        var gsObj = gsArray[yy];
        logDebug("gsObj text is: " + gsObj.text);
        if(gsObj.text == "Actual Inspection Date:"){
            logDebug("ACTUAL INSPECTION DATE FOUND in gsObj");
            gsObj.loadInfo();
            if(gsObj.validInfo){
                logDebug("gsObj info is Valid")
                logDebug(gsObj.info)
                for(i in gsObj.info){
                    logDebug(gsObj.info[i])
                }
                if(typeof(gsObj.info["Actual Inspection Date:"]) == "object"){
                    logDebug("gsObj info found with value: " + gsObj.info["Actual Inspection Date:"]);
                    actualInspectionDate = gsObj.info["Actual Inspection Date:"];
                }
            }
        }
    }
    logDebug("actualInspectionDate: " + actualInspectionDate);
    if(actualInspectionDate == "" || actualInspectionDate == null){
        showDebug = false;
        showMessage = true;
        //cancel = true;
        logMessage("You must enter a date in the checklist for 'Actual Inspection Date:' in order to submit this inspection.");
    }else{
        logDebug("actualInspectionDate has a value, good to move on");
    }
}