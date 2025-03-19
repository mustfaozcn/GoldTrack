'use client';

import { useLanguage } from '@/contexts/language-context';
import { translations } from '@/lib/translations';

export default function About() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex-grow flex flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-6 text-amber-800 dark:text-amber-400">
                {language === 'tr' ? 'Hakkında' : 'About'}
              </h1>

              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">
                  {language === 'tr' ? (
                      'Gold Calculator, altın yatırımlarınızı kolayca takip etmenizi sağlayan bir araçtır. Farklı altın türlerini doğal dil girişi veya manuel olarak ekleyebilir, toplam değerini TRY, USD veya EUR cinsinden görüntüleyebilirsiniz.'
                  ) : (
                      'Gold Calculator is a tool that helps you easily track your gold investments. You can add different types of gold through natural language input or manually, and view the total value in TRY, USD, or EUR.'
                  )}
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-4">
                  {language === 'tr' ? 'Teşekkürler' : 'Acknowledgments'}
                </h2>
                <p className="mb-4">
                  {language === 'tr' ? (
                      'Altın ve döviz kurları API servisi için Truncgil Technology\'e teşekkür ederiz.'
                  ) : (
                      'Special thanks to Truncgil Technology for providing the gold and currency rates API service.'
                  )}
                </p>
                <p>
                  <a
                      href="https://finance.truncgil.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    finance.truncgil.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
