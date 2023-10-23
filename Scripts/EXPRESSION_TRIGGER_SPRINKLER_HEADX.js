var variable3=expression.getValue("ASI::FORM");
variable3.blockSubmit=true;
variable3.message="form Emse sprinkler Headxx";
expression.setReturn(variable3);


var variable1=expression.getValue("ASI::SPRINKLER::Turnoffs");
variable1.message="triggered by Sprinkler headxx emse: ";
expression.setReturn(variable1);