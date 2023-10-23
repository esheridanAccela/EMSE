finalNote=expression.getValue("TSI::FINAL::Notes Final");
inspectionNote=expression.getValue("TSI::INSPECTION::Inspection Notes");
preventionNote=expression.getValue("TSI::PREVENTION::Notes");

finalNote.message="from EMSE EXPRESSION_II_SCRIPT Script";
inspectionNote.message="get value from EXPRESSION_II_SCRIPTt";
preventionNote.message="EXPRESSION_II_SCRIPT preventionNote";
finalNote.value=String("Testing");
expression.setReturn(finalNote);
expression.setReturn(inspectionNote);
expression.setReturn(preventionNote);