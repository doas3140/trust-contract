import React from "react";
import useEventListener from "./EventListener";
import { useSelector, useDispatch } from "react-redux";
import { ReduxMain } from "../redux/slice-main";

export default function useContractUpdateListener(readContracts, localProvider) {
  const dispatch = useDispatch();
  //   const { contracts } = useSelector(state => state.main);
  //   console.log('[contracts', contracts)
  const updates = useEventListener(readContracts, "TrustContract", "ContractUpdate", localProvider, 1);
  React.useEffect(() => {
    const c = {};
    for (const u of updates.reverse()) {
      c[Number(u.id)] = {
        id: Number(u.id),
        value: Number(u.value),
        step: Number(u.step),
        creator: {
          address: u.creator,
          oldBalance: Number(u.creatorOldBalance),
          balanceChange: u.step > 3 && Number(u.creatorBalanceChange),
          action: u.step < 4 ? "question" : u.creatorToSteal ? "steal" : "coop",
        },
        acceptor: u.step > 1 && {
          address: u.acceptor,
          oldBalance: Number(u.acceptorOldBalance),
          balanceChange: u.step > 3 && Number(u.acceptorBalanceChange),
          action: u.step < 4 ? "question" : u.acceptorToSteal ? "steal" : "coop",
        },
      };
    }
    const contracts = Object.entries(c)
      .sort(([k1, v1], [k2, v2]) => k1 - k2)
      .map(c => c[1]);
    dispatch(ReduxMain.setState({ contracts }));
  }, [updates.length]);
  return updates;
}
