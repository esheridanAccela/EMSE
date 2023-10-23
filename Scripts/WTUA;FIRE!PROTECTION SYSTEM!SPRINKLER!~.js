showDebug=true;
logDebug("trigger popup case 01394394");

	var params = aa.env.getParamValues();
var keys =  params.keys();
var key = null;
while(keys.hasMoreElements())
{
 key = keys.nextElement();
 eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
 logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}


// case 01394394
//resultWorkflowTask("Application Submittal","Incomplete","should be 2hours","should be 2hours");