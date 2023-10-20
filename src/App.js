import { RoutingComponent } from "./RoutingComponent";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { selectChangeTheme } from "./components/common/listSlice";
import { useSelector } from "react-redux";

function App() {
  const isDarkMode = useSelector(selectChangeTheme);
  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RoutingComponent />
      </ThemeProvider>
    </>
  );
}

export default App;
