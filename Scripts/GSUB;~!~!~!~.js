showDebug=true;
var s_id1 = "REC22";
var s_id2 = "00000";
var s_id3 = "000C8";

	var capResult = aa.cap.getCapID(s_id1, s_id2, s_id3);
var	capId = capResult.getOutput();

var theInspections = aa.inspection.getInspections(capId).getOutput();	
var theInspectionZero= theInspections[0]
	aa.print("inspections: " +theInspections);
		aa.print("inspections: " +theInspectionZero);
aa.print(" inspectiontype:" + theInspectionZero.getInspectionType());
aa.print(" inspectionScheduledDate:" + theInspectionZero.getScheduledDate());
aa.print(" inspectionID:" + theInspectionZero.getIdNumber());
aa.print(" inspectionDate:" + theInspectionZero.getInspectionDate());
	
	//	for (i in theInspectionZero) {aa.print("method: " + i + theInspectionZero[i]);}
	aa.print("aftersetting:"+ capId);