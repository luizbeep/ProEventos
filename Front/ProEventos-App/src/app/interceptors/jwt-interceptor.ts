import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const userStr = localStorage.getItem('user');

  if (!userStr) {
    return next(req);
  }

  try {
    const user = JSON.parse(userStr);

    if (!user?.token) {
      return next(req);
    }

    console.log('🔐 Token preview:', user.token.substring(0, 20) + '...');

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return next(authReq);

  } catch (error) {
    return next(req);
  }
};
