var CapIDList = aa.env.getValue("CapIDList");
var toCancel= false
 java.lang.System.out.println(aa.env.getValue('EventName') + ' - bkevent outside');
for (var i = 0; i < CapIDList.size(); i++) 
{
    var vCapId = CapIDList.get(i);
 		var cap = aa.cap.getCap(vCapId).getOutput();
  	var appTypeResult = cap.getCapType();
  	var appTypeString = appTypeResult.toString();
		if (appTypeString + '' ===  "Building/ASPTEST/NA/NA") {
                      java.lang.System.out.println(aa.env.getValue('EventName') + ' - bkevent');
			toCancel = true
		}
}

if (toCancel){
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" );