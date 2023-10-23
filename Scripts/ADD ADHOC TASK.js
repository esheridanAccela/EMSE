var id1=aa.env.getValue("PermitId1");
var id2=aa.env.getValue("PermitId2");
var id3=aa.env.getValue("PermitId3");

var ahTask = "Adhoc Task1";
var userObj = aa.person.getUser("JLU").getOutput();

var tmpID = aa.cap.getCapID(id1, id2,id3).getOutput();

// Get workflow for the record
var taskObjEnv = aa.workflow.getTasks(tmpID);

// Only continue if successful.  If so, alter first task as the basis of the adhoc task
if (taskObjEnv.getSuccess()) {
	var taskObj = taskObjEnv.getOutput()[0].getTaskItem();

	// TaskItemModel uses Java dates, so initialize variables for that
	var assignDateJava = new Date();
	var dueDateJava = new Date();

	// Convert assignDate to Java date for setting task info
	if (typeof assignDate != "undefined" && assignDate != null) {
		if (assignDate.match(/\//g).length == 2) {
			assignDateJava = new Date(assignDate);
		}
		else {
			logDebug("Invalid date format given for assignDate.  Using current date.")
		}
	}

	// Convert dueDate to Java date for setting task info
	if (typeof dueDate != "undefined" && dueDate != null) {
		if (dueDate.match(/\//g).length == 2) {
			dueDateJava = new Date(dueDate);
		}
		else {
			logDebug("Invalid date format given for dueDate.  Using current date.")
		}
	}

	// Set static task parameters for Pima County adhoc tasks (i.e. DO NOT CHANGE THEM)
	taskObj.setProcessCode("ADHOC_WORKFLOW");
	taskObj.setStepNumber(0);
	taskObj.setProcessID(51);

	// Making sure task is active
	taskObj.setActiveFlag("Y");
	taskObj.setAuditStatus("A");
	taskObj.setCompleteFlag("N");
	taskObj.setDispositionNote("");

	// Setting values specific to the task being added
	taskObj.setCapID(tmpID);
	taskObj.setTaskDescription(ahTask);
	taskObj.setAssignmentDate(assignDateJava);
	taskObj.setDueDate(dueDateJava);
	taskObj.setAssignedUser(userObj);

	// Create adhoc task
	wf = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
	wf.createAdHocTaskItem(taskObj);
}
