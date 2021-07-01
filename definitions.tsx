/* In addition to HP damage, some chips attack other chips in the opponent's currently active chipDeck (the set of 3 chips used for a given turn)
    None - No damage
    BackSlot - Deals damage to the chip furthest in the back, ignoring NullChips.
    RandomSlot - Deals damage to a random chip in the chipDeck, including ones that were already used this turn.
    AllSlot - Deals damage to all chips in the chipDeck.
*/
export enum PierceType {
  None = 0,
  BackSlot,
  RandomSlot,
  AllSlot,
}

/** All attacks in this game come in the form of Chips.
 *  Name - the name of the attack
 *  Damage - How much damage the attack will do the an opposing Navi
 *  HP - The amount of damage this chip can take before being deleted.
 *  PierceType - Specifies behaviour for attacking the chipDeck
 *  Recover - How much HP the user's Navi will recover.
 */
export interface Chip {
  name: string;
  damage: number;
  hp: number;
  pierceType?: number;
  recover?: number;
}

/** Navis are a special type of chip due to a few properties:
 *  1. When a NaviChip is deleted, the user loses the game.
 *  2. Unlike regular chips, NaviChips can be healed, so they include a maxHP field as well (healing cannot go beyond max HP).
 *  3. Navi
 */
export interface Navi extends Chip {
  name: string;
  hp: number;
  maxhp: number;
  damage: number;
  recover?: number;
  pierceType?: number;
}

/** A deck is made up of a Navi, plus three additional rows of chips.
 *  On a turn, one chip is selected from each row. The rows get progressively larger, like so:
 *  Row A - 2 Chips (0,1)
 *  Row B - 3 Chips (0,1,2)
 *  Row C - 4 Chips (0,1,2,3)
 *  Chips are selected randomly each turn. Chips in each row point to the chips in the next row with the same index and the same index + 1.
 *  This means some combinations of chips are invalid.
 *      EXAMPLE: 0, 0, 1 - OK
 *               0, 1, 2 - OK
 *               1, 2, 0 - not OK, because Row B's 2 chip cannot connect to Row C's 0 chip, only the 2 or 3
 */
export class Deck {
  Navi: Navi;
  RowA: [Chip, Chip];
  RowB: [Chip, Chip, Chip];
  RowC: [Chip, Chip, Chip, Chip];

  constructor(navi: Navi, rowA: [Chip, Chip], rowB: [Chip, Chip, Chip], rowC: [Chip, Chip, Chip, Chip]) {
    this.Navi = navi;
    this.RowA = rowA;
    this.RowB = rowB;
    this.RowC = rowC;
  }
}

/** A chip with no properties. Any deleted chip becomes a NullChip, rendering it unusable on future turns. */
export class NullChip implements Chip {
  name = "NullChip";
  hp = 0;
  damage = 0;
}

/** An extremely fragile chip boasting high damage.*/
export class Sword implements Chip {
  name = "Sword";
  hp = 10;
  damage = 80;
}

/** A chip that blends sturdiness and strength. */
export class Cannon implements Chip {
  name = "Cannon";
  hp = 60;
  damage = 60;
}

/** A mid-damage chip that attacks the opponent's deck.*/
export class Pierce implements Chip {
  name = "Pierce";
  hp = 30;
  damage = 30;
  pierceType = PierceType.RandomSlot;
}

/** A low damage chip that attacks all chips in the opponent's chipDeck.  */
export class PierceAll implements Chip {
  name = "PierceAll";
  hp = 50;
  damage = 20;
  pierceType = PierceType.AllSlot;
}


export class MegaMan implements Navi {
  name = "Mega Man";
  hp = 500;
  maxhp = 500;
  damage = 50;
}

export class Roll implements Navi {
    name = "Roll";
    hp = 450;
    maxhp = 450;
    damage = 30;
    recover = 30;
}
