import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  history: string[]; //push every command into this history array
  setHistory: Dispatch<SetStateAction<string[]>>; //use it to maintain state of list
  verbose: boolean;
  setVerbose: Dispatch<SetStateAction<boolean>>;
  // file_history: Map<string, string[][]>;
  // setFileHistory: Dispatch<SetStateAction<Map<string, string[][]>>>;
  // current_file: string;
  // setCurrentFile: Dispatch<SetStateAction<string>>;
}
// You can use a custom interface or explicit fields or both! An alternative to the current function header might be:
// REPLInput(history: string[], setHistory: Dispatch<SetStateAction<string[]>>)
export function REPLInput(props: REPLInputProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  //const [count, setCount] = useState<number>(0);
  const [file_history, setFileHistory] = useState<Map<string, string[][]>>(
    new Map()
  );
  const [loaded_file, setLoadFile] = useState<string>("");

  // TODO WITH TA: build a handleSubmit function called in button onClick
  // TODO: Once it increments, try to make it push commands... Note that you can use the `...` spread syntax to copy what was there before
  // add to it with new commands.
  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  function handleSubmit(commandString: string) {
    //setCount(count + 1);
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
  commandString.trim().toLowerCase();
  if (commandString.includes("mode") && commandString.length === 4) {
    if (props.verbose === false) {
      props.setVerbose(true);
    } else {
      props.setVerbose(false);
    }
  }

  function commandOutput(commandString: string): string {
    let newString = commandString.trim().toLowerCase();
    let loadedFilePath = "";
    // *** MODE COMMAND ***

    if (newString.includes("mode") && newString.length === 4) {
      if (props.verbose === false) {
        return "Brief mode!";
      } else if (props.verbose === true) {
        return "Verbose mode!";
      }
    }

    // *** LOAD, VIEW, & SEARCH CSV COMMAND ***
    if (commandString.substring(0, 10) === "load_file ") {
      let file_path = commandString.slice(9);
      // if (getMockedData(file_path) == [["File not found!"]]) {
      //   return "File not found!";
      // }
      setLoadFile(file_path);
      mapFiles(file_path);
      console.log(file_history);
      return loaded_file;
      //return file_history.has(file_path).toString();
      //return "File loaded";
    } else if (commandString === "view") {
      return makeHTMLTable(loaded_file);
      // if (loadedFilePath === "") {
      //   return "No file loaded!";
      // } else {
      //   return "beep";
      // }
    } else if (commandString.substring(0, 7) === "search ") {
      let searchParams = commandString.substring(7);
      let searchArray = searchParams.split(" ");
      let searchCol = searchArray[0];
      let searchVal = searchArray[1];
      return "search";
    } else {
      return "Command not found!";
    }
  }

  function getMockedData(filePath: string): string[][] {
    // Mock implementation
    const file1 = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ];
    const file2 = [
      ["beep", "boop", "beep"],
      ["boo", "b", "bee"],
      ["ooo", "cee", "see"],
      ["fdgfd", "gdfgdf", "gdgdf"],
    ];
    const mtfile = [[]];
    const file4 = [
      [
        "State",
        "RI",
        "Data Type",
        "Native American/American Indian",
        "Average Weekly Earnings",
        " $471.07 ",
        "Number of Workers",
        "Earnings Disparity",
        " $0.45 ",
        "Employed Percent",
        "0%",
      ],
      [
        "State",
        "RI",
        "Data Type",
        "Asian-Pacific Islander",
        "Average Weekly Earnings",
        " $1,080.09 ",
        "Number of Workers",
        "Earnings Disparity",
        " $1.02 ",
        "Employed Percent",
        "4%",
      ],
    ];

    if (filePath === "file1") {
      return file1;
    } else if (filePath === "file2") {
      return file2;
    } else if (filePath === "mtfile") {
      return mtfile;
    }
    return [["File not found!"]];
  }

  function mapFiles(filePath: string) {
    const dataset = getMockedData(filePath); // Retrieve or mock the CSV data

    //if file doesn't exist in map, add file to map
    if (file_history.has(filePath) === false) {
      setFileHistory(file_history.set(filePath, dataset));
      return "File mapped";
    }
  }

  function makeHTMLTable(filePath: string): string {
    let data = getMockedData(filePath);
    let tableHtml = "<table>\n<thead>\n<tr>\n";

    // Use the first row for column headers
    data[0].forEach((header) => {
      tableHtml += `<th>${header}</th>\n`;
    });

    tableHtml += "</tr>\n</thead>\n<tbody>\n";

    // Iterate over the remaining rows for the table body
    for (let i = 1; i < data.length; i++) {
      tableHtml += "<tr>\n";
      data[i].forEach((cell) => {
        tableHtml += `<td>${cell}</td>\n`;
      });
      tableHtml += "</tr>\n";
    }

    // Close the table body and the table
    tableHtml += "</tbody>\n</table>";

    return tableHtml;
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
