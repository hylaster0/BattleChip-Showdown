import {Deck, NullChip, MegaMan, Roll, Sword, Cannon, Pierce, PierceAll} from "./definitions";
import {Battle} from "./logic";

function simulate(){
    const deck1 = new Deck(new MegaMan(), [new Sword(), new Cannon()], [new NullChip(), new Cannon(), new NullChip()], [new NullChip(), new Sword(), new Sword(), new NullChip()]);
    const deck2 = new Deck(new Roll(), [new Pierce(), new Pierce()], [new NullChip(), new PierceAll(), new NullChip()], [new Cannon(), new NullChip(), new NullChip(), new Cannon()]);
    
    Battle(deck1, deck2);
}

simulate();