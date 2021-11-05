import {SubstrateEvent} from "@subql/types";
import {Account, Transfer} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const [fromAddress, toAddress, amount] = event.event.data;

    const toAccount = await Account.get(toAddress.toString());

    if(!toAccount) {
        await new Account(toAddress.toString()).save();
    }
  
    const transfer = new Transfer(`${event.block.block.header.number.toNumber()}-${event.idx}`);
    transfer.blockNumber = event.block.block.header.number.toBigInt();
    transfer.toId = toAddress.toString();
    transfer.amount = (amount as Balance).toBigInt();

    await transfer.save();
}


