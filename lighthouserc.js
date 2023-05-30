const preset = process.env.LHCI_DESKTOP ? 'desktop' : undefined
const LHCI_SERVER_BASE_URL = 'https://app-pizza-hawaii.vercel.app'


module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npm run start',
      startServerReadyPattern: 'ready on',
      url: [`${LHCI_SERVER_BASE_URL}/auth/login`,
            `${LHCI_SERVER_BASE_URL}/auth/signup`
      ],
      numberOfRuns: 1,
      settings: { preset: 'desktop'},
    },
    upload: {
      target: 'temporary-public-storage',
    },
  }
};
console.log('i', module.exports.ci.collect.url)