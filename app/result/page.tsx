import { redirect } from 'next/navigation';
import { FRUITS, type FruitKey } from '@/data/fruits';
import FruitResult from '@/components/FruitResult';

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ fruit?: string; mode?: string; reason?: string }>;
}) {
  // Next 15+：searchParams 是 Promise，必须 await
  const sp = await searchParams;
  const fruit = sp.fruit as FruitKey;
  const mode = (sp.mode ?? 'classic') as 'classic' | 'ai';

  if (!fruit || !FRUITS[fruit]) redirect('/');

  return <FruitResult fruit={fruit} mode={mode} reason={sp.reason} />;
}
