import request from 'supertest'; 
import app from '../src/app'; 
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';

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

  it('should return user info and tokens when authenticated', async () => {
    
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('mockAccessToken');
    expect(response.text).toContain('mockRefreshToken');
    expect(response.text).toContain('mockIdToken');
    expect(response.text).toContain('Mock User');
    expect(response.text).toContain('user@example.com');
  });
});
