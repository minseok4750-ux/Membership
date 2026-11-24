'use client'

import { useMemo, useState } from 'react'
import { Pencil, Search, Trash2, UsersRound } from 'lucide-react'
import type { Member, MemberStatus } from '@/lib/member-data'

type MemberDirectoryProps = {
  members: Member[]
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
}

type StatusFilter = '전체' | MemberStatus

const filters: StatusFilter[] = ['전체', '활성', '휴면']

function formatDate(value: string) {
  if (!value) return '—'
  const [year, month, day] = value.split('-')
  return `${year}.${month}.${day}`
}

function getInitials(name: string) {
  return name.replace(/\s/g, '').slice(0, 2)
}

export function MemberDirectory({ members, onEdit, onDelete }: MemberDirectoryProps) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('전체')

  const visibleMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return members.filter((member) => {
      const matchesFilter = activeFilter === '전체' || member.status === activeFilter
      const searchableText = `${member.name} ${member.email} ${member.phone}`.toLowerCase()
      return matchesFilter && searchableText.includes(normalizedQuery)
    })
  }, [activeFilter, members, query])

  return (
    <section className="panel directory-panel" aria-labelledby="directory-title">
      <div className="directory-topline">
        <div className="panel-heading directory-heading">
          <span className="heading-icon lavender-icon"><UsersRound aria-hidden="true" /></span>
          <div>
            <p className="panel-kicker">DIRECTORY</p>
            <h2 id="directory-title">회원 목록</h2>
          </div>
        </div>
        <span className="member-count"><strong>{members.length}</strong>명</span>
      </div>

      <div className="directory-toolbar">
        <label className="search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">회원 검색</span>
          <input
            type="search"
            placeholder="이름, 이메일, 전화번호 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="filter-list" role="group" aria-label="회원 상태 필터">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-button${activeFilter === filter ? ' is-active' : ''}`}
              type="button"
              aria-pressed={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              {filter === '전체' && <span>{members.length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="table-scroll" role="region" aria-label="회원 목록 표" tabIndex={0}>
        <table className="member-table">
          <caption className="sr-only">등록된 회원의 정보와 관리 작업</caption>
          <thead>
            <tr>
              <th scope="col">이름</th>
              <th scope="col">이메일</th>
              <th scope="col">전화번호</th>
              <th scope="col">생년월일</th>
              <th scope="col">가입일</th>
              <th scope="col">상태</th>
              <th scope="col"><span className="sr-only">작업</span></th>
            </tr>
          </thead>
          <tbody>
            {visibleMembers.map((member, index) => (
              <tr key={member.id}>
                <td>
                  <div className="member-name-cell">
                    <span className={`member-avatar avatar-${index % 5}`} aria-hidden="true">{getInitials(member.name)}</span>
                    <span className="member-name">{member.name}</span>
                  </div>
                </td>
                <td className="email-cell" data-label="이메일">{member.email}</td>
                <td className="phone-cell" data-label="전화번호">{member.phone}</td>
                <td data-label="생년월일">{formatDate(member.birthday)}</td>
                <td data-label="가입일">{formatDate(member.joinedAt)}</td>
                <td data-label="상태">
                  <span className={`status-badge ${member.status === '활성' ? 'status-active' : 'status-dormant'}`}>
                    <span aria-hidden="true" />{member.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="icon-action edit-action"
                      type="button"
                      aria-label={`${member.name} 회원 정보 수정`}
                      title="회원 정보 수정"
                      onClick={() => onEdit(member)}
                    >
                      <Pencil aria-hidden="true" />
                    </button>
                    <button
                      className="icon-action delete-action"
                      type="button"
                      aria-label={`${member.name} 회원 삭제`}
                      title="회원 삭제"
                      onClick={() => onDelete(member)}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visibleMembers.length === 0 && (
              <tr>
                <td className="empty-table-cell" colSpan={7}>
                  <div className="empty-state">
                    <span className="empty-icon"><Search aria-hidden="true" /></span>
                    <strong>검색 결과가 없습니다</strong>
                    <span>검색어나 상태 필터를 변경해 보세요.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="directory-footer">
        <span>총 {members.length}명의 회원</span>
        <span>검색 결과 <strong>{visibleMembers.length}</strong>명</span>
      </div>
    </section>
  )
}
