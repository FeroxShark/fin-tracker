import { FC } from 'react'
import Button from './Button'
import { PiggyBank, PlusCircle, Globe, Sun, Moon } from 'lucide-react'
import { useLanguage } from '../LanguageProvider'
import { useDarkMode } from '../hooks/useDarkMode'

interface Props {
  onAddTransaction: () => void
}

const TopNav: FC<Props> = ({ onAddTransaction }) => {
  const { t, lang, setLang } = useLanguage()
  const [darkMode, setDarkMode] = useDarkMode()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/80 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <PiggyBank className="h-6 w-6 text-blue-600" />
          <span className="font-semibold">Fin Tracker</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={onAddTransaction} className="hidden sm:inline-flex"><PlusCircle className="w-4 h-4" /> {t('newTransaction')}</Button>
          <Button variant="secondary" onClick={() => setDarkMode(!darkMode)} aria-label={darkMode ? t('lightMode') : t('darkMode')}>
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="secondary" onClick={() => setLang(lang === 'en' ? 'es' : 'en')} aria-label="Toggle language">
            <Globe className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default TopNav


