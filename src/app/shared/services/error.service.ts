import { Injectable } from '@angular/core';
import { ConditionalErrorMsg } from '../interfaces/conditional-error-msg';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private readonly unknownErrorMsg: string = 'Unknown error.';

  validateFieldError(errorKey: string, errorResp: Record<string, string[]>): boolean {
    return errorResp.hasOwnProperty(errorKey) && errorResp[errorKey].length > 0;
  }

  getConditionalFieldErrResp(errorKey: string, errorResp: Record<string, string[]>): ConditionalErrorMsg {
    const valid: boolean = this.validateFieldError(errorKey, errorResp);
    return {
      condition: valid,
      msg: valid ? errorResp[errorKey][0] : this.unknownErrorMsg,
    };
  }

  getUnknownErrResp(): Record<string, string[]> {
    return {
      'unknown': [this.unknownErrorMsg]
    }
  }

  generateErrorResp(err: any): Record<string, string[]> {
    const result: Record<string, string[]> = this.getUnknownErrResp();
    try {
      for (const key in err.error) {
        const value = this.formatErrorKeyToStringArray(err, key);
        if (value) {result[key] = value}
      }
    } finally {
      return result;
    }
  }

  formatErrorKeyToStringArray(err: any, key: string): string[] | undefined {
    const value = err.error[key];
    if (typeof value === 'string') {
      return [value];
    } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
      return value;
    }
    return undefined;
  }
}