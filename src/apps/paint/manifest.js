module.exports = {
  NAME: "PAINT",
  EXCLUSIVE: true,
  HOT_JOIN: true,
  HOT_LEAVE: true,
  FULLSCREEN: false,

  DEFAULT_STORE: {
    users: [],
    paths: []
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
      PAINT_SKETCH: "PAINT_SKETCH"
    }
  }
};
