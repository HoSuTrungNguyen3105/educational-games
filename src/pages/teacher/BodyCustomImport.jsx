import { useCallback, useState } from 'react';
import { API_BASE } from '../../services/api.js';
import { ManagementHeader } from '../../components/ui.jsx';

function parseBodyCustomJson(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (!data?.characters || !Array.isArray(data.characters)) return null;
    return data.characters.map(char => ({
      id: char.id,
      name: char.name,
      description: char.description || '',
      svg: char.svg || '',
    }));
  } catch {
    return null;
  }
}

export default function BodyCustomImport({ showToast }) {
  const [jsonStr, setJsonStr] = useState('');
  const [characters, setCharacters] = useState([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const importData = useCallback(async () => {
    if (!jsonStr.trim()) {
      setError("Vui lòng nhập JSON");
      return;
    }
    const parsed = parseBodyCustomJson(jsonStr);
    if (!parsed) {
      setError("JSON không hợp lệ - cần có trường characters mảng");
      return;
    }

    setImporting(true);
    try {
      const token = localStorage.getItem("edu_games_auth");
      const parsedToken = token ? JSON.parse(token) : null;
      const headers = { "Content-Type": "application/json" };
      if (parsedToken?.token) headers.Authorization = `Bearer ${parsedToken.token}`;

      for (const char of parsed) {
        const body = {
          name: char.name,
          type: 'custom',
          price: 0,
          default: true,
          html: char.svg,
        };

        await fetch(`${API_BASE}/avatar/admin/body`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });
      }

      showToast(`Đã nhập ${parsed.length} body character`);
      setImporting(false);
      setCharacters([]);
      setJsonStr('');
    } catch {
      setError("Lỗi nhập dữ liệu");
      setImporting(false);
    }
  }, [jsonStr, showToast]);

  return (
    <div>
      <ManagementHeader subtitle="Nhập body character từ JSON" title="Import Body Custom" />

      <div className="p-6 bg-white rounded-2xl border border-ink/10 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <textarea
            value={jsonStr}
            onChange={e => setJsonStr(e.target.value)}
            className="w-full h-40 p-3 rounded-xl border border-ink/10 text-[10px] font-mono text-ink/60 focus:outline-none focus:ring-2 focus:ring-pink/30 resize-none whitespace-pre-wrap break-all"
            placeholder="Dán JSON body_custom.json vào đây..."
            rows={8}
          />
          <div>
            <button onClick={importData}
              className="px-4 py-2 bg-pink text-white rounded-xl text-sm font-semibold hover:bg-pink/80 transition disabled:opacity-50"
              disabled={importing}
            >
              {importing ? 'Đang nhập...' : 'Nhập vào API'}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {characters.length > 0 && (
        <div className="p-6 bg-white rounded-2xl border border-ink/10 mb-6">
          <h3 className="font-display text-sm text-ink/50 mb-3">Preview {characters.length} characters:</h3>
          <div className="grid gap-3">
            {characters.map((char) => (
              <div key={char.id} className="p-3 rounded-xl bg-ink/5 border border-pink/20">
                <div className="text-[10px] font-mono uppercase text-pink/60 mb-1">{char.id}</div>
                <div className="font-body font-semibold text-sm text-ink truncate">{char.name}</div>
                <div className="text-[10px] text-pink/40">{char.description || ''}</div>
                <div className="mt-2">
                  <svg viewBox="0 0 200 280" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"
                    dangerouslySetInnerHTML={{ __html: char.svg }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}