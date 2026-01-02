import type { Surah, Reciter, Stat, ReadingActivity, Achievement } from './types';

export const surahs: Surah[] = [
  {
    id: 1,
    name: 'الفاتحة',
    englishName: 'Al-Fatiha',
    verses: [
      { id: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', indonesian: 'Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.' },
      { id: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', english: 'All praise is for Allah, Lord of the worlds.', indonesian: 'Segala puji bagi Allah, Tuhan semesta alam.' },
      { id: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', english: 'The Entirely Merciful, the Especially Merciful,', indonesian: 'Maha Pemurah lagi Maha Penyayang.' },
      { id: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', english: 'Sovereign of the Day of Recompense.', indonesian: 'Yang menguasai di Hari Pembalasan.' },
      { id: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', english: 'It is You we worship and You we ask for help.', indonesian: 'Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan.' },
      { id: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', english: 'Guide us to the straight path -', indonesian: 'Tunjukilah kami jalan yang lurus,' },
      { id: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', english: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.', indonesian: '(yaitu) Jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.' },
    ],
  },
  {
    id: 112,
    name: 'الإخلاص',
    englishName: 'Al-Ikhlas',
    verses: [
        { id: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', english: 'Say, "He is Allah, [who is] One,', indonesian: 'Katakanlah: Dialah Allah, Yang Maha Esa.' },
        { id: 2, arabic: 'اللَّهُ الصَّمَدُ', english: 'Allah, the Eternal Refuge.', indonesian: 'Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu.' },
        { id: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', english: 'He neither begets nor is born,', indonesian: 'Dia tiada beranak dan tidak pula diperanakkan,' },
        { id: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', english: 'Nor is there to Him any equivalent."', indonesian: 'dan tidak ada seorangpun yang setara dengan Dia.' },
    ]
  },
  {
    id: 114,
    name: 'الناس',
    englishName: 'An-Nas',
    verses: [
      { id: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', english: 'Say, "I seek refuge in the Lord of mankind,', indonesian: 'Katakanlah: "Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia.' },
      { id: 2, arabic: 'مَلِكِ النَّاسِ', english: 'The Sovereign of mankind,', indonesian: 'Raja manusia.' },
      { id: 3, arabic: 'إِلَٰهِ النَّاسِ', english: 'The God of mankind,', indonesian: 'Sembahan manusia.' },
      { id: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', english: 'From the evil of the retreating whisperer -', indonesian: 'Dari kejahatan (bisikan) syaitan yang biasa bersembunyi,' },
      { id: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', english: 'Who whispers [evil] into the breasts of mankind -', indonesian: 'yang membisikkan (kejahatan) ke dalam dada manusia,' },
      { id: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', english: 'From among the jinn and mankind."', indonesian: 'dari (golongan) jin dan manusia.' },
    ]
  }
];

export const reciters: Reciter[] = [
    { id: 'Mishary_Rashid_Alafasy_128kbps', name: 'Mishary Rashid Alafasy' },
    { id: 'Abdurrahmaan_As-Sudais_128kbps', name: 'Abdul Rahman Al-Sudais' },
    { id: 'Saood_ash-Shuraym_128kbps', name: 'Saud Al-Shuraim' },
    { id: 'maher_almuaiqly_128kbps', name: 'Maher Al Muaiqly' },
    { id: 'Yasser_Ad-Dussary_128kbps', name: 'Yasser Ad-Dussary' },
];

export const readingStats: { [key: string]: Stat } = {
  versesRead: {
    title: 'Verses Read Today',
    value: '7',
    change: '+3',
    changeType: 'increase',
  },
  timeSpent: {
    title: 'Time Spent',
    value: '12m 45s',
    change: '+2m',
    changeType: 'increase',
  },
  readingStreak: {
    title: 'Reading Streak',
    value: '5 Days',
    change: '-1',
    changeType: 'decrease',
  },
};

export const readingActivity: ReadingActivity[] = [
  { day: 'Mon', minutes: 15 },
  { day: 'Tue', minutes: 25 },
  { day: 'Wed', minutes: 10 },
  { day: 'Thu', minutes: 30 },
  { day: 'Fri', minutes: 45 },
  { day: 'Sat', minutes: 20 },
  { day: 'Sun', minutes: 12 },
];

export const achievements: Achievement[] = [
    { id: '1', title: 'First Steps', description: 'Read your first Surah.', unlocked: true, imageId: 'achievement-first-steps' },
    { id: '2', title: 'Devotion', description: 'Maintain a 7-day reading streak.', unlocked: true, imageId: 'achievement-devotion' },
    { id: '3', title: 'The Cow', description: 'Complete Surah Al-Baqarah.', unlocked: false, imageId: 'achievement-scholar' },
    { id: '4', title: 'Night Reader', description: 'Read between Fajr and Sunrise.', unlocked: false, imageId: 'achievement-night-reader' },
];

export const searchResults = [
  { surah: 'Al-Baqarah', verse: 255, text: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...' },
  { surah: 'Al-Imran', verse: 133, text: 'And hasten to forgiveness from your Lord and a garden as wide as the heavens and earth, prepared for the righteous' },
  { surah: 'An-Nisa', verse: 29, text: 'O you who have believed, do not consume one another\'s wealth unjustly but only [in lawful] business by mutual consent. And do not kill yourselves [or one another]. Indeed, Allah is to you ever Merciful.' },
];
