export interface Character {
  id: string;
  name: string;
  community: string;
  file: string | null;
  placeholder: boolean;
  color: string;
  interest: string;
  role: 'child' | 'teacher';
}

export const CHARACTERS: Character[] = [
  { id: 'miss-vdm', name: 'Miss van der Merwe', community: 'Afrikaans', file: null, placeholder: true, color: '#8B5CF6', interest: 'teaching', role: 'teacher' },
  { id: 'sipho', name: 'Sipho', community: 'Zulu', file: null, placeholder: true, color: '#E65100', interest: 'counting', role: 'child' },
  { id: 'aisha', name: 'Aisha', community: 'Cape Malay', file: null, placeholder: true, color: '#E91E63', interest: 'cooking', role: 'child' },
  { id: 'jaedon', name: 'Jaedon', community: 'Mixed heritage', file: null, placeholder: true, color: '#4CAF50', interest: 'sport', role: 'child' },
  { id: 'emma', name: 'Emma', community: 'English', file: null, placeholder: true, color: '#FF9800', interest: 'animals', role: 'child' },
  { id: 'priya', name: 'Priya', community: 'Indian/Tamil', file: '/characters/priya.png', placeholder: false, color: '#27AE60', interest: 'music', role: 'child' },
  { id: 'danie', name: 'Danie', community: 'Afrikaans', file: null, placeholder: true, color: '#2196F3', interest: 'building', role: 'child' },
  { id: 'naledi', name: 'Naledi', community: 'Xhosa', file: '/characters/naledi.png', placeholder: false, color: '#4A90D9', interest: 'stars', role: 'child' },
  { id: 'kagiso', name: 'Kagiso', community: 'Tswana', file: null, placeholder: true, color: '#9C27B0', interest: 'stories', role: 'child' },
];

export const KIDS = CHARACTERS.filter((c) => c.role === 'child');
export const TEACHER = CHARACTERS.find((c) => c.role === 'teacher')!;
