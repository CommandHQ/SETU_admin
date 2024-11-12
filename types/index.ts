import { string } from "zod";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  category: "CIVILIAN" | "MILITARY"; // Adjust if more categories exist
  phone: string;
  role: "user" | "admin"; // Adjust if more roles exist
  isVerifiedUser: boolean;
  userVerifiedBy: string | null;
  isBlocked: boolean;
  otp: string | null;
  otpExpires: string | null;
  image: string;
  gender: string | null;
  dob: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isRecruiter: boolean;
  isRecruiterVerified: boolean;
  recruiterVerifiedBy: string | null;
  companyName: string | null;
  companyEmail: string | null;
  blockUser: string[];
  blockBy: string[];
  emailOTP: string | null;
  emailOTPExpires: string | null;
  imageKey: string | null;
  isDeleted: boolean;
  imageExpires: string | null;
  isFirstLogin: boolean;
  emailVerificationToken: string | null;
  fcmToken: string | null;
  createdAt: string;
  updatedAt: string;
  isPrivateAccount: boolean;
  isPublicProfile: boolean;
  allowPushNotification: boolean;
  profile: Profile;
  isFollowing?: boolean;
  followers?: Follows[];
  following?: Follows[];
}

export type Follows = {
  follower: User;
  followerId: string;
  following: User;
  followingId: string;
  createdAt: Date;
};

export interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  slug: string;
  userId: string;
}
export interface Userinfo {
  userId: string;
  email: string;
  phone: string;
}
export interface Company {
  id: string;
  name: string;
  location: string;
}
export interface Title {
  id: string;
  name: string;
}

export interface Degree {
  id: string;
  name: string;
}
export interface Skills {
  id: string;
  name: string;
}

export interface Certification {
  id: string;
  name: string;
}

export interface Fieldofstudy {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  profileId?: string;
  companyId: string;
  company?: Company;
  titleId: string;
  title?: Title;
  startDate: Date;
  endDate: Date | null;
  description: string;
  locationType: string;
  employmentType: string;
}
export interface University {
  id: string;
  name: string;
}

export interface Education {
  fieldOfStudyId: string;
  id: string;
  profileId?: string;
  universityId: string;
  university?: University;
  degreeId: string;
  degree?: Degree;
  fieldofstudyId: string;
  fieldofstudy?: Fieldofstudy;
  startDate: Date;
  endDate: Date | null | undefined;
  grade: string;
  activities: string;
  description: string;
}

export interface Post {
  id: string;
  content: string;
  image: string;
  imageExpires: string | null;
  userId: string;
  key: string | null;
  tags: string[];
  isEdited: boolean;
  isApproved: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  isReported: boolean;
  isSponsored: boolean;
  isPromoted: boolean;
  isDeleted: boolean;
  reportedReason: string | null;
  reportedBy: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Profile {
  id?: string;
  userId: string;
  user?:User;
  location?: string;
  facebook?: string;
  twitter?: string;
  linkedIn?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
  about?: string;
  interests?:string[];
  coverImage?: string;
  achievements?:string[];
  education?:Education[];
  skills?:Skills[];
  experience?:Experience[];
  certifications?:Certification[];
  militaryProfile?:MilitaryProfile[];
}
export interface Userinfo {
  email: string;
  phone: string;
}

export interface CertificationSalesData {
  id: string;
  type: string;
  course: string;
  price: number;
  description: string;
  image: string;
}

export interface Module {
  number: number;
  title: string;
  description: string[];
}

export interface Post {
  id: string;
  content: string;
  image: string;
  imageExpires: string | null;
  userId: string;
  key: string | null;
  tags: string[];
  isEdited: boolean;
  isApproved: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  isReported: boolean;
  isSponsored: boolean;
  isPromoted: boolean;
  isDeleted: boolean;
  reportedReason: string | null;
  reportedBy: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
  comments: Commentpost[]; // You might want to define a more specific type for comments
  likes: Likespost[]; // You might want to define a more specific type for likes
}


export interface Report {
  id?: string;
  userId: string;
  user: User;
  postId?: string | null;
  blogId?: string | null;
  jobId?: string | null;
  category: string;
  description: string;
  reportFor: ReportFor;
  status: string;
  createdAt?: string | number |Date;
}
export enum ReportFor {
  JOB = "JOB",
  POST = "POST",
  BLOG = "BLOG",
  USER = "USER",
  NONE = "NONE",
}

export interface Savedpost{
  id?: string;
  userId?: string;
  postId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  post?: Post;
}

export interface MilitaryProfile {
  id: string;
  profileId?: string;
  dateOfCommission?: Date | null;
  dateOfRetirement?: Date | null;
  service: MilitaryService;
  rank: string;
  title:  Array<{ id: string; name: string }>;
  deployment: string[];
}
export enum MilitaryService {
  ARMY = "ARMY",
  NAVY = "NAVY",
  AIRFORCE = "AIRFORCE",
  COASTGUARD = "COASTGUARD",
  NONE = "NONE",
}

export type CourseData = {
  id: string;
  title: string;
  description: string;
  price: string | null;
  discount?: number;
  instructorId: string;
  instructor: User;
  categoryid: string;
  category: CourseCategory;
  level: string;
  language: string;
  prerequisites: string[];
  learningOutcomes: string[];
  enrollmentCount: number;
  isPublished: boolean;
  courseReviews: CourseReviews;
  courseReviewsId: string;
  thumbnail: string;
  chapters: Chapter[];
  enrollments: Enrollment[];
  courseCertificate: CourseCertificate[];
  resource: Resource[];
};

export type CourseCategory = {
  id: string;
  name: string;
};

export type CourseReviews = {
  id: string;
};

export interface Chapter {
  id: string;
  courseId?: string | null;
  course?: CourseData | null;
  title: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  lessons: Lesson[];
  published?: boolean | null;
}
export interface Lesson {
  id: string;
  chapterId?: string | null;
  chapter?: Chapter | null;
  title: string;
  description?: string | null;
  content?: string | null;
  iscompleted?: boolean | null;
  duration?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  published?: boolean | null;
  resources: Resource[];
}

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
};

export type CourseCertificate = {
  id: string;
  userId: string;
  courseId: string;
};

export interface Resource {
  id: string;
  courseId?: string;
  lessonId?: string;
  title?: string;
  type?: string;
  url?: string[];
}

export interface Commentpost{
  id:string;
  userId:string;
  user:User;
  postId:string;
  post:Post;
  content: string;
  createdAt: Date;
}

export interface Likespost{
  id:string;
  userId:string;
  user:User;
  postId:string;
  post:Post;
  createdAt: Date;
}

export interface Comment {
  _id: string;
  blog: string;
  userId: string;
  userName: string;
  content: string;
  _createdAt: Date;
}




// types/shared.ts
export interface AppliedJob {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  appliedAt: string;
  lastUpdatedAt: string;
  status: ApplicationStatus;
}

export interface ClientAppliedJob {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  appliedAt: string;
  lastUpdatedAt: string;
  status: ApplicationStatus;
}


// SavedJob Type
export type SavedJob = {
  id: string;
  userId: string;
  jobId: string;
  user: User;
  job: Job;
  isSaved: boolean;
  savedAt: Date;
};

// // JobStatus Enum
// export enum JobStatus {
//   ACTIVE = "ACTIVE",
//   INACTIVE = "INACTIVE",
//   COMPLETED = "COMPLETED",
// }

// ApplicationStatus Enum
export enum ApplicationStatus {
  APPLIED = "APPLIED",
  RESUME_VIEWED = "RESUME_VIEWED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  INTERVIEWED = "INTERVIEWED",
  OFFER_EXTENDED = "OFFER_EXTENDED",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
}


export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: Date;
}
export interface FollowRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: FollowRequestStatus;
  fromUser: User;
  toUser: User;
}
export enum FollowRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
export enum NotificationType {
  FOLLOW_REQUEST="FOLLOW_REQUEST",
  FOLLOW_ACCEPT=" FOLLOW_ACCEPT",
  NEW_FOLLOWER="NEW_FOLLOWER",
  COMMENT="COMMENT",
  LIKE="LIKE"
}
export interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: Array<{ [key: string]: any }>;
  userId: string;
  userName: string;
  tags: string[];
  currentSlug: string;
  image?: string;
  blogVideo?: {
    asset: {
      _ref: string;
      _type: string;
    };
    _type: string;
  };
  likeCount: number;
  commentCount: number;
  _createdAt: Date;
}

export interface ApplicationEducation {
  nameOfUniversity: string;
  degree: string;
  grade: string;
  fieldOfStudy: string;
  yearOfEnrollment: number;
  yearOfPassing: number;
}
export interface CourseReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface FormData {
  userId: string;
  fullname: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  alternativeNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  passportSizePhoto: string;
  service: string;
  dateOfCommission: string;
  rank: string;
  dateOfRetirement: string;
  armOrBranch: string;
  essay: string;
  resumeFile: string;
  certificationFile: string;
  education: ApplicationEducation[];
}

export interface Step {
  title: string;
  icon: React.ReactNode;
}

export interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FileUploadFieldProps {
  label: string;
  id: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface JobFilterOptions {
  searchTerm: string;
  locationType: string;
  datePosted: string;
  // experienceType:string,
  // industryType: string,
  // employmentType:string
}
export interface PaginatedJobsResponse {
  data: SavedJob[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}



export interface SkillMaster {
  id: string;
  name: string;
  skills: Skill[];
  createdAt: Date;
  updatedAt: Date;
  Job: Job[];
}

export interface CertificationMaster {
  id: string;
  name: string;
  certifications?: Certification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UniversityMaster {
  id: string;
  name: string;
  location?: string;
  country?: string;
  website?: string;
  educations: Education[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyMaster {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  website?: string;
  location?: string;
  experiences: Experience[];
  createdAt: Date;
  updatedAt: Date;
  Recruiter: Recruiter[];
}

export interface JobtitleMaster {
  id: string;
  name: string;
  experiences: Experience[];
  createdAt: Date;
  updatedAt: Date;
  MilitaryProfile: MilitaryProfile[];
  Job: Job[];
}

export interface DegreeMaster {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  education?: Education; // Make optional
  Job?: Job;             // Make optional
}
export interface FieldofstudyMaster {
  id: string;
  name: string;
  education: Education[];
  createdAt: Date;
  updatedAt: Date;
  Job: Job[];
}

// Define related interfaces as needed
export interface Skill {
  id: string;
  name: string;
}

export interface Certification {
  id: string;
  name: string;
}

export interface Education {
  id: string;
  name: string;
  universityId: string;
  degreeId: string;
  fieldOfStudyId: string;
  startDate: Date;
}

export interface Experience {
  id: string;
  description: string;
}

export interface Recruiter {
  id: string;
  name: string;
  companyId: string;
}

export interface MilitaryProfile {
  id: string;
  profileName: string;
}

// types/ExtendedSkillMaster.ts


export interface ExtendedSkillMaster {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  skills: Skill[];
  Job: Job[];
}
export interface Job {
  id: string;
  titleId: string;
  title: { id: string; name: string }; // Assuming title has both id and name for reference
  recruiterId: string;
  recruiter: { id: string; name: string; company: { name: string } }; // Adding recruiter id and name
  location: string;
  locationType: string;
  salary: string | number;
  description: string;
  skills: Skill[];
  experience: string;
  openings: string | number;
  applicants: number;
  education: Education[];
  department: Department[]; 
  employmentType: string;
  companyDescription: string;
  industryType: string;
  companyWebsite: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date | string;
}

// Assuming the Education type should have more fields
export interface Education {
  id: string;
  name: string;
  fieldOfStudyId: string;
  universityId: string;
  degreeId: string;
}

// Assuming Skill type is defined as:
export interface Skill {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}


export type ReportStatus = 'pending' | 'approved' | 'PENDING' | 'RESOLVED';



export type JobStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';

export type CreateCertificationDTO = {
  type: string;
  course: string;
  price: number;
  tax: number;
  discount: number; // Ensure this is required
  description: string;
  image: string;
};

// types/certificationSales.ts

export interface CertificationSaleData {
  type: string;
  course: string;
  price: number;
  tax: number;
  discount: number;
  description: string;
  image: string;
}

export interface CertificationSale {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  course: string;
  price: number;
  tax: number;
  discount?: number;
  description: string;
  image: string;
  sales:number;
}

export type CreateCertificationSaleDTO = CertificationSaleData;

export type UpdateCertificationSaleDTO = Partial<CertificationSaleData>;

// types.ts


