type Level = 'debug' | 'info' | 'warn' | 'error'

const isProd = import.meta.env.PROD

export const logger = {
  debug: (...args: unknown[]) => { if (!isProd) console.debug('[debug]', ...args) },
  info: (...args: unknown[]) => { if (!isProd) console.info('[info]', ...args) },
  warn: (...args: unknown[]) => { if (!isProd) console.warn('[warn]', ...args) },
  error: (...args: unknown[]) => { if (!isProd) console.error('[error]', ...args) },
}


