import "../styles/main.css";

interface REPLHistoryProps {
  // TODO: Fill with some shared state tracking all the pushed commands
  history: string[];
}
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {props.history.map((command, index) => (
        <p>{command}</p>
      ))}
    </div>
  );
}
