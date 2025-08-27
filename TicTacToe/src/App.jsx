import "./App.css";
import TicTacToe from "./components/TicTacToe";

function App() {
  // const [board, setBoard] = useState(Array(9).fill(null));
  // const board = Array(9).fill(null);

  return <TicTacToe boardSize={4} />;
}

export default App;
