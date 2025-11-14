export interface Card {
  id: string;
  name: string;
  icon: string;
  group: 'legendary' | 'rare' | 'common' | 'buff' | 'control' | 'chaos';
  story: string;
  effect: string;
  rarity: string;
  cardType?: string;
}
