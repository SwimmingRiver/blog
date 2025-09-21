export default function AboutPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About rivelog</h1>

        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            안녕하세요! 👋
          </p>

          <p>
            이곳은 개발을 공부하며 배운 것들을 기록하는 개인 학습용 기술 블로그입니다.
          </p>

          <p>
            새로운 기술을 익히고, 문제를 해결하며, 그 과정에서 얻은 인사이트들을
            정리해서 공유하고 있습니다.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">주요 관심사</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>웹 개발 (Frontend & Backend)</li>
              <li>새로운 프레임워크와 라이브러리</li>
              <li>개발 도구와 생산성</li>
              <li>코드 품질과 아키텍처</li>
            </ul>
          </div>

          <p>
            함께 배우고 성장하는 개발자가 되고 싶습니다.
            블로그를 통해 지식을 나누고 피드백을 받으며 더 나은 개발자로 발전해 나가겠습니다.
          </p>

          <p className="text-sm text-gray-600 pt-4 border-t">
            이 블로그는 Next.js, Supabase, Tailwind CSS로 만들어졌습니다.
          </p>
        </div>
      </div>
    </div>
  );
}