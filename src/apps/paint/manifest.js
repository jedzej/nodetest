module.exports = {
  NAME: "PAINT",
  EXCLUSIVE: true,
  HOT_JOIN: true,
  HOT_LEAVE: true,
  FULLSCREEN: true,

  DEFAULT_STORE: {
    users: [],
    actions: []
  },

  CONSTS: {
    COLORS: [
      '#e6194b',
      '#3cb44b',
      '#ffe119',
      '#0082c8',
      '#f58231',
      '#911eb4',
      '#46f0f0',
      '#f032e6',
      '#d2f53c',
      '#fabebe',
      '#008080',
      '#e6beff',
      '#aa6e28',
      '#800000',
      '#aaffc3',
      '#808000',
      '#000000'
    ],
    ACTION: {
      APP_UPDATE_PAINT: "APP_UPDATE_PAINT",
      PAINT_SKETCH: "PAINT_SKETCH",
      PAINT_FILL: "PAINT_FILL",
      PAINT_UNDO: "PAINT_UNDO",
      PAINT_CLEAR: "PAINT_CLEAR",
    }
  }
};
