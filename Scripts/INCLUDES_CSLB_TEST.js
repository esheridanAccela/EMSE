//@ts-check
//parameters - set parameter values here for ease of use
var showDebug = true;
var debug = "";

var useProductScript = true; // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)

//load MasterScript libraries. Don't change this unless you know what you are doing.
var SCRIPT_VERSION = 3;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useProductScript));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useProductScript));
eval(getScriptText("INCLUDES_CUSTOM", null, useProductScript));
eval(getScriptText("INCLUDES_CSLB", null, false));

var scriptTitle = "INCLUDES_CSLB";
var functTitle = scriptTitle + "_TEST: ";
var startTime;

var testArray = [
    {
        licNo: 494949
    },
    {
        licNo: 1
    }
];

var testArrayLen = testArray.length;

notice('** BEGIN SCRIPT TEST - ' + scriptTitle + '  **');

notice("BEGIN Test LookUpStandardChoice", functTitle, "INFO");
startClock();

var results = LookUpStandardChoice("CSLB_CONNECTION_INFO");

if (results && results !== null) {
    notice("Function completed successfully.", functTitle, "SUCCESS");
    logDebug(functTitle + "Token: " + results.Token);
    logDebug(functTitle + "URL: " + results.URL);
} else {
    notice("Function reporting errors in debug log.", functTitle, "ERROR");
}
notice("END Test case LookupStandardChoice <br />" + "Execution time: " + elapsedTime() + " seconds", functTitle, "INFO");

for (var i = 0; i < testArrayLen; i++) {
    notice("BEGIN Test SearchCslbByLic()", functTitle, "INFO");
    startClock();

    var searchResults = SearchCslbByLic(testArray[i].licNo);

    if (searchResults && searchResults !== null) {
        notice("Function completed successfully.", "SearchCslbByLic(): ", "SUCCESS");
        exploreObject(searchResults);
    }

    notice("END Test case SearchCslbByLic() <br />" + "Execution time: " + elapsedTime() + " seconds", "SearchCslbByLic(): ", "INFO");


}
notice('** END SCRIPT TEST - ' + scriptTitle + '  **');

aa.env.setValue("ScriptReturnCode", "0");
aa.env.setValue("ScriptReturnMessage", debug);

//test functions
function startClock() {
    startTime = new Date();
}

function elapsedTime() {
    var endTime = new Date();
    var timeDiff = Number(endTime) - startTime;
    timeDiff /= 1000;

    //var seconds = Math.round(timeDiff);

    return timeDiff;
}

function exploreObject(objExplore) {
    logDebug("Methods:");
    for (var x in objExplore) {
        try {
            if (typeof (objExplore[x]) === "function") {
                logDebug("<font color=blue><u><b>" + x + "</b></u></font> ");
                logDebug("   " + objExplore[x] + "<br>");
            }
        } catch (err) {
            logDebug("<font color=red><u><b>" + x + "</b></u></font> ");
            logDebug("**ERROR** " + err.Message);
        }
        var counter = objExplore.length;
    }

    logDebug("");
    logDebug("Properties:");
    for (var y in objExplore) {
        try {
            if (typeof (objExplore[y]) !== "function") {
                logDebug("  <b> " + y + ": </b> " + objExplore[y]);
            }
        } catch (err) {
            logDebug("  <font color=red><b> " + y + ": </b></font> " + "**ERROR**" + err.Message);
        }
    }
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript;
    try {
        if (useProductScripts) {
            emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

function notice(dstr, prefix, level) {
    var vLevel = "INFO";
    if (typeof level !== "undefined") {
        vLevel = level;
    }

    if (typeof prefix !== "undefined") {
        dstr = prefix + dstr;
    }

    var levelCSS = "infoMsg";
    if (vLevel == "INFO") levelCSS = "infoMsg";
    if (vLevel == "SUCCESS") levelCSS = "successMsg";
    if (vLevel == "WARNING") levelCSS = "warningMsg";
    if (vLevel == "ERROR") levelCSS = "errorMsg";
    var msgFormatted = getMessageStyle();
    msgFormatted += "<div class=\"" + levelCSS + "\">" + dstr + "</div>";

    logDebug(msgFormatted);
    return msgFormatted;
}

function getMessageStyle() {
    var cssStyle = "<style>.infoMsg, .successMsg, .warningMsg, .errorMsg, .validationMsg {   " +
        "margin: 10px 0px;" +
        "padding:12px;" +
        "}" +
        ".infoMsg {" +
        "color: #00529B;" +
        "background-color: #BDE5F8;" +
        "}" +
        ".successMsg {" +
        "color: #4F8A10;" +
        "background-color: #DFF2BF;" +
        "}" +
        ".warningMsg { " +
        "color: #9F6000;" +
        "background-color: #FEEFB3;" +
        "}" +
        ".errorMsg {" +
        "color: #D8000C;" +
        "background-color: #FFBABA;" +
        "}" +
        ".infoMsg i, .successMsg i, .warningMsg i, .errorMsg i {" +
        "margin:10px 22px;" +
        "font-size:2em;" +
        "vertical-align:middle;" +
        "}</style>";
    return cssStyle;
}

function functionToTest(input) {
    var functTitle = 'functionToTest(): ';
    if (input == 'Test for success') {
        logDebug(functTitle + 'found the SUCCESS parameter!');
        return true;
    }
    logDebug(functTitle + "didn't find the SUCCESS parameter.");
    return false;
}