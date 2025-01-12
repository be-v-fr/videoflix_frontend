import { Injectable } from '@angular/core';
import { ConditionalErrorMsg } from '../interfaces/conditional-error-msg';


/**
 * Service for handling and formatting error messages and responses.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private readonly _unknownErrorMsg: string = 'Unknown error.';
  get unknownErrorMsg(): string {
    return this._unknownErrorMsg;
  }


  /**
   * Validates if an error response contains an error for a given field,
   * represented by the corresponding key.
   */
  validateFieldError(errorKey: string, errorResp: Record<string, string[]>): boolean {
    return errorResp.hasOwnProperty(errorKey) && errorResp[errorKey].length > 0;
  }


  /**
   * Returns a conditional error message based on the error key and response.
   */
  getConditionalFieldErrResp(errorKey: string, errorResp: Record<string, string[]>): ConditionalErrorMsg {
    const fulfilled: boolean = this.validateFieldError(errorKey, errorResp);
    return {
      condition: fulfilled,
      msg: fulfilled ? errorResp[errorKey][0] : this._unknownErrorMsg,
    };
  }


  /**
   * Returns a default unknown error record.
   */
  getUnknownErrRecord(): Record<string, string[]> {
    return {
      'unknown': [this._unknownErrorMsg]
    }
  }


  /**
   * Generates an error record from the provided error response object.
   * @param {any} err The error object containing error details.
   * @returns {Record<string, string[]>} A record of errors, mapping error keys to string arrays.
   */
  generateErrRecord(err: any): Record<string, string[]> {
    const result: Record<string, string[]> = this.getUnknownErrRecord();
    try {
      for (const key in err.error) {
        const value = this.formatErrorKeyToStringArray(err, key);
        if (value) { result[key] = value }
      }
    } finally {
      return result;
    }
  }


  /**
   * Formats a specific error key into a string array, if valid.
   * @param {any} err The error response object.
   * @param {string} key The error key to format.
   * @returns {string[] | undefined} An array of error messages, or undefined if not valid.
   */
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