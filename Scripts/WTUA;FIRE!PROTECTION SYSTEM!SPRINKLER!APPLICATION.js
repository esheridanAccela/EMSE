

if(wfTask == "Issuance" && wfStatus == "Issued")
{ createLicense("Issued", true);}


/* code to generate pop-up report
InlinePrint("Testing Parmas Config",capId);

function InlinePrint(reportToPrint, reportCapIdModel)
{

var inLineReportModelResult = null;
var inlineURI = null;

  var inlineReportName = reportToPrint;
   if(inlineReportName == 'undefined')
   inlineReportName = null;

  if(inlineReportName)
   inlineReportModelResult = aa.reportManager.getReportModelByName(inlineReportName);
   if(inlineReportModelResult && inlineReportModelResult.getSuccess())
   inlineReportModelObj = inlineReportModelResult.getOutput();

var inlineHashMap = aa.util.newHashMap();
inlineHashMap.put("altID", String(reportCapIdModel.getCustomID()));


  if(inlineReportModelObj)
   inlineURI = aa.reportManager.runReport(inlineHashMap, inlineReportModelObj);

   if(inlineURI && inlineURI.getSuccess())
   {
      showMessage = true;
      aa.env.setValue("ScriptReturnCode", "0");
      aa.env.setValue("ScriptReturnMessage", inlineURI.getOutput());
   }

   if(inlineURI && inlineURI.getSuccess())
   {
      showMessage = true;
      aa.env.setValue("ScriptReturnCode", "0");
      aa.env.setValue("ScriptReturnMessage", inlineURI.getOutput());
   }
   else
   {
      showMessage = true;

 comment("failed");
   }

}

*/