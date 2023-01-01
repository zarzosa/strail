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
  // Save UTMS
  const utms = ['source', 'medium', 'campaign', 'term', 'content'];
  const params = new URL(window.location.href).searchParams;
  utms.forEach(utm => {
    if (params.get('utm_' + utm)) {
      analytics.storage.setItem(utm, params.get('utm_' + utm), 'sessionStorage');
    }
  });

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

    // Get UTMs
    utms.forEach(utm => {
      if (analytics.storage.getItem(utm)) { data.context.campaign[utm] = analytics.storage.getItem('utm_source') }
    });
  }

  // Send data
  fetch(config.endpoint, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  //navigator.sendBeacon(config.endpoint, JSON.stringify(data));
  console.log('--- --- ---');
  console.log(data);
}
