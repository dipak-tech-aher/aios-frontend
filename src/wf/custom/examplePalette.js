export default class ExamplePalette {
    constructor(create, elementFactory, palette, translate) {
      this.create = create;
      this.elementFactory = elementFactory;
      this.translate = translate;
  
      palette.registerProvider(this);
    }
  
    getPaletteEntries(element) {
      const {
        create,
        elementFactory,
        translate
      } = this;
  
      function createServiceTask(event) {
        const shape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
  
        create.start(event, shape);
      }
  
      return {
        'create.service-task': {
          group: 'activity',
          className: 'bpmn-icon-service-task',
          title: translate('Create ServiceTask'),
          action: {
            dragstart: createServiceTask,
            click: createServiceTask
          }
        },
        'create.new-task': {
            group: 'activity',
            className: 'bpmn-icon-service-task',
            title: translate('Create New Task'),
            action: {
              dragstart: createServiceTask,
              click: createServiceTask
            }
        }
      }
    }
  }
  
  ExamplePalette.$inject = [
    'create',
    'elementFactory',
    'palette',
    'translate'
  ];