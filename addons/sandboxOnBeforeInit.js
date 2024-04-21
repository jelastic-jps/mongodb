var SAME_NODES = "environment.maxsamenodescount",
    MAX_NODES = "environment.maxnodescount";

var max = 7, min = 1, resp, name, value, minStorageSize = 5, maxStorageSize,
    nodesMarkup = "Clustered mode is unavailable. Please check this quotas:", nodesMarkupHidden = true;

var hasCollaboration = (parseInt('${fn.compareEngine(7.0)}', 10) >= 0),
    quotas = [];

if (hasCollaboration) {
    quotas = [
        { quota : { name: MAX_NODES }, value: parseInt('${quota.environment.maxnodescount}', 10) },
        { quota : { name: SAME_NODES }, value: parseInt('${quota.environment.maxsamenodescount}', 10) }
    ];
    group = { groupType: '${account.groupType}' };
} else {
    quotas.push(jelastic.billing.account.GetQuotas(SAME_NODES).array[0]);
    quotas.push(jelastic.billing.account.GetQuotas(MAX_NODES).array[0]);
    group = jelastic.billing.account.GetAccount(appid, session);
}

for (var i = 0, n = quotas.length; i < n; i++) {
  name = quotas[i].quota.name;
  value = quotas[i].value;
  
  if (name == MAX_NODES || name == SAME_NODES) {
      if (max >= value) {
          max = value;
          if (value < 3) { nodesMarkup = nodesMarkup + " " + name };
      }
  }
}

jps.settings = {};
jps.settings.fields = [];

if ( max < 3 ) {
    nodesMarkupHidden = false;
}
  
jps.settings.fields.push({"type":"radio-fieldset","name":"customName","hidden":false,"default":"1","values":{"1":"Standalone","2":"Replica Set"},"showIf":{"2":[{"type":"spinner","name":"storageNodesCount","caption":"Number of nodes","min":3,"max":max,"increment":2},{"type":"displayfield","cls":"warning","height":30,"hideLabel":true,"markup":nodesMarkup,"hidden":nodesMarkupHidden},{"type":"string","name":"clustered","value":true,"inputType":"hidden"}]}});

return {
  result: 0,
  fields: jps.settings.fields
};
