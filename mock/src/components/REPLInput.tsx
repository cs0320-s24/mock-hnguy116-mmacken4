import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  history: string[]; //push every command into this history array
  setHistory: Dispatch<SetStateAction<string[]>>; //use it to maintain state of list
  verbose: boolean;
  setVerbose: Dispatch<SetStateAction<boolean>>;
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
  //const [html_Table, setHTMLTable] = useState<string>("");
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

  function commandOutput(commandString: string): any {
    let newString = commandString.trim().toLowerCase();
    // *** MODE COMMAND ***

    if (newString.includes("mode") && newString.length === 4) {
      if (props.verbose === false) {
        return "Brief mode!";
      } else if (props.verbose === true) {
        return "Verbose mode!";
      }
    }

    // *** LOAD COMMAND ***
    if (newString.substring(0, 10) === "load_file ") {
      let file_path = commandString.slice(10).trim().toLowerCase();
      let data = getMockedData(file_path);
      if (file_path.length === 0) {
        return "No file path given!";
      }
      if (data.length === 1 && data[0][0] === "File not found!") {
        return "File not found!";
      } else {
        setLoadFile(file_path);
        mapFiles(file_path);
        return "File loaded successfully!";
      }

      // *** VIEW COMMAND ***
    } else if (newString === "view") {
      if (!(loaded_file === "")) {
        let data = getMockedData(loaded_file);
        return makeHTMLTable(data);
      } else {
        return "No file loaded!";
      }

      // *** SEARCH COMMAND ***
    } else if (newString.substring(0, 7) === "search ") {
      if (loaded_file === "") {
        return "No file loaded!";
      }
      let searchParams = commandString.substring(7).trim();
      let searchArray = searchParams.split(" ");
      searchArray[0] = searchArray[0].trim();
      searchArray[1] = searchArray[1].trim();
      if (searchArray.length === 0) {
        return "No search parameters given!";
      } else if (searchArray.length > 2) {
        return "Too many search parameters given!";
      }
      let matchedRows = search(searchArray);
      if (matchedRows.length === 0) {
        return "No rows found!";
      }
      return makeHTMLTable(matchedRows);
    }
    return "Command not found!";
  }

  function mapFiles(filePath: string) {
    const dataset = getMockedData(filePath);

    //if file doesn't exist in map, add file to map
    if (file_history.has(filePath) === false) {
      setFileHistory(file_history.set(filePath, dataset));
      return "File mapped";
    }
  }

  function makeHTMLTable(data: string[][]) {
    return (
      <table className="html-table" aria-label="html-table">
        {data.map((command, index) => (
          <tr key={index}>
            {command.map((command2, element) => (
              <td key={element}>{command2}</td>
            ))}
          </tr>
        ))}
      </table>
    );
  }

  function search(searchParams: string[]): string[][] {
    if (loaded_file === "file1") {
      if (searchParams.length === 2) {
        if (searchParams[0] === "0" && searchParams[1] === "1") {
          //search for val w index
          return [["1", "2", "3"]];
        } else if (searchParams[0] === "0" && searchParams[1] === "hi") {
          //search for non-exist val w index
          return [[]];
        } else if (searchParams[0] === "col3" && searchParams[1] === "6") {
          //search for val w col name
          return [
            ["4", "1", "6"],
            ["4", "2", "6"],
          ];
        }
      }
    } else if (loaded_file === "file2") {
      if (searchParams.length === 2) {
        if (searchParams[0] === "1" && searchParams[1] === "boop") {
          //search for val w index (>1 matched row)
          return [
            ["beep", "boop", "beep"],
            ["boo", "boop", "bee"],
          ];
        }
      } else {
        if (searchParams[0] === "ooo") {
          //search w/o identifier
          return [
            ["ooo", "cee", "see"],
            ["beep", "ooo", "bloo"],
          ];
        }
      }
    } else if (loaded_file === "file4") {
      if (searchParams.length === 2) {
        if (searchParams[0] === "6000" && searchParams[1] === "RI") {
          //search w non-existent index
          return [[]];
        } else if (searchParams[0] === "6000" && searchParams[1] === "eek") {
          //search w non-existent index and val
          return [[]];
        }
      } else if (searchParams[0] === "eek") {
        //search w non existent val
        return [[]];
      }
    } else if (loaded_file === "mtfile") {
      //any search on empty file
      return [[]];
    }
    return [[]];
  }

  function getMockedData(filePath: string): string[][] {
    // Mock implementation
    const file1 = [
      ["col1", "col2", "col3"],
      ["1", "2", "3"],
      ["4", "1", "6"],
      ["7", "8", "9"],
      ["4", "2", "6"],
    ];
    const file2 = [
      ["beep", "boop", "beep"],
      ["boo", "boop", "bee"],
      ["ooo", "cee", "see"],
      ["fdgfd", "gdfgdf", "gdgdf"],
      ["beep", "ooo", "bloo"],
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
    } else if (filePath === "file4") {
      return file4;
    } else {
      return [["File not found!"]];
    }
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
