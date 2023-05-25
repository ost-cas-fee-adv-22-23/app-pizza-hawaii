const preset = process.env.DESKTOP ? 'desktop' : undefined

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npm run start',
      startServerReadyPattern: 'ready on',
      url: ['https://app-pizza-hawaii.vercel.app/auth/login',
            'https://app-pizza-hawaii.vercel.app/auth/signup'
      ],
      numberOfRuns: 1,
      settings: { preset },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  }
};