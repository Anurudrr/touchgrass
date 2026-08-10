import { Printer, Package, Wrench, GraduationCap, PartyPopper, ShoppingBag, HeartHandshake, FileText, Zap, Flame, Clock3, Star, MapPin, IndianRupee, Hand, Smile, Sparkles, Rocket, ShieldCheck, MessageCircle, Wallet, BadgeCheck } from 'lucide-react'

export const CATEGORY_ICONS: Record<string, typeof Printer> = {
  'Printing & Documents': Printer,
  'Parcel Pickup/Delivery': Package,
  'Minor Repairs & Handyman': Wrench,
  'Tutoring & Assignment Help': GraduationCap,
  'Event & Setup Help': PartyPopper,
  'General Errands': ShoppingBag,
  'Elderly Assistance': HeartHandshake,
  'Document Help (Online)': FileText,
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Printing & Documents': 'bg-[var(--color-sage-soft)]/90 text-sage',
  'Parcel Pickup/Delivery': 'bg-[var(--color-periwinkle-soft)]/90 text-periwinkle',
  'Minor Repairs & Handyman': 'bg-[var(--color-coral-soft)]/90 text-coral',
  'Tutoring & Assignment Help': 'bg-[var(--color-blush-soft)]/90 text-blush',
  'Event & Setup Help': 'bg-[var(--color-rose-soft)]/90 text-rose',
  'General Errands': 'bg-[var(--color-peach-soft)]/90 text-peach',
  'Elderly Assistance': 'bg-[var(--color-lavender-soft)]/90 text-lavender',
  'Document Help (Online)': 'bg-[var(--color-charcoal)] text-white',
}

export function categoryIcon(key: string) {
  return CATEGORY_ICONS[key] ?? Zap
}

export function categoryColor(key: string, fallback = 'bg-cocoa text-white') {
  return CATEGORY_COLORS[key] ?? fallback
}

export {
  Printer, Package, Wrench, GraduationCap, PartyPopper, ShoppingBag, HeartHandshake, FileText, Zap,
  Flame, Clock3, Star, MapPin, IndianRupee, Hand, Smile, Sparkles, Rocket, ShieldCheck, MessageCircle, Wallet, BadgeCheck,
}