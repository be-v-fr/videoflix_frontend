import { Injectable } from '@angular/core';
import { ConditionalErrorMsg } from '../interfaces/conditional-error-msg';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  validateFieldError(errorKey: string, errorResp: Record<string, string[]>): boolean {
    return errorResp.hasOwnProperty(errorKey) && errorResp[errorKey].length > 0;
  }

  getConditionalFieldErrResp(errorKey: string, errorResp: Record<string, string[]>): ConditionalErrorMsg {
    const valid: boolean = this.validateFieldError(errorKey, errorResp);
    return {
      condition: valid,
      msg: valid ? errorResp[errorKey][0] : 'Unknown error.',
    };
  }

  getUnknownErrResp(): Record<string, string[]> {
    return {
      'unknown': ['Unknown error.']
    }
  }

  generateErrorResp(err: any): Record<string, string[]> {
    return 'error' in err ? err.error : this.getUnknownErrResp();
  }
}