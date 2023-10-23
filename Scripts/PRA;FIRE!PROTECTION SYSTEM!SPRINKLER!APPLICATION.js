showDebug = true;

var startDate = new Date();

logDebug("script executed: "+ startDate);
var FROM = "noreply@accela.com";
		var TO = "esheridan@accela.com";
		var SUBJECT = "PRA:Fire-Protection System-Sprinkler-Application:"+ "startDate:" + startDate;
		var BODY_TEXT = " " + debug;
		aa.sendMail(FROM, TO, "", SUBJECT , BODY_TEXT);
 
//paymentReceivedEmail();


   //branch("CMN:Licenses/*/*/Application:ApplicationReceivedEmail");
   
   // get the Receipt number 10-15-2013 
function getReceiptNbr() {

    receiptResult = aa.finance.getReceiptByCapID(capId, null);
    if (receiptResult.getSuccess()) {
        receipt = receiptResult.getOutput();
        if (receipt[0] != undefined) {
			var recLen=receipt.length;

			recLen=recLen-1;

            logDebug("Receipt successfully retrieved: " + receipt[recLen].getReceiptNbr());
            return parseInt(receipt[recLen].getReceiptNbr());
        } else {
            //aa.print("Receipt Number Doesnt Exist.");
            return -1;
        }
    }
    else {
        aa.print("error getting the receipt nbr: " + receiptResult.getErrorMessage());
        return -1;
    }
}

function paymentReceivedEmail() {
    
    params = aa.util.newHashtable();
 //   getACARecordParam4Notification(params, acaUrl);
    addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
 logDebug("addParameter only LicenseType: " +params);   
    //FA 10-14-2013
    addParameter(params, "$$ReceiptNumber$$", getReceiptNbr().toString());
	aa.print("getReceiptNbr():"+getReceiptNbr());
	 logDebug("addParameter only LicenseType and receipt# : " +params);   
//    getPrimaryAddressLineParam4Notification(params);

    // addParameter(params, "$$emailFee$$", feeAmountExcept(capId, "fee").toFixed(2));
    var paymentTotalPaid = 0.00;
    if (typeof(PaymentTotalPaidAmount) != "undefined" && PaymentTotalPaidAmount != null) paymentTotalPaid = parseFloat(PaymentTotalPaidAmount).toFixed(2);
    addParameter(params, "$$emailFee$$", paymentTotalPaid);

 //   getRecordParams4Notification(params);
  //  getContactParams4Notification(params, "Applicant");

    //FA 10/21/2013 add organization Name to param
 //   addParameter(params, "$$organizationName$$", params.get("$$applicantBusinesName$$"));

    //Check to see if attorney contact exist if so cc attorney
    var conTypeAttrny = "Attorney";
    var conTypeReps = "Representative";
    var emailCC = "";
var sysFromEmail= "noreply@accela.com";
    contactArray = getContactArray();
                 emailCC = "esheridan@accela.com";
 

    //aa.print("emailCC:" + emailCC);

    var param4attachDoc = aa.util.newHashMap();
    param4attachDoc.put("capid", capIDString);
    param4attachDoc.put("agencyid", servProvCode);

    var paymentsResult = aa.finance.getPaymentByCapID(capId, null);

    if (paymentsResult.getSuccess()) {
		logDebug("paymentsResult: " +paymentsResult)
        var payments = paymentsResult.getOutput();
		
		var lenOfPayments=0;
		logDebug("paymentsLen:" +payments.length);
		var thisPayment=payments[lenOfPayments];
		for(l in thisPayment) if(typeof(thisPayment[l])!="function"){{logDebug("loop attributes: " + l + " : " +thisPayment[l]);}}
        if (payments[lenOfPayments]) {
            logDebug("sendOne-Trans Code" + payments[lenOfPayments].getBatchTransCode().toString());

            param4attachDoc.put("batchtransactionnbr", payments[lenOfPayments].getBatchTransCode().toString());
 runReportAndSendAsync("Receipt", appTypeArray[0], capId, param4attachDoc, sysFromEmail, "esheridan@accela.com", "APPLICATION RECEIVED", params, emailCC);
        } else {
            sendNotification(sysFromEmail,params.get("$$applicantEmail$$"),emailCC,"APPLICATION RECEIVED",params,null)
        }
    } else {
        //showDebug = 3; Turn it off - Defect NYELS-50564
	    //logDebug("sendTwo");
        sendNotification(sysFromEmail,params.get("$$applicantEmail$$"),emailCC,"MESSAGE_PAYMENT_RECEIPT_PERMITS",params,null);
    }
}
