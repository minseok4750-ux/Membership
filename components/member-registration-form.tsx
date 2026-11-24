'use client'

import { useState, type FormEvent } from 'react'
import { CalendarDays, Mail, Pencil, Phone, UserRoundPlus } from 'lucide-react'
import type { Member, MemberDraft } from '@/lib/member-data'

type MemberRegistrationFormProps = {
  editingMember: Member | null
  onSave: (draft: MemberDraft) => void
  onCancelEdit: () => void
}

const emptyDraft: MemberDraft = {
  name: '',
  email: '',
  phone: '',
  birthday: '',
}

export function MemberRegistrationForm({
  editingMember,
  onSave,
  onCancelEdit,
}: MemberRegistrationFormProps) {
  const [draft, setDraft] = useState<MemberDraft>(() =>
    editingMember
      ? {
          name: editingMember.name,
          email: editingMember.email,
          phone: editingMember.phone,
          birthday: editingMember.birthday,
        }
      : emptyDraft,
  )

  function updateField(field: keyof MemberDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave(draft)
    if (!editingMember) setDraft(emptyDraft)
  }

  return (
    <section className="panel registration-panel" aria-labelledby="registration-title">
      <div className="panel-heading registration-heading">
        <span className="heading-icon mint-icon">
          {editingMember ? <Pencil aria-hidden="true" /> : <UserRoundPlus aria-hidden="true" />}
        </span>
        <div>
          <p className="panel-kicker">MEMBER FORM</p>
          <h2 id="registration-title">{editingMember ? '회원 정보 수정' : '새 회원 등록'}</h2>
        </div>
      </div>
      <p className="panel-description">
        {editingMember ? '변경할 회원 정보를 입력해 주세요.' : '회원 정보를 입력하고 새로운 멤버를 추가해 보세요.'}
      </p>

      <form className="member-form" onSubmit={handleSubmit}>
        <label className="form-field" htmlFor="member-name">
          <span>이름 <span className="required-mark">*</span></span>
          <input
            id="member-name"
            autoComplete="name"
            maxLength={40}
            placeholder="홍길동"
            required
            value={draft.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
        </label>

        <label className="form-field" htmlFor="member-email">
          <span>이메일 <span className="required-mark">*</span></span>
          <span className="input-with-icon">
            <Mail aria-hidden="true" />
            <input
              id="member-email"
              type="email"
              autoComplete="email"
              maxLength={254}
              placeholder="hello@example.com"
              required
              value={draft.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </span>
        </label>

        <label className="form-field" htmlFor="member-phone">
          <span>전화번호 <span className="required-mark">*</span></span>
          <span className="input-with-icon">
            <Phone aria-hidden="true" />
            <input
              id="member-phone"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="010-1234-5678"
              required
              value={draft.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
          </span>
        </label>

        <label className="form-field" htmlFor="member-birthday">
          <span>생년월일 <span className="required-mark">*</span></span>
          <span className="input-with-icon">
            <CalendarDays aria-hidden="true" />
            <input
              id="member-birthday"
              type="date"
              autoComplete="bday"
              required
              value={draft.birthday}
              onChange={(event) => updateField('birthday', event.target.value)}
            />
          </span>
        </label>

        <div className="form-actions">
          {editingMember && (
            <button className="button button-secondary" type="button" onClick={onCancelEdit}>
              취소
            </button>
          )}
          <button className="button button-primary form-submit" type="submit">
            {editingMember ? '변경 사항 저장' : '회원 등록'}
          </button>
        </div>
      </form>

      <p className="form-footnote">* 표시된 항목은 필수 입력 정보입니다.</p>
    </section>
  )
}
