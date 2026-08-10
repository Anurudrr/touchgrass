import { connect, users, tasks, reviews, assignments, messages, payments } from './db'
import type { Review, Task, User } from '../../src/lib/types'

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString()
const inHours = (n: number) => new Date(Date.now() + n * 3600000).toISOString()

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'Meera Shah', phone: '9876500001', role: 'both', idVerification: 'verified', ratingAvg: 4.9, ratingCount: 42, tasksDone: 38, bio: 'Errand ninja. Printing, parcel runs, anything within 5km.', area: 'Koramangala', joinedAt: daysAgo(120), createdAt: daysAgo(120) },
  { id: 'u2', name: 'Rahul Verma', phone: '9876500002', role: 'poster', idVerification: 'none', ratingAvg: 4.7, ratingCount: 12, tasksDone: 0, bio: 'Busy freelancer, always need help with printing & parcels.', area: 'Indiranagar', joinedAt: daysAgo(90), createdAt: daysAgo(90) },
  { id: 'u3', name: 'Ananya Iyer', phone: '9876500003', role: 'doer', idVerification: 'verified', ratingAvg: 5.0, ratingCount: 27, tasksDone: 27, bio: 'Assignment help & tutoring. Fast turnaround.', area: 'HSR Layout', joinedAt: daysAgo(200), createdAt: daysAgo(200) },
  { id: 'u4', name: 'Kabir Malhotra', phone: '9876500004', role: 'both', idVerification: 'verified', ratingAvg: 4.6, ratingCount: 19, tasksDone: 15, bio: 'Handyman + event setup guy. Fridge wobble? Call me.', area: 'Jayanagar', joinedAt: daysAgo(60), createdAt: daysAgo(60) },
  { id: 'u5', name: 'Sneha Kulkarni', phone: '9876500005', role: 'poster', idVerification: 'none', ratingAvg: 4.8, ratingCount: 8, tasksDone: 0, bio: 'Doctor mom, need pickup/drop help a lot.', area: 'Whitefield', joinedAt: daysAgo(45), createdAt: daysAgo(45) },
  { id: 'u6', name: 'Arjun Nair', phone: '9876500006', role: 'doer', idVerification: 'verified', ratingAvg: 4.4, ratingCount: 31, tasksDone: 31, bio: 'Delivery specialist. Anywhere in the city, rain or shine.', area: 'MG Road', joinedAt: daysAgo(150), createdAt: daysAgo(150) },
]

export const SEED_TASKS: Task[] = [
  { id: 't1', posterId: 'u2', title: 'Print 60 pages + spiral bind 3 copies', description: 'Need 60 pages printed double-sided and spiral bound in 3 copies. Files on my drive, I will share link. Deadline tomorrow morning 9am.', category: 'Printing & Documents', price: 150, location: 'Indiranagar 100ft Road', lat: 12.9784, lng: 77.6408, deadline: inHours(14), urgent: true, status: 'open', createdAt: daysAgo(0.2) },
  { id: 't2', posterId: 'u5', title: 'Pickup medicine from Apollo & deliver home', description: 'Prescription is ready at Apollo Pharmacy, Whitefield main road. Just pick up and deliver to my mom at home, 2km away. Will share prescription + payment of medicine.', category: 'Parcel Pickup/Delivery', price: 80, location: 'Whitefield', lat: 12.9698, lng: 77.75, deadline: inHours(5), urgent: true, status: 'open', createdAt: daysAgo(0.4) },
  { id: 't3', posterId: 'u2', title: 'Hang 3 photo frames + fix wobbly bookshelf', description: 'Need someone with a drill. 3 frames on a wall + tighten a bookshelf that wobbles. Should take under an hour. Tools available at home.', category: 'Minor Repairs & Handyman', price: 400, location: 'Indiranagar, 12th Main', lat: 12.9719, lng: 77.6412, deadline: inDays(3), urgent: false, status: 'open', createdAt: daysAgo(1) },
  { id: 't4', posterId: 'u5', title: '2 hrs math tutoring for class 9 (online)', description: 'Help my daughter with quadratic equations. Online call, 2 hrs, today or tomorrow evening. Need someone patient who can explain in Kannada or English.', category: 'Tutoring & Assignment Help', price: 300, location: 'Online (Whitefield)', lat: 12.9698, lng: 77.75, deadline: inDays(2), urgent: false, status: 'open', createdAt: daysAgo(1.5) },
  { id: 't5', posterId: 'u1', title: 'Help set up 20 chairs + tables for birthday party', description: 'Small terrace birthday party, need 2 helpers for 2 hours: arrange chairs, tables, hang bunting. Snacks provided :)', category: 'Event & Setup Help', price: 350, location: 'Koramangala 5th Block', lat: 12.9352, lng: 77.6245, deadline: inDays(5), urgent: false, status: 'open', createdAt: daysAgo(2) },
  { id: 't6', posterId: 'u1', title: 'Get 5 Aadhaar photocopies + 2 passport photos', description: 'Quick run to Xerox shop near Forum Mall. 5 copies each of Aadhaar, 2 passport size photos. Return prints to me. 30 min job.', category: 'Printing & Documents', price: 60, location: 'Koramangala', lat: 12.9279, lng: 77.6271, deadline: inHours(20), urgent: false, status: 'open', createdAt: daysAgo(0.8) },
  { id: 't7', posterId: 'u4', title: 'Type 4-page assignment from handwritten notes', description: 'Handwritten notes need to be typed and formatted (Times New Roman, 1.5 spacing). I will scan and send photos. Due in 2 days.', category: 'Tutoring & Assignment Help', price: 250, location: 'Online', lat: 12.925, lng: 77.5938, deadline: inDays(2), urgent: false, status: 'open', createdAt: daysAgo(0.5) },
  { id: 't8', posterId: 'u6', title: 'Queue for passport appointment token', description: 'Need someone to stand in the passport office queue from 7am to grab a token. I will join by 9am. Standing around is boring but pays well.', category: 'General Errands', price: 200, location: 'Passport Seva Kendra, MG Road', lat: 12.9757, lng: 77.6064, deadline: inHours(26), urgent: false, status: 'open', createdAt: daysAgo(0.3) },
  { id: 't9', posterId: 'u3', title: 'Weekly groceries + meds for grandma', description: 'My grandmother lives alone in Jayanagar 4th block. Need weekly grocery + medicine delivery every Saturday, ~1.5 hrs. Will share the list and pay for items upfront.', category: 'General Errands', price: 150, location: 'Jayanagar 4th Block', lat: 12.9256, lng: 77.5838, deadline: inDays(6), urgent: false, status: 'open', createdAt: daysAgo(2.5) },
  { id: 't10', posterId: 'u4', title: 'Fix leaking kitchen tap', description: 'Kitchen mixer tap is leaking from the base. Need a plumber who can fix it today evening. Parts cost reimbursed.', category: 'Minor Repairs & Handyman', price: 250, location: 'Jayanagar 7th Block', lat: 12.9207, lng: 77.5788, deadline: inHours(9), urgent: true, status: 'open', createdAt: daysAgo(0.6) },
  { id: 't11', posterId: 'u2', title: 'Print 200 flyers for Sunday flea market', description: '200 A5 flyers on 100gsm paper. I have the PDF. Need pickup from print shop and delivery to my stall. By Saturday noon.', category: 'Printing & Documents', price: 180, location: 'Ulsoor', lat: 12.9791, lng: 77.6274, deadline: inDays(2), urgent: false, status: 'open', createdAt: daysAgo(0.9) },
  { id: 't12', posterId: 'u5', title: 'Carry-in help: 3 suitcases to airport', description: 'Need help moving 3 suitcases from 3rd floor (no lift) to cab at 5:30am. Strong arms needed. Coffee on me after.', category: 'General Errands', price: 100, location: 'Whitefield, Palm Meadows', lat: 12.9658, lng: 77.7498, deadline: inHours(30), urgent: true, status: 'open', createdAt: daysAgo(0.7) },
]

export const SEED_REVIEWS: Review[] = [
  { id: 'r1', taskId: 't1', reviewerId: 'u2', revieweeId: 'u1', rating: 5, comment: 'Super quick printing, came with 5 min margin to spare.', createdAt: daysAgo(30) },
  { id: 'r2', taskId: 't2', reviewerId: 'u5', revieweeId: 'u6', rating: 5, comment: 'Delivered meds before mom even called me. Legend.', createdAt: daysAgo(20) },
]

export async function seedMongo() {
  await connect()
  await Promise.all([users().drop().catch(() => {}), tasks().drop().catch(() => {}), assignments().drop().catch(() => {}), messages().drop().catch(() => {}), reviews().drop().catch(() => {}), payments().drop().catch(() => {})])
  await users().insertMany(SEED_USERS)
  await tasks().insertMany(SEED_TASKS)
  const reviewsCol = reviews()
  await reviewsCol.insertMany(SEED_REVIEWS)
  console.log(`seeded ${SEED_USERS.length} users, ${SEED_TASKS.length} tasks, ${SEED_REVIEWS.length} reviews into MongoDB`)
}

if (import.meta.url === new URL(process.argv[1] ?? '', 'file://').href) {
  seedMongo()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}