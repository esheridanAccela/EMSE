showDebug=3; 
logDebug("in renewal asa");
var partialCapId = getIncompleteCapId(); 
var parentCapId = aa.env.getValue("ParentCapID");

//1. Check to see if license is ready for renew if (isRenewProcess(parentCapId, partialCapId)) {
        aa.print("CAPID(" + parentCapId + ") is ready for renew. PartialCap (" + partialCapId + ")");
        var result = aa.cap.createRenewalCap(parentCapId, partialCapId, true);
        if (result.getSuccess())
        {
                //3. Copy key information from parent license to partial cap
            //    copyKeyInfo(parentCapId, partialCapId);
                //4. Set B1PERMIT.B1_ACCESS_BY_ACA to "N" for partial CAP to not allow that it is searched by ACA user.
                aa.cap.updateAccessByACA(partialCapId, "Y");
        }
        else
        {
                aa.print("ERROR: Associate partial cap with parent CAP. " + result.getErrorMessage());
        }


function getIncompleteCapId()
{
    var s_id1 = aa.env.getValue("PermitId1");
    var s_id2 = aa.env.getValue("PermitId2");
    var s_id3 = aa.env.getValue("PermitId3");

    var result = aa.cap.getCapIDModel(s_id1, s_id2, s_id3);
    if(result.getSuccess())
        {
      return result.getOutput();
        }
    else
    {
      aa.print("ERROR: Failed to get capId: " + result.getErrorMessage());
      return null;
    }
}
