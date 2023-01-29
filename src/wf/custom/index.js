import WFPaletteProvider from './wfPaletteProvider';
import WFContextPadProvider from './wfContextPadProvider';

// import ExamplePalette from './examplePalette';
// import ExamplePaletteProvider from './examplePaletteProvider';

// export default {
//   __init__: [ 'examplePalette', 'paletteProvider', 'examplePaletteProvider' ],
//   examplePalette: [ 'type', ExamplePalette ],
//   paletteProvider: [ 'type', ExamplePaletteProvider ],
//   examplePaletteProvider: [ 'type', ExamplePaletteProvider ]
// };

export default {
  __init__: [ 'paletteProvider', 'wfContextPadProvider', 'autoScroll' ],
  paletteProvider: [ 'type', WFPaletteProvider ],
  wfContextPadProvider: [ 'type', WFContextPadProvider ],
  autoScroll: [ 'value', null ]
};