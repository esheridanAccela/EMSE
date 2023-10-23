function dumpObject(objExplore) {
    var retStr = "";
    retStr += "Methods:\n";
    for (var x in objExplore) {
        if (typeof (objExplore[x]) === "function") {
            retStr += x + ":";
            retStr += objExplore[x];
        }
        var counter = objExplore.length;
    }
    retStr +="Properties:";
    for (var x in objExplore) {
        if (typeof (objExplore[x]) !== "function") {
            retStr += "\n    " + x + ": " + objExplore[x];
        }
    }

    return retStr;
}

showDebug = true;
var documentModelArray = aa.env.getValue("DocumentModelList");	
var obj = dumpObject(documentModelArray);
aa.print(obj);
for(i = 0; i < documentModelArray.size(); i++){
    var doc = documentModelArray.get(i);
    // print the length of the content byte[]
    aa.print("Doc content present? - " + (doc.getDocumentContent() === null));
    if(doc.getDocumentContent()){
        aa.print(dumpObject(doc.getDocumentContent()));
        aa.print("Doc content length: " + doc.getDocumentContent().getDocContent().length);
    }
}