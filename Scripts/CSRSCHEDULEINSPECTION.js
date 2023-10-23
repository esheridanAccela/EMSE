//_______________________________________
/*
aa.env.setValue("CONTECT_TYPE","Applicant");
aa.env.setValue("CONTECT_ADDRESS_TYPE","Mailing");
aa.env.setValue("AGENCY","CRC);
aa.env.setValue("FROM_DATE","2020-10-01");
aa.env.setValue("TO_DATE","2020-11-05");
*/

var br = '\n';
var message = "Refund Export: " + br;
var total = 0;

//refundExport();
//function refundExport (){
	
	var contact_Type = aa.env.getValue("CONTECT_TYPE");
	var contact_Address_Type = aa.env.getValue("CONTECT_ADDRESS_TYPE");
	var agency = aa.env.getValue("AGENCY");
	var from_Date = aa.env.getValue("FROM_DATE");
	var to_Date = aa.env.getValue("TO_DATE");
		
	var array = [];
	var rowMin = 0;
	var rowMax = 999999999999;
	 
	var q = "SELECT GF_L1, PAYMENT_SEQ_NBR, CASHIER_ID, TRAN_AMOUNT, PAYMENT_DATE, replace(PAYMENT_COMMENT, ',', ' ') PAYMENT_COMMENT, case when Len(b1_contact_nbr) >= 9 then Substring( Cast(b1_contact_nbr AS VARCHAR(50)), Len(b1_contact_nbr) - 9 + 1, Len(b1_contact_nbr) ) else null end B1_CONTACT_NBR, REPLACE(B1_FNAME, ',', ' ') B1_FNAME, REPLACE(B1_MNAME, ',', ' ') B1_MNAME, REPLACE(B1_LNAME, ',', ' ') B1_LNAME, REPLACE(B1_BUSINESS_NAME, ',', ' ') B1_BUSINESS_NAME, REPLACE(B1_ADDRESS1, ',', ' ') B1_ADDRESS1, REPLACE(B1_ADDRESS2, ',', ' ') B1_ADDRESS2, REPLACE(B1_CITY, ',', ' ') B1_CITY, REPLACE(B1_STATE, ',', ' ') B1_STATE, B1_ZIP FROM ( SELECT ROW_NUMBER() OVER ( PARTITION BY ACC_AUDIT_SEQ_NBR ORDER BY B1_CONTACT_NBR ) RANK, A.ACC_AUDIT_SEQ_NBR, A.GF_L1 AS GF_L1, CONCAT(A.PAYMENT_SEQ_NBR, '.', A.FEEITEM_SEQ_NBR) AS PAYMENT_SEQ_NBR, ISNULL( ( SELECT NULLIF( SUBSTRING(PU.CASHIER_ID, 3, LEN(PU.CASHIER_ID)), '' ) FROM dbo.PUSER PU WHERE A.CASHIER_ID = PU.USER_NAME AND A.SERV_PROV_CODE = PU.SERV_PROV_CODE ), A.CASHIER_ID ) AS CASHIER_ID, A.TRAN_AMOUNT AS TRAN_AMOUNT, CONVERT(DATETIME, A.TRAN_DATE, 120) AS PAYMENT_DATE, B.B1_COMMENT AS PAYMENT_COMMENT, B.B1_CONTACT_NBR AS B1_CONTACT_NBR, B.B1_FNAME AS B1_FNAME, B.B1_MNAME AS B1_MNAME, B.B1_LNAME AS B1_LNAME, B.B1_BUSINESS_NAME AS B1_BUSINESS_NAME, b.B1_ADDRESS1, b.B1_ADDRESS2, b.B1_CITY, b.B1_STATE, b.B1_ZIP FROM dbo.ACCOUNTING_AUDIT_TRAIL A LEFT JOIN dbo.F4PAYMENT F ON A.SERV_PROV_CODE = F.SERV_PROV_CODE AND A.B1_PER_ID1 = F.B1_PER_ID1 AND A.B1_PER_ID2 = F.B1_PER_ID2 AND A.B1_PER_ID3 = F.B1_PER_ID3 AND A.PAYMENT_SEQ_NBR = F.PAYMENT_SEQ_NBR AND A.B1_PER_ID3 = '#0000' LEFT JOIN ( SELECT SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, RECEIPT_NBR FROM( SELECT SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, RECEIPT_NBR, ROW_NUMBER() OVER ( ORDER BY GETDATE() ) AS ROWID FROM dbo.F4PAYMENT WHERE B1_PER_ID3 != '#0000' AND SERV_PROV_CODE = 'CHESAPEAKE' GROUP BY SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, RECEIPT_NBR ) t1 WHERE ROWID IN ( SELECT MAX(ROWID) ROW_ID FROM ( SELECT SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, RECEIPT_NBR, ROW_NUMBER() OVER ( ORDER BY GETDATE() ) AS ROWID FROM dbo.F4PAYMENT WHERE B1_PER_ID3 != '#0000' AND SERV_PROV_CODE = 'CHESAPEAKE' GROUP BY SERV_PROV_CODE, B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, RECEIPT_NBR ) t2 ) ) XP ON F.SERV_PROV_CODE = XP.SERV_PROV_CODE AND F.RECEIPT_NBR = XP.RECEIPT_NBR LEFT JOIN ( SELECT b.SERV_PROV_CODE, b.B1_PER_ID1, b.B1_PER_ID2, b.B1_PER_ID3, b.B1_CONTACT_NBR, b.B1_FNAME, b.B1_MNAME, b.B1_LNAME, B.B1_BUSINESS_NAME, CASE WHEN NULLIF(G7.G7_ADDRESS1, '') IS NULL THEN B.B1_ADDRESS1 ELSE G7.G7_ADDRESS1 END B1_ADDRESS1, CASE WHEN NULLIF(G7.G7_ADDRESS1, '') IS NULL THEN B.B1_ADDRESS2 ELSE G7.G7_ADDRESS2 END B1_ADDRESS2, CASE WHEN NULLIF(G7.G7_ADDRESS1, '') IS NULL THEN B.B1_CITY ELSE G7.G7_CITY END B1_CITY, CASE WHEN NULLIF(G7.G7_ADDRESS1, '') IS NULL THEN B.B1_STATE ELSE G7.G7_STATE END B1_STATE, CASE WHEN NULLIF(G7.G7_ADDRESS1, '') IS NULL THEN B.B1_ZIP ELSE G7.G7_ZIP END B1_ZIP, b.B1_COMMENT FROM dbo.B3CONTACT b LEFT JOIN dbo.XRECORD_CONTACT_ENTITY X ON b.SERV_PROV_CODE = X.SERV_PROV_CODE AND b.B1_PER_ID1 = X.B1_PER_ID1 AND b.B1_PER_ID2 = X.B1_PER_ID2 AND B.B1_PER_ID3 = X.B1_PER_ID3 AND X.ENT_TYPE <> 'REF_CONTACT' LEFT JOIN dbo.G7CONTACT_ADDRESS G7 ON X.SERV_PROV_CODE = G7.SERV_PROV_CODE AND X.ENT_ID1 = G7.RES_ID AND G7.G7_ADDRESS_TYPE = ? WHERE B.B1_CONTACT_TYPE = ? ) B ON( ( A.SERV_PROV_CODE = B.SERV_PROV_CODE AND A.B1_PER_ID1 = B.B1_PER_ID1 AND A.B1_PER_ID2 = B.B1_PER_ID2 AND A.B1_PER_ID3 = B.B1_PER_ID3 ) OR ( XP.SERV_PROV_CODE = B.SERV_PROV_CODE AND xp.B1_PER_ID1 = b.B1_PER_ID1 AND xp.B1_PER_ID2 = b.B1_PER_ID2 AND xp.B1_PER_ID3 = b.B1_PER_ID3 ) ) WHERE A.SERV_PROV_CODE = ? AND A.TRAN_DATE > CONVERT(DATETIME, ?, 120) AND A.TRAN_DATE <= CONVERT(DATETIME, ?, 120) AND A.ACTION = 'Refund Applied' AND A.PAYMENT_METHOD <> 'Treasurer' AND NOT EXISTS ( SELECT 1 FROM dbo.ACCOUNTING_AUDIT_TRAIL B WHERE A.SERV_PROV_CODE = B.SERV_PROV_CODE AND A.B1_PER_ID1 = B.B1_PER_ID1 AND A.B1_PER_ID2 = B.B1_PER_ID2 AND A.B1_PER_ID3 = B.B1_PER_ID3 AND A.PAYMENT_SEQ_NBR = B.PAYMENT_SEQ_NBR AND A.FEEITEM_SEQ_NBR = B.FEEITEM_SEQ_NBR AND A.TRAN_DATE < B.TRAN_DATE AND B.ACTION = 'Payment Applied' ) ) AA WHERE RANK = 1 "

	try {
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/CRC");
		var conn = ds.getConnection();
		var sStmt = aa.db.prepareStatement(conn,q);
		
		sStmt.setString(1, contact_Type);
		sStmt.setString(2, contact_Address_Type);
		sStmt.setString(3, agency);
		sStmt.setString(4, from_Date);
		sStmt.setString(5, to_Date);


		var rSet = sStmt.executeQuery();
		while (rSet.next()) {
			var obj = {};
			var md = rSet.getMetaData();
			var columns = md.getColumnCount();
			for (i = 1; i <= columns; i++) {
				obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
			}
			obj.count = rSet.getRow();
			array.push(obj)
		}
		//Sort
		
	    array.sort(customSortArray("B1_CONTACT_NBR"));
		//function(a, b){return a.B1_CONTACT_NBR - b.B1_CONTACT_NBR});
		
		aa.env.setValue("returnCode", "0"); // success
		aa.env.setValue("returnValue", JSON.stringify(array));
		aa.print(JSON.stringify(array));
		var strtest = JSON.stringify(array);
		rSet.close();
		sStmt.close();
		conn.close();
	} catch (err) {
		aa.env.setValue("returnCode", "-1"); // error
		aa.env.setValue("returnValue", err.message);
		aa.print(err.message);
	}

//}

message += "Refund Export completed. "
message += "json" + strtest + contact_Type + ", " + contact_Address_Type + ", " + agency + ", " + from_Date + ", " + to_Date
aa.env.setValue("ScriptReturnMessage", message);

function customSortArray(sortByProperty) {
//Sort an array by a custom property.
    var sortOrder = 1;
    if(sortByProperty[0] === "-") {
        sortOrder = -1;
        sortByProperty = sortByProperty.substr(1);
    }
    return function (a,b) {
        var result = (a[sortByProperty] < b[sortByProperty]) ? -1 : (a[sortByProperty] > b[sortByProperty]) ? 1 : 0;
        return result * sortOrder;
    }
}
//_____________________________________________