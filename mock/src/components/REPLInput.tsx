import { Dispatch, SetStateAction, useState } from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: any[]; //push every command into this history array
  setHistory: Dispatch<SetStateAction<any[]>>; //use it to maintain state of list
  verbose: boolean;
  setVerbose: Dispatch<SetStateAction<boolean>>;
}

// 1. make map: string (command) - > function
// 2. pass function as argument to command handler (which calls the command)

// var command = commandProcessing.get(commandName);

// var response = command(argumentsArray);

// const commandList: Map<string, REPLFunction> = new Map();

export interface REPLFunction {
  (args: Array<string>): any;
}

// function addCommand(commandName: string, commandFunc: REPLFunction) {
//   commandList.set(commandName, commandFunc);
// }

// const loadFileCommand: REPLFunction = (Array<string>) any => {
//   let newString = commandString.trim().toLowerCase();
//   let file_path = commandString.slice(10).trim().toLowerCase();
//       let data = getMockedData(file_path);
//       if (file_path.length === 0) {
//         return "No file path given!";
//       }
//       if (data.length === 1 && data[0][0] === "File not found!") {
//         return "File not found!";
//       } else {
//         setLoadFile(file_path);
//         mapFiles(file_path);
//         return "File loaded successfully!";
//       }
// }

// addCommand("load_file", loadFileCommand);

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
  const commandMap: Map<string, REPLFunction> = new Map();

  function addCommand(commandName: string, commandFunc: REPLFunction) {
    commandMap.set(commandName, commandFunc);
  }

  const modeCommand: REPLFunction = (args: Array<string>) => {
    //mode command is called and mode is switched
    if (props.verbose === false) {
      return "Brief mode!";
    } else if (props.verbose === true) {
      return "Verbose mode!";
    }
  };

  const loadCommand: REPLFunction = (args: Array<string>) => {
    // let file_path = commandString.slice(10).trim().toLowerCase();
    // let data = getMockedData(file_path);
    // if (file_path.length === 0) {
    //   return "No file path given!";
    // }
    // if (data.length === 1 && data[0][0] === "File not found!") {
    //   return "File not found!";
    // } else {
    //   setLoadFile(file_path);
    //   mapFiles(file_path);
    //   return "File loaded successfully!";
    // }
    const filepath = args[0];
    let data = getMockedData(filepath);
    if (filepath.length === 0) {
      return "No filepath given.";
    }
    if (data.length === 1 && data[0][0] === "File not found!") {
      return "File not found!";
    } else {
      setLoadFile(filepath);
      //return filepath; use this to check args
      return "File loaded successfully!";
    }
  };

  const viewCommand: REPLFunction = (args: Array<string>) => {
    if (!(loaded_file === "")) {
      let data = getMockedData(loaded_file);
      return makeHTMLTable(data);
    } else {
      return "No file loaded!";
    }
  };

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

  addCommand("mode", modeCommand);
  addCommand("load_file", loadCommand);
  addCommand("view", viewCommand);
  addCommand("search", searchCommand);

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
  if (commandString.includes("mode") && commandString.length === 4) {
    if (props.verbose === false) {
      props.setVerbose(true);
    } else {
      props.setVerbose(false);
    }
  }

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

  // function commandOutput(commandString: string): any {
  //   let newString = commandString.trim().toLowerCase();

  //   // *** MODE COMMAND ***
  //   // if (newString.includes("mode") && newString.length === 4) {
  //   //   if (props.verbose === false) {
  //   //     return "Brief mode!";
  //   //   } else if (props.verbose === true) {
  //   //     return "Verbose mode!";
  //   //   }
  //   // }

  //   // *** LOAD COMMAND ***
  //   if (newString.substring(0, 10) === "load_file ") {
  //     let file_path = commandString.slice(10).trim().toLowerCase();
  //     let data = getMockedData(file_path);
  //     if (file_path.length === 0) {
  //       return "No file path given!";
  //     }
  //     if (data.length === 1 && data[0][0] === "File not found!") {
  //       return "File not found!";
  //     } else {
  //       setLoadFile(file_path);
  //       mapFiles(file_path);
  //       return "File loaded successfully!";
  //     }

  //     // *** VIEW COMMAND ***
  //   } else if (newString === "view") {
  //     if (!(loaded_file === "")) {
  //       let data = getMockedData(loaded_file);
  //       return makeHTMLTable(data);
  //     } else {
  //       return "No file loaded!";
  //     }

  //     // *** SEARCH COMMAND ***
  //   } else if (newString.substring(0, 7) === "search ") {
  //     if (loaded_file === "") {
  //       return "No file loaded!";
  //     }
  //     let searchParams = commandString.substring(7).trim();
  //     let searchArray = searchParams.split(" ");
  //     searchArray[0] = searchArray[0].trim();
  //     searchArray[1] = searchArray[1].trim();
  //     if (searchArray.length === 0) {
  //       return "No search parameters given!";
  //     } else if (searchArray.length > 2) {
  //       return "Too many search parameters given!";
  //     }
  //     let matchedRows = search(searchArray);
  //     if (matchedRows.length === 0) {
  //       return "No rows found!";
  //     }
  //     return makeHTMLTable(matchedRows);
  //   }
  //   return "Command not found!";
  // }

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
