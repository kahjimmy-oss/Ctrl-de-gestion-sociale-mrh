import { useState, useEffect, useRef } from 'react';

const NOTES_KEY = 'cosmetica_notes';

export default function NotesPanel() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(true);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(NOTES_KEY);
    if (stored) setNotes(stored);
  }, []);

  const handleChange = (val) => {
    setNotes(val);
    setSaved(false);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(NOTES_KEY, val);
      setSaved(true);
    }, 1500);
  };

  const clearNotes = () => {
    if (!window.confirm('Effacer toutes les notes ?')) return;
    setNotes('');
    localStorage.removeItem(NOTES_KEY);
    setSaved(true);
  };

  const TEMPLATES = [
    { label: 'Formule turnover', text: '\nTurnover = (Départs + Entrées) / 2 / Effectif × 100\n' },
    { label: 'Formule absentéisme', text: '\nAbsentéisme = Jours absence / Jours théoriques × 100\n' },
    { label: 'Formule MS chargée', text: '\nMS chargée = MS brute × (1 + taux charges patronales)\n' },
    { label: 'ROI action RH', text: '\nROI = (Gains - Coût action) / Coût action × 100\n' },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-cosmetica-600 hover:bg-cosmetica-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-xl"
        title="Mes notes de cours"
      >
        {open ? '✕' : '📓'}
      </button>

      {/* Panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black bg-opacity-20 sm:hidden" onClick={() => setOpen(false)} />
          <div className="fixed bottom-20 right-6 z-40 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[75vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">📓 Mes notes de cours</h3>
                <p className="text-xs text-gray-400">{saved ? '✓ Sauvegardé' : '⟳ Sauvegarde...'}</p>
              </div>
              <button onClick={clearNotes} className="text-xs text-red-400 hover:text-red-600">Effacer</button>
            </div>

            {/* Quick formulas */}
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2">Insérer une formule :</p>
              <div className="flex flex-wrap gap-1">
                {TEMPLATES.map(t => (
                  <button
                    key={t.label}
                    onClick={() => handleChange(notes + t.text)}
                    className="text-xs bg-gray-100 hover:bg-cosmetica-50 hover:text-cosmetica-700 text-gray-600 px-2 py-1 rounded-lg transition-colors"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              className="flex-1 p-4 text-sm text-gray-800 resize-none focus:outline-none font-mono leading-relaxed min-h-[200px]"
              placeholder="Vos notes, calculs, idées...&#10;&#10;Sauvegarde automatique activée."
              value={notes}
              onChange={e => handleChange(e.target.value)}
            />

            <div className="p-3 border-t border-gray-100 text-right">
              <span className="text-xs text-gray-400">{notes.length} caractères</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
