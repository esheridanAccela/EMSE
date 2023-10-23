/***********************************************************************
 * To get People Template Attribute(dropdown list) values by EMSE Script.
 * 1. Get peopleNumber(LP/Contact number) from aa.env
 * 2. Invoke web service URL to get return values.
 * 3. Populate the return values to aa.env.
 **********************************************************************/
 
/**
 * EMSE script entrance 
 **/
main();

/**
 * Main function 
 **/
function main()
{
	var rtnCode = "-1";
	var licenseProfessionalModel = aa.env.getValue("LICENSE_PROFESSIONAL_MODEL");
	
//hardcoded to retrieve info for p_lic_num=37-905c
	var wsURL = "https://www4.cbs.state.or.us/exs/bcd/accela/ws/accelaws.cfc?method=elect_super&returnformat=json&p_lic_num=37-905c";
	var scriptResult = aa.httpClient.get(wsURL);
	if (scriptResult.getSuccess() == true)
	{
		var result = scriptResult.getOutput();
		rtnCode = populateReturnValuesToAAEnv(result.toString());
	}
	else
	{
		setReturnMessage(scriptResult.getErrorMessage());
	}

	
	if (rtnCode != "-1")
	{
		aa.env.setValue("ScriptReturnCode", "0");
	}
}

/**
 * Populate return values to AAenv.
 **/
function populateReturnValuesToAAEnv(result)
{
	if (result.indexOf("Sorry no signing supervisors in the system") != -1)
	{
		setReturnMessage("Sorry no signing supervisors in the system!");
		return "-1";
	}
	else
	{
		var myObj = eval('(' + result + ')');
		var list = aa.util.newArrayList();
		var myObjArr = String(myObj.NAME_PAIRS).split("|");
		for (i in myObjArr)
		{
		list.add(myObjArr[i]);
		}
		aa.env.setValue("PTA_DDLIST_ITEMS",list);
		setReturnMessage("Sucessful to get People Template Attribute dropdown list items"+list);
		return "0";
	}
}

/**
 * Set return message
 **/
function setReturnMessage(message)
{
	aa.log(message);
	aa.env.setValue("ScriptReturnMessage", message);
}