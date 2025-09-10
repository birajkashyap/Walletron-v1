import Button from "./Button";
import { SunIcon, MoonIcon } from "./Navbar";

type ThemeToggleProps = {
  theme: "light" | "dark"; // your theme type
  setTheme: (theme: "light" | "dark") => void; // setter function
};

const ThemeToggle = ({ theme, setTheme }: ThemeToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
