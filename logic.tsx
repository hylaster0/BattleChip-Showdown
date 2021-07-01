import {PierceType, Deck, Chip, Navi, NullChip} from "./definitions";

/** Determines which chips to use on a given turn. */
function buildChipDeck(deck: Deck): Array<Chip> {
    let position = Math.floor(Math.random() * 2); // picks either 0 or 1
    const chipDeck = new Array<Chip>();
    chipDeck[0] = deck.RowA[position];
    position += Math.floor(Math.random() * 2);
    chipDeck[1] = deck.RowB[position];
    position += Math.floor(Math.random() * 2);
    chipDeck[2] = deck.RowC[position];
    chipDeck[3] = deck.Navi;
    return chipDeck;
}

function attackChip(damage: number, chip: Chip){
    const damageDealt = Math.min(chip.hp, damage);
    chip.hp -= damageDealt;
    console.log(chip.name + " took " + damageDealt + " damage!");
    if (chip.hp == 0){
        console.log("Chip deleted!");
        return new NullChip();
    }
    return chip;
}

/** Deal damage to the chip deck based on the PierceType. Pierce damage does not apply to the Navi. */
function attackChipDeck(damage: number, type: PierceType, chipDeck: Array<Chip>){
    if (type == PierceType.RandomSlot){
        const slot = Math.floor(Math.random() * 3);
        if (chipDeck[slot].name == "NullChip") {
            console.log("But it targeted a slot with no chip data!");
          } else {
            chipDeck[slot] = attackChip(damage,chipDeck[slot]);            
          }
    }

    if (type == PierceType.AllSlot){
        for (let i = 0; i < 3; i++){
            if (chipDeck[i].name != "NullChip"){
                chipDeck[i] = attackChip(damage, chipDeck[i]);
            }
        }
    }
}

/** Applies the effects of a given chip to the opposing Navi and chipDeck*/
function applyChip(chip: Chip, targetDeck: Array<Chip>, user: Navi) {

    // Start of turn, declare the attack.
    console.log(user.name + "'s " + chip.name + "!");
  
    if (chip.name == "NullChip") {
      console.log("No effect!");
      return;
    }

    // Begin by applying damage. If this ends the game, exit immediately rather than apply other effects.
    if (chip.damage > 0) {
        attackChip(chip.damage, targetDeck[3]);
    }

    // Restore HP
    if (chip.recover) {
      const healBy = Math.min(user.maxhp - user.hp, chip.recover);
      user.hp += healBy;
      console.log(user.name + " recovered " + healBy + " HP!");
    }
  
    // Apply damage to the opponent's chipDeck, if applicable
    attackChipDeck(chip.damage, chip.pierceType || 0, targetDeck);
}

/** When a chip's HP is reduced to 0, it is replaced by a NullChip.
 *  However, overwriting the chip means that this only applies in the chipDeck.
 *  This function finds chips that should be deleted and removes them before the next selection phase.
 */
function cleanDeck(deck: Deck){
    for (let i = 0; i < 4; i++) {
        if (i < 2) {
          if (deck.RowA[i].hp == 0) {
            deck.RowA[i] = new NullChip();
          }
        }
        if (i < 3) {
            if (deck.RowB[i].hp == 0){
                deck.RowB[i] = new NullChip();
            }
        }

        if (deck.RowC[i].hp == 0){
            deck.RowC[i] = new NullChip();
        }
    }
}

/** Main Driver
 *  Takes in two decks and performs actions until one of them dies.
 */
export function Battle(deck1: Deck, deck2: Deck){
    console.log("Battle started!");

    // Each loop = 1 turn
    while (deck1.Navi.hp > 0 && deck2.Navi.hp > 0) {

        // Turn Start: Select Chips
        const chipDeckA = buildChipDeck(deck1);
        const chipDeckB = buildChipDeck(deck2);
        
        // Both players use their first chip, then both players use their second chip. Finally, each Navi uses their built-in attack.
        // Currently, the player controlling deck1 always goes first.
        // TODO: Give each Chip a Speed stat, determining where in the turn order it should be. (Ties decided randomly)
        for (let i = 0; i < 4; i++) {
            // Player 1's Attack!
            applyChip(chipDeckA[i], chipDeckB, deck1.Navi);
            console.log("");

            // If the battle ended, stop here.
            if (deck2.Navi.hp <= 0) break;

            // Player 2's Attack!
            applyChip(chipDeckB[i], chipDeckA, deck2.Navi);
            console.log("");

            if (deck1.Navi.hp <= 0) break;
        }

      cleanDeck(deck1);
      cleanDeck(deck2);
      console.log(deck1.Navi.hp + " | " + deck2.Navi.hp);
    }  
}