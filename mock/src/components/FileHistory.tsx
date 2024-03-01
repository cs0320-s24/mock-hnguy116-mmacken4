// import "../styles/main.css";

// interface FileProps {
//   // TODO: Fill with some shared state tracking all the pushed commands
//   file_history: string[][];
// }
// export function FileHistory(props: FileProps) {

//     function getFilePath(commandString: string) {
//         commandString = commandString.trim().toLowerCase();
//         let file_path = commandString.slice(9);
//         return file_path;
//     }

//   return (
//     <div className="file-history">
//       {/* This is where command history will go */}
//       {/* TODO: To go through all the pushed commands... try the .map() function! */}

//       {/* need to get specifically the filepath from the command */}
//       {props.file_history.map((getFilePath(command), index) => (
//         <p>{getFilePath(command)}</p>
//       ))}
//     </div>
//   );
// }

// import "../styles/main.css";

// interface REPLHistoryProps {
//   // TODO: Fill with some shared state tracking all the pushed commands
//   history: string[];
// }
// export function REPLHistory(props: REPLHistoryProps) {
//   return (
//     <div className="repl-history">
//       {/* This is where command history will go */}
//       {/* TODO: To go through all the pushed commands... try the .map() function! */}
//       {props.history.map((command, index) => (
//         <p>{command}</p>
//       ))}
//     </div>
//   );
// }
