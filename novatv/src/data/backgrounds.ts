export const BACKGROUNDS: Record<string, string> = {
  neighbourhood: '/backgrounds/neighbourhood.jpg',
  'spaza-shop': '/backgrounds/spaza-shop.jpg',
  stoep: '/backgrounds/stoep.jpg',
  'music-room': '/backgrounds/music-room.jpg',
};

export const CHARACTER_BACKGROUNDS: Record<string, string> = {
  sipho: BACKGROUNDS['spaza-shop'],
  priya: BACKGROUNDS['music-room'],
  kagiso: BACKGROUNDS.stoep,
};

export const SCENE_BACKGROUNDS: Record<string, string> = {
  'miss-vdm-intro': BACKGROUNDS.stoep,
  'miss-vdm-outro': BACKGROUNDS.neighbourhood,
  'group-finale': BACKGROUNDS.neighbourhood,
};
