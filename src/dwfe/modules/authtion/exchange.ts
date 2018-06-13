import {Observable} from 'rxjs';

import {AbstractExchangerDwfe} from '@dwfe/classes/AbstractExchangerDwfe';
import {UtilsDwfe} from '@dwfe/classes/UtilsDwfe';

const API_VERSION = '/v1';

export const endpoints = {
  signIn: `${API_VERSION}/sign-in`,
  tokenRefresh: `${API_VERSION}/sign-in`,
  googleCaptchaValidate: `${API_VERSION}/google-captcha-validate`,
  signOut: `${API_VERSION}/sign-out`,
  checkEmail: `${API_VERSION}/check-email`,
  createAccount: `${API_VERSION}/create-account`,
  getAccount: `${API_VERSION}/get-account`,
  updateAccount: `${API_VERSION}/update-account`,
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
      UtilsDwfe.optionsForAnonymouseReq());
  }
}

export class CreateAccountExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.createAccount,
      body,
      UtilsDwfe.optionsForAnonymouseReq());
  }
}

export class GetAccountExchanger extends AbstractExchangerDwfe {
  getHttpReq$(params?: any): Observable<Object> {
    return this.http.get(
      endpoints.getAccount,
      UtilsDwfe.optionsForAuthorizedReq(this.accessToken)
    );
  }
}

export class UpdateAccountExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.updateAccount,
      body,
      UtilsDwfe.optionsForAuthorizedReq(this.accessToken)
    );
  }
}

export class ReqResetPassExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.reqResetPass,
      body,
      UtilsDwfe.optionsForAnonymouseReq());
  }
}

export class ConfirmResetPassExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.confirmResetPass,
      body,
      UtilsDwfe.optionsForAnonymouseReq());
  }
}

export class ResetPassExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.resetPass,
      body,
      UtilsDwfe.optionsForAnonymouseReq());
  }
}

export class ChangePassExchanger extends AbstractExchangerDwfe {
  getHttpReq$(body?: any): Observable<Object> {
    return this.http.post(
      endpoints.changePass,
      body,
      UtilsDwfe.optionsForAuthorizedReq(this.accessToken));
  }
}
