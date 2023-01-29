export default class CustomContextPadProvider {
  constructor(contextPad) {
    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    return function(entries) {

      delete entries['replace']
      delete entries['append.intermediate-event']

      return entries;
    };
  }
}

CustomContextPadProvider.$inject = ["contextPad"];