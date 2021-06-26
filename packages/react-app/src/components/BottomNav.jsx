import React from "react";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { Restore } from "@material-ui/icons";
import { Code, Group, ListAlt } from "@material-ui/icons";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { useLocation, useHistory } from "react-router-dom";

export const Hidden = props => <div style={{ visibility: "hidden" }}>{props.children}</div>;

export default function BottomNav() {
  const location = useLocation();
  const history = useHistory();
  const { currentTheme } = useThemeSwitcher();

  const style = {
    position: "fixed",
    width: "100vw",
    bottom: 0,
    backgroundColor: currentTheme == "light" ? "white" : "#222222",
    color: "white",
  };

  return (
    <>
      <BottomNavigation style={style} showLabels value={location.pathname} onChange={(e, route) => history.push(route)}>
        <BottomNavigationAction label="Contracts" value="/" icon={<ListAlt />} />
        <BottomNavigationAction label="Players" value="/users" icon={<Group />} />
        <BottomNavigationAction label="Functions" value="/functions" icon={<Code />} />
        {/* <BottomNavigationAction label="Example" value="/contracts-example" icon={<ListAlt />} /> */}
        {/* <BottomNavigationAction label="Hints" value="/hints" icon={<Restore />} />
        <BottomNavigationAction label="Example UI" value="/exampleui" icon={<Restore />} />
        <BottomNavigationAction label="Mainnet DAI" value="/mainnetdai" icon={<Restore />} /> */}
      </BottomNavigation>
      <Hidden>
        <BottomNavigation>
          <BottomNavigationAction label="Main" value="/" icon={<Restore />} />
        </BottomNavigation>
      </Hidden>
    </>
  );
}
