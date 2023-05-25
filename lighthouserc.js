const preset = process.env.DESKTOP ? 'desktop' : undefined

module.exports = {
  ci: {
    collect: {
      url: ['https://app-pizza-hawaii.vercel.app/auth/login',
            'https://app-pizza-hawaii.vercel.app/auth/signup'
      ],
      numberOfRuns: 3,
      settings: { preset },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  }
};