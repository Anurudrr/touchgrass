export type Role = 'poster' | 'doer' | 'both'
export type IdStatus = 'none' | 'pending' | 'verified'
export type TaskStatus = 'open' | 'accepted' | 'in_progress' | 'completed' | 'paid' | 'disputed' | 'cancelled'
export type PaymentStatus = 'held' | 'released' | 'refunded'

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  role: Role
  idVerification: IdStatus
  ratingAvg: number
  ratingCount: number
  tasksDone: number
  bio: string
  area: string
  joinedAt: string
  createdAt: string
}

export interface Task {
  id: string
  posterId: string
  title: string
  description: string
  category: string
  price: number
  location: string
  lat: number
  lng: number
  deadline: string
  urgent: boolean
  status: TaskStatus
  photoUrl?: string
  createdAt: string
  completedAt?: string
}

export interface Assignment {
  id: string
  taskId: string
  doerId: string
  acceptedAt: string
  completedAt?: string
  status: 'active' | 'done'
}

export interface Message {
  id: string
  taskId: string
  senderId: string
  content: string
  createdAt: string
}

export interface Review {
  id: string
  taskId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  createdAt: string
}

export interface Payment {
  id: string
  taskId: string
  amount: number
  commissionRate: number
  commission: number
  doerNet: number
  status: PaymentStatus
  razorpayOrderId?: string
  releasedAt?: string
}

export const COMMISSION_RATE = 0.15

export const CATEGORIES = [
  { key: 'printing', label: 'Printing & Documents', icon: 'printer', price: '₹15' },
  { key: 'delivery', label: 'Parcel Pickup/Delivery', icon: 'package', price: '₹49' },
  { key: 'repairs', label: 'Minor Repairs & Handyman', icon: 'wrench', price: '₹199' },
  { key: 'tutoring', label: 'Tutoring & Assignment Help', icon: 'graduation', price: '₹99' },
  { key: 'events', label: 'Event & Setup Help', icon: 'party', price: '₹149' },
  { key: 'errands', label: 'General Errands', icon: 'bag', price: '₹79' },
  { key: 'elderly', label: 'Elderly Assistance', icon: 'heart', price: '₹99' },
  { key: 'digital', label: 'Document Help (Online)', icon: 'file', price: '₹59' },
] as const

export interface DBShape {
  users: User[]
  tasks: Task[]
  assignments: Assignment[]
  messages: Message[]
  reviews: Review[]
  payments: Payment[]
}
