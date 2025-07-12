export const getAuth = jest.fn(() => ({
  currentUser: {
    uid: 'mock-user-id',
    displayName: 'Mock User',
    email: 'mock@exemplo.com'
  }
}));