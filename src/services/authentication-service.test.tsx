import AuthenticationService from './authentication-service';
import http from './http-service';

jest.mock('../services/http-service');

describe('AuthenticationService', () => {
  it('should make a request to /login-with-tara-jwt', () => {
    const chatId = '1';
    AuthenticationService.loginWithTaraJwt(chatId);
    expect(http.post).toHaveBeenCalledWith('/login-with-tara-jwt', { chatId });
  });

  it('should make a request to /custom-jwt-userinfo', () => {
    AuthenticationService.customJwtUserinfo();
    expect(http.post).toHaveBeenCalledWith('/custom-jwt-userinfo', 'clientCustomJwtCookie');
  });
});
