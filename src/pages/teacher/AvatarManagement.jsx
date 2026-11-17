import { useCallback, useEffect, useState } from 'react';
import { ManagementHeader } from '../../components/ui';
import { LayoutTemplate, PersonStanding, Shirt } from 'lucide-react';
import AvatarItemManagement from './AvatarItemManagement.jsx';
import AvatarTemplateEditor from './AvatarTemplateEditor.jsx';
import BodyCustomImport from './BodyCustomImport.jsx';

/* Trang Avatar gộp: 3 trang cũ (Avatar Items / Avatar Template / Thân Avatar)
 * cùng một luồng nghiệp vụ DressUp, chỉ khác góc nhìn, nên nay là 3 tab của
 * một trang duy nhất ở route chuẩn /dashboard/avatar-items.
 * Tab đồng bộ qua ?tab= trên hash: bấm tab thì URL cập nhật, tải lại trang
 * hay share link vẫn mở đúng tab. Route cũ (/dashboard/avatar-template,
 * /dashboard/body-custom) được TeacherApp chuyển hướng về đây kèm ?tab=. */

const TABS = [
  { key: 'items', label: 'Vật phẩm', icon: Shirt },
  { key: 'template', label: 'Mẫu Avatar', icon: LayoutTemplate },
  { key: 'body', label: 'Thân Avatar', icon: PersonStanding },
];
const TAB_KEYS = TABS.map((t) => t.key);

/* Router tự chế bỏ qua query khi match route nên trang tự đọc ?tab= từ hash. */
function tabFromHash() {
  const query = (window.location.hash || '').split('?')[1] || '';
  const tab = new URLSearchParams(query).get('tab');
  return TAB_KEYS.includes(tab) ? tab : null;
}

export default function AvatarManagement({ showToast, defaultTab = 'items' }) {
  const [tab, setTab] = useState(() => tabFromHash() || defaultTab);

  /* Hash đổi từ bên ngoài (chuyển hướng route cũ, back/forward, bấm menu về
   * route chuẩn không kèm ?tab=) thì tab đi theo URL. */
  useEffect(() => {
    const sync = () => {
      const fromUrl = tabFromHash();
      if (fromUrl) setTab(fromUrl);
      else if ((window.location.hash || '').startsWith('#/dashboard/avatar-items')) setTab('items');
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const switchTab = useCallback((key) => {
    setTab(key);
    /* replaceState: cập nhật ?tab= trên URL mà không bắn hashchange (tránh
     * useRoute cuộn lên đầu trang) và không thêm mục history cho mỗi lần đổi tab. */
    window.history.replaceState(null, '', `#/dashboard/avatar-items?tab=${key}`);
  }, []);

  return (
    <div className="space-y-4">
      <ManagementHeader
        title="Avatar"
        subtitle="Vật phẩm, mẫu và thân của hệ DressUp — dùng chung với modal Tùy chỉnh Avatar ở #/profile"
      />

      <div className="flex gap-1 p-1 rounded-2xl bg-ink/5 w-fit max-w-full overflow-x-auto" role="tablist" aria-label="Nhóm quản lí Avatar">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => switchTab(key)}
            className={`flex-none flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === key ? 'bg-pink text-white shadow' : 'text-ink/60 hover:bg-ink/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'items' && <AvatarItemManagement showToast={showToast} onSwitchTab={switchTab} />}
      {tab === 'template' && <AvatarTemplateEditor onSwitchTab={switchTab} />}
      {tab === 'body' && <BodyCustomImport showToast={showToast} onSwitchTab={switchTab} />}
    </div>
  );
}
