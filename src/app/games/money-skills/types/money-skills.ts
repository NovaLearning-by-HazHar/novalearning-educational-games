/** Money Skills L1 — Type Definitions */

export type CoinId = 'coin-5c' | 'coin-10c' | 'coin-20c' | 'coin-50c' | 'coin-r1' | 'coin-r2' | 'coin-r5';

export interface CoinData {
  id: CoinId;
  name: string;
  value: number;
  color: string;
  size: number;
  description: string;
  /** Audio clue used in practice phase */
  clue: string;
}

export interface PracticeRoundData {
  clue: string;
  correctCoinId: CoinId;
  /** Subset of coins shown as options */
  options: CoinId[];
}
