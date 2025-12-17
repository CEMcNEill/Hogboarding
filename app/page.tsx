import { redirect } from 'next/navigation';

export default function Home() {
  const roomId = crypto.randomUUID();
  redirect(`/${roomId}`);
}
