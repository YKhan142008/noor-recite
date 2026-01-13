'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, writeBatch } from 'firebase/firestore';

export default function MigratePage() {
  const [status, setStatus] = useState('Ready');
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 50));

  const startMigration = async () => {
    setStatus('Fetching JSON...');
    try {
      const res = await fetch('/tafsir-data.json');
      const data = await res.json();
      const entries = Object.entries(data);
      setTotal(entries.length);

      setStatus('Starting Upload...');
      addLog(`Found ${entries.length} entries`);

      // Process in chunks of 250 (max batch size is 500)
      const batchSize = 250;

      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = entries.slice(i, i + batchSize);

        chunk.forEach(([verseKey, entry]: [string, any]) => {
          const [surah, ayah] = verseKey.split(':').map(Number);
          const docRef = doc(db, 'tafsir', verseKey);

          batch.set(docRef, {
            verse_key: verseKey,
            surah,
            ayah,
            text: entry.text || '', // Ensure no undefined
            ayah_keys: entry.ayah_keys || [verseKey],
            language: 'en',
            author: 'Ibn Kathir',
            created_at: new Date()
          });
        });

        await batch.commit();
        setProgress(prev => Math.min(prev + chunk.length, entries.length));
        addLog(`Uploaded batch ${Math.floor(i / batchSize) + 1}`);
      }

      setStatus('Complete!');
      addLog('🎉 Migration Finished Successfully');

    } catch (err: any) {
      console.error(err);
      setStatus('Error: ' + err.message);
      addLog('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tafsir Migration Tool</h1>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <p className="mb-2 font-mono">Status: {status}</p>
        <p className="mb-4">Progress: {progress} / {total} ({total > 0 ? Math.round(progress / total * 100) : 0}%)</p>

        <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      <button
        onClick={startMigration}
        disabled={status !== 'Ready'}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-bold"
      >
        {status === 'Ready' ? 'Start Migration' : 'Processing...'}
      </button>

      <div className="mt-8 bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
    </div>
  );
}
