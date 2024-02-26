import { Dispatch, SetStateAction, useState} from "react";
import "../styles/main.css";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  history: string[]; //push every command into this history array
  setHistory: Dispatch<SetStateAction<string[]>>; //use it to maintain state of list
  //brief: boolean;
  //setBrief: Dispatch<SetStateAction<boolean>>;
  verbose: boolean;
  setVerbose: Dispatch<SetStateAction<boolean>>;
}
// You can use a custom interface or explicit fields or both! An alternative to the current function header might be:
// REPLInput(history: string[], setHistory: Dispatch<SetStateAction<string[]>>)
export function REPLInput(props: REPLInputProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  // TODO WITH TA : add a count state
  const [count, setCount] = useState<number>(0);
  const [verbose, setVerbose] = useState<boolean>(false);
  
  // TODO WITH TA: build a handleSubmit function called in button onClick
  // TODO: Once it increments, try to make it push commands... Note that you can use the `...` spread syntax to copy what was there before
  // add to it with new commands.
  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */
  function handleSubmit(commandString: string) {
    if (commandString === "mode") {
      props.setVerbose(!props.verbose);
    }
    setCount(count + 1);
    if(props.verbose === false) {
      props.setHistory([...props.history, getOutputForCommand(commandString)]); 
    } else {
    props.setHistory([...props.history, "Command: " + commandString +"\n" + "Output: " + getOutputForCommand(commandString)]);
    }
    setCommandString("");
  }

  function changeMode(commandString: string){
    if (commandString.includes('mode')){ //if mode command 
      props.setVerbose(!props.verbose);
    }
  }

  // <result of running the command>
  function getOutputForCommand(commandString: string) {
    if (commandString.includes('mode')) {
      console.log(props.verbose);
      return ("this is the printed mode" + props.verbose); //this is undefined right now, need to initilize it
    }
    if(props.verbose === false) { //brief mode
      //console.log("verbose mode"); 
      return("brief mode"); 
    } else { 
      return("verbose"); 
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
      <button aria-label={"Submit"} onClick={() => handleSubmit(commandString)}>Submit</button>
    </div>
  );
}