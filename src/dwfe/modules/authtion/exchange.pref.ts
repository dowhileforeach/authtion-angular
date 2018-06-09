import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';

import {AbstractExchangerDwfe} from '@dwfe/classes/AbstractExchangerDwfe';

const API_VERSION = '/v1';

export const endpoints = {
  signIn: `${API_VERSION}/sign-in`,
  tokenRefresh: `${API_VERSION}/sign-in`,
  googleCaptchaValidate: `${API_VERSION}/google-captcha-validate`,
  signOut: `${API_VERSION}/sign-out`,
  checkEmail: `${API_VERSION}/check-email`,
  createAccount: `${API_VERSION}/create-account`,
  updateAccount: `${API_VERSION}/update-account`,
  getAccount: `${API_VERSION}/get-account`,
  changePass: `${API_VERSION}/change-pass`,
  reqResetPass: `${API_VERSION}/req-reset-pass`,
  resetPass: `${API_VERSION}/reset-pass`,
  confirmResetPass: `${API_VERSION}/confirm-reset-pass`,
};

export class GoogleCaptchaValidateExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.googleCaptchaValidate,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class CreateAccountExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.createAccount,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class GetAccountExchanger extends AbstractExchangerDwfe {
  static of(http: HttpClient): GetAccountExchanger {
    return new GetAccountExchanger({http: http});
  }

  getHttpReq$(params?: any): Observable<Object> {
    const accessToken = params.accessToken || this.accessToken;
    return this.http.get(
      endpoints.getAccount,
      AbstractExchangerDwfe.optionsForAuthorizedReq(accessToken)
    );
  }
}

export class ReqResetPassExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.reqResetPass,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class ConfirmResetPassExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.confirmResetPass,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class ResetPassExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.resetPass,
      body,
      AbstractExchangerDwfe.optionsForAnonymouseReq());
  }
}

export class ChangePassExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.changePass,
      body,
      AbstractExchangerDwfe.optionsForAuthorizedReq(this.accessToken));
  }
}
