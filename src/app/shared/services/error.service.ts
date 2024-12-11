import { Injectable } from '@angular/core';
import { ConditionalErrorMsg } from '../interfaces/conditional-error-msg';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private readonly _unknownErrorMsg: string = 'Unknown error.';
  get unknownErrorMsg(): string {
    return this._unknownErrorMsg;
  }

  validateFieldError(errorKey: string, errorResp: Record<string, string[]>): boolean {
    return errorResp.hasOwnProperty(errorKey) && errorResp[errorKey].length > 0;
  }

  getConditionalFieldErrResp(errorKey: string, errorResp: Record<string, string[]>): ConditionalErrorMsg {
    const valid: boolean = this.validateFieldError(errorKey, errorResp);
    return {
      condition: valid,
      msg: valid ? errorResp[errorKey][0] : this._unknownErrorMsg,
    };
  }


  getUnknownErrRecord(): Record<string, string[]> {
    return {
      'unknown': [this._unknownErrorMsg]
    }
  }

  generateErrRecord(err: any): Record<string, string[]> {
    const result: Record<string, string[]> = this.getUnknownErrRecord();
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