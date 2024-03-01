import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";

/**
 * props for REPLInput component
 *
 * @interface
 * @property history {any[]}: array that stores the command history submitted to REPL
 * @property setHistory {Dispatch<SetStateAction<any[]>>}: function that updates the state of 'history' array
 * @property verbose {boolean}: boolean that indicates the output mode
 *              - false = brief mode, only command output returned
 *              - true = verbose mode, command and command output returned in format Command: ___ Output: ___
 * @property setVerbose {Dispatch<SetStateAction<boolean>>}: function that updates the state of 'verbose'
 */
interface REPLInputProps {
  history: any[]; //push every command into this history array
  setHistory: Dispatch<SetStateAction<any[]>>; //use it to maintain state of list
  verbose: boolean;
  setVerbose: Dispatch<SetStateAction<boolean>>;
}

/**
 * defines a function for command use
 * a function takes an array of strings as arguments (representing parameters) and returns a result
 * @interface
 * @param args {string[]} : array of strings, paramters for a command (ie. args for load_file
 * is the filepath)
 * @returns result of running a command, varies by command
 * */
export interface REPLFunction {
  (args: Array<string>): any;
}

/**
 * input interface for REPL
 * users enter commands, manages command history, executes commands
 * @param props {REPLInputProps}: props passed to REPLInput component
 *                              - history
 *                              - setHistory
 *                              - verbose
 *                              - setVerbose
 *
 * State:
 *  - commandString: string, command entered by user
 *  - file_history: Map<string, string[][]>, map storing history of files loaded and their respective datasets
 *  - loaded_file: string, current loaded file's filepath, updated each time a new file is loaded by the user
 *
 * @returns FINISH THIS
 */
export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [file_history, setFileHistory] = useState<Map<string, string[][]>>(
    new Map()
  );
  const [loaded_file, setLoadFile] = useState<string>("");
  const commandMap: Map<string, REPLFunction> = new Map();

  function addCommand(commandName: string, commandFunc: REPLFunction) {
    commandMap.set(commandName, commandFunc);
  }

  /**
   * Mode command function: defines output for mode command
   * @param args the arguments input after mode command
   * @returns string to output to user
   */
  const modeCommand: REPLFunction = (args: Array<string>) => {
    if (props.verbose === false) {
      return "Brief mode!";
    } else if (props.verbose === true) {
      return "Verbose mode!";
    }
  };

  /**
   * Load command function: defines behavior for load command,
   * setting the loaded file w the current file path
   * @param args the arguments input after load command
   * @returns string to output to user
   */
  const loadCommand: REPLFunction = (args: Array<string>) => {
    const filepath = args[0];
    let data = getMockedData(filepath);
    if (filepath.length === 0) {
      return "No filepath given.";
    }
    if (data.length === 1 && data[0][0] === "File not found!") {
      return "File not found!";
    } else {
      setLoadFile(filepath);
      return "File loaded successfully!";
    }
  };

  /**
   * View command func: defines behavior for view command,
   * making an html table from the file or returning error message
   * @param args the arguments input after view command
   * @returns html table or string to output to user
   */
  const viewCommand: REPLFunction = (args: Array<string>) => {
    if (!(loaded_file === "")) {
      let data = getMockedData(loaded_file);
      return makeHTMLTable(data);
    } else {
      return "File not found!";
    }
  };

  /**
   * Search command func: defines behavior for search command,
   * searching a file w identifier and val or returning error message
   * @param args the arguments input after search command
   * @returns html table or string to output to user
   */
  const searchCommand: REPLFunction = (args: Array<string>) => {
    const columnID = args[0];
    const value = args[1];
    let data = getMockedData(loaded_file);
    if (columnID === "" || value === "") {
      return "Missing parameters, unable to search file.";
    }
    if (data.length === 1 && data[0][0] === "File not found!") {
      return "File not found!";
    }
    if (args.length > 2) {
      return "Too many parameters given, unable to search file.";
    }
    if (args.length === 2) {
      setLoadFile(loaded_file);
      let matchedRows = search(args);
      if (matchedRows.length === 0) {
        return "No value found.";
      } else {
        return makeHTMLTable(matchedRows);
      }
    }
  };

  // add commands to the command map
  addCommand("mode", modeCommand);
  addCommand("load_file", loadCommand);
  addCommand("view", viewCommand);
  addCommand("search", searchCommand);

  /**
   * Handles program functionality after the user inputs a string,
   * retrieving the command function from the map and returning
   * output to the user
   * @param commandString user input
   */
  function handleSubmit(commandString: string) {
    if (commandString.length > 0) {
      const args = commandString.split(" ");
      const commandName = args.shift()?.toLowerCase();
      const commandFunc = commandMap.get(commandName!);
      if (commandFunc) {
        if (props.verbose === false) {
          props.setHistory([...props.history, commandFunc(args)]);
        } else {
          props.setHistory([
            ...props.history,
            verboseOutput(commandString, commandFunc, args),
          ]);
        }
      } else {
        props.setHistory([...props.history, "Command not found!"]);
      }
    }
    setCommandString("");
  }
  commandString.trim().toLowerCase();

  //update mode
  if (commandString.includes("mode") && commandString.length === 4) {
    if (props.verbose === false) {
      props.setVerbose(true);
    } else {
      props.setVerbose(false);
    }
  }

  /**
   * Defines how to
   * @param commandString user input
   * @param commandFunc command extracted from user input
   * @param args arguments given after command string
   * @returns
   */
  function verboseOutput(
    commandString: string,
    commandFunc: REPLFunction,
    args: Array<string>
  ) {
    if (typeof commandFunc(args) === "string") {
      return (
        "Command: " + commandString + "\n" + "Output: " + commandFunc(args)
      );
    } else {
      let myOutput = [];
      myOutput.push("Command: " + commandString + " ");
      myOutput.push("Output: ");
      myOutput.push(commandFunc(args));
      return myOutput;
    }
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
          // let matchedRows = [["1", "2", "3"]];
          // return makeHTMLTable(matchedRows);
        } else if (searchParams[0] === "0" && searchParams[1] === "hi") {
          //search for non-exist val w index
          return [[]];
          // return "Value does not exist in file"
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
          return [["Non-existent index!"]];
        } else if (searchParams[0] === "6000" && searchParams[1] === "eek") {
          //search w non-existent index and val
          return [["Non-existent index and value!"]];
        }
      } else if (searchParams[0] === "eek") {
        //search w non existent val
        return [["Non-existent value!"]];
      }
    } else if (loaded_file === "mtfile") {
      //any search on empty file
      return [["File is empty!"]];
    }
    return [[]];
  }

  function getMockedData(filePath: string): string[][] {
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
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button aria-label={"Submit"} onClick={() => handleSubmit(commandString)}>
        Submit
      </button>
    </div>
  );
}
