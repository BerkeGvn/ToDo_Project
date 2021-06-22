import "./scss/main.scss";
import events from "./modules/mainClickEvents";
import localMemory from "./modules/localStorage";

events();
localMemory.pullLocalStorage();
