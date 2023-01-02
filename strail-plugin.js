function strail(pluginConfig = {}) {
  return {
    name: 'strail',
    config: {
      endpoint: 'https://strail-api.herokuapp.com/v2/signals/analytics/' + pluginConfig.id
    },
    initialize: ({ config }) => {
      //console.log(config);
    },
    page: ({ payload, config, instance }) => {
      sendData(payload, config, instance);
    },
    track: ({ payload, config, instance }) => {
      sendData(payload, config, instance);
    },
    identify: ({ payload, config, instance }) => {
      sendData(payload, config, instance);
    }
  }
}

function sendData(payload, config, instance) {
  // Build data
  let data = {
    type: payload.type,
    userId: payload.userId,
    anonymousId: payload.anonymousId
  };
  
  if (payload.event) { data.event = payload.event }
  if (payload.properties) { data.properties = payload.properties }
  if (instance.getState().user.traits) { data.traits = instance.getState().user.traits; }
  
  if (instance.getState().context) {
    data.context = instance.getState().context

    // Save and get UTMs
    const utms = ['source', 'medium', 'campaign', 'term', 'content'];
    utms.forEach(utm => {
      if (data.context.campaign[utm]) { analytics.storage.setItem(utm, data.context.campaign[utm], 'sessionStorage'); }
      if (analytics.storage.getItem(utm)) { data.context.campaign[utm] = analytics.storage.getItem(utm) }
    });
  }

  // Send data
  fetch(config.endpoint, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  //navigator.sendBeacon(config.endpoint, JSON.stringify(data));
  console.log('--- --- ---');
  console.log(data);
}
