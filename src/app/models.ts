export type Role = 'ADMIN' | 'LIBRARIAN' | 'STUDENT';
export type IssueStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE';

export interface AuthUser {
  token: string;
  id: number;
  username: string;
  fullName: string;
  role: Role;
}

export interface UserAccount {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  role: Role;
  active: boolean;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  category?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  date?: string;
  registrationNumber?: string;
  publication?: string;
  publicationYear?: number;
  pageCount?: number;
  seller?: string;
  receiptNumber?: string;
  price?: number;
}

export interface BookIssue {
  id: number;
  bookId: number;
  bookTitle: string;
  author: string;
  studentId: number;
  studentName: string;
  issuedByName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: IssueStatus;
  category?: string;
}

export interface Dashboard {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  overdueCopies: number;
  students: number;
  librarians: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
