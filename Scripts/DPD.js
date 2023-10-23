/**
 * Script ID: 402
 * Created By: Steve Tomilloso
 * Summary: When fees are paid and balance is 0 update WF status from "Waiting for Payment"
 * to "Paid" then trigger WTUA in case scripts are tied to status change. 
 */
if (((appTypeArray[0].substr(0,3) == "DPD") || (appTypeArray[0].substr(0,4) == "RRIO")) && balanceDue <= 0) {
	var wfObj = aa.workflow.getTasks(capId).getOutput();
	var i = 0;
	var fTask;
	var vTaskName;
	var vProcessID;
	var vProcessCode;
	var vStepNum;
	var vTaskActive;
	var vTaskStatus;
	for (i in wfObj) {
		fTask = wfObj[i];
		vTaskName = fTask.getTaskDescription();
		vProcessID = fTask.getProcessID();
		vProcessCode = fTask.getProcessCode();
		vStepNum = fTask.getStepNumber();
		vTaskActive = fTask.getActiveFlag();
		vTaskStatus = fTask.getDisposition();
		
		if (vTaskActive == "Y" && vTaskStatus == "Waiting for Payment") {
            logDebug("Found waiting for payment task " + vTaskName + " in process " + vProcessCode);
			var vAction = getWorkflowTaskResultAction(vTaskName, "Paid", vProcessCode);
			if(""+vAction === "U"){
				updateTask(vTaskName, "Paid", "Updated by DPD script 402.","Updated by DPD script 402.", vProcessCode);
			} else {
				closeTask(vTaskName,"Paid","Closed by script 402.","Updated by script 402.", vProcessCode);
				
			}
			runWTUAForWFTaskWFStatus(vTaskName, vProcessID, vStepNum, "Paid", capId);		
		}
	}
}