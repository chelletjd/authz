import request from 'supertest'; 
import app from '../src/app'; 
import sinon from 'sinon';
import { Request, Response, NextFunction, response } from 'express';

const mockFetchUserInfo = jest.fn().mockResolvedValue({
  name: 'Mock User',
  email: 'user@example.com',
});

jest.mock('express-openid-connect', () => {
  return {
    auth: (obj: any) => (req: Request, res: Response, next: NextFunction) => next(),
    requiresAuth: () => (req: Request & { isAuthenticated: boolean}, res: Response, next: NextFunction) => {
      req.isAuthenticated = true;
      req.oidc = {
        isAuthenticated: () => true,
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        idToken: 'mockIdToken',
        idTokenClaims: {
          sub: 'mockSub',
          email: 'user@example.com',
        },
        fetchUserInfo: mockFetchUserInfo,
      } as any;
      next()
    }
  }
})

type OIDCType = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  idTokenClaims: {
    sub: string;
    email: string;
  };
  fetchUserInfo: () => Promise<{ name: string; email: string }>;
}

// Define `oidc` types in the request
interface OidcRequest extends Request {
  oidc: any | OIDCType;
}

// Mocking OIDC Middleware and Authentication
describe('GET / - OIDC Authentication', () => {
  let requiresAuthStub: sinon.SinonStub;

  beforeAll(() => {
    requiresAuthStub = sinon.stub().callsFake((req: OidcRequest, res: Response, next: NextFunction) => {
      req.oidc = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        idToken: 'mockIdToken',
        idTokenClaims: {
          sub: 'mockSub',
          email: 'user@example.com',
        },
        fetchUserInfo: sinon.stub().resolves({
          name: 'Mock User',
          email: 'user@example.com',
        }),
      };
      next();
    });

    app.use(requiresAuthStub);
  });

  it('should send the user to login', async () => {
    
    const response = await request(app).get('/');

    expect(response.status).toBe(302);
    expect(response.headers['location']).toBe('/login');
  });

  it('should validate the url', async () => {
    
    const response = await request(app).get('/login');

    expect(response.status).toBe(303);
    expect(response.headers['location']).toBe('http://localhost:4000/self-service/login/browser?aal=&refresh=&return_to=&organization=&via=');
  });
});
