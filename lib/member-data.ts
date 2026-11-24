export type MemberStatus = '활성' | '휴면'

export type Member = {
  id: string
  name: string
  email: string
  phone: string
  birthday: string
  joinedAt: string
  status: MemberStatus
}

export type MemberDraft = Omit<Member, 'id' | 'joinedAt' | 'status'>

export const initialMembers: Member[] = [
  {
    id: 'member-01',
    name: '김민지',
    email: 'minji.kim@example.com',
    phone: '010-2841-6390',
    birthday: '1995-04-18',
    joinedAt: '2026-10-18',
    status: '활성',
  },
  {
    id: 'member-02',
    name: '박지원',
    email: 'jiwon.park@example.com',
    phone: '010-3952-7401',
    birthday: '1998-09-02',
    joinedAt: '2026-11-03',
    status: '활성',
  },
  {
    id: 'member-03',
    name: '이서준',
    email: 'seojun.lee@example.com',
    phone: '010-4728-1563',
    birthday: '1992-12-11',
    joinedAt: '2026-11-11',
    status: '휴면',
  },
  {
    id: 'member-04',
    name: '최유나',
    email: 'yuna.choi@example.com',
    phone: '010-5186-9234',
    birthday: '2000-06-27',
    joinedAt: '2026-09-26',
    status: '활성',
  },
  {
    id: 'member-05',
    name: '강도현',
    email: 'dohyun.kang@example.com',
    phone: '010-7630-2854',
    birthday: '1996-02-14',
    joinedAt: '2026-11-18',
    status: '활성',
  },
]
