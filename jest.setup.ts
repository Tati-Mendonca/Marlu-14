import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

beforeEach(() => {
  fetchMock.resetMocks();
});

