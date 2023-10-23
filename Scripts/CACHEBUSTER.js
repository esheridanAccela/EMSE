try{
    var result = aa.util.newArrayList();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    emseBiz.cleanScriptCache();
    result.add("Cleared script cache");
    emseBiz.cleanEventCache();
    result.add("Cleared event cache");
    emseBiz.cleanMasterScriptCache();
    result.add("Cleared master script cache");
    aa.env.paramValues.put("ScriptSuccess", true);
    aa.env.paramValues.put("ScriptResult",result);
}
catch (err) {
    aa.env.paramValues.put("ScriptResult", err.toString() + "\n" + err.stack);
    aa.env.paramValues.put("ScriptSuccess", false);
}