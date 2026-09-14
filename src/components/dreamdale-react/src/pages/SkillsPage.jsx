import React from 'react'

const skills = [
  { name: 'Đào đá', level: 3, icon: '⛏️', desc: 'Đào đá nhanh hơn' },
  { name: 'Chặt gỗ', level: 2, icon: '🪓', desc: 'Chặt gỗ nhanh hơn' },
  { name: 'Chiến đấu', level: 1, icon: '⚔️', desc: 'Tăng sát thương' },
  { name: 'Thu hoạch', level: 1, icon: '🌾', desc: 'Thu hoạch nhiều hơn' },
]

export default function SkillsPage() {
  return (
    <div className="page-container">
      <h2 className="page-title">⚡ Kỹ năng</h2>
      <div className="page-content">
        {skills.map((skill) => (
          <div key={skill.name} className="skill-card">
            <span className="skill-icon">{skill.icon}</span>
            <div className="skill-info">
              <div className="skill-name">{skill.name}</div>
              <div className="skill-desc">{skill.desc}</div>
              <div className="skill-level">
                Cấp {skill.level}
                <div className="skill-bar">
                  <div className="skill-bar-fill" style={{ width: `${(skill.level / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
