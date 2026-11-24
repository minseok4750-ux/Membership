'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, CircleHelp, Sparkles, UserRoundCheck, UserRoundPlus, UsersRound } from 'lucide-react'
import { MemberDirectory } from '@/components/member-directory'
import { MemberRegistrationForm } from '@/components/member-registration-form'
import { initialMembers, type Member, type MemberDraft } from '@/lib/member-data'

function formatMonth(value: string) {
  const [year, month] = value.split('-')
  return `${year}.${month}`
}

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function MemberDashboard() {
  const [members, setMembers] = useState(initialMembers)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [notice, setNotice] = useState('')

  const activeCount = useMemo(() => members.filter((member) => member.status === '활성').length, [members])
  const joinedThisMonth = useMemo(
    () => members.filter((member) => member.joinedAt.startsWith(getCurrentMonth())).length,
    [members],
  )

  function handleSave(draft: MemberDraft) {
    if (editingMember) {
      setMembers((current) => current.map((member) =>
        member.id === editingMember.id ? { ...member, ...draft } : member,
      ))
      setNotice(`${draft.name} 회원 정보가 수정되었습니다.`)
      setEditingMember(null)
      return
    }

    const joinedAt = new Date().toLocaleDateString('sv-SE')
    const newMember: Member = {
      ...draft,
      id: crypto.randomUUID(),
      joinedAt,
      status: '활성',
    }
    setMembers((current) => [newMember, ...current])
    setNotice(`${draft.name} 회원이 등록되었습니다.`)
  }

  function handleDelete(member: Member) {
    if (!window.confirm(`${member.name} 회원을 삭제할까요? 삭제한 정보는 복구할 수 없습니다.`)) return
    setMembers((current) => current.filter((item) => item.id !== member.id))
    if (editingMember?.id === member.id) setEditingMember(null)
    setNotice(`${member.name} 회원이 삭제되었습니다.`)
  }

  function handleEdit(member: Member) {
    setEditingMember(member)
    setNotice(`${member.name} 회원 정보를 수정하고 있습니다.`)
  }

  function handleCancelEdit() {
    setEditingMember(null)
    setNotice('회원 정보 수정이 취소되었습니다.')
  }

  const stats = [
    {
      label: '전체 회원',
      value: members.length,
      detail: '등록된 전체 회원 수',
      icon: UsersRound,
      tone: 'lavender',
    },
    {
      label: '활성 회원',
      value: activeCount,
      detail: '현재 이용 중인 회원',
      icon: UserRoundCheck,
      tone: 'mint',
    },
    {
      label: '이번 달 신규',
      value: joinedThisMonth,
      detail: `${formatMonth(getCurrentMonth())} 가입 회원`,
      icon: UserRoundPlus,
      tone: 'peach',
    },
  ]

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#main-content" aria-label="모아클럽 회원관리 홈">
            <span className="brand-mark"><UsersRound aria-hidden="true" /></span>
            <span className="brand-copy">
              <strong>모아클럽</strong>
              <span>MEMBER ADMIN</span>
            </span>
          </a>
          <div className="topbar-actions">
            <span className="workspace-label"><span /> 관리자 워크스페이스</span>
            <a className="help-button" href="#registration-title" aria-label="회원 등록 도움말" title="회원 등록 안내로 이동">
              <CircleHelp aria-hidden="true" />
            </a>
            <span className="topbar-divider" aria-hidden="true" />
            <div className="profile-chip">
              <span className="profile-avatar" aria-hidden="true">관</span>
              <span><strong>관리자</strong><small>admin@moa.kr</small></span>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="dashboard-main">
        <section className="page-intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> MEMBERSHIP <span className="eyebrow-slash">/</span> 관리</p>
            <h1 id="page-title">회원 관리</h1>
            <p className="intro-copy">회원 정보와 활동 현황을 한 곳에서 관리해 보세요.</p>
          </div>
          <div className="intro-note"><Sparkles aria-hidden="true" /><span>오늘도 좋은 하루예요</span></div>
        </section>

        <section className="stats-grid" aria-label="회원 통계">
          {stats.map(({ label, value, detail, icon: Icon, tone }) => (
            <article className="stat-card" key={label}>
              <span className={`stat-icon ${tone}`}><Icon aria-hidden="true" /></span>
              <div className="stat-copy">
                <span className="stat-label">{label}</span>
                <strong className="stat-value">{value}<small>명</small></strong>
                <span className="stat-detail">{detail}</span>
              </div>
              <CalendarDays className="stat-watermark" aria-hidden="true" />
            </article>
          ))}
        </section>

        {notice && <p className="sr-only" role="status" aria-live="polite">{notice}</p>}

        <div className="content-grid">
          <MemberRegistrationForm
            key={editingMember?.id ?? 'new-member'}
            editingMember={editingMember}
            onSave={handleSave}
            onCancelEdit={handleCancelEdit}
          />
          <MemberDirectory members={members} onEdit={handleEdit} onDelete={handleDelete} />
        </div>

        <footer className="dashboard-footer">
          <span>© 2026 모아클럽</span>
          <span><span className="footer-status-dot" /> 데모 데이터 · 새로고침 시 초기화됩니다</span>
        </footer>
      </main>
    </div>
  )
}
