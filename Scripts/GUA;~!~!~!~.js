showDebug = true; 
logDebug("GUA triggered.")
var itemArray = GuidesheetModel.getItems().toArray();
var gsb = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
if (itemArray.length >= 1)
{
if (itemArray[0].getGuideItemText() == "Test" && itemArray[0].getGuideItemStatus() == "Reviewed")
{
for (var i = 1; i < itemArray.length; i++)
{
itemArray[i].setGuideItemStatus("Reviewed");
gsb.updateGuideSheetItem(itemArray[i], "ADMIN");
}
}
}