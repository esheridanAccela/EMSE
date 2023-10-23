//@ts-check

aa.print("INCLUDES_CSLB library loaded.");
var CSLB_SC = "CSLB_CONNECTION_INFO";
var CSLB_SC_TOKEN = "Token";
var CSLB_SC_URL = "URL";
// var testObj =
// {
//     "Token": "A9FE514D-7A6D-4685-951C-B2AE14F663FA",
//     "URL": "https://www.cslb.ca.gov/onlineservices/DataPortalAPI/getbyclassification.asmx"
// };


function SearchCslbByLic(licNo) {
    var title = "SearchCslbByLic(): ";
    var cslb = CslbObj();
    var cslbString = "";

    ///look up token from standard choice with LookUpCSLB
    var cslbSC = LookUpStandardChoice(CSLB_SC);
    //var cslbSC = testObj;

    var token = cslbSC[CSLB_SC_TOKEN];
    if (typeof token == "undefined") {
        logDebug(title + CSLB_SC_TOKEN + " standard choice value in the " + CSLB_SC + " standard choice is missing.");
        return cslb;
    }

    ///build SOAP string to search with
    var soapContent = {};
    soapContent["LicenseNumber"] = licNo;
    soapContent["Token"] = token;
    var soapEnvelope = buildSoapXml("GetLicense", "http://CSLB.Ca.gov/", soapContent);

    var url = cslbSC[CSLB_SC_URL];
    if (typeof url == "undefined") {
        logDebug(title + CSLB_SC_URL + " standard choice value in the " + CSLB_SC + " standard choice is missing.");
        return cslb;
    }

    var headers = { "Content-Type": "text/xml" }

    ///submit to search with SOAP string with CLSBSearch
    var cslbResult;
    try {
        cslbResult = httpClient(url, "POST", headers, soapEnvelope, "application/soap+xml");
    } catch (err) {
        logDebug(title + "Error in httpClient. Message = " + err.message);
        return cslb;
    }

    ///check for success and exit if error
    if (cslbResult.getSuccess()) {
        cslbString = String(cslbResult.getOutput().result);
    } else {
        logDebug(title + "Error in result. Message = (" + cslbResult.errorType + ") " + cslbResult.errorMessage);
        return cslb;
    }

    ///build return object from result 
    cslb.LicenseNumber = TagValue(cslbString, "LicenseNumber");
    cslb.LastUpdated = TagValue(cslbString, "LastUpdated");
    cslb.BusinessType = TagValue(cslbString, "BusinessType");
    cslb.BusinessName = TagValue(cslbString, "BusinessName");
    cslb.Address = TagValue(cslbString, "Address");
    cslb.City = TagValue(cslbString, "City");
    cslb.State = TagValue(cslbString, "State");
    cslb.ZIP = TagValue(cslbString, "ZIP");
    cslb.County = TagValue(cslbString, "County");
    cslb.PhoneNumber = TagValue(cslbString, "PhoneNumber");
    cslb.IssueDate = TagValue(cslbString, "IssueDate");
    cslb.ExpirationDate = TagValue(cslbString, "ExpirationDate");
    cslb.Classifications = TagValue(cslbString, "Classifications");
    cslb.Status = TagValue(cslbString, "Status");
    cslb.SuretyCompany = TagValue(cslbString, "SuretyCompany");
    cslb.ContractorBondNumber = TagValue(cslbString, "ContractorBondNumber");
    cslb.ContractorBondAmount = TagValue(cslbString, "ContractorBondAmount");
    cslb.BondEffectiveDate = TagValue(cslbString, "BondEffectiveDate");
    cslb.BondCancellationDate = TagValue(cslbString, "BondCancellationDate");
    cslb.WorkersCompCoverageType = TagValue(cslbString, "WorkersCompCoverageType");
    cslb.PolicyEffectiveDate = TagValue(cslbString, "PolicyEffectiveDate");
    cslb.PolicyExpirationDate = TagValue(cslbString, "PolicyExpirationDate");
    cslb.PolicyCancellationDate = TagValue(cslbString, "PolicyCancellationDate");
    cslb.WorkersCompSuspendDate = TagValue(cslbString, "WorkersCompSuspendDate");

    ///return object
    return cslb;
}

/**
 * Creates a CSLB object with empty values.
 *
 * @return {object} 
 */
function CslbObj() {

    //@todo change function to be initial captialized instead of lower case.
    var title = "CslbObj(): ";
    var thisClass = {
        "LicenseNumber": "",
        "LastUpdated": "",
        "BusinessType": "",
        "BusinessName": "",
        "Address": "",
        "City": "",
        "State": "",
        "ZIP": "",
        "County": "",
        "PhoneNumber": "",
        "IssueDate": "",
        "ExpirationDate": "",
        "Classifications": "",
        "Status": "",
        "SuretyCompany": "",
        "ContractorBondNumber": "",
        "ContractorBondAmount": "",
        "BondEffectiveDate": "",
        "BondCancellationDate": "",
        "WorkersCompCoverageType": "",
        "PolicyEffectiveDate": "",
        "PolicyExpirationDate": "",
        "PolicyCancellationDate": "",
        "WorkersCompSuspendDate": ""
    };

    return thisClass;
}

/**
 * Looks up a standard choice and returns the standard choice value/desc
 * in name/value pair in a JSON array. Access the 
 * description value with object[value]. 
 * @example var scArray = LookupCSLB();
 * @example var descr = scArray[value];
 * @param {string} stdChoice name of standard choice.
 *
 * @return {Array}  array object with the value as the index. 
 */
function LookUpStandardChoice(stdChoice) {
    var title = "LookUpStandardChoice(): ";
    
    var retArray = [];
    var bizDomainResult = aa.bizDomain.getBizDomain(stdChoice);
    var bizDomain;
    if (bizDomainResult.getSuccess()) {
        bizDomain = bizDomainResult.getOutput().toArray();
    } else {
        return retArray;
    }

    var bizDomainLen = bizDomain.length;
    for (var i = 0; i < bizDomainLen; i++) {
        if (bizDomain[i].auditStatus == "A") {
            retArray[bizDomain[i].bizdomainValue] = bizDomain[i].description;
        }
    }

    return retArray;
}


function CLSBSearch(soapString) {
    ///execute search against CSLB with soap string


    ///check for transaction error and exit if true


    ///return results
}

function CheckCSLBStatus(licNo) {
    var title = "CheckCSLBStatus(): ";

    var cslb = SearchCslbByLic(licNo);

    var status = cslb.Status;

    return status;
}

function EditLicenseModel() { }

function GetCSLBInfo(doPop, doWarning) {
    var title = "GetCSLBInfo(): ";
    var retStatus = false;
    var licProfModel;

    ///retrieve licensed professional from capId environment variable (bad practice)
    if (typeof capId == "undefined") {
        logDebug(title + "Environment variable capId isn't defined.");
        return retStatus;
    }

    var capLicProfResult = aa.licenseScript.getLicenseProf(capId);
    if (capLicProfResult.getSuccess()) {
        licProfModel = capLicProfResult.getOutput();
    } else {
        logDebug(title + "Unable to retrieve license professional information from " + capId);
        return retStatus;
    }

    ////TEMPORARY
    var thisLicProfModel = licProfModel[0];
    ////TEMPORARY

    ///extract license number
    var licNo = thisLicProfModel.getLicenseNbr();

    ///search using license number
    var cslbInfo = SearchCslbByLic(licNo);

    ///if doWarning, extract status and display message and comment
    ///uses environment variable startDate
    if (doWarning) {
        if (cslbInfo.ExpirationDate < startDate) {
            showMessage = true;
            comment("** WARNING: Professional License expired on " + cslbInfo.ExpirationDate.toString());
        }
    }

    ///if doPop, edit license professional model and update record.
    if (doPop) {
        thisLicProfModel.setAddress1(cslbInfo.Address);
        thisLicProfModel.setBusinessName(cslbInfo.BusinessName);
        thisLicProfModel.setCity(cslbInfo.City);
        thisLicProfModel.setLicenseExpirDate(cslbInfo.ExpirationDate);
        thisLicProfModel.setLicesnseOrigIssueDate(cslbInfo.IssueDate);
        thisLicProfModel.setState(cslbInfo.State);
        thisLicProfModel.setPhone1(cslbInfo.PhoneNumber);
        thisLicProfModel.setZip(cslbInfo.ZIP);
        var licProfUpdateResult = aa.m_licenseProfessional.editLicensedProfessional(thisLicProfModel);
        if (!licProfUpdateResult.getSuccess()) {
            logDebug(title + "Unable to update record " + capId);
            return retStatus;
        }
    }
    ///return true if successful, false if not. If we get this far without erroring out, assume success.

    return true;
}

/**
 * Takes a string and a tag string and finds the first HTML or XML tag which 
 * matches the tag string and returns the value between the beginning and 
 * ending tag.
 *
 * @param {string} string
 * @param {string} tag
 * @return {string} string value in the XML or HTML tag. 
 */
function TagValue(string, tag) {
    var beginTag = '<' + tag + '>';
    var endTag = '</' + tag + '>';
    var tagLen = beginTag.length;

    var startIdx = string.indexOf(beginTag);
    if (startIdx == -1) {
        return "";
    }

    var endIdx = string.indexOf(endTag, startIdx);
    var tagVal = string.slice(startIdx + tagLen, endIdx);

    return tagVal;
}

// INCLUDES_HTTPCLIENT library

/**
 * Builds a SOAP XML string
 *
 * @param {any} method - The SOAP method
 * @param {any} namespace - The SOAP namespace
 * @param {any} params - Key/value pair object containing the values to include in the method 
 * @param {any} username - Optional. If included, will set the username and password in the security header
 * @param {any} password - Optional. If username is included, will be set in the security header
 * @returns SOAP XML string
 */
function buildSoapXml(method, namespace, params, username, password) {
    var xmlRequest = "";
    var paramsStr = "";
    var useSecurity = false;

    //if username or password is undefined then set to empty value
    username = (typeof username != 'undefined') ? username : "";
    password = (typeof password != 'undefined') ? password : "";

    if (username != '') {
        useSecurity = true;
    }

    for (var key in params) {
        paramsStr = paramsStr + "<" + key + ">" + params[key] + "</" + key + ">";
    }

    xmlRequest = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
    xmlRequest += '<soap:Header>';
    if (useSecurity) {
        xmlRequest += '<wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">';
        xmlRequest += '<wsse:UsernameToken>';
        xmlRequest += '<wsse:Username>' + username + '</wsse:Username>';
        xmlRequest += '<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">' + password + '</wsse:Password>';
        xmlRequest += '</wsse:UsernameToken>';
        xmlRequest += '</wsse:Security>';
    }
    xmlRequest += '</soap:Header>';
    xmlRequest += '<soap:Body>';
    xmlRequest += '<' + method + ' xmlns="' + namespace + '">\ ' + paramsStr + '</' + method + '>';
    xmlRequest += '</soap:Body>';
    xmlRequest += '</soap:Envelope>';

    return xmlRequest;
}

/**
 * httpClient builds an Apache commons 3.1 httpclient for
 * the specified method and submits the request. It then 
 * takes the response and formats it into an AA Script Result
 * and returns.
 * 
 * @param {any} url - The endpoint URL
 * @param {any} method - HTTP method (POST, GET, PUT)
 * @param {any} headers - Array of header key value pairs. Key is header name, value is header value
 * @param {any} content - Needed for POST and sometimes PUT. String content of package
 * @param {any} contentType - Optional. if content type is omitted, value is set to text/xml
 * @param {any} encoding - Optional. If encoding is omitted, value is set to utf-8
 * @returns AA Script Result Object
 */
function httpClient(url, method, headers, content, contentType, encoding) {
    //content type and encoding are optional; if not sent use default values
    contentType = (typeof contentType != 'undefined') ? contentType : 'text/xml';
    encoding = (typeof encoding != 'undefined') ? encoding : 'utf-8';

    //build the http client, request content, and post method from the apache classes
    //@ts-ignore
    var httpClientClass = org.apache.commons.httpclient;
    var httpClient = new httpClientClass.HttpClient();

    switch (method.toUpperCase()) {
        case "POST":
            method = new httpClientClass.methods.PostMethod(url);
            break;
        case "GET":
            method = new httpClientClass.methods.GetMethod(url);
            content = "";
            break;
        case "PUT":
            method = new httpClientClass.methods.PutMethod(url);
            break;
        default:
            method = '';
    }

    if (typeof headers != 'undefined') {
        for (var key in headers) {
            method.setRequestHeader(key, headers[key]);
        }
    }

    if (typeof content != 'undefined' && content != '') {
        var requestEntity = new httpClientClass.methods.StringRequestEntity(content, contentType, encoding);
        method.setRequestEntity(requestEntity);
    }

    //set variables to catch and logic on response success and error type. build a result object for the data returned
    var resp_success = true;
    var resp_errorType = null;

    var resultObj = {
        resultCode: 999,
        result: null
    };

    //execute the http client call in a try block and once complete, release the connection
    try {
        resultObj.resultCode = httpClient.executeMethod(method);
        resultObj.result = method.getResponseBodyAsString();
        //logDebug(resultObj.result);

    } finally {
        method.releaseConnection();
    }

    //if any response other than transaction success, set success to false and catch the error type string
    if (resultObj.resultCode.toString().substr(0, 1) !== '2') {
        resp_success = false;
        resp_errorType = httpStatusCodeMessage(resultObj.resultCode);
    }

    //create script result object with status flag, error type, error message, and output and return
    //@ts-ignore
    var scriptResult = new com.accela.aa.emse.dom.ScriptResult(resp_success, resp_errorType, resultObj.result, resultObj);

    return scriptResult;
}

/**
 * Takes a status code and returns the standard HTTP status code string
 *
 * @param {any} statusCode - Integer of the status code returned from an HTTP request.
 * @returns string description of HTTP status code
 */
function httpStatusCodeMessage(statusCode) {
    switch (statusCode) {
        case 100:
            return "100 - Continue";
        case 101:
            return "101 - Switching Protocols";
        case 200:
            return "200 - OK";
        case 201:
            return "201 - Created";
        case 202:
            return "202 - Accepted";
        case 203:
            return "203 - Non-Authoritative Information";
        case 204:
            return "204 - No Content";
        case 205:
            return "205 - Reset Content";
        case 206:
            return "206 - Partial Content";
        case 300:
            return "300 - Multiple Choices";
        case 301:
            return "301 - Moved Permanently";
        case 302:
            return "302 - Found";
        case 303:
            return "303 - See Other";
        case 304:
            return "304 - Not Modified";
        case 305:
            return "305 - Use Proxy";
        case 306:
            return "306 - (Unused)";
        case 307:
            return "307 - Temporary Redirect";
        case 400:
            return "400 - Bad Request";
        case 401:
            return "401 - Unauthorized";
        case 402:
            return "402 - Payment Required";
        case 403:
            return "403 - Forbidden";
        case 404:
            return "404 - Not Found";
        case 405:
            return "405 - Method Not Allowed";
        case 406:
            return "406 - Not Acceptable";
        case 407:
            return "407 - Proxy Authentication Required";
        case 408:
            return "408 - Request Timeout";
        case 409:
            return "409 - Conflict";
        case 410:
            return "410 - Gone";
        case 411:
            return "411 - Length Required";
        case 412:
            return "412 - Precondition Failed";
        case 413:
            return "413 - Request Entity Too Large";
        case 414:
            return "414 - Request-URI Too Long";
        case 415:
            return "415 - Unsupported Media Type";
        case 416:
            return "416 - Requested Range Not Satisfiable";
        case 417:
            return "417 - Expectation Failed";
        case 500:
            return "500 - Internal Server Error";
        case 501:
            return "501 - Not Implemented";
        case 502:
            return "502 - Bad Gateway";
        case 503:
            return "503 - Service Unavailable";
        case 504:
            return "504 - Gateway Timeout";
        case 505:
            return "505 - HTTP Version Not Supported";
    }
    return statusCode + " - Unknown Status Code";
}