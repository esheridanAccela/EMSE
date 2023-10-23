var myCapId = "20CAP-00000016";
var myUserId = "JLU";

var capId=aa.cap.getCapID(myCapId).getOutput();

rParams = aa.util.newHashtable();
rParams.put("altId", "" + capId.getCustomID());
aa.runAsyncScript("EncroachmentPermitStatus", rParams);