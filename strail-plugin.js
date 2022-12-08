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
      const traits = instance.getState().user.traits;
      const context = instance.getState().context;

      const data = JSON.stringify({
        type: payload.type,
        userId: payload.userId,
        anonymousId: payload.anonymousId,
        properties: payload.properties,
        traits: traits,
        context: context
      });

      fetch(config.endpoint, {method: "POST", headers: {'Content-Type': 'application/json'}, body: data});
      //navigator.sendBeacon(config.endpoint, data);
      console.log(data);
    },
    track: ({ payload, config, instance }) => {
      const traits = instance.getState().user.traits;
      const context = instance.getState().context;

      const data = JSON.stringify({
        type: payload.type,
        event: payload.event ? payload.event : 'track',
        userId: payload.userId,
        anonymousId: payload.anonymousId,
        properties: payload.properties,
        traits: traits,
        context: context
      });
      
      fetch(config.endpoint, {method: "POST", headers: {'Content-Type': 'application/json'}, body: data});
      //navigator.sendBeacon(config.endpoint, data);
      console.log(data);
    },
    identify: ({ payload, config, instance }) => {
      const context = instance.getState().context;

      const data = JSON.stringify({
        type: payload.type,
        userId: payload.userId,
        anonymousId: payload.anonymousId,
        traits: payload.traits,
        context: context
      });

      fetch(config.endpoint, {method: "POST", headers: {'Content-Type': 'application/json'}, body: data});
      //navigator.sendBeacon(config.endpoint, data);
      console.log(data);
    }
  }
}
