class MockedData {
  constructor() {
    this.files = {};
    this.populateFiles;
  }
  addFile(name, dataset) {
    this.files[name] = dataset;
  }
  getDataset(name) {
    if (this.files.includes(name)) {
      return this.files[name];
    }
  }
  populateFiles() {
    this.files.addFile("file1", ["1", "2", "3"]);
    this.files.addFile("file2", ["beep", "boop", "boo"]);
    this.files.addFile("", "");
    this.files.addFile("file4", "");
  }
}
