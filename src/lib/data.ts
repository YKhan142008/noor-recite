
import type { Surah, Reciter, Stat, ReadingActivity, Achievement } from './types';

const bismillahVerse = {
  id: 0, // Use 0 to indicate it's the prepended Bismillah
  arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
  indonesian: 'Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.',
  verse_key: "1:1" // Although it's being prepended, it's originally the first verse of Al-Fatiha
};

const allSurahs: Omit<Surah, 'verses'>[] = [
  { id: 1, name: 'الفاتحة', englishName: 'Al-Fatiha' },
  { id: 2, name: 'البقرة', englishName: 'Al-Baqarah' },
  { id: 3, name: 'آل عمران', englishName: 'Ali \'Imran' },
  { id: 4, name: 'النساء', englishName: 'An-Nisa' },
  { id: 5, name: 'المائدة', englishName: 'Al-Ma\'idah' },
  { id: 6, name: 'الأنعام', englishName: 'Al-An\'am' },
  { id: 7, name: 'الأعراف', englishName: 'Al-A\'raf' },
  { id: 8, name: 'الأنفال', englishName: 'Al-Anfal' },
  { id: 9, name: 'التوبة', englishName: 'At-Tawbah' },
  { id: 10, name: 'يونس', englishName: 'Yunus' },
  { id: 11, name: 'هود', englishName: 'Hud' },
  { id: 12, name: 'يوسف', englishName: 'Yusuf' },
  { id: 13, name: 'الرعد', englishName: 'Ar-Ra\'d' },
  { id: 14, name: 'ابراهيم', englishName: 'Ibrahim' },
  { id: 15, name: 'الحجر', englishName: 'Al-Hijr' },
  { id: 16, name: 'النحل', englishName: 'An-Nahl' },
  { id: 17, name: 'الإسراء', englishName: 'Al-Isra' },
  { id: 18, name: 'الكهف', englishName: 'Al-Kahf' },
  { id: 19, name: 'مريم', englishName: 'Maryam' },
  { id: 20, name: 'طه', englishName: 'Taha' },
  { id: 21, name: 'الأنبياء', englishName: 'Al-Anbya' },
  { id: 22, name: 'الحج', englishName: 'Al-Hajj' },
  { id: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minun' },
  { id: 24, name: 'النور', englishName: 'An-Nur' },
  { id: 25, name: 'الفرقان', englishName: 'Al-Furqan' },
  { id: 26, name: 'الشعراء', englishName: 'Ash-Shu\'ara' },
  { id: 27, name: 'النمل', englishName: 'An-Naml' },
  { id: 28, name: 'القصص', englishName: 'Al-Qasas' },
  { id: 29, name: 'العنكبوت', englishName: 'Al-\'Ankabut' },
  { id: 30, name: 'الروم', englishName: 'Ar-Rum' },
  { id: 31, name: 'لقمان', englishName: 'Luqman' },
  { id: 32, name: 'السجدة', englishName: 'As-Sajdah' },
  { id: 33, name: 'الأحزاب', englishName: 'Al-Ahzab' },
  { id: 34, name: 'سبإ', englishName: 'Saba' },
  { id: 35, name: 'فاطر', englishName: 'Fatir' },
  { id: 36, name: 'يس', englishName: 'Ya-Sin' },
  { id: 37, name: 'الصافات', englishName: 'As-Saffat' },
  { id: 38, name: 'ص', englishName: 'Sad' },
  { id: 39, name: 'الزمر', englishName: 'Az-Zumar' },
  { id: 40, name: 'غافر', englishName: 'Ghafir' },
  { id: 41, name: 'فصلت', englishName: 'Fussilat' },
  { id: 42, name: 'الشورى', englishName: 'Ash-Shuraa' },
  { id: 43, name: 'الزخرف', englishName: 'Az-Zukhruf' },
  { id: 44, name: 'الدخان', englishName: 'Ad-Dukhan' },
  { id: 45, name: 'الجاثية', englishName: 'Al-Jathiyah' },
  { id: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf' },
  { id: 47, name: 'محمد', englishName: 'Muhammad' },
  { id: 48, name: 'الفتح', englishName: 'Al-Fath' },
  { id: 49, name: 'الحجرات', englishName: 'Al-Hujurat' },
  { id: 50, name: 'ق', englishName: 'Qaf' },
  { id: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat' },
  { id: 52, name: 'الطور', englishName: 'At-Tur' },
  { id: 53, name: 'النجم', englishName: 'An-Najm' },
  { id: 54, name: 'القمر', englishName: 'Al-Qamar' },
  { id: 55, name: 'الرحمن', englishName: 'Ar-Rahman' },
  { id: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah' },
  { id: 57, name: 'الحديد', englishName: 'Al-Hadid' },
  { id: 58, name: 'المجادلة', englishName: 'Al-Mujadila' },
  { id: 59, name: 'الحشر', englishName: 'Al-Hashr' },
  { id: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah' },
  { id: 61, name: 'الصف', englishName: 'As-Saf' },
  { id: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah' },
  { id: 63, name: 'المنافقون', englishName: 'Al-Munafiqun' },
  { id: 64, name: 'التغابن', englishName: 'At-Taghabun' },
  { id: 65, name: 'الطلاق', englishName: 'At-Talaq' },
  { id: 66, name: 'التحريم', englishName: 'At-Tahrim' },
  { id: 67, name: 'الملك', englishName: 'Al-Mulk' },
  { id: 68, name: 'القلم', englishName: 'Al-Qalam' },
  { id: 69, name: 'الحاقة', englishName: 'Al-Haqqah' },
  { id: 70, name: 'المعارج', englishName: 'Al-Ma\'arij' },
  { id: 71, name: 'نوح', englishName: 'Nuh' },
  { id: 72, name: 'الجن', englishName: 'Al-Jinn' },
  { id: 73, name: 'المزمل', englishName: 'Al-Muzzammil' },
  { id: 74, name: 'المدثر', englishName: 'Al-Muddaththir' },
  { id: 75, name: 'القيامة', englishName: 'Al-Qiyamah' },
  { id: 76, name: 'الانسان', englishName: 'Al-Insan' },
  { id: 77, name: 'المرسلات', englishName: 'Al-Mursalat' },
  { id: 78, name: 'النبإ', englishName: 'An-Naba' },
  { id: 79, name: 'النازعات', englishName: 'An-Nazi\'at' },
  { id: 80, name: 'عبس', englishName: '\'Abasa' },
  { id: 81, name: 'التكوير', englishName: 'At-Takwir' },
  { id: 82, name: 'الإنفطار', englishName: 'Al-Infitar' },
  { id: 83, name: 'المطففين', englishName: 'Al-Mutaffifin' },
  { id: 84, name: 'الإنشقاق', englishName: 'Al-Inshiqaq' },
  { id: 85, name: 'البروج', englishName: 'Al-Buruj' },
  { id: 86, name: 'الطارق', englishName: 'At-Tariq' },
  { id: 87, name: 'الأعلى', englishName: 'Al-A\'la' },
  { id: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah' },
  { id: 89, name: 'الفجر', englishName: 'Al-Fajr' },
  { id: 90, name: 'البلد', englishName: 'Al-Balad' },
  { id: 91, name: 'الشمس', englishName: 'Ash-Shams' },
  { id: 92, name: 'الليل', englishName: 'Al-Layl' },
  { id: 93, name: 'الضحى', englishName: 'Ad-Duhaa' },
  { id: 94, name: 'الشرح', englishName: 'Ash-Sharh' },
  { id: 95, name: 'التين', englishName: 'At-Tin' },
  { id: 96, name: 'العلق', englishName: 'Al-\'Alaq' },
  { id: 97, name: 'القدر', englishName: 'Al-Qadr' },
  { id: 98, name: 'البينة', englishName: 'Al-Bayyinah' },
  { id: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah' },
  { id: 100, name: 'العاديات', englishName: 'Al-\'Adiyat' },
  { id: 101, name: 'القارعة', englishName: 'Al-Qari\'ah' },
  { id: 102, name: 'التكاثر', englishName: 'At-Takathur' },
  { id: 103, name: 'العصر', englishName: 'Al-\'Asr' },
  { id: 104, name: 'الهمزة', englishName: 'Al-Humazah' },
  { id: 105, name: 'الفيل', englishName: 'Al-Fil' },
  { id: 106, name: 'قريش', englishName: 'Quraysh' },
  { id: 107, name: 'الماعون', englishName: 'Al-Ma\'un' },
  { id: 108, name: 'الكوثر', englishName: 'Al-Kawthar' },
  { id: 109, name: 'الكافرون', englishName: 'Al-Kafirun' },
  { id: 110, name: 'النصر', englishName: 'An-Nasr' },
  { id: 111, name: 'المسد', englishName: 'Al-Masad' },
  { id: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas' },
  { id: 113, name: 'الفلق', englishName: 'Al-Falaq' },
  { id: 114, name: 'الناس', englishName: 'An-Nas' },
];

const versesData: Record<string, any[]> = {
  '1': [
    { id: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', indonesian: 'Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.' },
    { id: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', english: 'All praise is for Allah, Lord of the worlds.', indonesian: 'Segala puji bagi Allah, Tuhan semesta alam.' },
    { id: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', english: 'The Entirely Merciful, the Especially Merciful,', indonesian: 'Maha Pemurah lagi Maha Penyayang.' },
    { id: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', english: 'Sovereign of the Day of Recompense.', indonesian: 'Yang menguasai di Hari Pembalasan.' },
    { id: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', english: 'It is You we worship and You we ask for help.', indonesian: 'Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan.' },
    { id: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', english: 'Guide us to the straight path -', indonesian: 'Tunjukilah kami jalan yang lurus,' },
    { id: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', english: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.', indonesian: '(yaitu) Jalan orang-orang yang telah Engkau beri nikmat kepada mereka; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat.' },
  ],
  '2': [], '3': [], '4': [], '5': [], '6': [], '7': [], '8': [], '9': [], '10': [], '11': [], '12': [], '13': [], '14': [], '15': [], '16': [], '17': [], '18': [], '19': [], '20': [], '21': [], '22': [], '23': [], '24': [], '25': [], '26': [], '27': [], '28': [], '29': [], '30': [], '31': [], '32': [], '33': [], '34': [], '35': [], '36': [], '37': [], '38': [], '39': [], '40': [], '41': [], '42': [], '43': [], '44': [], '45': [], '46': [], '47': [], '48': [], '49': [], '50': [], '51': [], '52': [], '53': [], '54': [], '55': [], '56': [], '57': [], '58': [], '59': [], '60': [], '61': [], '62': [], '63': [], '64': [], '65': [], '66': [], '67': [], '68': [], '69': [], '70': [], '71': [], '72': [], '73': [], '74': [], '75': [], '76': [], '77': [], '78': [], '79': [], '80': [], '81': [], '82': [], '83': [], '84': [], '85': [], '86': [], '87': [], '88': [], '89': [], '90': [], '91': [], '92': [], '93': [], '94': [], '95': [], '96': [], '97': [], '98': [], '99': [], '100': [], '101': [], '102': [], '103': [], '104': [], '105': [], '106': [], '107': [], '108': [], '109': [], '110': [], '111': [],
  '112': [
      { id: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', english: 'Say, "He is Allah, [who is] One,', indonesian: 'Katakanlah: Dialah Allah, Yang Maha Esa.' },
      { id: 2, arabic: 'اللَّهُ الصَّمَدُ', english: 'Allah, the Eternal Refuge.', indonesian: 'Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu.' },
      { id: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', english: 'He neither begets nor is born,', indonesian: 'Dia tiada beranak dan tidak pula diperanakkan,' },
      { id: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', english: 'Nor is there to Him any equivalent."', indonesian: 'dan tidak ada seorangpun yang setara dengan Dia.' },
  ],
  '113': [],
  '114': [
    { id: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', english: 'Say, "I seek refuge in the Lord of mankind,', indonesian: 'Katakanlah: "Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia.' },
    { id: 2, arabic: 'مَلِكِ النَّاسِ', english: 'The Sovereign of mankind,', indonesian: 'Raja manusia.' },
    { id: 3, arabic: 'إِلَٰهِ النَّاسِ', english: 'The God of mankind,', indonesian: 'Sembahan manusia.' },
    { id: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', english: 'From the evil of the retreating whisperer -', indonesian: 'Dari kejahatan (bisikan) syaitan yang biasa bersembunyi,' },
    { id: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', english: 'Who whispers [evil] into the breasts of mankind -', indonesian: 'yang membisikkan (kejahatan) ke dalam dada manusia,' },
    { id: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', english: 'From among the jinn and mankind."', indonesian: 'dari (golongan) jin dan manusia.' },
  ]
};


export const surahs: Surah[] = allSurahs.map(surahInfo => {
    let verses = versesData[surahInfo.id.toString()] || [];
    
    // For Al-Fatiha, the Bismillah is already the first verse.
    if (surahInfo.id === 1) {
        return {
            ...surahInfo,
            verses: verses.map(v => ({...v, id: v.id}))
        };
    }
    
    // For all other surahs except At-Tawbah, prepend Bismillah.
    if (surahInfo.id !== 9) {
        verses = [bismillahVerse, ...verses.map(v => ({...v, id: v.id + 1}))];
    } else {
        verses = verses.map(v => ({...v, id: v.id}));
    }

    return {
        ...surahInfo,
        verses,
    };
});

export const reciters: Reciter[] = [
    { id: '7', name: 'Mishary Rashid Alafasy', audio_url_path: 'Mishary_Bin_Rashid_Alafasy_128kbps' },
    { id: '4', name: 'Mahmoud Khalil Al-Husary', audio_url_path: 'Husary_128kbps' },
    { id: '1', name: 'Abdur-Rahman as-Sudais', audio_url_path: 'Abdurrahmaan_As-Sudais_128kbps' },
    { id: '2', name: 'Saad al-Ghamdi', audio_url_path: 'Ghamadi_40kbps' },
    { id: '5', name: 'Saud ash-Shuraym', audio_url_path: 'Saood_ash-Shuraym_128kbps' },
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
