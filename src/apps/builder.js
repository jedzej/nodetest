
class App {
  constructor(name, mainComponent, epic, reducer) {
    this.name = name;
    this.mainComponent = mainComponent;
    this.epic = epic;
    this.reducer = reducer;
  }
}

export default createApp = (name, mainComponent, epic, reducer) => new App(mainComponent, handlers, epic, reducer);
