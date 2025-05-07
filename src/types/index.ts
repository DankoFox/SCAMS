export type UserType = 'lecturer' | 'student' | 'guest';

export interface PageProps {
  userType: UserType;
}