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
  // TODO WITH TA : add a count state
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
      const updatedMode = !props.verbose;
      props.setVerbose(updatedMode);
      if (props.verbose === false) {
        return "Current Mode: Brief";
      } else if (props.verbose === true) {
        return "Current Mode: Verbose";
      }
    }

    //put other commands here
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
