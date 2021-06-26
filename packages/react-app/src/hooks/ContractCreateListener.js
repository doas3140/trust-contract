import React from "react";
import useEventListener from "./EventListener";
import { useSelector, useDispatch } from "react-redux";
import { ReduxMain } from "../redux/slice-main";

export default function useContractCreateListener(readContracts, localProvider) {
  const dispatch = useDispatch();
  //   const { contracts } = useSelector(state => state.main);
  //   console.log('[contracts', contracts)
  const creates = useEventListener(readContracts, "TrustContract", "ContractCreate", localProvider, 1);
  React.useEffect(() => {
    const address2ids = {};
    for (const c of creates) {
      if(!(c.creator in address2ids)) {
        address2ids[c.creator] = []
      }
      address2ids[c.creator].push(Number(c.id))
    }
    dispatch(ReduxMain.setState({ address2ids }));
  }, [creates.length]);
  return creates;
}
