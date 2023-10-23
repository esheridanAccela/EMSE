/*------------------------------------------------------------------------------------------------------/
| Program: CLEAREXPIREDINCOMPLETECAP
| Purpose: Batch job processing of license expirations
|
| Modification History
| ------------------------------------------------------------------------------------------------------
| ENT 945 10/05/2018 JAR:  first version
/-------------------------------------------------------------------------------------------------------*/

emailText = "";
maxSeconds = 5400; // number of seconds allowed for batch processing, usually < 5*60
message = "";
br = "<br>";

// START OF MAIN PROCESS

aa.print("Batch job Started " + br);
batchJobName = "clearExpiredIncompleteCAP"; // Please replace batchJobName value with the actual Batch Job Name.
batchJobDesc = "clearExpiredIncompleteCAP"; // Please replace batchJobDesc value with the actual Batch Job Description.
batchJobResult = "clearExpiredIncompleteCAP"; // Please replace batchJobResult value with the actual Batch Job Result.
sysDate = aa.date.getCurrentDate(); 
batchJobID = aa.batchJob.getJobID().getOutput(); 
var removeResult = aa.cap.removeExpiredIncompleteCAP();
if(removeResult.getSuccess())
{
  aa.print("passed");
  aa.env.setValue("ScriptReturnCode","0");
  aa.env.setValue("ScriptReturnMessage","Remove expired incomplete CAPS successful");
  aa.eventLog.createEventLog("Cleared Incomplete CAPs successfully", "Batch Process", batchJobName, sysDate, sysDate,batchJobDesc, batchJobResult, batchJobID);
}
else
{
  aa.print("failed");
  aa.env.setValue("ScriptReturnCode","1");
  aa.env.setValue("ScriptReturnMessage","Remove expired incomplete CAPS failed");
}

aa.print("Batch job Completed " + br);