import "../styles/main.css";

/**
 * props for REPLHistory component
 *
 * @interface
 * @property history {string[]}: history of commands run in REPL, array of commands(strings)
 */
interface REPLHistoryProps {
  history: string[];
}

/**
 * react component that displays history of commands run in REPL
 *
 * @param props {REPLHistoryProps}: props passed into REPLHistory component
 * @returns JSX.element, rendered list of commands, each command displayed as paragraph within a div
 */
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {props.history.map((command, index) => (
        <p key={index}>{command}</p>
      ))}
    </div>
  );
}
