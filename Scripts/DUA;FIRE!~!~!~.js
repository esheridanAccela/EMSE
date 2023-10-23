showDebug=true;

params = aa.util.newHashtable();

addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
addParameter(params, "$$francisField$$", "Francis");
getContactParams4Notification(params)
getRecordParams4Notification(params); //this gives you common fields used in notifications
aa.print("params: " +params);

sendNotification("noreply@accela.com", "esheridan@accela.com", "esheridan@accela.com", "ACA_DOCUMENTUPLOADAFTER", params, null);

aa.print("sent");