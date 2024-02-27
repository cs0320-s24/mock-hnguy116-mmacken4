import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  history: string[]; //push every command into this history array
  setHistory: Dispatch<SetStateAction<string[]>>; //use it to maintain state of list
  verbose: boolean;
  setVerbose: Dispatch<SetStateAction<boolean>>;
  file_history: string[][];
  setFileHistory: Dispatch<SetStateAction<string[][]>>;
  current_file: string;
  setCurrentFile: Dispatch<SetStateAction<string>>;
}
// You can use a custom interface or explicit fields or both! An alternative to the current function header might be:
// REPLInput(history: string[], setHistory: Dispatch<SetStateAction<string[]>>)
export function REPLInput(props: REPLInputProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  // TODO WITH TA: build a handleSubmit function called in button onClick
  // TODO: Once it increments, try to make it push commands... Note that you can use the `...` spread syntax to copy what was there before
  // add to it with new commands.
  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  function handleSubmit(commandString: string) {
    setCount(count + 1);
    if (props.verbose === false) {
      props.setHistory([...props.history, commandOutput(commandString)]);
    } else {
      props.setHistory([
        ...props.history,
        "Command: " +
          commandString +
          "\n" +
          "Output: " +
          commandOutput(commandString),
      ]);
    }
    setCommandString("");
  }

  // <result of running the command>
  function commandOutput(commandString: string) {
    commandString = commandString.trim().toLowerCase();
    // *** MODE COMMAND ***
    // with .includes() the mode command occurs right away
    // with === mode command occurs on the next command

    //if (commandString.toLowerCase() === 'mode') {
    if (commandString.includes("mode") && commandString.length === 4) {
      // may need to change to ===, but this works for now

      props.setVerbose(!props.verbose);
      if (props.verbose === false) {
        return "Current Mode: Brief";
      } else if (props.verbose === true) {
        return "Current Mode: Verbose";
      }
    }

    // *** LOAD, VIEW, & SEARCH CSV COMMAND ***
    if (commandString.substring(0, 10) === "load_file ") {
      let file_path = commandString.slice(9);
      props.setCurrentFile(file_path);
      mapFiles(file_path);
      return "Success: CSV File Loaded";
    } else if (commandString === "view") {
      return makeHTMLTable(current_file);
      //return "viewing a file";
      //check that a file was loaded
    } else if (commandString.substring(0, 7) === "search ") {
      let searchParams = commandString.substring(7);
      let searchArray = searchParams.split(" ");
      let searchCol = searchArray[0];
      let searchVal = searchArray[1];
      return "search";
    }
  }
  //put other commands here

  //updates file_history?

  function getMockedData(filePath: string): string[][] {
    // Mock implementation
    const mockedData = new MockedData();
    const data = mockedData.getDataset("file1");
    return data;
    // [ ["H1", "H2", "H3"],
    // ["a", "b", "c"], ]
  }
  function mapFiles(filePath: string) {
    //file_history is string[][]
    //
    //ex [[filepath1, ""a", "b", "c""",""1", "2,", "3"""], [filepath2, ""e", "f", "g""",""3", "2,", "1"""]]
    //setFileHistory is initially empty
    //want to map filepath and mocked dataset (info inside filepath?)
    //setFileHistory([[filePath, fileData]]);

    const fileData = getMockedData(filePath); // Retrieve or mock the CSV data
    // Check if the filePath already exists in file_history
    const existingIndex = props.file_history.findIndex(
      (entry) => entry[0] === filePath
    );
    if (existingIndex >= 0) {
      // Update existing entry with new data
      props.file_history[existingIndex] = [filePath, fileData];
    } else {
      // Add new entry
      props.setFileHistory([...props.file_history, [filePath, fileData]]);
    }
  }

  function makeHTMLTable(filePath: string) {
    let data = getMockedData(filePath);
    let HTMLTable = "<table>\n";
    data.forEach((row, rowIndex) => {
      HTMLTable += "  <tr>\n";

      const tag = rowIndex === 0 ? "th" : "td";

      // Iterate over each cell in the row
      row.forEach((cell) => {
        HTMLTable += `    <${tag}>${cell}</${tag}>\n`;
      });

      HTMLTable += "  </tr>\n";
    });

    HTMLTable += "</table>";
    return HTMLTable;
  }

  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      {/* TODO WITH TA: Build a handleSubmit function that increments count and displays the text in the button */}
      {/* TODO: Currently this button just counts up, can we make it push the contents of the input box to the history?*/}
      <button aria-label={"Submit"} onClick={() => handleSubmit(commandString)}>
        Submit
      </button>
    </div>
  );
}
