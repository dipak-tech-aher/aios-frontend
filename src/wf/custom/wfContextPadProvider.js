export default function WFContextPadProvider(contextPad) {

  contextPad.registerProvider(this);

}

WFContextPadProvider.$inject = ["contextPad"];

WFContextPadProvider.prototype.getContextPadEntries  = function (element) {
  return function(entries) {

    delete entries['replace']
    delete entries['append.intermediate-event']
    
    return entries;
  };

}