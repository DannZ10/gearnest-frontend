import { redirect } from 'next/navigation';

// The customer area moved from /dashboard to /account.
export default function DashboardRedirect() {
  redirect('/account');
}
