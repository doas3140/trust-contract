import React from "react";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { Restore } from "@material-ui/icons";
import {Code, Group} from '@material-ui/icons';

import { useLocation, useHistory } from "react-router-dom";

export const Hidden = props => <div style={{ visibility: "hidden" }}>{props.children}</div>;

const style = {
  position: "fixed",
  width: "100vw",
  bottom: 0
}

export default function BottomNav() {
  const location = useLocation();
  const history = useHistory();

  return (
    <>
      <BottomNavigation style={style} showLabels value={location.pathname} onChange={(e, route) => history.push(route)}>
        <BottomNavigationAction label="Functions" value="/" icon={<Code />} />
        <BottomNavigationAction label="Players" value="/names" icon={<Group />} />
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
